import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Repository } from 'typeorm';
import { UUID } from 'crypto';
import { Subscriber, SubscriberRecord } from './models/subscriber.entity';
import { AddSubscriberDTO } from './models/subscriber.dto';

@Injectable()
export class SubscribersService {
  constructor(
    @InjectRepository(Subscriber)
    private subscribersRepository: Repository<Subscriber>,
  ) {}

  async addSubscriber(
    subscriberDto: AddSubscriberDTO,
    organisationId: UUID,
  ): Promise<void> {
    const subscriber = new Subscriber(subscriberDto.email, organisationId);
    subscriber.encryptSensitiveData();

    await this.subscribersRepository.save(subscriber);
  }

  async removeSubscriber(
    subscriberId: UUID,
    organisationId: UUID,
  ): Promise<void> {
    const where: FindOptionsWhere<Subscriber> = {
      subscriberId,
      organisationId,
    };

    await this.subscribersRepository.delete(where);
  }

  // Information exposing
  async isSubscribed(email: string, organisationId: UUID): Promise<boolean> {
    const where: FindOptionsWhere<Subscriber> = {
      email,
      organisationId,
    };

    return !!(await this.subscribersRepository.findOneBy(where));
  }

  async getSubscriberByEmail(
    email: string,
    organisationId: UUID,
  ): Promise<Subscriber> {
    const where: FindOptionsWhere<Subscriber> = {
      email,
      organisationId,
    };

    const subscriber = await this.subscribersRepository.findOneBy(where);
    if (!subscriber) {
      throw new HttpException('Subscriber not found', 404);
    }

    return subscriber;
  }

  async getSubscribersCount(organisationId: UUID): Promise<number> {
    const where: FindOptionsWhere<Subscriber> = {
      organisationId,
    };

    return await this.subscribersRepository.countBy(where);
  }

  async getSubscribersRecords(
    organisationId: UUID,
  ): Promise<SubscriberRecord[]> {
    const query = `SELECT "joinedAt" FROM "membership" WHERE "organisationId" = '${organisationId}' and "confirmed" = true`;

    const result = (await this.subscribersRepository.query(
      query,
    )) as SubscriberRecord[];

    return result;
  }

  async getSubscribersForOrganisation(
    organisationId: UUID,
  ): Promise<Subscriber[]> {
    const where: FindOptionsWhere<Subscriber> = {
      organisationId,
    };

    return await this.subscribersRepository.findBy(where);
  }
}
