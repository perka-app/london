import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  Validate,
} from 'class-validator';
import { IsUserNameValid } from './organisation.validator';
import { Organisation } from './organisation.entity';

export class CreateOrganisationDTO {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  @Validate(IsUserNameValid)
  login: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

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

export class OrganisationDTO {
  name: string;
  login: string;
  email: string;
  description: string;
  avatarUrl: string;

  constructor(organisation: Organisation) {
    this.name = organisation.name;
    this.login = organisation.login;
    this.email = organisation.email;
    this.description = organisation.description;
    this.avatarUrl = organisation.avatarUrl;
  }
}
