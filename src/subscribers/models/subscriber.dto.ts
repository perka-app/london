import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString } from 'class-validator';

export class AddSubscriberDTO {
  @ApiProperty({
    description: 'Email of the client',
    type: String,
    example: 'example.email@gmail.com',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'Nickname of the organisation',
    type: String,
    example: 'dummy_org',
  })
  @IsString()
  organisationNickname: string;
}
