import { HttpService } from '@nestjs/axios';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { CacheStore, Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MailService } from '@sendgrid/mail';
import { PrismaService } from 'src/prisma.service';
@Injectable()
export class SendgridService {
  constructor(
    private configService: ConfigService,
    private httpService: HttpService,
    private prisma: PrismaService,
    @Inject(CACHE_MANAGER) private cacheManager: CacheStore,
    private mailService: MailService,
  ) {
    this.mailService.setApiKey(this.configService.get('SENDGRID_API_KEY'));
  }

  async sendMessage(msg: sendgridMessage) {
    return await this.mailService
      .send(msg)
      .then(() => {
        return `SENT a message: ${msg.subject}`;
      })
      .catch((error) => {
        const errorMessage = `Failed to send mail message ${msg.subject}, ERROR: ${error}`;
        console.error(errorMessage, error);
        return errorMessage;
      });
  }
}

export type sendgridMessage = {
  to: string;
  from: string;
  subject: string;
  text: string;
  html: string;
};
