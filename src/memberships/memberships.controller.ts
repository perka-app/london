import {
  Controller,
  Delete,
  HttpCode,
  HttpException,
  HttpStatus,
  ParseUUIDPipe,
  Post,
  Query,
} from '@nestjs/common';
import { UUID } from 'crypto';
import { ClientsService } from 'src/clients/clients.service';
import { OrganisationsService } from 'src/organisations/organisations.service';
import { MembershipsService } from './memberships.service';
import {
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiOperation,
} from '@nestjs/swagger';

@Controller('memberships')
export class MembershipsController {
  constructor(
    private readonly organisationsService: OrganisationsService,
    private readonly clientsService: ClientsService,
    private readonly membershipsService: MembershipsService,
  ) {}

  @ApiOperation({
    summary: 'Create new membership',
  })
  @ApiCreatedResponse({ description: 'Membership created successfully' })
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createMembership(
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

      await this.membershipsService.createMembership(clientId, organisationId);
    } catch (err) {
      if (err instanceof HttpException) throw err;

      throw new HttpException(err.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @ApiOperation({
    summary: 'Delete membership',
  })
  @ApiNoContentResponse({ description: 'Membership deleted successfully' })
  @Delete()
  @HttpCode(HttpStatus.NO_CONTENT)
  async endMembership(
    @Query('clientId', ParseUUIDPipe) clientId: UUID,
    @Query('organisationId', ParseUUIDPipe) organisationId: UUID,
  ): Promise<void> {
    try {
      if (
        !(await this.membershipsService.membershipExists(
          clientId,
          organisationId,
        ))
      ) {
        throw new HttpException(
          'Client is not a member of this organisation',
          HttpStatus.BAD_REQUEST,
        );
      }

      await this.membershipsService.deleteMembership(clientId, organisationId);
    } catch (err) {
      if (err instanceof HttpException) throw err;

      throw new HttpException(err.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
