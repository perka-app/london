import { Module } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Message } from './models/message.entity';
import { MessagesController } from './messages.controller';
import { ClientsModule } from 'src/clients/clients.module';
import { MembershipsModule } from 'src/memberships/memberships.module';
import { OrganisationsModule } from 'src/organisations/organisations.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    TypeOrmModule.forFeature([Message]),
    MessagesModule,
    ClientsModule,
    MembershipsModule,
    OrganisationsModule,
    JwtModule,
  ],
  providers: [MessagesService],
  exports: [MessagesService],
  controllers: [MessagesController],
})
export class MessagesModule {}
