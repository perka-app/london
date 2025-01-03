import { forwardRef, Module } from '@nestjs/common';
import { ClientsController } from './clients.controller';
import { ClientsService } from './clients.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Client } from './models/client.entity';
import { MembershipsModule } from 'src/memberships/memberships.module';
@Module({
  imports: [
    TypeOrmModule.forFeature([Client]),
    forwardRef(() => MembershipsModule),
  ],
  controllers: [ClientsController],
  providers: [ClientsService],
  exports: [ClientsService],
})
export class ClientsModule {}
