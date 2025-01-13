import { HttpException, Injectable } from '@nestjs/common';
import { UUID } from 'crypto';
import { Organisation } from './models/organisation.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { S3Service } from 'src/s3/s3.service';
import { OrganisationDTO } from './models/organisation.dto';

@Injectable()
export class OrganisationsService {
  constructor(
    @InjectRepository(Organisation)
    private organisationsRepository: Repository<Organisation>,
    private readonly S3Service: S3Service,
  ) {}

  async createOrganisation(organisation: Organisation): Promise<string> {
    await organisation.hashPassword();
    await this.organisationsRepository.save(organisation);
    return organisation.organisationId;
  }

  // Information exposing
  async getName(organisationId: UUID): Promise<string> {
    const organisation = await this.organisationsRepository.findOneBy({
      organisationId: organisationId,
    });

    if (!organisation) {
      throw new Error(`Organisation by id ${organisationId} not found`);
    }

    return organisation.name;
  }

  async getOrganisationData(organisationId: UUID): Promise<OrganisationDTO> {
    const organisation = await this.organisationsRepository.findOneBy({
      organisationId,
    });

    if (!organisation) {
      throw new HttpException(
        `Organisation by id ${organisationId} not found`,
        404,
      );
    }

    return new OrganisationDTO(organisation);
  }

  async getOrganisationByLogin(login: string): Promise<Organisation | null> {
    const organisation = await this.organisationsRepository.findOneBy({
      login,
    });

    return organisation;
  }

  // Editing information
  async uploadAvatar(
    organisationId: UUID,
    file: Express.Multer.File,
  ): Promise<string> {
    const key = `${file.fieldname}${Date.now()}`;
    const imageUrl = await this.S3Service.uploadFile(file, key);

    await this.organisationsRepository.update(
      { organisationId },
      { avatarUrl: imageUrl },
    );
    return imageUrl;
  }
}
