import {
  BadRequestException,
  Body,
  Controller,
  HttpException,
  InternalServerErrorException,
  Param,
  Post,
} from '@nestjs/common';
import { AlertsService } from './alerts.service';
import { CreateAlertDto } from './dto/createAlert.dto';

@Controller('alerts')
export class AlertsController {
  constructor(private AlertsService: AlertsService) {}
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
      (e) => {
        if (e instanceof HttpException) {
          throw { status: e.getStatus(), message: e.message, name: e.name };
        }
        throw new InternalServerErrorException(
          undefined,
          'Internal server error',
        );
      },
    );
    /* dillema: creating alert is different endpoint from sending email, 
      but they complement each other, hence should I call sendgrid service send email here?
      Calling controller endpoint doesn't make sense, if i can call sendgrid service directly, 
      but why then sendCreation endpoint exists if it should be called only from this service?
    */
    return result;
  }
}
