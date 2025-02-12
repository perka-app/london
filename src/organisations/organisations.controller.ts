import {
  Body,
  Controller,
  Get,
  Headers,
  HttpCode,
  HttpException,
  HttpStatus,
  Param,
  Patch,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { OrganisationsService } from './organisations.service';
import { UUID } from 'crypto';
import {
  CreateOrganisationDTO,
  EditOrganisationDTO,
  OrganisationDTO,
  OrganisationInfo,
  OrganisationStatistics,
} from './models/organisation.dto';
import { Organisation } from './models/organisation.entity';
import { AuthGuard } from 'src/auth/auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiCreatedResponse,
  ApiHeader,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiResponse,
} from '@nestjs/swagger';

@Controller('organisations')
export class OrganisationsController {
  constructor(private readonly organisationsService: OrganisationsService) {}

  @ApiOperation({
    summary: 'Create new organisation',
  })
  @ApiCreatedResponse({ description: 'Organisation created' })
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

  // Exposing organisation data
  @ApiOperation({
    summary: 'Get organisation data',
    description: 'Returns information about the organisation',
  })
  @ApiBearerAuth()
  @ApiHeader({
    name: 'id',
    required: false,
    description: 'Id will be taken from JWT token (no need to provide it)',
  })
  @ApiOkResponse({ type: OrganisationDTO })
  @UseGuards(AuthGuard)
  @Get('/data')
  async getData(@Headers('id') organisationId: UUID): Promise<OrganisationDTO> {
    try {
      const organisationData =
        await this.organisationsService.getOrganisationData(organisationId);

      return organisationData;
    } catch (err) {
      if (err instanceof HttpException) throw err;

      throw new HttpException(err.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @ApiOperation({
    summary: 'Get organisation statistics',
    description: 'Returns statistics about the organisation',
  })
  @ApiBearerAuth()
  @ApiHeader({
    name: 'id',
    required: false,
    description: 'Id will be taken from JWT token (no need to provide it)',
  })
  @ApiOkResponse({ type: OrganisationStatistics })
  @UseGuards(AuthGuard)
  @Get('/statistics')
  async getStatistics(
    @Headers('id') organisationId: UUID,
  ): Promise<OrganisationStatistics> {
    try {
      const statistics =
        await this.organisationsService.getOrganisationStatistics(
          organisationId,
        );

      return statistics;
    } catch (err) {
      if (err instanceof HttpException) throw err;

      throw new HttpException(err.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @ApiOperation({
    summary: 'Get organisation public info',
    description: 'Returns publicly avalible information about the organisation',
  })
  @ApiParam({
    name: 'nickname',
    description: 'Organisation nickname',
    example: 'dummy_org',
  })
  @ApiOkResponse({ type: OrganisationInfo })
  @ApiNotFoundResponse({ description: 'Organisation not found' })
  @Get('/info/:nickname')
  async getInfo(
    @Param('nickname') nickname: string,
  ): Promise<OrganisationInfo> {
    try {
      return await this.organisationsService.getOrganisationInfo(nickname);
    } catch (err) {
      if (err instanceof HttpException) throw err;

      throw new HttpException(err.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  // Edit organisation data
  @ApiOperation({
    summary: 'Edit organisation data',
  })
  @ApiBearerAuth()
  @ApiHeader({
    name: 'id',
    required: false,
    description: 'Id will be taken from JWT token (no need to provide it)',
  })
  @ApiOkResponse({ description: 'Organisation data updated' })
  @UseGuards(AuthGuard)
  @Patch('/data')
  async editOrganisationData(
    @Headers('id') organisationId: UUID,
    @Body() editRequest: EditOrganisationDTO,
  ): Promise<void> {
    try {
      await this.organisationsService.editOrganisationData(
        organisationId,
        editRequest,
      );
    } catch (err) {
      if (err instanceof HttpException) throw err;

      throw new HttpException(err.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @ApiOperation({
    summary: 'Upload organisation avatar',
    description:
      'Uploads an avatar for the organisation or replaces the existing one',
  })
  @ApiBearerAuth()
  @ApiHeader({
    name: 'id',
    required: false,
    description: 'Id will be taken from JWT token (no need to provide it)',
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Upload avatar',
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @ApiResponse({ status: 201, description: 'Avatar uploaded' })
  @UseGuards(AuthGuard)
  @Post('/avatar')
  @HttpCode(HttpStatus.CREATED)
  @UseInterceptors(FileInterceptor('file'))
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
}
