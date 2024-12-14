import { IsNotEmpty, IsString, Validate } from 'class-validator';
import { IsUserNameValid } from 'src/organisations/models/organisation.validator';

export class SignInDTO {
  @IsString()
  @IsNotEmpty()
  @Validate(IsUserNameValid)
  userName: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}
