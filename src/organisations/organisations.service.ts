import { Injectable } from '@nestjs/common';
import { UUID } from 'crypto';
import { ClientRecord, Organisation } from 'src/models/organisationModels';

const organisation: Organisation = {
  organisation_id: 'f47b8e9b-3c3d-4b5d-8f6b-7c5a4f7a1a5f',
  name: 'My Organisation',
  createdAt: new Date(),
  clients: new Map<UUID, ClientRecord>(),
};

@Injectable()
export class OrganisationsService {
  async addClient(clientId: UUID, organisationId: UUID): Promise<void> {
    const clientRecord: ClientRecord = {
      sinceFrom: new Date(),
    };
    organisation.clients.set(clientId, clientRecord);
  }

  async getClients(organisationId: UUID): Promise<Map<UUID, ClientRecord>> {
    return organisation.clients;
  }
}
