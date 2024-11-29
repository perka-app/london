import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ClientsModule } from './clients/clients.module';
import { OrganisationsModule } from './organisations/organisations.module';

@Module({
  imports: [ClientsModule, OrganisationsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
