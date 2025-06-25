import { Test, TestingModule } from '@nestjs/testing';
import { AlertsController } from './alerts.controller';
import { AlertsService } from './alerts.service';
import { CmcService } from 'src/cmc/cmc.service';
import { SendgridService } from 'src/sendgrid/sendgrid.service';

describe('AlertsController', () => {
  let controller: AlertsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AlertsController],
      providers: [
        { provide: AlertsService, useValue: {} },
        { provide: CmcService, useValue: {} },
        { provide: SendgridService, useValue: {} },
        { provide: 'PrismaService', useValue: {} },
        { provide: 'ConfigService', useValue: {} },
        { provide: 'HttpService', useValue: {} },
        { provide: 'CACHE_MANAGER', useValue: {} },
      ],
    }).compile();

    controller = module.get<AlertsController>(AlertsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
