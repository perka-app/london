import { IsBoolean, IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class ClientDTO {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEmail()
  email: string;
}
