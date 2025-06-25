import { Test, TestingModule } from '@nestjs/testing';
import { SendgridController } from './sendgrid.controller';
import { SendgridService } from './sendgrid.service';
import { MailService } from '@sendgrid/mail';
import { ConfigService } from '@nestjs/config';

describe('SendgridController', () => {
  let controller: SendgridController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SendgridController],
      providers: [SendgridService, MailService, ConfigService],
    }).compile();

    controller = module.get<SendgridController>(SendgridController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
