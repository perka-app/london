import { IsNotEmpty, IsString } from 'class-validator';
import { Email } from './email.entity';

export class SendEmailDTO {
  @IsString()
  @IsNotEmpty()
  subject: string;

  @IsString()
  @IsNotEmpty()
  text: string;
}

export class EmailStatus {
  sentAt: Date;

  reciversCount: number;

  constructor(email: Email) {
    this.sentAt = email.sentAt;
    this.reciversCount = email.reciversCount;
  }
}
