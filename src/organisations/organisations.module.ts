import { forwardRef, Module } from '@nestjs/common';
import { OrganisationsService } from './organisations.service';
import { OrganisationsController } from './organisations.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Organisation } from './models/organisation.entity';
import { ClientsModule } from 'src/clients/clients.module';
import { MembershipsModule } from 'src/memberships/memberships.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    OrganisationsModule,
    forwardRef(() => ClientsModule),
    forwardRef(() => MembershipsModule),
    TypeOrmModule.forFeature([Organisation]),
    JwtModule,
  ],
  providers: [OrganisationsService],
  controllers: [OrganisationsController],
  exports: [OrganisationsService],
})
export class OrganisationsModule {}
