import { forwardRef, Module } from '@nestjs/common';
import { MembershipsService } from './memberships.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Membership } from './memberships.entity';
import { MembershipsController } from './memberships.controller';
import { OrganisationsModule } from 'src/organisations/organisations.module';
import { ClientsModule } from 'src/clients/clients.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    forwardRef(() => ClientsModule),
    forwardRef(() => OrganisationsModule),
    JwtModule,
    TypeOrmModule.forFeature([Membership]),
  ],
  providers: [MembershipsService],
  exports: [MembershipsService],
  controllers: [MembershipsController],
})
export class MembershipsModule {}
