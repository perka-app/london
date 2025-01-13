import { randomUUID, UUID } from 'crypto';
import { Column, Entity, PrimaryColumn } from 'typeorm';
import { IsNotEmpty } from 'class-validator';
import { SendEmailDTO } from './email.dto';

@Entity('emails')
export class Email {
  @PrimaryColumn({ nullable: false })
  emailId: UUID;

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
  reciversCount: number;

  constructor(emailDTO?: SendEmailDTO, organisationId?: UUID) {
    if (emailDTO && organisationId) {
      this.emailId = randomUUID();
      this.organisationId = organisationId;
      this.text = emailDTO.text;
      this.subject = emailDTO.subject;
    }
  }
}
