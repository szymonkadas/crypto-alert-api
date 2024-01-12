import { HttpModule } from '@nestjs/axios';
import { CacheModule } from '@nestjs/cache-manager';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MailService } from '@sendgrid/mail';
import { CmcController } from './cmc/cmc.controller';
import { CmcService } from './cmc/cmc.service';
import { PrismaService } from './prisma.service';
import { SendgridController } from './sendgrid/sendgrid.controller';
import { SendgridService } from './sendgrid/sendgrid.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['.env'],
    }),
    HttpModule,
    CacheModule.register(),
  ],
  controllers: [CmcController, SendgridController],
  providers: [
    PrismaService,
    CmcService,
    ConfigService,
    SendgridService,
    MailService,
  ],
})
export class AppModule {}
