import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { Alert } from '@prisma/client';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { PrismaService } from 'src/prisma.service';
import { CreateAlertDto } from './dto/createAlert.dto';

@Injectable()
export class AlertsService {
  constructor(private prisma: PrismaService) {}

  create(userEmail: string, data: CreateAlertDto): Promise<Alert> {
    return this.prisma.alert
      .create({
        data: {
          userEmail,
          ...data,
        },
      })
      .catch((error) => {
        if (error instanceof PrismaClientKnownRequestError) {
          if (error.code === 'P2002') {
            throw new ConflictException('Alert already exists');
          } else {
            throw new InternalServerErrorException();
          }
        } else {
          throw error;
        }
      });
  }
}
