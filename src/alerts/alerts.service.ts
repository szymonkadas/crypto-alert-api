import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
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
  ) {}

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
