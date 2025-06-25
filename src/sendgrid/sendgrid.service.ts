import { Injectable, ServiceUnavailableException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MailService } from '@sendgrid/mail';
import { AlertDto } from 'src/alerts/dto/GetAlerts.dto';
import MessageTemplate from 'src/utils/sendgrid/MessageTemplate';
@Injectable()
export class SendgridService {
  senderMail: string;
  constructor(
    private configService: ConfigService,
    private mailService: MailService,
  ) {
    this.mailService.setApiKey(this.configService.get('SENDGRID_API_KEY'));
    this.senderMail = this.configService.get('SENDER_MAIL');
  }

  // prolly will take crypto name and price info as arguments i suppose?
  async sendCreateAlert(alertData: Omit<AlertDto, 'id' | 'createdAt'>) {
    // verifyUser(userEmail); not needed if we're using it only in alerts controller.
    // create message
    const message = new MessageTemplate(
      `ALERT: ${alertData.crypto}`,
      `CREATED: ${alertData.crypto} alert with price set to ${alertData.price}${alertData.currency} has been created!`,
    );
    // send notification
    return this.sendMail(
      alertData.email,
      message.formatToMessageConfig(),
      'CREATION',
    );
  }

  async sendAlertPriceReached(
    alertData: Omit<AlertDto, 'id' | 'createdAt'> & { currentPrice: number },
  ) {
    // verifyUser(userEmail); not needeed if we're using it only in alerts controller.
    // fetch alert from db OR take it as argument, gotta decide
    // create message
    const message = new MessageTemplate(
      `ALERT: ${alertData.crypto}`,
      `ALERT: ${alertData.crypto} has reached ${alertData.price} ${alertData.currency}! It's price at the moment was: ${alertData.currentPrice} ${alertData.currency}.`,
    );
    // send notification
    return this.sendMail(
      alertData.email,
      message.formatToMessageConfig(),
      'ALERT',
    );
  }

  async deletionOfAlert(alertData: Omit<AlertDto, 'id' | 'createdAt'>) {
    // verifyUser(userEmail); not needed if we're using it only in alerts controller.
    // create message
    const message = new MessageTemplate(
      `ALERT: ${alertData.crypto}`,
      `DELETED: ${alertData.crypto} alert with price set to ${alertData.price}${alertData.currency} has been deleted!`,
    );
    // send notification
    return this.sendMail(
      alertData.email,
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
        throw new ServiceUnavailableException(
          error,
          `Failed to send mail message ${msg.subject}`,
        );
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
