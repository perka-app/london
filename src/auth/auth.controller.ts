import {
  Body,
  Controller,
  Get,
  Headers,
  HttpCode,
  HttpStatus,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInDTO } from './models/signIn.dto';
import { AuthGuard } from './auth.guard';
import { UUID } from 'crypto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('organisation')
  @HttpCode(HttpStatus.OK)
  async signInOrganisation(
    @Body() signInCredentials: SignInDTO,
  ): Promise<{ access_token: string }> {
    const access_token = await this.authService.signInOrganisation(
      signInCredentials.userName,
      signInCredentials.password,
    );

    return { access_token };
  }

  @UseGuards(AuthGuard)
  @Get()
  getProfile(@Headers('id') id: UUID): { id: string } {
    return { id };
  }
}
