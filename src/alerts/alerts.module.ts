import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { CmcModule } from 'src/cmc/cmc.module';
import { PrismaService } from 'src/prisma.service';
import { SendgridModule } from 'src/sendgrid/sengrid.module';
import { AlertsController } from './alerts.controller';
import { AlertsService } from './alerts.service';

@Module({
  imports: [SendgridModule, CmcModule, ScheduleModule.forRoot()],
  providers: [AlertsService, PrismaService],
  controllers: [AlertsController],
})
export class AlertsModule {}
