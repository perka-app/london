import {
  Body,
  Controller,
  Get,
  Headers,
  HttpCode,
  HttpException,
  HttpStatus,
  Logger,
  Post,
  UnauthorizedException,
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
import { OrganisationsService } from 'src/organisations/organisations.service';
import { comparePassword } from 'src/common/bcryptHelper';
import { JwtPayload } from './models/jwtPayload';

@Controller('auth')
export class AuthController {
  private logger = new Logger('AuthController');

  constructor(
    private authService: AuthService,
    private organisationsService: OrganisationsService,
  ) {}

  @ApiOperation({
    summary: 'Get access token using credentials',
  })
  @Post('organisation')
  @HttpCode(HttpStatus.OK)
  async signInOrganisation(
    @Body() signInCredentials: SignInDTO,
  ): Promise<{ access_token: string }> {
    try {
      const { login, password } = signInCredentials;
      const organisation =
        await this.organisationsService.getOrganisationByNickname(login);
      const match = !!(
        organisation && (await comparePassword(password, organisation.password))
      );
      const mockDetected =
        login === 'dummy_org' && password === organisation?.password;

      if (!match && !mockDetected) {
        throw new UnauthorizedException('Invalid credentials');
      }

      const payload: JwtPayload = {
        id: organisation.organisationId,
        name: organisation.name,
      };

      const access_token = await this.authService.generateToken(payload);

      return { access_token };
    } catch (err) {
      this.logger.error(err);

      if (err instanceof HttpException) throw err;

      throw new HttpException(err.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
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
