import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { randomUUID, UUID } from 'crypto';
import { Model } from 'mongoose';
import { Organisation } from './organisation/organisation.schema';
import { ClientRecord } from './organisation/clientRecord.schema';

@Injectable()
export class OrganisationsService {
  constructor(
    @InjectModel(Organisation.name) private organisation: Model<Organisation>,
    @InjectModel(ClientRecord.name) private clientRecord: Model<ClientRecord>,
  ) {}

  async createOrganisation(organisation: Organisation): Promise<void> {
    const organisationRecord = new this.organisation(organisation);
    await organisationRecord.save();
  }

  async addClient(clientId: UUID, organisationId: UUID): Promise<void> {
    const clientRecord = new this.clientRecord({
      _id: randomUUID(),
      clientId: clientId,
      organisationId: organisationId,
      sinceFrom: new Date(),
    });
    await clientRecord.save();
  }
}
