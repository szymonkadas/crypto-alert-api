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

  @Get(':userEmail')
  async get(
    @Param('userEmail') userEmail: string,
  ): Promise<GetUserAlertsDto[]> {
    await this.validateEmail(userEmail);
    try {
      const result = await this.AlertsService.get(userEmail);
      return result;
    } catch (error) {
      await this.handleException(error);
    }
  }

  @Post(':userEmail/create')
  async create(
    @Param('userEmail') userEmail: string | null,
    @Body() dto: CreateAlertDto,
  ) {
    await this.validateEmail(userEmail);
    const result = await this.AlertsService.create(userEmail, dto).catch(
      this.handleException,
    );
    await this.sendEmailIfAlertCreated(result);
    return result;
  }

  // Validates whether the user email is valid
  async validateEmail(userEmail: string | null) {
    if (!isEmail(userEmail)) {
      throw new BadRequestException(
        undefined,
        'provided userEmail must be valid email address',
      );
    }
  }

  // Handles exceptions according to their type
  async handleException(error: any) {
    if (error instanceof HttpException) {
      throw error;
    }
    throw new InternalServerErrorException(
      undefined,
      error.message || 'Internal server error',
    );
  }

  async sendEmailIfAlertCreated(result: any) {
    if (result)
      await this.SendgridService.sendCreateAlert(result.userEmail, {
        price: result.price,
        currency: result.currencyData.symbol,
        crypto: result.cryptoData.name,
      });
  }
}
