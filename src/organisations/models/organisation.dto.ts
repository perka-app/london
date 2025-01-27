import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
import { Organisation } from './organisation.entity';
import { ApiProperty } from '@nestjs/swagger';
import { SubscriberRecord } from 'src/subscribers/models/subscriber.entity';

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
    example: 'admin',
  })
  @IsString()
  @IsNotEmpty()
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
    example: 'password',
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

export class EditOrganisationDTO {
  @ApiProperty()
  @IsString()
  @IsOptional()
  description?: string;
}

export class OrganisationStatistics {
  @ApiProperty({
    description: 'Total number of clients in the organisation',
  })
  clientsCount: number;

  @ApiProperty({
    description: 'Array of clients records',
    type: [SubscriberRecord],
  })
  clientsRecords: SubscriberRecord[];

  constructor(clientsCount: number, clientsRecords: SubscriberRecord[]) {
    this.clientsCount = clientsCount;
    this.clientsRecords = clientsRecords;
  }
}

export class OrganisationInfo {
  @ApiProperty()
  name: string;

  @ApiProperty()
  description: string;

  @ApiProperty()
  subscribersCount: number;

  @ApiProperty()
  avatarUrl: string;

  constructor(organisation: Organisation, subscribersCount: number) {
    this.name = organisation.name;
    this.description = organisation.description;
    this.avatarUrl = organisation.avatarUrl;
    this.subscribersCount = subscribersCount;
  }
}
