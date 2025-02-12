import {
  Body,
  Controller,
  Headers,
  HttpCode,
  HttpException,
  HttpStatus,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { UUID } from 'crypto';
import { AuthGuard } from 'src/auth/auth.guard';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiHeader,
  ApiOperation,
} from '@nestjs/swagger';
import {
  GetMesagesDTO,
  MessageDTO,
  MessageStatus,
  SendMessageDTO,
} from './models/message.dto';
import { Message } from './models/message.entity';
import { MessagesService } from './messages.service';
import { SubscribersService } from 'src/subscribers/subscribers.service';

@Controller('messages')
export class MessagesController {
  constructor(
    private readonly messageService: MessagesService,
    private readonly subscribersServece: SubscribersService,
  ) {}

  @ApiOperation({
    summary: 'Send message',
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

      const recivers = await this.subscribersServece
        .getSubscribersForOrganisation(organisationId)
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

  @ApiOperation({
    summary: 'Send test message',
    description: 'Message will be sent to provided email',
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
  @Post('/:email')
  @HttpCode(HttpStatus.CREATED)
  async sendTestMessage(
    @Headers('id') organisationId: UUID,
    @Param('email') email: string,
    @Body() messageRequest: SendMessageDTO,
  ): Promise<MessageStatus> {
    try {
      const message = new Message(messageRequest, organisationId);

      const confirmedMessage = await this.messageService
        .sendTestMessage(message, email)
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

  @ApiOperation({
    summary: 'Get messages',
    description: 'Get organisation latest messages in in range(start & end)',
  })
  @ApiBearerAuth()
  @ApiHeader({
    name: 'id',
    required: false,
    description: 'Id will be taken from JWT token (no need to provide it)',
  })
  @ApiCreatedResponse({
    description: 'Organisation lastest messages in provided range',
    type: [MessageDTO],
  })
  @UseGuards(AuthGuard)
  @Post('get')
  async getMessages(
    @Headers('id') organisationId: UUID,
    @Body() getMessagesParams: GetMesagesDTO,
  ): Promise<MessageDTO[]> {
    const messages = await this.messageService.getMessages(
      organisationId,
      getMessagesParams,
    );

    return messages.map((message) => new MessageDTO(message));
  }
}
