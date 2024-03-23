import { HttpService } from '@nestjs/axios';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { CacheStore, Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Cron } from '@nestjs/schedule';
import { firstValueFrom, map } from 'rxjs';
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
import {
  QuotesMapRecord,
  quotesSubMap,
} from 'src/utils/cmc/mapSubfunctions/quotesSubMap';
import updateDbMapController from 'src/utils/cmc/updateDbMapController';
@Injectable()
export class CmcService {
  constructor(
    private configService: ConfigService,
    private httpService: HttpService,
    private prisma: PrismaService,
    @Inject(CACHE_MANAGER) private cacheManager: CacheStore,
  ) {}

  // get latest quotes from cmc, if no idList is passed, returns all quotes. Use fiatIdList with caution (100/200 cryptos for 1 point + 1 point for each convert_id (except for first one)!)
  async getQuotesData(
    idList?: string,
    fiatIdList?: string,
  ): Promise<QuotesMapRecord[]> {
    const headers = {
      'X-CMC_PRO_API_KEY': this.configService.get('TEST_CRYPTO_API_KEY'),
    };
    const params = idList
      ? {
          id: idList,
          convert_id: fiatIdList,
        }
      : { convert_id: fiatIdList };
    const endpoint = idList
      ? '/v2/cryptocurrency/quotes/latest'
      : '/v1/cryptocurrency/listings/latest';

    const data: QuotesMapRecord[] = await this.cacheManager.get(
      CacheKeys.QuotesData,
    );
    if (data) {
      return data;
    }
    try {
      const response = this.httpService
        .get(`${this.configService.get('TEST_CRYPTO_API_URL')}${endpoint}`, {
          headers,
          params,
        })
        .pipe(
          map((response) => {
            // map data
            const mappedResponse = mapData(
              Object.values(response.data.data),
              quotesSubMap,
            );
            // save data in cache.
            this.cacheManager.set(CacheKeys.QuotesData, mappedResponse, 240000);
            return mappedResponse;
          }),
        );

      return await firstValueFrom(response);
    } catch (error) {
      console.error(error);
      throw error;
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

  // updates map of all available fiats/cryptos from api and saves it in db. (once a day every midnight) (id & name of fiats/cryptos are stored in db)
  @Cron('0 0 */1 * *')
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
            const mappedResponse: FiatMapRecord[] | CryptoMapRecord[] =
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
            // save data in cache for one hour
            try {
              this.cacheManager.set(
                CacheKeys[enumKey],
                mappedResponse,
                3600000,
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

  // fetching map from db in it's raw form (not mapped) and caching it.
  @Cron('0 */5 * * *')
  async cacheMapFromDb(mapId: DbMapEnumKeys) {
    try {
      const fetchedData = await this.prisma[PrismaMapModels[mapId]].findMany(
        {},
      );
      // save mapData in cache for 6 minutes. (1 additional minute to be safe)
      this.cacheManager.set(
        CacheKeys[mapId],
        mapId === DbMapEnumKeys.Crypto
          ? await mapData(fetchedData, cryptoSubMap)
          : await mapData(fetchedData, fiatSubMap),
        360000,
      );
      return fetchedData;
    } catch (error) {
      console.log(error);
      return false;
    }
  }
}
