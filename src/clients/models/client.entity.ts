import { randomUUID, UUID } from 'crypto';
import { Column, Entity, PrimaryColumn } from 'typeorm';
import { ClientDTO } from './client.dto';
import { IsNotEmpty } from 'class-validator';
import { aesEncrypt } from 'src/common/aesHelper';

@Entity('clients')
export class Client {
  @PrimaryColumn({ nullable: false })
  clientId: UUID;

  @Column()
  @IsNotEmpty()
  name: string;

  @Column({ unique: true, nullable: false })
  email: string;

  public encryptSensitiveData(): void {
    this.email = aesEncrypt(this.email);
  }

  public decryptSensitiveData(): void {
    this.email = aesEncrypt(this.email);
  }

  //todo: do we need isEmailConfirmed?

  constructor(clientDTO?: ClientDTO) {
    if (clientDTO) {
      this.clientId = randomUUID();
      this.name = clientDTO.name;
      this.email = clientDTO.email;
    }
  }
}
