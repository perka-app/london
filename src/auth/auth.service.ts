import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { OrganisationsService } from 'src/organisations/organisations.service';
import { JwtPayload } from './models/jwtPayload';

@Injectable()
export class AuthService {
  constructor(
    private organisationsService: OrganisationsService,
    private jwtService: JwtService,
  ) {}

  async signInOrganisation(login: string, password: string): Promise<string> {
    const organisation =
      await this.organisationsService.getOrganisationByCredentials(
        login,
        password,
      );

    if (!organisation) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload: JwtPayload = {
      id: organisation.organisationId,
      name: organisation.name,
    };

    return await this.jwtService.signAsync(payload);
  }
}
