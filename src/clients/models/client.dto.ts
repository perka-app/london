import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class ClientDTO {
  @ApiProperty({
    description: 'Name of the client',
    type: String,
    example: 'John Doe',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'Email of the client',
    type: String,
    example: 'example.email@gmail.com',
  })
  @IsEmail()
  email: string;
}
