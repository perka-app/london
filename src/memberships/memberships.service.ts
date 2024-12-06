import { Injectable } from '@nestjs/common';
import { Membership } from './memberships.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Repository } from 'typeorm';
import { UUID } from 'crypto';

@Injectable()
export class MembershipsService {
  constructor(
    @InjectRepository(Membership)
    private membershipsRepository: Repository<Membership>,
  ) {}

  async createMembership(membership: Membership): Promise<string> {
    await this.membershipsRepository.save(membership);

    return membership.membershipId;
  }

  async membershipExists(
    clientId: UUID,
    organisationId: UUID,
  ): Promise<boolean> {
    const where: FindOptionsWhere<Membership> = {
      clientId: clientId,
      organisationId: organisationId,
    };

    return this.membershipsRepository.existsBy(where);
  }

  async getClientsIdCount(organisationId: UUID): Promise<number> {
    const where: FindOptionsWhere<Membership> = {
      organisationId: organisationId,
    };

    return await this.membershipsRepository.countBy(where);
  }

  async getClientsId(organisationId: UUID): Promise<UUID[]> {
    const where: FindOptionsWhere<Membership> = {
      organisationId: organisationId,
    };
    const memberships = await this.membershipsRepository.findBy(where);

    return memberships.map((membership) => membership.clientId);
  }
}
