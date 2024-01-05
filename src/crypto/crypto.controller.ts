import { Controller, Get, Query } from '@nestjs/common';
import { CryptoService } from './crypto.service';

@Controller('crypto')
export class CryptoController {
  constructor(private readonly cryptoService: CryptoService) {}
  // Endpoints that return data around cryptocurrencies such as ordered cryptocurrency lists or price and volume data.
  @Get('/data')
  getData(
    @Query('id') idList: string,
    @Query('convert_id') currencyIdList?: string,
  ) {
    try {
      return this.cryptoService.getData(idList, currencyIdList);
    } catch (e) {
      console.error(e);
      return e;
    }
  }

  // // Providing cryptocurrencies map in format: cryptoName: {id: number, price: number}
  // @Get('/data/map')
  // getDataMap() {
  //   return this.cryptoService.getDataMap();
  // }

  // // Providing cryptocurrencies api map (id, rank, name, symbol, slug, is_active)
  // @Get('/data/id-map')
  // getCryptoIdMap() {
  //   return this.cryptoService.getCryptoIdMap();
  // }
  // // Providing real world currencies data used in convertPrice.
  // @Get('/fiat-map')
  // getFiatMap() {
  //   return this.cryptoService.getFiatMap();
  // }

  // Convert an amount of one cryptocurrency or fiat currency into one or more different currencies utilizing the latest market rate for each currency. You may optionally pass a historical timestamp as time to convert values based on historical rates
  // @Get('/price_convert')
  // convertPrice(
  //   @Query('amount') amount: number,
  //   @Query('currencyName') currencyName: string,
  //   @Query('convert_id') currencyIdList: string,
  // ) {
  //   const fiatMap = this.cryptoService.getFiatMap();
  //   // its now 100% error
  //   const fiatId = fiatMap.get(currencyName);
  //   return this.cryptoService.convertPrice(amount, fiatId, currencyIdList);
  // }
}
