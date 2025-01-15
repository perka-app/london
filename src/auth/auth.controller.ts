import {
  Body,
  Controller,
  Get,
  Headers,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInDTO } from './models/signIn.dto';
import { AuthGuard } from './auth.guard';
import { UUID } from 'crypto';
import {
  ApiBearerAuth,
  ApiHeader,
  ApiOkResponse,
  ApiOperation,
} from '@nestjs/swagger';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @ApiOperation({
    summary: 'Get access token using credentials',
  })
  @ApiBearerAuth()
  @ApiHeader({
    name: 'id',
    required: false,
    description: 'Id will be taken from JWT token (no need to provide it)',
  })
  @Post('organisation')
  @HttpCode(HttpStatus.OK)
  async signInOrganisation(
    @Body() signInCredentials: SignInDTO,
  ): Promise<{ access_token: string }> {
    const access_token = await this.authService.signInOrganisation(
      signInCredentials.login,
      signInCredentials.password,
    );

    return { access_token };
  }

  @ApiOperation({
    summary: 'Get id from access token',
  })
  @ApiBearerAuth()
  @ApiHeader({
    name: 'id',
    required: false,
    description: 'Id will be taken from JWT token (no need to provide it)',
  })
  @ApiOkResponse({
    description: 'Id extracted from token',
    schema: {
      type: 'object',
      properties: {
        id: {
          type: 'string',
          example: 'some token',
        },
      },
    },
  })
  @UseGuards(AuthGuard)
  @Get()
  getProfile(@Headers('id') id: UUID): { id: string } {
    return { id };
  }
}
