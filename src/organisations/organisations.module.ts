import { Module } from '@nestjs/common';
import { OrganisationsService } from './organisations.service';
import { OrganisationsController } from './organisations.controller';
import { ClientsModule } from 'src/clients/clients.module';

@Module({
  imports: [ClientsModule],
  providers: [OrganisationsService],
  controllers: [OrganisationsController],
})
export class OrganisationsModule {}
