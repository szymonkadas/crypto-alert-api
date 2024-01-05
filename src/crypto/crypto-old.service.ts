// import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
@Injectable()
export class CryptoService {
  //cryptocurrencies map in format: cryptoName: {id: number, price: number}, maybe move it to cache?
  // private dataMap: Map<string, { id: number; price: number }>;
  private urlPrefix = this.configService.get('TEST_CRYPTO_API_URL');
  // cryptocurrencies map in format id: {name: string, symbol: string, slug: string, is_active: number (1/0) }, move it to DB?
  public cryptoIdMap;

  constructor(
    // private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    // może tutaj brać wartość z cache? A MOŻE MONGO?
    // this.dataMap = new Map();
  }
  // Endpoints that return data around cryptocurrencies such as ordered cryptocurrency lists or price and volume data.
  async getData(
    idList: string,
    fiatIdList?: string,
    // skipCache: boolean = false,
  ) {
    // CACHE part;
    // if (!skipCache) {
    // można użyć getDataMap tylko pamiętaj że ichniejszy map z id: cryptoName będzie wymagał innej metody
    // }

    // fetch part:
    const dataSuffix = '/v2/cryptocurrency/quotes/latest';
    // const urlPrefix = this.configService.get('TEST_CRYPTO_API_URL');
    const headers = {
      'X-CMC_PRO_API_KEY': this.configService.get('TEST_CRYPTO_API_KEY'),
      id: idList,
    };
    try {
      const response = await axios.get(
        `${this.urlPrefix}${dataSuffix}${
          // fiatIdList ? `&convert_id=${fiatIdList}` : ''
          ''
        }`,
        { headers },
      );
      // save in CACHE part

      // return
      return response;
    } catch (e) {
      console.error(e);
      return e;
    }
  }

  // // Providing cryptocurrencies map in format: cryptoName: {id: number, price: number, date: string}
  // getDataMap() {
  //   return this.dataMap;
  // }

  // async updateDataMap(names: string[]) {
  //   // bez crona to nie ma racji bytu na blokach, DO ZROBIENIA CRON
  //   const idList: number[] = [];
  //   for (const name of names) {
  //     idList.push(this.dataMap.get(name).id);
  //   }
  //   const data = await this.getData(idList.join(','));
  //   // save data in CACHE (db wouldn't work here better than cache)

  //   // return data
  //   return data;
  // }

  // // Providing cryptocurrencies api map (id, rank, name, symbol, slug, is_active)
  // async getCryptoIdMap() {
  //   // setup
  //   const headers = {
  //     'X-CMC_PRO_API_KEY': this.configService.get('TEST_CRYPTO_API_KEY'),
  //   };
  //   const dataSuffix = '/v1/cryptocurrency/map';
  //   // fetch
  //   const response = await this.httpService.get(
  //     `${this.urlPrefix}${dataSuffix}`,
  //     { headers },
  //   );
  //   // save in DB later on
  //   this.cryptoIdMap = response;
  //   // return
  //   return response;
  // }

  // // Providing real world currencies data used in convertPrice.
  // async getFiatMap() {
  //   // setup
  //   const headers = {
  //     'X-CMC_PRO_API_KEY': this.configService.get('TEST_CRYPTO_API_KEY'),
  //   };
  //   const dataSuffix = '/v1/fiat/map';
  //   // fetch
  //   const response = await this.httpService.get(
  //     `${this.urlPrefix}${dataSuffix}`,
  //     { headers },
  //   );
  //   // save in DB

  //   // return
  //   return response;
  // }

  // // Convert an amount of one cryptocurrency or fiat currency into one or more different currencies utilizing the latest market rate for each currency. You may optionally pass a historical timestamp as time to convert values based on historical rates
  // async convertPrice(amount: number, id: number, convert_id: string) {
  //   // setup
  //   const headers = {
  //     'X-CMC_PRO_API_KEY': this.configService.get('TEST_CRYPTO_API_KEY'),
  //   };
  //   const dataSuffix = '/v2/tools/price-conversion';
  //   // fetch
  //   const response = await this.httpService.get(
  //     `${this.urlPrefix}${dataSuffix}?amount=${amount}&id=${id}&convert_id=${convert_id}`,
  //     { headers },
  //   );
  //   return response;
  // }
}
