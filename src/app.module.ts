import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrganisationsModule } from './organisations/organisations.module';
import { MessagesModule } from './messages/messages.module';
import { AppController } from './app.controller';
import { AuthModule } from './auth/auth.module';
import { S3Module } from './s3/s3.module';
import { SubscribersModule } from './subscribers/subscribers.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DATABASE_HOST'),
        port: configService.get<number>('DATABASE_PORT'),
        username: configService.get<string>('DATABASE_USERNAME'),
        password: configService.get<string>('DATABASE_PASSWORD'),
        database: configService.get<string>('DATABASE_NAME'),
        autoLoadEntities: true,
        synchronize: false,
      }),
      inject: [ConfigService],
    }),
    OrganisationsModule,
    SubscribersModule,
    MessagesModule,
    AuthModule,
    S3Module,
  ],
  controllers: [AppController],
})
export class AppModule {}
