import {
  Body,
  Controller,
  Headers,
  HttpCode,
  HttpException,
  HttpStatus,
  ParseUUIDPipe,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { EmailsService } from './emails.service';
import { EmailStatus, SendEmailDTO } from './models/email.dto';
import { Email } from './models/email.entity';
import { MembershipsService } from 'src/memberships/memberships.service';
import { UUID } from 'crypto';
import { ClientsService } from 'src/clients/clients.service';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('emails')
export class EmailsController {
  constructor(
    private readonly emailsService: EmailsService,
    private readonly clientsService: ClientsService,
    private readonly membershipsService: MembershipsService,
  ) {}

  @UseGuards(AuthGuard)
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async sendEmail(
    @Headers('id') organisationId: UUID,
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

      const recivers = await this.clientsService
        .getClients(reciversUUID)
        .catch((err) => {
          throw new HttpException(
            'Unable to get recivers: ' + err.message,
            HttpStatus.INTERNAL_SERVER_ERROR,
          );
        });

      const confirmedEmail = await this.emailsService
        .sendEmail(email, recivers)
        .catch((err) => {
          throw new HttpException(
            'Unable to send email: ' + err.message,
            HttpStatus.INTERNAL_SERVER_ERROR,
          );
        });

      return new EmailStatus(confirmedEmail);
    } catch (err) {
      if (err instanceof HttpException) throw err;

      throw new HttpException(err.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
