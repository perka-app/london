import { IsNotEmpty, IsString } from 'class-validator';
import { Email } from './email.entity';
import { ApiProperty } from '@nestjs/swagger';

export class SendEmailDTO {
  @ApiProperty({
    description: 'Subject of the email',
    type: String,
    example: 'Welcome to our platform',
  })
  @IsString()
  @IsNotEmpty()
  subject: string;

  @ApiProperty({
    description: 'Text / HTML of the email',
    type: String,
    example: 'Hello, welcome to our platform! We are happy to have you here.',
  })
  @IsString()
  @IsNotEmpty()
  text: string;
}

export class EmailStatus {
  @ApiProperty({
    description: 'Date and time when the email was sent',
    type: Date,
    example: '2021-01-01T12:00:00.000Z',
  })
  sentAt: Date;

  @ApiProperty({
    description: 'Number of email recivers',
    type: Number,
    example: 10,
  })
  reciversCount: number;

  constructor(email: Email) {
    this.sentAt = email.sentAt;
    this.reciversCount = email.reciversCount;
  }
}
