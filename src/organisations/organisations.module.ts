import { Module } from '@nestjs/common';
import { OrganisationsService } from './organisations.service';
import { OrganisationsController } from './organisations.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Organisation } from './organisation/organisation.entity';
import { ClientsModule } from 'src/clients/clients.module';
import { Membership } from '../memberships/memberships.entity';
import { MembershipsModule } from 'src/memberships/memberships.module';

@Module({
  imports: [
    OrganisationsModule,
    ClientsModule,
    MembershipsModule,
    TypeOrmModule.forFeature([Organisation]),
  ],
  providers: [OrganisationsService],
  controllers: [OrganisationsController],
})
export class OrganisationsModule {}
