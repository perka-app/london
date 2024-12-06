import { Module } from '@nestjs/common';
import { EmailsService } from './emails.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Email } from './email/email.entity';
import { EmailsController } from './emails.controller';
import { ClientsModule } from 'src/clients/clients.module';
import { MembershipsModule } from 'src/memberships/memberships.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Email]),
    EmailsModule,
    ClientsModule,
    MembershipsModule,
  ],
  providers: [EmailsService],
  exports: [EmailsService],
  controllers: [EmailsController],
})
export class EmailsModule {}
