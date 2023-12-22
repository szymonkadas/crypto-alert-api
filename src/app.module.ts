import { Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { TestPostController } from './test-post/test-post.controller';
import { TestPostModule } from './test-post/test-post.module';
import { TestPostService } from './test-post/test-post.service';

@Module({
  imports: [TestPostModule],
  controllers: [TestPostController],
  providers: [PrismaService, TestPostService],
})
export class AppModule {}
