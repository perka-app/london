import { randomUUID, UUID } from 'crypto';
import { OrganisationDTO } from './organisation.dto';
import { Column, Entity, PrimaryColumn } from 'typeorm';
import { IsNotEmpty } from 'class-validator';
import { comparePassword, hashPassword } from 'src/common/bcryptHelper';

@Entity()
export class Organisation {
  @PrimaryColumn({ nullable: false })
  organisationId: UUID;

  @Column({ unique: true })
  @IsNotEmpty()
  name: string;

  @Column({ unique: true, nullable: false })
  @IsNotEmpty()
  login: string;

  @Column()
  @IsNotEmpty()
  password: string;

  @Column({ nullable: true, length: 150 })
  description: string;

  @Column({ nullable: true })
  avatarUrl: string;

  public async hashPassword(): Promise<void> {
    this.password = await hashPassword(this.password);
  }

  public async validatePassword(password: string): Promise<boolean> {
    return await comparePassword(password, this.password);
  }

  constructor(clientDTO?: OrganisationDTO) {
    if (clientDTO) {
      this.organisationId = randomUUID();
      this.name = clientDTO.name;
      this.login = clientDTO.login;
      this.password = clientDTO.password;
      this.description = clientDTO.description;
    }
  }
}
