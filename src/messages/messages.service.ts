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
import { Subscriber } from 'src/subscribers/models/subscriber.entity';
import { UUID } from 'crypto';
import { GetMesagesDTO } from './models/message.dto';

@Injectable()
export class MessagesService {
  private mailgunClient: IMailgunClient;
  private messageFooter: string;
  private fromAddress: string;
  private logger = new Logger('MessagesService');

  constructor(
    @InjectRepository(Message)
    private messagesRepository: Repository<Message>,
    private configService: ConfigService,
    private organisationsService: OrganisationsService,
  ) {
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

    const from = `${organisationName} <${this.fromAddress}>`;

    for (const reciver of recivers) {
      reciver.decryptSensitiveData();
      const messageText =
        message.text + this.messageFooter.replace('{{message}}', reciver.email);

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
