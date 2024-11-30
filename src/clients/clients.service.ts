import { Injectable } from '@nestjs/common';
import { randomUUID, UUID } from 'crypto';
import { Client, ClientDTO } from 'src/models/clientModels';

@Injectable()
export class ClientsService {
  private clients: Client[] = [];

  async create(client: ClientDTO): Promise<UUID> {
    const newClient: Client = {
      client_id: randomUUID(),
      ...client,
    };

    this.clients.push(newClient);
    return newClient.client_id;
  }

  async findAll(): Promise<Client[]> {
    return this.clients;
  }

  async getClientCount(): Promise<number> {
    return this.clients.length;
  }

  async clientExists(clientId: UUID): Promise<boolean> {
    return this.clients.some((client) => client.client_id === clientId);
  }

  async canRegister(clientDTO: ClientDTO): Promise<boolean> {
    return !this.clients.some((client) => client.email === clientDTO.email);
  }
}
