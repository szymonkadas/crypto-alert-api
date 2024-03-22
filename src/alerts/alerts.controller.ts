import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  InternalServerErrorException,
  Param,
  Post,
} from '@nestjs/common';
import { isEmail } from 'class-validator';
import { AlertsService } from './alerts.service';
import { CreateAlertDto } from './dto/createAlert.dto';

@Controller('alerts')
export class AlertsController {
  constructor(private AlertsService: AlertsService) {}

  @Get(':userEmail')
  async get(@Param('userEmail') userEmail: string) {
    const validationResult = await this.validateEmail(userEmail);
    if (validationResult) {
      return validationResult;
    }
    try {
      const result = await this.AlertsService.get(userEmail);
      return result;
    } catch (error) {
      return await this.handleException(error);
    }
  }

  @Post(':userEmail/create')
  async create(
    @Param('userEmail') userEmail: string | null,
    @Body() dto: CreateAlertDto,
  ) {
    const validationResult = await this.validateEmail(userEmail);
    if (validationResult) {
      return validationResult;
    }
    try {
      return await this.AlertsService.create(userEmail, dto);
    } catch (error) {
      return this.handleException(error);
    }
  }

  @Delete('/:id')
  async delete(@Param('id') id: string) {
    try {
      await this.AlertsService.delete(id);
    } catch (error) {
      return this.handleException(error);
    }
    return { success: true };
  }

  // Validates whether the user email is valid
  async validateEmail(userEmail: string | null) {
    if (!isEmail(userEmail)) {
      return new BadRequestException(
        undefined,
        'provided userEmail must be valid email address',
      );
    }
    return null;
  }

  // Handles exceptions according to their type.
  async handleException<t extends HttpException | Error>(error: t) {
    if (error instanceof HttpException) {
      return error;
    }
    return new InternalServerErrorException(
      undefined,
      error.message || 'Internal server error',
    );
  }
}
