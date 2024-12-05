import { Injectable } from '@nestjs/common';
import { UUID } from 'crypto';
import { Organisation } from './organisation/organisation.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Membership } from '../memberships/memberships.entity';

@Injectable()
export class OrganisationsService {
  constructor(
    @InjectRepository(Organisation)
    private organisationsRepository: Repository<Organisation>,
    @InjectRepository(Membership)
    private clientRecordsRepository: Repository<Membership>,
  ) {}

  async createOrganisation(organisation: Organisation): Promise<string> {
    await this.organisationsRepository.save(organisation);
    return organisation.organisationId;
  }

  async addClient(clientId: UUID, organisationId: UUID): Promise<void> {
    const clientRecord = new Membership(clientId, organisationId);
    await this.clientRecordsRepository.save(clientRecord);
  }
}
