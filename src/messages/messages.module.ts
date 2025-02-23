import { forwardRef, Module } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Message } from './models/message.entity';
import { MessagesController } from './messages.controller';
import { OrganisationsModule } from 'src/organisations/organisations.module';
import { SubscribersModule } from 'src/subscribers/subscribers.module';
import { AuthModule } from 'src/auth/auth.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    forwardRef(() => SubscribersModule),
    forwardRef(() => OrganisationsModule),
    forwardRef(() => AuthModule),
    JwtModule,
    TypeOrmModule.forFeature([Message]),
  ],
  providers: [MessagesService],
  exports: [MessagesService],
  controllers: [MessagesController],
})
export class MessagesModule {}
