import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { TestPostController } from './test-post.controller';
import { TestPostService } from './test-post.service';

@Module({
  providers: [PrismaService, TestPostService],
  controllers: [TestPostController],
})
export class TestPostModule {}
