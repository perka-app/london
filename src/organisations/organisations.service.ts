import { Injectable } from '@nestjs/common';
import { UUID } from 'crypto';
import { ClientRecord, Organisation } from 'src/models/organisationModels';

@Injectable()
export class OrganisationsService {
  private organisation: Organisation = {
    organisation_id: 'f47b8e9b-3c3d-4b5d-8f6b-7c5a4f7a1a5f',
    name: 'My Organisation',
    createdAt: new Date(),
    clients: new Map<UUID, ClientRecord>(),
  };

  async addClient(clientId: UUID, organisationId: UUID): Promise<void> {
    const clientRecord: ClientRecord = {
      sinceFrom: new Date(),
    };
    this.organisation.clients.set(clientId, clientRecord);
    console.log(`Client ${clientId} added to organisation ${organisationId}`);
    console.log('SUKA:', this.organisation.clients);
  }

  async getClients(
    organisationId: UUID,
  ): Promise<Record<string, ClientRecord>> {
    const clientsObject: Record<string, ClientRecord> = {};
    this.organisation.clients.forEach((value, key) => {
      clientsObject[key] = value;
    });
    return clientsObject;
  }
}
