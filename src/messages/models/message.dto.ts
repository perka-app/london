import { IsEnum, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Message } from './message.entity';

export class SendMessageDTO {
  @ApiProperty({
    description: 'Subject of the message',
    type: String,
    example: 'Welcome to our platform',
  })
  @IsString()
  @IsNotEmpty()
  subject: string;

  @ApiProperty({
    description: 'Text / HTML of the message',
    type: String,
    example: 'Hello, welcome to our platform! We are happy to have you here.',
  })
  @IsString()
  @IsNotEmpty()
  text: string;

  constructor(message: Message) {
    this.subject = message.subject;
    this.text = message.text;
  }
}

export enum Order {
  ASC = 'ASC',
  DESC = 'DESC',
}
export class GetMesagesDTO {
  @ApiProperty({
    description: 'Order of the messages',
    example: Order.ASC,
    enum: Order,
  })
  @IsEnum(Order)
  order: Order;

  @ApiProperty({
    description: 'Number of messages to skip',
    type: Number,
    example: 0,
  })
  @IsNumber()
  start: number;

  @ApiProperty({
    description: 'Number of messages to take',
    type: Number,
    example: 10,
  })
  @IsNumber()
  end: number;
}

export class MessageDTO {
  @ApiProperty()
  subject: string;

  @ApiProperty()
  text: string;

  @ApiProperty()
  sentAt: Date;

  @ApiProperty()
  reciversCount: number;

  constructor(message: Message) {
    this.subject = message.subject;
    this.text = message.text;
    this.sentAt = message.sentAt;
    this.reciversCount = message.reciversCount;
  }
}

export class MessageStatus {
  @ApiProperty({
    description: 'Date and time when the message was sent',
    type: Date,
    example: '2021-01-01T12:00:00.000Z',
  })
  sentAt: Date;

  @ApiProperty({
    description: 'Number of message recivers',
    type: Number,
    example: 10,
  })
  reciversCount: number;

  constructor(message: Message) {
    this.sentAt = message.sentAt;
    this.reciversCount = message.reciversCount;
  }
}
