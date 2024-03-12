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

  // sending alert mail about created notification
  @Post('/:userEmail/create')
  async sendCreateAlert(
    @Param('userEmail') userEmail,
    @Body() alertData: { id: number },
  ) {
    return await this.sendgridService.sendCreateAlert(userEmail, alertData);
  }

  // sending price reached alert mail
  @Get('/:userEmail/alert/:alertId')
  async sendAlertPriceReached(
    @Param('userEmail') userEmail: string,
    @Param('alertId') alertId: number,
  ) {
    return await this.sendgridService.sendAlertPriceReached(userEmail, alertId);
  }

  // sending delete alert mail
  @Delete('/:userEmail/delete/:alertId')
  async deletionOfAlert(
    @Param('userEmail') userEmail: string,
    @Param('alertId') alertId: number,
  ) {
    return await this.sendgridService.deletionOfAlert(userEmail, alertId);
  }
}
