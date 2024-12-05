import { Injectable } from '@nestjs/common';
import { randomUUID, UUID } from 'crypto';
import { ClientDTO } from './client/client.dto';
import { Client } from './client/client.entity';
import { FindOptionsWhere, Repository } from 'typeorm';
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

  async getClientCount(): Promise<number> {
    return this.clientsRepository.count();
  }

  async clientExists(clientId: UUID): Promise<boolean> {
    const where: FindOptionsWhere<Client> = { clientId: clientId };
    return this.clientsRepository.existsBy(where);
  }

  async isEmailUsed(clientDTO: ClientDTO): Promise<boolean> {
    const where: FindOptionsWhere<Client> = { email: clientDTO.email };
    return !(await this.clientsRepository.existsBy(where));
  }
}
