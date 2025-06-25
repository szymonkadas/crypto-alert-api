import { Test, TestingModule } from '@nestjs/testing';
import { CacheModule } from '@nestjs/cache-manager';
import { ConfigModule } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';
import { MailService } from '@sendgrid/mail';
import { CmcService } from 'src/cmc/cmc.service';
import { PrismaService } from 'src/prisma.service';
import { SendgridService } from 'src/sendgrid/sendgrid.service';
import { AlertsService } from './alerts.service';

describe('AlertsService', () => {
  let service: AlertsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule, HttpModule, CacheModule.register()],
      providers: [
        AlertsService,
        CmcService,
        PrismaService,
        SendgridService,
        MailService,
      ],
    }).compile();

    service = module.get<AlertsService>(AlertsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

