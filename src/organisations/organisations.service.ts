import { HttpException, Injectable } from '@nestjs/common';
import { UUID } from 'crypto';
import { Organisation } from './models/organisation.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { S3Service } from 'src/s3/s3.service';
import {
  OrganisationDTO,
  OrganisationInfo,
  OrganisationStatistics,
} from './models/organisation.dto';
import { SubscribersService } from 'src/subscribers/subscribers.service';

@Injectable()
export class OrganisationsService {
  constructor(
    @InjectRepository(Organisation)
    private readonly organisationsRepository: Repository<Organisation>,
    private readonly subscribersService: SubscribersService,
    private readonly S3Service: S3Service,
  ) {}

  async createOrganisation(organisation: Organisation): Promise<string> {
    await organisation.hashPassword();
    await this.organisationsRepository.save(organisation);
    return organisation.organisationId;
  }

  // Information exposing
  async getOrganisationByNickname(nickname: string): Promise<Organisation> {
    const organisation = await this.organisationsRepository.findOneBy({
      login: nickname,
    });

    if (!organisation) {
      throw new HttpException(`Organisation '${nickname}' not found`, 404);
    }

    return organisation;
  }

  async organisationExists(organisationId: UUID): Promise<boolean> {
    const organisation = await this.organisationsRepository.findOneBy({
      organisationId,
    });

    return !!organisation;
  }

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
    const organisation = (await this.organisationsRepository.findOneBy({
      organisationId,
    })) as Organisation;

    return new OrganisationDTO(organisation);
  }

  async getOrganisationStatistics(
    organisationId: UUID,
  ): Promise<OrganisationStatistics> {
    const joinedRecords = await this.subscribersService.getSubscribersRecords(
      organisationId,
    );
    const clientsCount = joinedRecords.length;

    return new OrganisationStatistics(clientsCount, joinedRecords);
  }

  async getOrganisationInfo(nickname: string): Promise<OrganisationInfo> {
    const organisation = await this.getOrganisationByNickname(nickname);
    const clientsCount = await this.subscribersService.getSubscribersCount(
      organisation.organisationId,
    );

    return new OrganisationInfo(organisation, clientsCount);
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
