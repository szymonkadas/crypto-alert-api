import { Body, Controller, Param, Post } from '@nestjs/common';
import { SendgridService, sendgridMessageConfig } from './sendgrid.service';
@Controller('alerts')
export class SendgridController {
  constructor(private readonly sendgridService: SendgridService) {}

  // Sending email
  @Post('/send')
  async sendMail(
    @Param() userEmail: string,
    @Body() message: sendgridMessageConfig,
  ): Promise<string> {
    return await this.sendgridService.sendMail(userEmail, message);
  }

  // sending alert mail about created notification
  @Post('/create')
  async sendCreateAlert(
    @Param() userEmail: string,
    @Body() message: sendgridMessageConfig,
  ) {
    return await this.sendgridService.sendCreateAlert(userEmail, message);
  }

  // sending price reached alert mail
  @Post('/alert')
  async sendAlertPriceReached(
    @Param() userEmail: string,
    @Body() message: sendgridMessageConfig,
  ) {
    return await this.sendgridService.sendAlertPriceReached(userEmail, message);
  }

  // sending delete alert mail
  @Post('/delete')
  async deletionOfAlert(
    @Param() userEmail: string,
    @Param() alertId: number,
    @Body() message: sendgridMessageConfig,
  ) {
    return await this.sendgridService.deletionOfAlert(
      userEmail,
      alertId,
      message,
    );
  }
}
