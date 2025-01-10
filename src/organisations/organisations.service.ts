import { Injectable } from '@nestjs/common';
import { UUID } from 'crypto';
import { Organisation } from './models/organisation.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Membership } from '../memberships/memberships.entity';
import { MembershipsService } from 'src/memberships/memberships.service';
import { S3Service } from 'src/s3/s3.service';

@Injectable()
export class OrganisationsService {
  constructor(
    @InjectRepository(Organisation)
    private organisationsRepository: Repository<Organisation>,
    private readonly membershipsService: MembershipsService,
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

  async getOrganisationByCredentials(
    login: string,
    password: string,
  ): Promise<Organisation | null> {
    const organisation = await this.organisationsRepository.findOneBy({
      login,
      password,
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
