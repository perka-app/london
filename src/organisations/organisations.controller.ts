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
import {
  CreateOrganisationDTO,
  OrganisationDTO,
} from './models/organisation.dto';
import { Organisation } from './models/organisation.entity';
import { AuthGuard } from 'src/auth/auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('organisations')
export class OrganisationsController {
  constructor(private readonly organisationsService: OrganisationsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createOrganisation(
    @Body() organisationDTO: CreateOrganisationDTO,
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
  @Get('/data')
  async getOrganisationData(
    @Headers('id') organisationId: UUID,
  ): Promise<OrganisationDTO> {
    try {
      const organisationData =
        await this.organisationsService.getOrganisationData(organisationId);

      return organisationData;
    } catch (err) {
      if (err instanceof HttpException) throw err;

      throw new HttpException(err.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
