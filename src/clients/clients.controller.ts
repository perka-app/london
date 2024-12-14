import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpException,
  HttpStatus,
  Post,
} from '@nestjs/common';
import { ClientsService } from './clients.service';
import { ClientDTO } from './models/client.dto';

@Controller('clients')
export class ClientsController {
  constructor(private readonly clientsService: ClientsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createClient(@Body() createClientDTO: ClientDTO): Promise<string> {
    try {
      if (!(await this.clientsService.isEmailUsed(createClientDTO))) {
        throw new HttpException(
          'Client with this email already exists',
          HttpStatus.BAD_REQUEST,
        );
      }

      const clientId = await this.clientsService.create(createClientDTO);

      return JSON.stringify({ clientId });
    } catch (err) {
      throw new HttpException(err.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
