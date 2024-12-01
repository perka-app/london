import { Module } from '@nestjs/common';
import { ClientsController } from './clients.controller';
import { ClientsService } from './clients.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Client } from './client/client.entity';
import { Relation } from './client/clientRelation.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Client, Relation])],
  controllers: [ClientsController],
  providers: [ClientsService],
  exports: [ClientsService],
})
export class ClientsModule {}
