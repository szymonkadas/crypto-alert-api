import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MailService } from '@sendgrid/mail';
import { SendgridController } from './sendgrid.controller';
import { SendgridService } from './sendgrid.service';

@Module({
  imports: [],
  controllers: [SendgridController],
  providers: [SendgridService, ConfigService, MailService],
  exports: [SendgridService],
})
export class SendgridModule {}
