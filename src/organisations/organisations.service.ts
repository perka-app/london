import { Injectable } from '@nestjs/common';
import { UUID } from 'crypto';
import { Organisation } from './organisation/organisation.entity';
import { ClientRecord } from './organisation/clientRecord.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class OrganisationsService {
  constructor(
    @InjectRepository(Organisation)
    private organisationsRepository: Repository<Organisation>,
    @InjectRepository(ClientRecord)
    private clientRecordsRepository: Repository<ClientRecord>,
  ) {}

  async createOrganisation(organisation: Organisation): Promise<string> {
    await this.organisationsRepository.save(organisation);
    return organisation.organisationId;
  }

  async addClient(clientId: UUID, organisationId: UUID): Promise<void> {
    const clientRecord = new ClientRecord(clientId, organisationId);
    await this.clientRecordsRepository.save(clientRecord);
  }
}
