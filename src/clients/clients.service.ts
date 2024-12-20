import { Injectable } from '@nestjs/common';
import { UUID } from 'crypto';
import { ClientDTO } from './models/client.dto';
import { Client } from './models/client.entity';
import { FindOptionsWhere, In, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class ClientsService {
  constructor(
    @InjectRepository(Client)
    private clientsRepository: Repository<Client>,
  ) {}

  async create(clientDTO: ClientDTO): Promise<UUID> {
    const newClient = new Client(clientDTO);

    await this.clientsRepository.save(newClient);

    return newClient.clientId;
  }

  async clientExists(clientId: UUID): Promise<boolean> {
    const where: FindOptionsWhere<Client> = { clientId: clientId };

    return this.clientsRepository.existsBy(where);
  }

  async isEmailUsed(clientDTO: ClientDTO): Promise<boolean> {
    const where: FindOptionsWhere<Client> = { email: clientDTO.email };

    return !(await this.clientsRepository.existsBy(where));
  }

  async getClients(clientsUUIDs: UUID[]): Promise<Client[]> {
    const where: FindOptionsWhere<Client> = { clientId: In(clientsUUIDs) };
    const clients = await this.clientsRepository.findBy(where);

    return clients;
  }
}
