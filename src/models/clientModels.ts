import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsDate,
  IsEmail,
  IsNotEmpty,
  IsString,
} from 'class-validator';
import { UUID } from 'crypto';

export type Client = {
  client_id: UUID;
  name: string;
  email: string;
  dateOfBirth: Date;
  student: boolean;
};

export class ClientDTO {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEmail()
  email: string;

  @IsDate()
  @Type(() => Date)
  dateOfBirth: Date;

  @IsBoolean()
  student: boolean;
}
