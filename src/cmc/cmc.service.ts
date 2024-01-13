import { HttpService } from '@nestjs/axios';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { CacheStore, Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { map } from 'rxjs';
import { PrismaService } from 'src/prisma.service';
import {
  CacheKeys,
  DbMapEnumKeys,
  MapEndpoints,
  PrismaMapModels,
} from 'src/utils/cmc/enums';
import mapData from 'src/utils/cmc/mapData';
import {
  CryptoMapRecord,
  cryptoSubMap,
} from 'src/utils/cmc/mapSubfunctions/cryptoSubMap';
import {
  FiatMapRecord,
  fiatSubMap,
} from 'src/utils/cmc/mapSubfunctions/fiatSubMap';
import { quotesSubMap } from 'src/utils/cmc/mapSubfunctions/quotesSubMap';
import updateDbMapController from 'src/utils/cmc/updateDbMapController';
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
            const mappedResponse = mapData(
              Object.values(response.data.data),
              quotesSubMap,
            );
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
    const response = await this.httpService
      .get(`${this.configService.get('TEST_CRYPTO_API_URL')}${endpoint}`, {
        headers,
        params,
      })
      .pipe(
        map(async (response) => {
          const data = response.data.data;
          return data;
        }),
      );

    return response;
  }

  // updates map in db. Cron maybe?
  async updateDbMap(enumKey: DbMapEnumKeys) {
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
            const mappedResponse: FiatMapRecord | CryptoMapRecord =
              enumKey === DbMapEnumKeys.Crypto
                ? await mapData(response.data.data, cryptoSubMap)
                : await mapData(response.data.data, fiatSubMap);
            // save data in db
            try {
              await updateDbMapController(
                CacheKeys[enumKey],
                response,
                this.prisma,
              );
            } catch (e) {
              console.log(`${CacheKeys[enumKey]} db update failed`, e);
            }
            // save data in cache
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

  // fetching map from db in it's raw form (not mapped) and caching it. (use on init?)
  async cacheMapFromDb(mapId: PrismaMapModels) {
    try {
      const fetchedData = await this.prisma[mapId].findMany({});
      // save mapData in cache for 1000 seconds, prolly will change lifespan
      this.cacheManager.set(mapId, fetchedData, 1000000);
      return fetchedData;
    } catch (error) {
      console.log(error);
      return false;
    }
  }
}
