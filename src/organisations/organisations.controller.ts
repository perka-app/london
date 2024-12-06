import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpException,
  HttpStatus,
  ParseUUIDPipe,
  Post,
  Query,
} from '@nestjs/common';
import { OrganisationsService } from './organisations.service';
import { ClientsService } from 'src/clients/clients.service';
import { UUID } from 'crypto';
import {
  ClientsCountDTO,
  OrganisationDTO,
} from './organisation/organisation.dto';
import { Organisation } from './organisation/organisation.entity';
import { MembershipsService } from 'src/memberships/memberships.service';
import { count } from 'console';

@Controller('organisations')
export class OrganisationsController {
  constructor(
    private readonly organisationsService: OrganisationsService,
    private readonly clientsService: ClientsService,
    private readonly membershipsService: MembershipsService,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createOrganisation(
    @Body() organisationDTO: OrganisationDTO,
  ): Promise<void> {
    try {
      const organisation = new Organisation(organisationDTO);
      await this.organisationsService.createOrganisation(organisation);
    } catch (err) {
      throw new HttpException(err.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Post('clients')
  @HttpCode(HttpStatus.CREATED)
  async addClient(
    @Query('clientId', ParseUUIDPipe) clientId: UUID,
    @Query('organisationId', ParseUUIDPipe) organisationId: UUID,
  ): Promise<void> {
    try {
      if (!(await this.clientsService.clientExists(clientId))) {
        throw new HttpException(
          'Client does not exist',
          HttpStatus.BAD_REQUEST,
        );
      }

      if (
        await this.membershipsService.membershipExists(clientId, organisationId)
      ) {
        throw new HttpException(
          'Client is already a member of this organisation',
          HttpStatus.BAD_REQUEST,
        );
      }

      await this.organisationsService.addClient(clientId, organisationId);
    } catch (err) {
      throw new HttpException(err.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get('clients_count')
  @HttpCode(HttpStatus.OK)
  async getClientsCount(
    @Query('organisationId', ParseUUIDPipe) organisationId: UUID,
  ): Promise<ClientsCountDTO> {
    try {
      const count = await this.membershipsService.getClientsIdCount(
        organisationId,
      );
      return new ClientsCountDTO(organisationId, count);
    } catch (err) {
      throw new HttpException(err.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
