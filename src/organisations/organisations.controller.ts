import {
  Body,
  Controller,
  Get,
  Headers,
  HttpCode,
  HttpException,
  HttpStatus,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { OrganisationsService } from './organisations.service';
import { UUID } from 'crypto';
import { ClientsCountDTO, OrganisationDTO } from './models/organisation.dto';
import { Organisation } from './models/organisation.entity';
import { MembershipsService } from 'src/memberships/memberships.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('organisations')
export class OrganisationsController {
  constructor(
    private readonly organisationsService: OrganisationsService,
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
  @UseInterceptors(FileInterceptor('file'))
  @Post('/avatar')
  @HttpCode(HttpStatus.CREATED)
  async uploadAvatar(
    @Headers('id') organisationId: UUID,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<{ url: string }> {
    try {
      const imageUrl = await this.organisationsService.uploadAvatar(
        organisationId,
        file,
      );

      return { url: imageUrl };
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
