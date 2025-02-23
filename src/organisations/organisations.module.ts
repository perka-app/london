import { forwardRef, Module } from '@nestjs/common';
import { OrganisationsService } from './organisations.service';
import { OrganisationsController } from './organisations.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Organisation } from './models/organisation.entity';
import { S3Module } from 'src/s3/s3.module';
import { SubscribersModule } from 'src/subscribers/subscribers.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    forwardRef(() => SubscribersModule),
    S3Module,
    TypeOrmModule.forFeature([Organisation]),
    JwtModule,
  ],
  providers: [OrganisationsService],
  controllers: [OrganisationsController],
  exports: [OrganisationsService],
})
export class OrganisationsModule {}
