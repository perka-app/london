import { Injectable } from '@nestjs/common';
import { randomUUID, UUID } from 'crypto';
import { Client, ClientDTO } from 'src/models/clientModels';

@Injectable()
export class ClientsService {
  private clients: Client[] = [];

  async create(client: ClientDTO): Promise<void> {
    const newClient: Client = {
      client_id: randomUUID(),
      ...client,
    };

    this.clients.push(newClient);
  }

  async findAll(): Promise<Client[]> {
    return this.clients;
  }

  async getClientCount(): Promise<number> {
    return this.clients.length;
  }

  async validateClient(clientId: UUID): Promise<boolean> {
    return this.clients.some((client) => client.client_id === clientId);
  }
}
