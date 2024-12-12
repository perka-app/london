import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Email } from './email/email.entity';
import { Repository } from 'typeorm';

import { ConfigService } from '@nestjs/config';
import { IMailgunClient } from 'mailgun.js/Interfaces';
import formData from 'form-data';
import Mailgun, { MailgunMessageData } from 'mailgun.js';

@Injectable()
export class EmailsService {
  constructor(
    @InjectRepository(Email)
    private emailsRepository: Repository<Email>,
    private configService: ConfigService,
  ) {}

  MAILGUN_API_KEY = this.configService.get<string>('MAILGUN_API_KEY') as string;
  MAILGUN_DOMAIN = this.configService.get<string>('MAILGUN_DOMAIN') as string;

  private client = new Mailgun(FormData).client({
    username: 'api',
    key: this.MAILGUN_API_KEY,
  });

  async sendEmail(email: Email, reciversEmails: string[]): Promise<Email> {
    // Send the email
    // thow an error if the email could not be sent
    email.sentAt = new Date();
    email.reciversCount = reciversEmails.length;

    await this.emailsRepository.save(email);
    return email;
  }

  async sendTestEmail(email: Email, reciversEmails: string[]): Promise<Email> {
    const emailData: MailgunMessageData = {
      to: ['maksim.peg.pl@gmail.com'],
      from: 'Excited User <no-reply@perka.com>',
      subject: 'Hello',
      text: 'Testing some Mailgun awesomeness!',
      html: email.text,
    };

    await this.send(emailData);

    return email;
  }

  async send(email: MailgunMessageData): Promise<void> {
    await this.client.messages
      .create(this.MAILGUN_DOMAIN, email)
      .then((msg) => console.log(msg))
      .catch((err) => {
        console.log(err);
        throw new Error(err.details);
      });
  }
}
