import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { SendgridService, sendgridMessageConfig } from './sendgrid.service';
@Controller('mail')
export class SendgridController {
  constructor(private readonly sendgridService: SendgridService) {}

  // Sending email
  @Post('/:userEmail/send')
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
    @Body() alertData: { price: number; currency: string; crypto: string },
  ) {
    return await this.sendgridService.sendCreateAlert(userEmail, alertData);
  }

  // sending price reached alert mail
  @Get('/:userEmail/alert/:alertId')
  async sendAlertPriceReached(
    @Param('userEmail') userEmail: string,
    @Param('alertId') alertId: string,
  ) {
    return await this.sendgridService.sendAlertPriceReached(userEmail, alertId);
  }

  // sending delete alert mail => for testing purposes used only in alerts controller
  @Delete('/:userEmail/delete/:alertId')
  async deletionOfAlert(
    @Param('userEmail') userEmail: string,
    @Param('alertId') alertId: string,
  ) {
    return await this.sendgridService.deletionOfAlert(userEmail, alertId);
  }
}
