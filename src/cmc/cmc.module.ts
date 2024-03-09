import { HttpModule } from '@nestjs/axios';
import { CacheModule } from '@nestjs/cache-manager';
import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from 'src/prisma.service';
import { CmcController } from './cmc.controller';
import { CmcService } from './cmc.service';

@Module({
  imports: [HttpModule, CacheModule.register()],
  controllers: [CmcController],
  providers: [CmcService, ConfigService, PrismaService],
})
export class CmcModule {}
