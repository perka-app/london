import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OrganisationsService } from 'src/organisations/organisations.service';
import * as FormData from 'form-data';
import Mailgun, { MailgunMessageData } from 'mailgun.js';
import * as fs from 'fs';
import * as path from 'path';
import { IMailgunClient } from 'mailgun.js/Interfaces';
import { Message } from './models/message.entity';
import {
  Subscriber,
  // Subscription,
} from 'src/subscribers/models/subscriber.entity';
import { UUID } from 'crypto';
import { GetMesagesDTO } from './models/message.dto';
// import { AuthService } from 'src/auth/auth.service';

@Injectable()
export class MessagesService {
  private mailgunClient: IMailgunClient;
  private messageFooter: string;

  private fromAddress: string;
  private unsubscribeUrl: string;
  // private confirmEmailUrl: string;
  // private confirmEmail: {
  //   subject: string;
  //   html: string;
  // };

  private logger = new Logger('MessagesService');

  constructor(
    @InjectRepository(Message)
    private messagesRepository: Repository<Message>,

    private configService: ConfigService,
    private organisationsService: OrganisationsService,
    // private authService: AuthService,
  ) {
    this.unsubscribeUrl =
      this.configService.get<string>('UNSUBSCRIBE_URL') || '';
    // this.confirmEmailUrl =
    //   this.configService.get<string>('CONFIRM_EMAIL_URL') || '';
    const mailgun = new Mailgun(FormData);
    this.mailgunClient = mailgun.client({
      username: 'api',
      key: this.configService.get<string>('MAILGUN_API_KEY') as string,
    });

    // Load JSON file with text templates
    const textTemplatesPath = path.join(
      process.cwd(),
      'assets/emailAssets.json',
    );
    const textTemplatesContent = fs.readFileSync(textTemplatesPath, 'utf8');
    const textTemplates = JSON.parse(textTemplatesContent);
    this.messageFooter = textTemplates.footer;
    this.fromAddress = textTemplates.from;
    // this.confirmEmail = textTemplates.confirmEmail;
  }

  async sendMessage(
    message: Message,
    recivers: Subscriber[],
  ): Promise<Message> {
    await this.sendEmail(message, recivers);

    message.sentAt = new Date();
    message.reciversCount = recivers.length;
    await this.messagesRepository.save(message);

    return message;
  }

  async sendTestMessage(
    message: Message,
    reciverEmail: string,
  ): Promise<Message> {
    const reciver = new Subscriber(reciverEmail, message.organisationId);
    reciver.encryptSensitiveData();
    await this.sendEmail(message, [reciver]);

    message.sentAt = new Date();
    message.reciversCount = 1;

    return message;
  }

  async sendConfirmationEmail(
    organisationId: UUID,
    subscriber: Subscriber,
  ): Promise<void> {
    //   const tokenData: Subscription = {
    //     subscriberId: subscriber.subscriberId,
    //     organisationId,
    //   };
    //   const token = await this.authService.generateToken(tokenData);
    //   const message = new Message(
    //     {
    //       subject: this.confirmEmail.subject,
    //       text: this.confirmEmail.html.replace(
    //         '{{organisationName}}',
    //         (await this.organisationsService.getName(organisationId))
    //           .replace('{{CONFIRM_EMAIL_URL}}', this.confirmEmailUrl)
    //           .replace('{{token}}', token),
    //       ),
    //     },
    //     organisationId,
    //   );
    //   await this.sendEmail(message, [subscriber]);
    console.log(organisationId + subscriber);
  }

  async getMessages(
    organisationId: UUID,
    getMessagesParams: GetMesagesDTO,
  ): Promise<Message[]> {
    const { start, end, order } = getMessagesParams;

    return await this.messagesRepository.find({
      where: { organisationId },
      order: { sentAt: order },
      skip: start,
      take: end,
    });
  }

  private async sendEmail(
    message: Message,
    recivers: Subscriber[],
  ): Promise<void> {
    const organisationName = await this.organisationsService.getName(
      message.organisationId,
    );

    const from = `${organisationName} via PERKA <${this.fromAddress}>`;
    let messageText =
      message.text +
      this.messageFooter.replace('{{UNSUBSCRIBE_URL}}', this.unsubscribeUrl);

    this.logger.log(
      `Sending email for organisation "${recivers[0].organisationId}" with content: ${messageText}`,
    );

    for (const reciver of recivers) {
      reciver.decryptSensitiveData();

      messageText = messageText.replace('{{id}}', reciver.subscriberId);

      const messageData = {
        to: reciver.email,
        from,
        subject: message.subject,
        text: message.text,
        html: messageText,
      };

      await this.send(messageData);
    }
  }

  private async send(message: MailgunMessageData): Promise<void> {
    await this.mailgunClient.messages
      .create(
        this.configService.get<string>('MAILGUN_DOMAIN') as string,
        message,
      )
      .catch((err) => {
        this.logger.error(
          `Failed to send message: ${JSON.stringify(message)}`,
          err,
        );
        throw new Error(err.details);
      });
  }
}
