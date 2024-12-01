import { IsNotEmpty } from "class-validator";
import { randomUUID, UUID } from "crypto";
import { Column, Entity, PrimaryColumn } from "typeorm";

@Entity()
export class Relation{

  @PrimaryColumn()
  relationId: UUID;

  @Column()
  @IsNotEmpty()
  ClientId: UUID;

  @Column()
  @IsNotEmpty()
  organisationId: UUID;

  constructor(ClientId: UUID, organisationId: UUID){
    this.relationId = randomUUID();
    this.ClientId = ClientId;
    this.organisationId = organisationId;
  }
};
