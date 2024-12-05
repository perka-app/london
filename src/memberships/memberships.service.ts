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

  async getMembersCount(organisationId: UUID): Promise<number> {
    const where: FindOptionsWhere<Membership> = {
      organisationId: organisationId,
    };
    return await this.membershipsRepository.countBy(where);
  }
}
