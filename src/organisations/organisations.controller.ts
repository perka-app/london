import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpException,
  HttpStatus,
  Param,
  Post,
} from '@nestjs/common';
import { ClientRegistrationDTO } from 'src/models/organisationModels';
import { OrganisationsService } from './organisations.service';
import { ClientsService } from 'src/clients/clients.service';
import { UUID } from 'crypto';

@Controller('organisations')
export class OrganisationsController {
  constructor(
    private readonly organisationsService: OrganisationsService,
    private readonly clientsService: ClientsService,
  ) {}

  @Post('clients')
  @HttpCode(HttpStatus.CREATED)
  async addClient(@Body() clientRecord: ClientRegistrationDTO): Promise<void> {
    try {
      if (!(await this.clientsService.clientExists(clientRecord.clientId))) {
        throw new HttpException(
          'Client does not exist',
          HttpStatus.BAD_REQUEST,
        );
      }

      this.organisationsService.addClient(
        clientRecord.clientId,
        clientRecord.organisationId,
      );
    } catch (err) {
      throw new HttpException(err.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get('clients')
  async getClients(
    @Param('organisationId') organisationId: UUID,
  ): Promise<string> {
    try {
      const clients =
        await this.organisationsService.getClients(organisationId);
      return JSON.stringify(clients);
    } catch (err) {
      throw new HttpException(err.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
