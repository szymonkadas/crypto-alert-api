import { Test, TestingModule } from '@nestjs/testing';
import { CmcService } from 'src/cmc/cmc.service';
import { PrismaService } from 'src/prisma.service';
import { AlertsService } from './alerts.service';

describe('AlertsService', () => {
  let service: AlertsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AlertsService, CmcService, PrismaService],
    }).compile();

    service = module.get<AlertsService>(AlertsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
