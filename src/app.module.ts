import { CacheModule } from '@nestjs/cache-manager';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AlertsModule } from './alerts/alerts.module';
import { CmcModule } from './cmc/cmc.module';
import { SendgridModule } from './sendgrid/sengrid.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['.env'],
    }),
    CacheModule.register(),
    SendgridModule,
    CmcModule,
    AlertsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
