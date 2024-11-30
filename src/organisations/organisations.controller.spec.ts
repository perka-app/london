import { Test, TestingModule } from '@nestjs/testing';
import { OrganisationsController } from './organisations.controller';
import { OrganisationsService } from './organisations.service';
import { ClientsService } from '../clients/clients.service';

describe('OrganisationsController', () => {
  let controller: OrganisationsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OrganisationsController],
      providers: [OrganisationsService, ClientsService],
    }).compile();

    controller = module.get<OrganisationsController>(OrganisationsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
