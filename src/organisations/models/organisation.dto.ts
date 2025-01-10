import {
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  Validate,
} from 'class-validator';
import { IsUserNameValid } from './organisation.validator';

export class OrganisationDTO {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  @Validate(IsUserNameValid)
  login: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsString()
  @IsOptional()
  @MaxLength(150)
  description: string;

  @IsString()
  @IsOptional()
  avatarUrl: string;
}

export class ClientsCountDTO {
  organisationId: string;
  clientsCount: number;

  constructor(organisationId: string, count: number) {
    this.organisationId = organisationId;
    this.clientsCount = count;
  }
}
