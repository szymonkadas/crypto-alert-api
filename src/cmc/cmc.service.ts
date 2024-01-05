import { HttpService } from '@nestjs/axios';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { CacheStore, Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { map } from 'rxjs';
import { PrismaService } from 'src/prisma.service';
import dbUpdateMap from 'src/utils/dbUpdateMap';
import { CacheKeys, DbEnumKeys, MapEndpoints } from 'src/utils/enums';
import mapCryptocurrencies from 'src/utils/mapCryptocurrencies';
import mapFiat from 'src/utils/mapFiat';
import mapQuotesData from 'src/utils/mapQuotesData';
@Injectable()
export class CmcService {
  constructor(
    private configService: ConfigService,
    private httpService: HttpService,
    private prisma: PrismaService,
    @Inject(CACHE_MANAGER) private cacheManager: CacheStore,
  ) {}

  async getQuotesData(idList: string, fiatIdList?: string) {
    const headers = {
      'X-CMC_PRO_API_KEY': this.configService.get('TEST_CRYPTO_API_KEY'),
    };
    const params = {
      id: idList,
      convert_id: fiatIdList,
    };
    const endpoint = '/v2/cryptocurrency/quotes/latest';
    // get data from cache (maybe will work later only with crons and get data only from cache?)
    const data = await this.cacheManager.get(CacheKeys.QuotesData);
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
          map(async (response) => {
            // map data
            const mappedResponse = mapQuotesData(response);
            // save data in cache
            try {
              this.cacheManager.set(
                CacheKeys.QuotesData,
                mappedResponse,
                1000000,
              );
            } catch (e) {
              console.log(`${CacheKeys.QuotesData} update failed`, e);
            }
            // return
            return mappedResponse;
          }),
        );
      return response;
    } catch (error) {
      console.error(error);
      return error;
    }
  }

  // May be useful, but tbh conversion is available in getLatest so won't yet use in controller and do sth with this data.
  async convertPrice(amount: number, id: number, convert_id: string) {
    // setup
    const headers = {
      'X-CMC_PRO_API_KEY': this.configService.get('TEST_CRYPTO_API_KEY'),
    };
    const endpoint = '/v2/tools/price-conversion';
    const params = {
      amount,
      id,
      convert_id,
    };
    // fetch
    const response = await this.httpService.get(
      `${this.configService.get('TEST_CRYPTO_API_URL')}${endpoint}`,
      { headers, params },
    );

    return response;
  }

  // updates map in db. Cron maybe?
  async updateDbMap(enumKey: DbEnumKeys) {
    const headers = {
      'X-CMC_PRO_API_KEY': this.configService.get('TEST_CRYPTO_API_KEY'),
    };
    try {
      const response = await this.httpService
        .get(
          `${this.configService.get('TEST_CRYPTO_API_URL')}${
            MapEndpoints[enumKey]
          }`,
          {
            headers,
          },
        )
        .pipe(
          map(async (response) => {
            // map data
            const mappedResponse =
              enumKey === DbEnumKeys.Crypto
                ? await mapCryptocurrencies(response)
                : await mapFiat(response);
            // save in db data
            try {
              await dbUpdateMap(
                CacheKeys[enumKey],
                mappedResponse,
                this.prisma,
              );
            } catch (e) {
              console.log(`${CacheKeys[enumKey]} db update failed`, e);
            }
            // save in cache data
            try {
              this.cacheManager.set(
                CacheKeys[enumKey],
                mappedResponse,
                1000000,
              );
            } catch (e) {
              console.log(`${CacheKeys[enumKey]} cache update failed`, e);
            }

            return mappedResponse;
          }),
        );
      return response;
    } catch (error) {
      console.error(error);
      return error;
    }
  }

  // fetching map from db and caching it. (use on init?) Won't return map
  async cacheMapFromDb(mapId: CacheKeys) {
    try {
      const newResponse = await this.prisma.mapData.findFirst({
        where: {
          id: mapId,
        },
      });
      // since Json is string such assertion is ok. JSON.stringify would mess real js typing
      const mapData = new Map(JSON.parse(newResponse.map as string));
      // save mapData in cache
      this.cacheManager.set(mapId, mapData, 1000000);
      return newResponse.map;
    } catch (error) {
      console.log(error);
      return false;
    }
  }
}
