import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from 'src/prisma.service';
import { CmcService } from './cmc.service';

describe('CmcService', () => {
  let service: CmcService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CmcService, PrismaService],
    }).compile();

    service = module.get<CmcService>(CmcService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
