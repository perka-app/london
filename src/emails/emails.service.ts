import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Email } from './email/email.entity';
import { Repository } from 'typeorm';

@Injectable()
export class EmailsService {
  constructor(
    @InjectRepository(Email)
    private emailsRepository: Repository<Email>,
  ) {}

  async sendEmail(email: Email, reciversEmails: string[]): Promise<Email> {
    // Send the email
    // thow an error if the email could not be sent
    email.sentAt = new Date();
    email.reciversCount = reciversEmails.length;

    await this.emailsRepository.save(email);
    return email;
  }
}
