import { IsNotEmpty, IsString, Validate } from 'class-validator';
import { IsUserNameValid } from './organisation.validator';

export class OrganisationDTO {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  @Validate(IsUserNameValid)
  userName: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}

export class ClientsCountDTO {
  organisationId: string;
  clientsCount: number;

  constructor(organisationId: string, count: number) {
    this.organisationId = organisationId;
    this.clientsCount = count;
  }
}
