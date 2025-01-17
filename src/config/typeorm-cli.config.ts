import { ConfigService } from '@nestjs/config';
import { config } from 'dotenv';
import { Client } from 'src/clients/models/client.entity';
import { Message } from 'src/messages/models/message.entity';
import { Membership } from 'src/memberships/memberships.entity';
import { InitialSchema1736623661026 } from 'src/migrations/1736623661026-initial-schema';
import { Organisation } from 'src/organisations/models/organisation.entity';
import { DataSource } from 'typeorm';

config();

const configService = new ConfigService();

export default new DataSource({
  type: 'postgres',
  host: configService.get<string>('DATABASE_HOST'),
  port: configService.get<number>('DATABASE_PORT'),
  username: configService.get<string>('DATABASE_USERNAME'),
  password: configService.get<string>('DATABASE_PASSWORD'),
  database: configService.get<string>('DATABASE_NAME'),
  entities: [Client, Organisation, Membership, Message],
  migrations: [InitialSchema1736623661026],
});
