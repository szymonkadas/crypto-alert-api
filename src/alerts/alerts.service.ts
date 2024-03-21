import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { PrismaService } from 'src/prisma.service';
import { convertPrismaAlertToDto } from './dto/GetAlerts.dto';
import { CreateAlertDto } from './dto/createAlert.dto';

@Injectable()
export class AlertsService {
  constructor(private prisma: PrismaService) {}

  create(userEmail: string, data: CreateAlertDto) {
    return this.prisma.alert
      .create({
        data: {
          userEmail,
          ...data,
        },
        include: {
          user: true,
          cryptoData: true,
          currencyData: true,
        },
      })
      .then((data) => convertPrismaAlertToDto(data))
      .catch((error) => {
        if (
          error instanceof PrismaClientKnownRequestError &&
          error.code === 'P2002'
        ) {
          throw new ConflictException('Alert already exists');
        }
        throw new InternalServerErrorException();
      });
  }

  get(userEmail: string) {
    return this.prisma.alert
      .findMany({
        where: {
          userEmail,
        },
        include: {
          user: true,
          cryptoData: true,
          currencyData: true,
        },
      })
      .then((data) =>
        data.map((dataRecord) => convertPrismaAlertToDto(dataRecord)),
      )
      .catch((error) => {
        throw new InternalServerErrorException(
          error,
          'Database connection error',
        );
      });
  }
}
