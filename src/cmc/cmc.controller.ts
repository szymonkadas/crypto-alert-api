import { CACHE_MANAGER } from '@nestjs/cache-manager';
import {
  CacheStore,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Inject,
  Query,
} from '@nestjs/common';
import { DbMapEnumKeys, PrismaMapModels } from 'src/utils/enums';
import { CmcService } from './cmc.service';
@Controller('cmc')
export class CmcController {
  constructor(
    private cmcService: CmcService,
    @Inject(CACHE_MANAGER) private cacheManager: CacheStore,
  ) {}

  // Provides quotes (default USD if fiatIdList not provided) for cryptocurrencies.
  @Get('/data')
  async getQuotesData(
    @Query('id') idList: string,
    @Query('convert_id') fiatIdList?: string,
  ) {
    return await this.cmcService.getQuotesData(idList, fiatIdList);
  }

  // updating basic data endpoints:
  @Get('/update/db_map')
  async updateDbMap(@Query('map_type') enumKey: DbMapEnumKeys) {
    if (Object.keys(DbMapEnumKeys).includes(enumKey)) {
      return await this.cmcService.updateDbMap(enumKey);
    } else {
      throw new HttpException('Incorrect map_type', HttpStatus.BAD_REQUEST);
    }
  }

  @Get('/update/cache')
  async updateCache(@Query('model_name') enumKey: PrismaMapModels) {
    if (Object.keys(PrismaMapModels).includes(enumKey)) {
      const response = await this.cmcService.cacheMapFromDb(
        PrismaMapModels[enumKey],
      );
      if (response) {
        return response;
      } else {
        throw new HttpException(
          'Update failed, db does not have such record yet',
          HttpStatus.CONFLICT,
        );
      }
    } else {
      throw new HttpException('Incorrect cache_key', HttpStatus.BAD_REQUEST);
    }
  }

  // Possible endpoints in future:

  // Convert an amount of one cryptocurrency or fiat currency into one or more different currencies utilizing the latest market rate for each currency. You may optionally pass a historical timestamp as time to convert values based on historical rates
  // @Get('/price_convert')
  // async convertPrice(
  //   @Query('amount') amount: number,
  //   @Query('currencyName') currencyName: string,
  //   @Query('convert_id') currencyIdList: string,
  // ) {
  //   // to be implemented if needed.
  //   const id = 1;
  //   return await this.cmcService.convertPrice(amount, id, currencyIdList);
  // }
}
