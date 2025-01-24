import { ApiProperty } from '@nestjs/swagger';
import { IsEmail } from 'class-validator';

export class AddSubscriberDTO {
  @ApiProperty({
    description: 'Email of the client',
    type: String,
    example: 'example.email@gmail.com',
  })
  @IsEmail()
  email: string;
}
