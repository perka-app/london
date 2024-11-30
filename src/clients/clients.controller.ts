import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpException,
  HttpStatus,
  Post,
} from '@nestjs/common';
import { ClientDTO } from 'src/models/clientModels';
import { ClientsService } from './clients.service';

@Controller('clients')
export class ClientsController {
  constructor(private readonly clientsService: ClientsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createClient(@Body() createClientDTO: ClientDTO): Promise<string> {
    try {
      if (!(await this.clientsService.canRegister(createClientDTO))) {
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

  @Get()
  async getAllClients(): Promise<string> {
    try {
      const clients = await this.clientsService.findAll();

      return JSON.stringify(clients);
    } catch (err) {
      throw new HttpException(err.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
