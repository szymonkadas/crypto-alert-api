import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
@Injectable()
export class CryptoService {
  constructor(
    private readonly cryptoService: CryptoService,
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {}
  // Endpoints that return data around cryptocurrencies such as ordered cryptocurrency lists or price and volume data.
  async getData() {
    // cache part:

    // fetch part:
    const dataSuffix = '/v2/cryptocurrency/quotes/latest';
    const urlPrefix = this.configService.get('TEST_CRYPTO_API_URL');
    const headers = {
      'X-CMC_PRO_API_KEY': this.configService.get('TEST_CRYPTO_API_KEY'),
    };
    const response = await this.httpService.get(
      `${urlPrefix}/v1/cryptocurrency`,
      { headers },
    );
    return response;
  }

  // Providing cryptocurrencies map in format: cryptoName: {id: number, price: number}
  getDataMap() {}

  // Providing real world currencies data used in convertPrice.
  getFiatMap() {}

  // may be useful
  // Convert an amount of one cryptocurrency or fiat currency into one or more different currencies utilizing the latest market rate for each currency. You may optionally pass a historical timestamp as time to convert values based on historical rates
  async convertPrice() {}
}
