import { Module } from '@nestjs/common';
import { ExchangeService } from './exchange.service';
import { ExchangeController } from './exchange.controller';
import { DatabaseModule } from '../database/database.module'

@Module({
  imports : [DatabaseModule],
  providers: [ExchangeService],
  controllers: [ExchangeController]
})
export class ExchangeModule {}
