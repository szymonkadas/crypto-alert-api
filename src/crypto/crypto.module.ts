import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CryptoController } from './crypto.controller';
import { CryptoService } from './crypto.service';

@Module({
  // imports: [HttpModule],
  providers: [CryptoService, ConfigService],
  controllers: [CryptoController],
  exports: [CryptoService],
})
export class CryptoModule {}
