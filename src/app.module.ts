import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClientsModule } from './clients/clients.module';
import { OrganisationsModule } from './organisations/organisations.module';
import { Client } from './clients/client/client.entity';
import { Membership } from './memberships/memberships.entity';
import { Organisation } from './organisations/organisation/organisation.entity';
import { MembershipsModule } from './memberships/memberships.module';
import { EmailsModule } from './emails/emails.module';
import { Email } from './emails/email/email.entity';
import { AppController } from './app.controller';

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
        entities: [Client, Membership, Organisation, Email],
        synchronize: configService.get<string>('ENVIRONMENT') === 'dev',
      }),
      inject: [ConfigService],
    }),
    ClientsModule,
    OrganisationsModule,
    MembershipsModule,
    EmailsModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
