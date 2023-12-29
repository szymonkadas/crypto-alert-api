import { Controller, Get } from '@nestjs/common';
import { CryptoService } from './crypto.service';

@Controller('crypto')
export class CryptoController {
  constructor(private readonly cryptoService: CryptoService) {}
  // Endpoints that return data around cryptocurrencies such as ordered cryptocurrency lists or price and volume data.
  @Get('/data:')
  getData() {
    return this.cryptoService.getData();
  }

  // Providing cryptocurrencies map in format: cryptoName: {id: number, price: number}
  @Get('/data/map')
  getDataMap() {
    return this.cryptoService.getDataMap();
  }

  // Providing real world currencies data used in convertPrice.
  @Get('/fiat_map')
  getFiatMap() {
    return this.cryptoService.getFiatMap();
  }

  // Convert an amount of one cryptocurrency or fiat currency into one or more different currencies utilizing the latest market rate for each currency. You may optionally pass a historical timestamp as time to convert values based on historical rates
  @Get('/price_convert')
  convertPrice() {
    return this.cryptoService.convertPrice();
  }
}
