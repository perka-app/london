import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrganisationsModule } from 'src/organisations/organisations.module';
import { JwtModule } from '@nestjs/jwt';
import { Subscriber } from './models/subscriber.entity';
import { SubscribersService } from './subscribers.service';
import { SubscribersController } from './subscribers.controller';
import { MessagesModule } from 'src/messages/messages.module';

@Module({
  imports: [
    forwardRef(() => OrganisationsModule),
    forwardRef(() => MessagesModule),
    JwtModule,
    TypeOrmModule.forFeature([Subscriber]),
  ],
  providers: [SubscribersService],
  exports: [SubscribersService],
  controllers: [SubscribersController],
})
export class SubscribersModule {}
