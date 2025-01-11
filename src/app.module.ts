import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClientsModule } from './clients/clients.module';
import { OrganisationsModule } from './organisations/organisations.module';
import { MembershipsModule } from './memberships/memberships.module';
import { EmailsModule } from './emails/emails.module';
import { AppController } from './app.controller';
import { AuthModule } from './auth/auth.module';
import { S3Module } from './s3/s3.module';

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
        autoLoadEntities: true,
        synchronize: false,
      }),
      inject: [ConfigService],
    }),
    ClientsModule,
    OrganisationsModule,
    MembershipsModule,
    EmailsModule,
    AuthModule,
    S3Module,
  ],
  controllers: [AppController],
})
export class AppModule {}
