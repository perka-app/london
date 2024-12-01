import { randomUUID, UUID } from "crypto";
import { Column, Entity, PrimaryColumn } from "typeorm";
import { ClientDTO } from "./client.dto";

@Entity()
export class Client{

  @PrimaryColumn()
  clientId: UUID;

  @Column()
  name: string;

  @Column({unique: true})
  email: string;

  @Column()
  dateOfBirth: Date;

  @Column()
  isStudent: boolean;


  constructor(clientDTO?: ClientDTO){
    if(clientDTO){
      this.clientId = randomUUID();
      this.name = clientDTO.name;
      this.email = clientDTO.email;
      this.dateOfBirth = new Date(clientDTO.dateOfBirth);
      this.isStudent = clientDTO.isStudent;
    }
  }
};
