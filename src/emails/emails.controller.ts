import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpException,
  HttpStatus,
  ParseUUIDPipe,
  Post,
  Query,
} from '@nestjs/common';
import { EmailsService } from './emails.service';
import { EmailStatus, SendEmailDTO } from './email/email.dto';
import { Email } from './email/email.entity';
import { MembershipsService } from 'src/memberships/memberships.service';
import { UUID } from 'crypto';
import { ClientsService } from 'src/clients/clients.service';

@Controller('emails')
export class EmailsController {
  constructor(
    private readonly emailsService: EmailsService,
    private readonly clientsService: ClientsService,
    private readonly membershipsService: MembershipsService,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async sendEmail(
    @Query('organisationId', ParseUUIDPipe) organisationId: UUID,
    @Body() emailRequest: SendEmailDTO,
  ): Promise<EmailStatus> {
    try {
      const email = new Email(emailRequest, organisationId);

      const reciversUUID = await this.membershipsService
        .getClientsId(organisationId)
        .catch((err) => {
          throw new HttpException(
            'Unable to get recivers UUID: ' + err.message,
            HttpStatus.INTERNAL_SERVER_ERROR,
          );
        });

      const reciversEmails = await this.clientsService
        .getClientsEmails(reciversUUID)
        .catch((err) => {
          throw new HttpException(
            'Unable to get recivers mails: ' + err.message,
            HttpStatus.INTERNAL_SERVER_ERROR,
          );
        });

      const confirmedEmail = await this.emailsService
        .sendEmail(email, reciversEmails)
        .catch((err) => {
          throw new HttpException(
            'Unable to send email: ' + err.message,
            HttpStatus.INTERNAL_SERVER_ERROR,
          );
        });

      return new EmailStatus(confirmedEmail);
    } catch (err) {
      throw new HttpException(err.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Post('test')
  @HttpCode(HttpStatus.CREATED)
  async sendTestEmail(
    @Body() emailRequest: SendEmailDTO,
  ): Promise<EmailStatus> {
    try {
      const email = new Email(
        emailRequest,
        'c9ab89ce-2464-4ab5-9c2a-8ef7e2339a2b',
      );

      const confirmedEmail = await this.emailsService
        .sendTestEmail(email, [])
        .catch((err) => {
          throw new HttpException(
            'Unable to send email: ' + err.message,
            HttpStatus.INTERNAL_SERVER_ERROR,
          );
        });

      return new EmailStatus(confirmedEmail);
    } catch (err) {
      throw new HttpException(err.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
