import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { CmcService } from 'src/cmc/cmc.service';
import { PrismaService } from 'src/prisma.service';
import { SendgridService } from 'src/sendgrid/sendgrid.service';
import {
  AlertDto,
  convertDeletedAlertToDto,
  convertPrismaAlertToDto,
} from './dto/GetAlerts.dto';
import { CreateAlertDto } from './dto/createAlert.dto';

@Injectable()
export class AlertsService {
  constructor(
    private prisma: PrismaService,
    private sendgrid: SendgridService,
    private cmc: CmcService,
  ) {}

  // Cron job running every 5 minutes (change before deploy to 2h so the api keys won't vanish quickly it would use approx. 75% of tokens)
  @Cron('0 */5 * * * *')
  /**
   * Method that periodically fetches prices of cryptos for each fiat currency and
   * sends emails to users who have alerts set for that combination of crypto
   * and fiat currency and whose alert threshold is exceeded.
   */
  async monitorPrices() {
    /*
    get all the USED crypto ids in alerts from database and map these to fiatCurrency that they're using => fiatCurrency: set(cryptoId) 
    - later on could simply fetch all ids using CryptoData collection when most of cryptos would be in use, 
    but for now, such way is more efficient especially for saving tokens for api calls
    - also later on could fetch fiatCurrencies quotes and use them for calculations with cryptoMap
    */

    const fiatsWithCryptos = await this.prisma.alert
      .findMany({
        select: {
          cryptoId: true,
          currencyId: true,
        },
      })
      .then((data) => {
        return data.reduce((mappedCryptos, curr) => {
          const previousValues =
            mappedCryptos.get(curr.currencyId) || new Set();
          previousValues.add(curr.cryptoId);
          mappedCryptos.set(curr.currencyId, previousValues);
          return mappedCryptos;
        }, new Map<number, Set<number>>());
      });

    // get quotes from cmc
    for (const [currencyId, cryptoIds] of fiatsWithCryptos) {
      // get quotes data of all cryptos for each currency
      const quotesMapRecords = await this.cmc.getQuotesData(
        Array.from(cryptoIds).join(','),
        currencyId.toString(),
      );
      for (const quoteRecord of quotesMapRecords) {
        const [cryptoId, quoteData] = quoteRecord;
        // get quote currency symbol
        const quoteCurrencySymbol = Object.keys(quoteData.quote)[0];
        const quotePrice = quoteData.quote[quoteCurrencySymbol].price;
        // fetch alerts with met/exceeded threshold
        const alerts = await this.prisma.alert.findMany({
          select: {
            price: true,
            userEmail: true,
          },
          where: {
            cryptoId: cryptoId,
            price: {
              lt: quotePrice,
              equals: quotePrice,
            },
          },
        });

        // send emails to the users
        alerts.forEach((alert) => {
          this.sendgrid.sendAlertPriceReached({
            price: alert.price,
            crypto: quoteData.name,
            currency: quoteCurrencySymbol,
            email: alert.userEmail,
            currentPrice: quotePrice,
          });
        });
        // dunno about deleting these alerts?
      }
    }
  }

  async create(userEmail: string, data: CreateAlertDto) {
    const result = await this.prisma.alert
      .create({
        data: {
          userEmail,
          ...data,
        },
        include: {
          user: true,
          cryptoData: true,
          currencyData: true,
        },
      })
      .then((data) => convertPrismaAlertToDto(data))
      .catch((error) => {
        if (
          error instanceof PrismaClientKnownRequestError &&
          error.code === 'P2002'
        ) {
          throw new ConflictException(error, 'Alert already exists');
        }
        throw new InternalServerErrorException(
          error,
          'Database connection error',
        );
      });
    try {
      this.sendEmailOnDelete(result);
    } catch (error) {
      throw new InternalServerErrorException(error, 'Email sending error');
    }
    return result;
  }

  async get(userEmail: string) {
    return this.prisma.alert
      .findMany({
        where: {
          userEmail,
        },
        include: {
          user: true,
          cryptoData: true,
          currencyData: true,
        },
      })
      .then((data) =>
        data.map((dataRecord) => convertPrismaAlertToDto(dataRecord)),
      )
      .catch((error) => {
        throw new InternalServerErrorException(
          error,
          'Database connection error',
        );
      });
  }

  async delete(alertId: string) {
    const result = await this.prisma.alert
      .delete({
        where: {
          id: alertId,
        },
        include: {
          cryptoData: {
            select: {
              name: true,
            },
          },
          currencyData: {
            select: {
              symbol: true,
            },
          },
        },
      })
      .then((data) => convertDeletedAlertToDto(data))
      .catch((error) => {
        throw new InternalServerErrorException(
          error,
          'Database connection error',
        );
      });
    try {
      this.sendEmailOnDelete(result);
    } catch (error) {
      throw new InternalServerErrorException(error, 'Email sending error');
    }
    return result;
  }

  async sendEmailOnCreate(result: AlertDto) {
    await this.sendgrid.sendCreateAlert(result);
  }

  async sendEmailOnDelete(result: AlertDto) {
    await this.sendgrid.deletionOfAlert(result);
  }
}
