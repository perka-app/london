import { IsUUID } from 'class-validator';
import { UUID } from 'crypto';

export type Organisation = {
  organisation_id: UUID;
  name: string;
  createdAt: Date;
  clients: Map<UUID, ClientRecord>;
};

export type ClientRecord = {
  sinceFrom: Date;
};

export class ClientRegistrationDTO {
  @IsUUID()
  clientId: UUID;

  @IsUUID()
  organisationId: UUID;
}
