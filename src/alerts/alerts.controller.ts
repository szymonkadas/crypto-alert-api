import {
  BadRequestException,
  Body,
  Controller,
  HttpException,
  InternalServerErrorException,
  Param,
  Post,
} from '@nestjs/common';
import { SendgridService } from 'src/sendgrid/sendgrid.service';
import { AlertsService } from './alerts.service';
import { CreateAlertDto } from './dto/createAlert.dto';

@Controller('alerts')
export class AlertsController {
  constructor(
    private AlertsService: AlertsService,
    private SendgridService: SendgridService,
  ) {}
  @Post(':userEmail/create')
  async create(
    @Param('userEmail') userEmail: string | null,
    @Body() dto: CreateAlertDto,
  ) {
    if (userEmail === null) {
      if (userEmail === null || userEmail === undefined) {
        throw new BadRequestException(undefined, 'userEmail must be provided');
      }
    }
    const result = await this.AlertsService.create(userEmail, dto).catch(
      (error) => {
        if (error instanceof HttpException) {
          throw error;
        }
        throw new InternalServerErrorException(
          undefined,
          error.message || 'Internal server error',
        );
      },
    );
    if (result)
      await this.SendgridService.sendCreateAlert(result.userEmail, {
        price: result.price,
        currency: result.currencyData.symbol,
        crypto: result.cryptoData.name,
      });
    return result;
  }
}
