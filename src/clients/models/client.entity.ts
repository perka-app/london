import { randomUUID, UUID } from 'crypto';
import { Column, Entity, PrimaryColumn } from 'typeorm';
import { ClientDTO } from './client.dto';
import { IsNotEmpty } from 'class-validator';

@Entity()
export class Client {
  @PrimaryColumn({ nullable: false })
  clientId: UUID;

  @Column()
  @IsNotEmpty()
  name: string;

  @Column({ unique: true, nullable: false })
  @IsNotEmpty()
  email: string;

  @Column()
  isStudent: boolean;

  //todo: do we need isEmailConfirmed?

  constructor(clientDTO?: ClientDTO) {
    if (clientDTO) {
      this.clientId = randomUUID();
      this.name = clientDTO.name;
      this.email = clientDTO.email;
      this.isStudent = clientDTO.isStudent;
    }
  }
}