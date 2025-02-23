import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrganisationsModule } from 'src/organisations/organisations.module';
import { Subscriber } from './models/subscriber.entity';
import { SubscribersService } from './subscribers.service';
import { SubscribersController } from './subscribers.controller';
import { MessagesModule } from 'src/messages/messages.module';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [
    forwardRef(() => OrganisationsModule),
    MessagesModule,
    forwardRef(() => AuthModule),
    TypeOrmModule.forFeature([Subscriber]),
  ],
  providers: [SubscribersService],
  exports: [SubscribersService],
  controllers: [SubscribersController],
})
export class SubscribersModule {}
