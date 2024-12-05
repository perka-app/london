import { Module } from '@nestjs/common';
import { MembershipsService } from './memberships.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Membership } from './memberships.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Membership])],
  providers: [MembershipsService],
  exports: [MembershipsService],
})
export class MembershipsModule {}
