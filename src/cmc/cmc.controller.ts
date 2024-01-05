import { Controller, Get, Query } from '@nestjs/common';
import { CmcService } from './cmc.service';
@Controller('cmc')
export class CmcController {
  constructor(private cmcService: CmcService) {}

  // Endpoints that return data around cryptocurrencies such as ordered cryptocurrency lists or price and volume data.
  @Get('/data')
  getData(
    @Query('id') idList: string,
    @Query('convert_id') fiatIdList?: string,
  ) {
    return this.cmcService.getData(idList, fiatIdList);
  }

  // Convert an amount of one cryptocurrency or fiat currency into one or more different currencies utilizing the latest market rate for each currency. You may optionally pass a historical timestamp as time to convert values based on historical rates
  // @Get('/price_convert')
  // convertPrice(
  //   @Query('amount') amount: number,
  //   @Query('currencyName') currencyName: string,
  //   @Query('convert_id') currencyIdList: string,
  // ) {
  //   const fiatMap = this.cmcService.getFiatMap();
  //   const fiatId = fiatMap.get(currencyName);
  //   return this.cmcService.convertPrice(amount, fiatId, currencyIdList);
  // }
}
