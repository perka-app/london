import { Injectable } from '@nestjs/common';
import { UUID } from 'crypto';
import { Organisation } from './organisation/organisation.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Membership } from '../memberships/memberships.entity';
import { MembershipsService } from 'src/memberships/memberships.service';

@Injectable()
export class OrganisationsService {
  constructor(
    @InjectRepository(Organisation)
    private organisationsRepository: Repository<Organisation>,
    private readonly membershipsService: MembershipsService,
  ) {}

  async createOrganisation(organisation: Organisation): Promise<string> {
    await this.organisationsRepository.save(organisation);
    return organisation.organisationId;
  }

  async addClient(clientId: UUID, organisationId: UUID): Promise<void> {
    const clientRecord = new Membership(clientId, organisationId);
    await this.membershipsService.createMembership(clientRecord);
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
}
