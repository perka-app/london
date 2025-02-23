import { Injectable, NotFoundException } from '@nestjs/common';
import { UUID } from 'crypto';
import { Organisation } from './models/organisation.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  EditOrganisationDTO,
  OrganisationDTO,
} from './models/organisation.dto';

@Injectable()
export class OrganisationsService {
  constructor(
    @InjectRepository(Organisation)
    private readonly organisationsRepository: Repository<Organisation>,
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
      throw new NotFoundException(`Organisation '${nickname}' not found`);
    }

    return organisation;
  }

  async organisationExists(organisationId: UUID): Promise<boolean> {
    const organisation = await this.organisationsRepository.findOneBy({
      organisationId,
    });

    return !!organisation;
  }

  async getOrganisationById(organisationId: UUID): Promise<Organisation> {
    const organisation = await this.organisationsRepository.findOneBy({
      organisationId: organisationId,
    });

    if (!organisation) {
      throw new NotFoundException(
        `Organisation by id ${organisationId} not found`,
      );
    }

    return organisation;
  }

  async getOrganisationData(organisationId: UUID): Promise<OrganisationDTO> {
    const organisation = (await this.organisationsRepository.findOneBy({
      organisationId,
    })) as Organisation;

    return new OrganisationDTO(organisation);
  }

  // Editing information
  async uploadAvatar(organisationId: UUID, avatarUrl: string): Promise<void> {
    await this.organisationsRepository.update(
      { organisationId },
      { avatarUrl },
    );
  }

  async editOrganisationData(
    organisationId: UUID,
    data: EditOrganisationDTO,
  ): Promise<void> {
    await this.organisationsRepository.update({ organisationId }, { ...data });
  }
}
