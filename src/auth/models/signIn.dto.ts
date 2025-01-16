import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class SignInDTO {
  @ApiProperty({
    example: 'dummy_org',
  })
  @IsString()
  @IsNotEmpty()
  login: string;

  @ApiProperty({
    example: 'dummy_password',
  })
  @IsString()
  @IsNotEmpty()
  password: string;
}
