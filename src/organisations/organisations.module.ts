import { Module } from '@nestjs/common';
import { OrganisationsService } from './organisations.service';
import { OrganisationsController } from './organisations.controller';
import { ClientsModule } from 'src/clients/clients.module';
import { MongooseModule } from '@nestjs/mongoose';
import {
  Organisation,
  OrganisationSchema,
} from './organisation/organisation.schema';
import {
  ClientRecord,
  ClientRecordSchema,
} from './organisation/clientRecord.schema';

@Module({
  imports: [
    ClientsModule,
    MongooseModule.forFeature([
      { name: Organisation.name, schema: OrganisationSchema },
      { name: ClientRecord.name, schema: ClientRecordSchema },
    ]),
  ],
  providers: [OrganisationsService],
  controllers: [OrganisationsController],
})
export class OrganisationsModule {}
