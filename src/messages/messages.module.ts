import { Module } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Message } from './models/message.entity';
import { MessagesController } from './messages.controller';
import { OrganisationsModule } from 'src/organisations/organisations.module';
import { JwtModule } from '@nestjs/jwt';
import { SubscribersModule } from 'src/subscribers/subscribers.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Message]),
    MessagesModule,
    SubscribersModule,
    OrganisationsModule,
    JwtModule,
  ],
  providers: [MessagesService],
  exports: [MessagesService],
  controllers: [MessagesController],
})
export class MessagesModule {}
