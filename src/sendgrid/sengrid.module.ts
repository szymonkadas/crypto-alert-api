import { HttpModule } from '@nestjs/axios';
import { CacheModule } from '@nestjs/cache-manager';
import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MailService } from '@sendgrid/mail';
import { PrismaService } from 'src/prisma.service';
import { SendgridController } from './sendgrid.controller';
import { SendgridService } from './sendgrid.service';

@Module({
  imports: [CacheModule.register(), HttpModule],
  controllers: [SendgridController],
  providers: [SendgridService, ConfigService, PrismaService, MailService],
})
export class SendgridModule {}
