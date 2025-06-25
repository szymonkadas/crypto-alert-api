import { IsNotEmpty, IsNumber } from 'class-validator';

export class CreateAlertDto {
  @IsNumber()
  @IsNotEmpty()
  cryptoId: number;
  @IsNumber()
  @IsNotEmpty()
  price: number;
  @IsNumber()
  @IsNotEmpty()
  // pass id?
  currencyId: number;
}
