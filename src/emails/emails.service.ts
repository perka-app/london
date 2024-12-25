import { HttpException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Email } from './models/email.entity';
import { Client } from 'src/clients/models/client.entity';
import { OrganisationsService } from 'src/organisations/organisations.service';
import * as FormData from 'form-data';
import Mailgun, { MailgunMessageData, MessagesSendResult } from 'mailgun.js';
import * as fs from 'fs';
import * as path from 'path';
import { IMailgunClient } from 'mailgun.js/Interfaces';

@Injectable()
export class EmailsService {
  private mailgunClient: IMailgunClient;
  private emailFooter: string;
  private fromAddress: string;

  constructor(
    @InjectRepository(Email)
    private emailsRepository: Repository<Email>,
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
    this.emailFooter = textTemplates.footer;
    this.fromAddress = textTemplates.from;
  }

  async sendEmail(email: Email, recivers: Client[]): Promise<Email> {
    const organisationName = await this.organisationsService.getName(
      email.organisationId,
    );

    const from = `${organisationName} <${this.fromAddress}>`;

    for (const reciver of recivers) {
      reciver.decryptSensitiveData();
      const emailText =
        email.text + this.emailFooter.replace('{{email}}', reciver.email);

      const emailData = {
        to: reciver.email,
        from,
        subject: email.subject,
        text: email.text,
        html: emailText,
      };

      await this.send(emailData);
    }

    email.sentAt = new Date();
    email.reciversCount = recivers.length;
    await this.emailsRepository.save(email);

    return email;
  }

  private async send(email: MailgunMessageData): Promise<void> {
    await this.mailgunClient.messages
      .create(this.configService.get<string>('MAILGUN_DOMAIN') as string, email)
      .then((msg: MessagesSendResult) => console.log(msg))
      .catch((err) => {
        console.log(err);
        throw new Error(err.details);
      });
  }
}
