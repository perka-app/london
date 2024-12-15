import {
  Body,
  Controller,
  Get,
  Headers,
  HttpCode,
  HttpException,
  HttpStatus,
  ParseUUIDPipe,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { OrganisationsService } from './organisations.service';
import { ClientsService } from 'src/clients/clients.service';
import { UUID } from 'crypto';
import { ClientsCountDTO, OrganisationDTO } from './models/organisation.dto';
import { Organisation } from './models/organisation.entity';
import { MembershipsService } from 'src/memberships/memberships.service';
import { AuthGuard } from 'src/auth/auth.guard';

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
      if (err instanceof HttpException) throw err;

      throw new HttpException(err.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @UseGuards(AuthGuard)
  @Get('clients_count')
  @HttpCode(HttpStatus.OK)
  async getClientsCount(
    @Headers('id') organisationId: UUID,
  ): Promise<ClientsCountDTO> {
    try {
      const count = await this.membershipsService.getClientsIdCount(
        organisationId,
      );

      return new ClientsCountDTO(organisationId, count);
    } catch (err) {
      if (err instanceof HttpException) throw err;

      throw new HttpException(err.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
