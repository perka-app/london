import { randomUUID, UUID } from 'crypto';
import { OrganisationDTO } from './organisation.dto';
import { Column, Entity, PrimaryColumn } from 'typeorm';
import { IsNotEmpty } from 'class-validator';

@Entity()
export class Organisation {
  @PrimaryColumn({ nullable: false })
  organisationId: UUID;

  @Column()
  @IsNotEmpty()
  name: string;

  @Column({ unique: true, nullable: false })
  @IsNotEmpty()
  userName: string;

  @Column()
  @IsNotEmpty()
  password: string;

  constructor(clientDTO?: OrganisationDTO) {
    if (clientDTO) {
      this.organisationId = randomUUID();
      this.name = clientDTO.name;
      this.userName = clientDTO.userName;
      this.password = clientDTO.password;
    }
  }
}
