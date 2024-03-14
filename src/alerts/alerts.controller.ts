import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpException,
  InternalServerErrorException,
  Param,
  Post,
} from '@nestjs/common';
import { isEmail } from 'class-validator';
import { SendgridService } from 'src/sendgrid/sendgrid.service';
import { AlertsService } from './alerts.service';
import { GetUserAlertsDto } from './dto/GetAlerts.dto';
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
    if (!isEmail(userEmail)) {
      throw new BadRequestException(
        undefined,
        'provided userEmail must be valid email address',
      );
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
  @Get(':userEmail')
  async get(
    @Param('userEmail') userEmail: string,
  ): Promise<GetUserAlertsDto[]> {
    if (!isEmail(userEmail)) {
      throw new BadRequestException('userEmail must be a valid email address');
    }
    try {
      const result = await this.AlertsService.get(userEmail);
      return result;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException(
        undefined,
        error.message || 'Internal server error',
      );
    }
  }
}
