import { Test, TestingModule } from '@nestjs/testing';
import { CacheModule } from '@nestjs/cache-manager';
import { ConfigService } from '@nestjs/config';
import { HttpService, HttpModule } from '@nestjs/axios';
import { PrismaService } from 'src/prisma.service';
import { CmcService } from './cmc.service';

describe('CmcService', () => {
  let service: CmcService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [CacheModule.register(), HttpModule],
      providers: [CmcService, PrismaService, ConfigService],
    }).compile();

    service = module.get<CmcService>(CmcService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

