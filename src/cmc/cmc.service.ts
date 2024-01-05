import { HttpService } from '@nestjs/axios';
import { CacheStore, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { map } from 'rxjs';
import { PrismaService } from 'src/prisma.service';
import mapCryptocurrencies from 'src/utils/mapCryptocurrencies';
import mapFiat from 'src/utils/mapFiat';
import mapLatestData from 'src/utils/mapLatestData';

@Injectable()
export class CmcService {
  constructor(
    private configService: ConfigService,
    private httpService: HttpService,
    private prisma: PrismaService,
    private cacheManager: CacheStore,
  ) {}

  async getData(idList: string, fiatIdList?: string) {
    const headers = {
      'X-CMC_PRO_API_KEY': this.configService.get('TEST_CRYPTO_API_KEY'),
    };
    const params = {
      id: idList,
      convert_id: fiatIdList,
    };
    const endpoint = '/v2/cryptocurrency/quotes/latest';
    // get data from cache (maybe will work later only with crons and get data only from cache?)
    const data = this.cacheManager.get('latestQuotesData');
    if (data) {
      return data;
    }
    // if cache not available:
    try {
      const response = await this.httpService
        .get(`${this.configService.get('TEST_CRYPTO_API_URL')}${endpoint}`, {
          headers,
          params,
        })
        .pipe(
          map((response) => {
            // save data in cache
            mapLatestData(response, this.cacheManager);
            // return
            return data;
          }),
        );
      return response;
    } catch (error) {
      console.error(error);
      return error;
    }
  }

  async updateCryptocurrencyMap() {
    const headers = {
      'X-CMC_PRO_API_KEY': this.configService.get('TEST_CRYPTO_API_KEY'),
    };
    const endpoint = '/v1/cryptocurrency/map';
    try {
      const response = await this.httpService
        .get(`${this.configService.get('TEST_CRYPTO_API_URL')}${endpoint}`, {
          headers,
        })
        .pipe(
          map(async (response) => mapCryptocurrencies(response, this.prisma)),
        );
      return response;
    } catch (error) {
      console.error(error);
    }
  }

  async updateFiatMap() {
    const headers = {
      'X-CMC_PRO_API_KEY': this.configService.get('TEST_CRYPTO_API_KEY'),
    };
    const endpoint = '/v1/fiat/map';
    try {
      const response = await this.httpService
        .get(`${this.configService.get('TEST_CRYPTO_API_URL')}${endpoint}`, {
          headers,
        })
        .pipe(map((response) => mapFiat(response, this.prisma)));
      return response;
    } catch (error) {
      console.error(error);
      return error;
    }
  }

  async cacheMap(mapId: string) {
    try {
      const newResponse = await this.prisma.mapData.findFirst({
        where: {
          id: mapId,
        },
      });
      const mapData = new Map(JSON.parse(`${newResponse.map}`).map);
      // save mapData in cache

      return mapData;
    } catch (error) {
      console.log(error);
      return false;
    }
  }
}
