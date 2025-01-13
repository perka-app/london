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
import { ApiProperty } from '@nestjs/swagger';

export class CreateOrganisationDTO {
  @ApiProperty({
    description: 'Name of the organisation, must be unique',
    type: String,
    example: 'My Test Organisation',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'Must be unique',
    type: String,
    example: 'my_test_organisation',
  })
  @IsString()
  @IsNotEmpty()
  @Validate(IsUserNameValid)
  login: string;

  @ApiProperty({
    description: 'Email of the organisation owner, does not have to be unique',
    type: String,
    example: 'info@myorganisation.com',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    type: String,
    example: 'strongpassword123',
  })
  @IsString()
  @IsNotEmpty()
  password: string;

  @ApiProperty({
    description: 'Description of the organisation that is shown in the profile',
    type: String,
    maxLength: 150,
    example: 'This is a sample organisation.',
    required: false,
  })
  @IsString()
  @IsOptional()
  @MaxLength(150)
  description: string;

  @ApiProperty({
    description: 'URL of the organisation Avatar',
    type: String,
    example: 'http://example.com/avatar.png',
    required: false,
  })
  @IsString()
  @IsOptional()
  avatarUrl: string;
}

export class OrganisationDTO {
  @ApiProperty()
  name: string;

  @ApiProperty()
  login: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  description: string;

  @ApiProperty()
  avatarUrl: string;

  constructor(organisation: Organisation) {
    this.name = organisation.name;
    this.login = organisation.login;
    this.email = organisation.email;
    this.description = organisation.description;
    this.avatarUrl = organisation.avatarUrl;
  }
}
