import { Body, Controller, Post } from '@nestjs/common';
import { SendgridService, sendgridMessage } from './sendgrid.service';
@Controller('sendgrid')
export class SendgridController {
  constructor(private readonly sendgridService: SendgridService) {}

  @Post('/send')
  async send(@Body() message: sendgridMessage): Promise<string> {
    return await this.sendgridService.sendMessage(message);
  }
}
