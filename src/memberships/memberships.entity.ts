import { IsNotEmpty } from 'class-validator';
import { randomUUID, UUID } from 'crypto';
import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity()
export class Membership {
  @PrimaryColumn()
  membershipId: UUID;

  @Column()
  @IsNotEmpty()
  clientId: UUID;

  @Column()
  @IsNotEmpty()
  organisationId: UUID;

  constructor(clientId: UUID, organisationId: UUID) {
    this.membershipId = randomUUID();
    this.clientId = clientId;
    this.organisationId = organisationId;
  }
}
