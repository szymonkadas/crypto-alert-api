import { Test, TestingModule } from '@nestjs/testing';
import { TestPostService } from './test-post.service';

describe('TestPostService', () => {
  let service: TestPostService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TestPostService],
    }).compile();

    service = module.get<TestPostService>(TestPostService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
