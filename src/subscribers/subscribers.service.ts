import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Repository } from 'typeorm';
import { UUID } from 'crypto';
import { Subscriber, SubscriberRecord } from './models/subscriber.entity';
import { AddSubscriberDTO } from './models/subscriber.dto';
import { aesEncrypt } from 'src/common/aesHelper';

@Injectable()
export class SubscribersService {
  constructor(
    @InjectRepository(Subscriber)
    private subscribersRepository: Repository<Subscriber>,
  ) {}

  async addSubscriber(
    subscriberDTO: AddSubscriberDTO,
    organisationId: UUID,
  ): Promise<Subscriber> {
    const subscriber = new Subscriber(subscriberDTO.email, organisationId);
    subscriber.encryptSensitiveData();

    await this.subscribersRepository.save(subscriber);

    return subscriber;
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

  async confirmSubscriber(
    subscriberId: UUID,
    organisationId: UUID,
  ): Promise<void> {
    const where: FindOptionsWhere<Subscriber> = {
      subscriberId,
      organisationId,
    };

    const subscriber = await this.subscribersRepository.findOneBy(where);
    if (!subscriber) {
      throw new HttpException('Subscriber not found', 404);
    }

    subscriber.confirmed = true;
    await this.subscribersRepository.save(subscriber);
  }

  // Information exposing
  async isSubscribed(email: string, organisationId: UUID): Promise<boolean> {
    const where: FindOptionsWhere<Subscriber> = {
      email: aesEncrypt(email),
      organisationId,
    };

    return !!(await this.subscribersRepository.findOneBy(where));
  }

  async getSubscriberByEmail(
    email: string,
    organisationId: UUID,
  ): Promise<Subscriber> {
    const where: FindOptionsWhere<Subscriber> = {
      email: aesEncrypt(email),
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
    const result = await this.subscribersRepository
      .createQueryBuilder('subscriber')
      .select('subscriber.joinedAt')
      .where('subscriber.organisationId = :organisationId', { organisationId })
      .andWhere('subscriber.confirmed = :confirmed', { confirmed: true })
      .getRawMany();

    return result as SubscriberRecord[];
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
