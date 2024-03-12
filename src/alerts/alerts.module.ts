import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { SendgridModule } from 'src/sendgrid/sengrid.module';
import { AlertsController } from './alerts.controller';
import { AlertsService } from './alerts.service';

@Module({
  imports: [SendgridModule],
  providers: [AlertsService, PrismaService],
  controllers: [AlertsController],
})
export class AlertsModule {}
