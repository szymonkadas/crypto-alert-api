import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { AlertDto } from 'src/alerts/dto/GetAlerts.dto';
import handleException from 'src/utils/controllers/handleException';
import { SendgridService, sendgridMessageConfig } from './sendgrid.service';
@Controller('mail')
export class SendgridController {
  constructor(private readonly sendgridService: SendgridService) {}

  // Sending email
  @Post('/:userEmail/message')
  async sendMail(
    @Param('userEmail') userEmail: string,
    @Body() message: sendgridMessageConfig,
  ): Promise<string> {
    return await this.sendgridService.sendMail(userEmail, message);
  }

  // sending alert mail about created notification -> for testing purposes => service used only in alerts controller.
  @Post('/:userEmail/create')
  async sendCreateAlert(
    @Param('userEmail') userEmail,
    @Body() alertData: Omit<AlertDto, 'id' | 'createdAt' | 'email'>,
  ) {
    try {
      return await this.sendgridService.sendCreateAlert({
        email: userEmail,
        ...alertData,
      });
    } catch (error) {
      return handleException(error);
    }
  }

  // sending price reached alert mail
  @Get('/:userEmail/fire')
  async sendAlertPriceReached(
    @Param('userEmail') userEmail: string,
    @Body() alertData: Omit<AlertDto, 'id' | 'createdAt' | 'email'>,
  ) {
    try {
      return await this.sendgridService.sendAlertPriceReached({
        email: userEmail,
        ...alertData,
      });
    } catch (error) {
      return handleException(error);
    }
  }

  // though it's not proper to pass more data than alert's id and email, it uses data that would be fetched from db, because this endpoint isn't meant to be used anywhere besides test env.
  // sending delete alert mail => for testing purposes used only in alerts controller (maybe we'll go back to the prev version and fetch data from db here, gotta decide when will start testing)
  @Delete('/:userEmail/delete')
  async deletionOfAlert(
    @Param('userEmail') userEmail: string,
    @Body() alertData: Omit<AlertDto, 'id' | 'createdAt' | 'email'>,
  ) {
    try {
      return await this.sendgridService.deletionOfAlert({
        email: userEmail,
        ...alertData,
      });
    } catch (error) {
      return handleException(error);
    }
  }
}
