import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
} from '@nestjs/common';
import { isEmail } from 'class-validator';
import handleException from 'src/utils/controllers/handleException';
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
      return handleException(error);
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
      return handleException(error);
    }
  }

  @Delete('/:id')
  async delete(@Param('id') id: string) {
    try {
      await this.AlertsService.delete(id);
    } catch (error) {
      return handleException(error);
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
}
