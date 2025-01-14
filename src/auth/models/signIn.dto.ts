import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Validate } from 'class-validator';
import { IsUserNameValid } from 'src/organisations/models/organisation.validator';

export class SignInDTO {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @Validate(IsUserNameValid)
  login: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  password: string;
}
