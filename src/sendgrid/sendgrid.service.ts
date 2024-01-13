import { HttpService } from '@nestjs/axios';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { CacheStore, Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MailService } from '@sendgrid/mail';
import { PrismaService } from 'src/prisma.service';
import createAlert from 'src/utils/sendgrid/createAlert';
import deleteAlert from 'src/utils/sendgrid/deleteAlert';
@Injectable()
export class SendgridService {
  senderMail: string;
  constructor(
    private configService: ConfigService,
    private httpService: HttpService,
    private prisma: PrismaService,
    @Inject(CACHE_MANAGER) private cacheManager: CacheStore,
    private mailService: MailService,
  ) {
    this.mailService.setApiKey(this.configService.get('SENDGRID_API_KEY'));
    this.senderMail = this.configService.get('SENDER_MAIL');
  }

  // prolly will take crypto name and price info as arguments i suppose?
  async sendCreateAlert(userEmail: string, msg: sendgridMessageConfig) {
    const message = {
      from: this.senderMail,
      ...msg,
    };
    // save new alert in db
    createAlert();
    // send notification
    return this.sendMail(userEmail, message, 'CREATION');
  }

  async sendAlertPriceReached(userEmail: string, msg: sendgridMessageConfig) {
    const message = {
      ...msg,
    };

    // send notification
    return this.sendMail(userEmail, message, 'ALERT');
  }

  async deletionOfAlert(
    userEmail: string,
    alertId: number,
    msg: sendgridMessageConfig,
  ) {
    const message = {
      ...msg,
    };
    // delete alert from db
    deleteAlert(alertId);
    // send notification
    return this.sendMail(userEmail, message, 'DELETION');
  }

  async sendMail(
    userEmail: string,
    msg: sendgridMessageConfig,
    description?: string,
  ) {
    const message: sendgridMessage = {
      from: this.senderMail,
      to: userEmail,
      ...msg,
    };
    return await this.mailService
      .send(message)
      .then(() => {
        return `SENT the ${description} message: ${msg.subject}`;
      })
      .catch((error) => {
        const errorMessage = `Failed to send mail message ${msg.subject}, ERROR: ${error}`;
        console.error(errorMessage, error);
        return errorMessage;
      });
  }
}

export type sendgridMessageConfig = {
  subject: string;
  text: string;
  html: string;
};

type sendgridMessage = sendgridMessageConfig & {
  to: string;
  from: string;
};
