import { IsNotEmpty, IsString, IsUUID } from 'class-validator';
import { UUID } from 'crypto';
import { Email } from './email.entity';

export class SendEmailDTO {
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
