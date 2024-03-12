import { HttpService } from '@nestjs/axios';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { CacheStore, Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MailService } from '@sendgrid/mail';
import { PrismaService } from 'src/prisma.service';
import createAlert from 'src/utils/sendgrid/createAlert';
import deleteAlert from 'src/utils/sendgrid/deleteAlert';
import MessageTemplate from 'src/utils/sendgrid/MessageTemplate';
import verifyUser from 'src/utils/user/verifyUser';
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
  async sendCreateAlert(
    userEmail: string,
    alertData: { price: number; currency: string; crypto: string },
  ) {
    verifyUser(userEmail);
    // save new alert in db
    createAlert();
    // create message
    const message = new MessageTemplate(
      `ALERT: ${alertData.crypto}`,
      `CREATED: ${alertData.crypto} alert with price set to ${alertData.price}${alertData.currency} has been created!`,
    );
    // send notification
    return this.sendMail(
      userEmail,
      message.formatToMessageConfig(),
      'CREATION',
    );
  }

  async sendAlertPriceReached(userEmail: string, alertId: number) {
    verifyUser(userEmail);
    // fetch alert from db OR take it as argument, gotta decide
    // create message
    const message = new MessageTemplate(
      `ALERT: {alert.crypto}`,
      'ALERT: {alert.crypto} has reached {alert.price}{alert.currency}!',
    );
    // send notification
    return this.sendMail(userEmail, message.formatToMessageConfig(), 'ALERT');
  }

  async deletionOfAlert(userEmail: string, alertId: number) {
    verifyUser(userEmail);
    // delete alert from db
    deleteAlert(alertId);
    // create message
    const message = new MessageTemplate(
      `ALERT: {alert.crypto}`,
      'DELETED: {alert.crypto} alert with price set to {alert.price}{alert.currency} has been deleted!',
    );
    // send notification
    return this.sendMail(
      userEmail,
      message.formatToMessageConfig(),
      'DELETION',
    );
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
        return `SENT the ${description || 'custom'} message: ${msg.subject}`;
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
