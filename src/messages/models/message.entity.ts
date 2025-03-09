import { randomUUID, UUID } from 'crypto';
import { Column, Entity, PrimaryColumn } from 'typeorm';
import { IsNotEmpty } from 'class-validator';
import { SendMessageDTO } from './message.dto';

@Entity()
export class Message {
  @PrimaryColumn({ nullable: false })
  messageId: UUID;

  @Column()
  @IsNotEmpty()
  organisationId: UUID;

  @Column({ type: 'text', nullable: true })
  @IsNotEmpty()
  subject: string;

  @Column({ type: 'text' })
  @IsNotEmpty()
  text: string;

  @Column()
  @IsNotEmpty()
  sentAt: Date;

  @Column()
  @IsNotEmpty()
  receiversCount: number;

  constructor(messageDTO?: SendMessageDTO, organisationId?: UUID) {
    if (messageDTO && organisationId) {
      this.messageId = randomUUID();
      this.organisationId = organisationId;
      this.text = messageDTO.text;
      this.subject = messageDTO.subject;
    }
  }
}
