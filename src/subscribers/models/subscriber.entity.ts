import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { randomUUID, UUID } from 'crypto';
import { aesEncrypt } from 'src/common/aesHelper';
import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity()
export class Subscriber {
  @PrimaryColumn()
  subscriberId: UUID;

  @Column()
  @IsNotEmpty()
  organisationId: UUID;

  @Column()
  email: string;

  @Column()
  confirmed: boolean;

  @Column()
  joinedAt: Date;

  public encryptSensitiveData(): void {
    this.email = aesEncrypt(this.email);
  }

  public decryptSensitiveData(): void {
    this.email = aesEncrypt(this.email);
  }

  constructor(email: string, organisationId: UUID) {
    this.subscriberId = randomUUID();
    this.email = email;
    this.organisationId = organisationId;
    this.joinedAt = new Date();
  }
}

export class SubscriberRecord {
  @ApiProperty()
  joinedAt: Date;
}
