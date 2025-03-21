import { randomUUID, UUID } from 'crypto';
import { CreateOrganisationDTO } from './organisation.dto';
import { Column, Entity, PrimaryColumn } from 'typeorm';
import { IsEmail, IsNotEmpty } from 'class-validator';
import { hashPassword } from 'src/common/bcryptHelper';

@Entity()
export class Organisation {
  @PrimaryColumn({ nullable: false })
  organisationId: UUID;

  @Column({ unique: true, nullable: false })
  @IsNotEmpty()
  name: string;

  @Column({ unique: true, nullable: false })
  @IsNotEmpty()
  login: string;

  @Column()
  @IsNotEmpty()
  password: string;

  @Column({ nullable: false })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @Column({ nullable: true, length: 150 })
  description: string;

  @Column({ nullable: true })
  avatarUrl: string;

  public async hashPassword(): Promise<void> {
    this.password = await hashPassword(this.password);
  }

  constructor(clientDTO?: CreateOrganisationDTO) {
    if (clientDTO) {
      this.organisationId = randomUUID();
      this.name = clientDTO.name;
      this.login = clientDTO.login;
      this.email = clientDTO.email;
      this.password = clientDTO.password;
      this.description = clientDTO.description;
    }
  }
}
