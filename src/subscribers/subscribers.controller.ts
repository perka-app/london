import {
  Body,
  Controller,
  Delete,
  HttpCode,
  HttpException,
  HttpStatus,
  Param,
  Post,
} from '@nestjs/common';
import { OrganisationsService } from 'src/organisations/organisations.service';
import {
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
} from '@nestjs/swagger';
import { SubscribersService } from './subscribers.service';
import { AddSubscriberDTO } from './models/subscriber.dto';

@Controller('subscribers')
export class SubscribersController {
  constructor(
    private readonly organisationsService: OrganisationsService,
    private readonly subscribersService: SubscribersService,
  ) {}

  @ApiOperation({
    summary: 'Add subscriber to organisation',
  })
  @ApiParam({
    name: 'organisationNickname',
    description: 'Organisation nickname',
    example: 'dummy_org',
  })
  @ApiCreatedResponse({ description: 'Subscriber added but not verified' })
  @Post('/:organisationNickname')
  @HttpCode(HttpStatus.CREATED)
  async createMembership(
    @Param('organisationNickname') organisationNickname: string,
    @Body() addSubscriberDTO: AddSubscriberDTO,
  ): Promise<void> {
    const { email: subscriberEmail } = addSubscriberDTO;

    try {
      const { organisationId } =
        await this.organisationsService.getOrganisationByNickname(
          organisationNickname,
        );

      const isSubscribed = await this.subscribersService.isSubscribed(
        subscriberEmail,
        organisationId,
      );
      if (isSubscribed) {
        throw new HttpException('Already subscribed', 404);
      }

      await this.subscribersService.addSubscriber(
        addSubscriberDTO,
        organisationId,
      );
    } catch (err) {
      if (err instanceof HttpException) throw err;

      throw new HttpException(err.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @ApiOperation({
    summary: 'Confirm subscriber',
  })
  @ApiParam({
    name: 'activation key',
    description:
      'Activation key used to indentify subscriber and confirm subscriber',
    example: 'jnn26bkkz8n111ji2hdkaA11u9',
  })
  @ApiOkResponse({ description: 'Subscriber was confirmed' })
  @Post('confirm/:organisationNickname')
  @HttpCode(HttpStatus.OK)
  async confirmMembership(
    @Param('activation_key') activation_key: string,
  ): Promise<void> {
    try {
      console.log(activation_key);
      // do something
    } catch (err) {
      if (err instanceof HttpException) throw err;

      throw new HttpException(err.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @ApiOperation({
    summary: 'Remove subscriber from organisation',
  })
  @ApiNoContentResponse({ description: 'Subscriber removed successfully' })
  @Delete('/:organisationNickname')
  @HttpCode(HttpStatus.NO_CONTENT)
  async endMembership(
    @Param('organisationNickname') organisationNickname: string,
    @Body() addSubscriberDTO: AddSubscriberDTO,
  ): Promise<void> {
    const { email: subscriberEmail } = addSubscriberDTO;

    try {
      const { organisationId } =
        await this.organisationsService.getOrganisationByNickname(
          organisationNickname,
        );

      const subscriber = await this.subscribersService.getSubscriberByEmail(
        subscriberEmail,
        organisationId,
      );

      await this.subscribersService.removeSubscriber(
        subscriber.subscriberId,
        organisationId,
      );
    } catch (err) {
      if (err instanceof HttpException) throw err;

      throw new HttpException(err.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
