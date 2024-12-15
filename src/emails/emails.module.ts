import { Module } from '@nestjs/common';
import { EmailsService } from './emails.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Email } from './models/email.entity';
import { EmailsController } from './emails.controller';
import { ClientsModule } from 'src/clients/clients.module';
import { MembershipsModule } from 'src/memberships/memberships.module';
import { OrganisationsModule } from 'src/organisations/organisations.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    TypeOrmModule.forFeature([Email]),
    EmailsModule,
    ClientsModule,
    MembershipsModule,
    OrganisationsModule,
    JwtModule,
  ],
  providers: [EmailsService],
  exports: [EmailsService],
  controllers: [EmailsController],
})
export class EmailsModule {}
