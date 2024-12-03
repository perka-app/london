import { randomUUID, UUID } from "crypto";
import { Column, Entity, PrimaryColumn } from "typeorm";
import { IsNotEmpty } from "class-validator";

@Entity()
export class ClientRecord {

  @PrimaryColumn({nullable: false, unique: true})
  recordId: UUID;

  @Column()
  @IsNotEmpty()
  organisationId: string;

  @Column()
  @IsNotEmpty()
  clientId: string;

  @Column()
  sinceFrom: Date;

  constructor(clientId?: UUID, organisationId?: UUID){
    if(clientId && organisationId){
      this.recordId = randomUUID();
      this.clientId = clientId;
      this.organisationId = organisationId;
      this.sinceFrom = new Date();
    }
  }
}