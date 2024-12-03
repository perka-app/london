import { Module } from '@nestjs/common';
import { OrganisationsService } from './organisations.service';
import { OrganisationsController } from './organisations.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Organisation } from './organisation/organisation.entity';
import { ClientRecord } from './organisation/clientRecord.entity';
import { ClientsModule } from 'src/clients/clients.module';

@Module({
  imports: [
    OrganisationsModule,
    TypeOrmModule.forFeature([Organisation, ClientRecord]),
    ClientsModule,
  ],
  providers: [OrganisationsService],
  controllers: [OrganisationsController],
})
export class OrganisationsModule {}
