import {
  Body,
  Controller,
  Headers,
  HttpCode,
  HttpException,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import { MembershipsService } from 'src/memberships/memberships.service';
import { UUID } from 'crypto';
import { ClientsService } from 'src/clients/clients.service';
import { AuthGuard } from 'src/auth/auth.guard';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiHeader,
  ApiOperation,
} from '@nestjs/swagger';
import { MessageStatus, SendMessageDTO } from './models/message.dto';
import { Message } from './models/message.entity';
import { MessagesService } from './messages.service';

@Controller('messages')
export class MessagesController {
  constructor(
    private readonly messageService: MessagesService,
    private readonly clientsService: ClientsService,
    private readonly membershipsService: MembershipsService,
  ) {}

  @ApiOperation({
    summary: 'Sent message',
    description: 'Provided message will be sent to all organisation members',
  })
  @ApiBearerAuth()
  @ApiHeader({
    name: 'id',
    required: false,
    description: 'Id will be taken from JWT token (no need to provide it)',
  })
  @ApiCreatedResponse({
    description: 'Message sent successfully',
    type: MessageStatus,
  })
  @UseGuards(AuthGuard)
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async sendMessage(
    @Headers('id') organisationId: UUID,
    @Body() messageRequest: SendMessageDTO,
  ): Promise<MessageStatus> {
    try {
      const message = new Message(messageRequest, organisationId);

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

      const confirmedMessage = await this.messageService
        .sendMessage(message, recivers)
        .catch((err) => {
          throw new HttpException(
            'Unable to send message: ' + err.message,
            HttpStatus.INTERNAL_SERVER_ERROR,
          );
        });

      return new MessageStatus(confirmedMessage);
    } catch (err) {
      if (err instanceof HttpException) throw err;

      throw new HttpException(err.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
