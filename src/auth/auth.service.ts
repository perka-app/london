import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  private logger = new Logger('AuthService');

  constructor(private jwtService: JwtService) {}

  async generateToken<T extends object | Buffer>(payload: T): Promise<string> {
    return await this.jwtService.signAsync(payload);
  }

  async decodeToken<T>(token: string): Promise<T> {
    try {
      return (await this.jwtService.verifyAsync(token)) as T;
    } catch (error) {
      this.logger.error('Unable to decode token:', error.message);
      throw new UnauthorizedException('Invalid token');
    }
  }
}
