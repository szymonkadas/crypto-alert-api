import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class TestPostService {
  constructor(private prisma: PrismaService) {}

  async getAllPosts() {
    return this.prisma.post.findMany();
  }
}
