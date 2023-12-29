import { Module } from '@nestjs/common';
import { CryptoController } from './crypto.controller';
import { CryptoService } from './crypto.service';

@Module({
  providers: [CryptoService],
  controllers: [CryptoController],
})
export class CryptoModule {}
