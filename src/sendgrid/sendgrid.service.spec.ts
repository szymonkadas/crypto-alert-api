import { Test, TestingModule } from '@nestjs/testing';
import { SendgridService } from './sendgrid.service';
import { MailService } from '@sendgrid/mail';
import { ConfigService } from '@nestjs/config';

describe('SendgridService', () => {
  let service: SendgridService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SendgridService, MailService, ConfigService],
    }).compile();

    service = module.get<SendgridService>(SendgridService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
