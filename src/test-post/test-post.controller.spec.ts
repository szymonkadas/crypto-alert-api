import { Test, TestingModule } from '@nestjs/testing';
import { TestPostController } from './test-post.controller';

describe('TestPostController', () => {
  let controller: TestPostController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TestPostController],
    }).compile();

    controller = module.get<TestPostController>(TestPostController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
