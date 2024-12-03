import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClientsModule } from './clients/clients.module';
import { OrganisationsModule } from './organisations/organisations.module';
import { Client } from './clients/client/client.entity';
import { Relation } from './clients/client/clientRelation.entity';
import { Organisation } from './organisations/organisation/organisation.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DATABASE_HOST'),
        port: configService.get<number>('DATABASE_PORT'),
        username: configService.get<string>('DATABASE_USERNAME'),
        password: configService.get<string>('DATABASE_PASSWORD'),
        database: configService.get<string>('DATABASE_NAME'),
        entities: [Client, Relation, Organisation],
        synchronize: configService.get<string>('ENVIRONMENT') === 'dev',
      }),
      inject: [ConfigService],
    }),
    ClientsModule,
    OrganisationsModule,
  ],
})
export class AppModule {}
