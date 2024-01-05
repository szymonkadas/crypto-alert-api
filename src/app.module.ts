import { HttpModule } from '@nestjs/axios';
import { CacheModule } from '@nestjs/cache-manager';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CmcController } from './cmc/cmc.controller';
import { CmcService } from './cmc/cmc.service';
import { PrismaService } from './prisma.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['.env'],
    }),
    HttpModule,
    CacheModule.register(),
  ],
  controllers: [CmcController],
  providers: [PrismaService, CmcService, ConfigService],
})
export class AppModule {}
