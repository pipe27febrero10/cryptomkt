import { Module } from '@nestjs/common';
import { CoinService } from './coin.service';
import { CoinController } from './coin.controller';
import { DatabaseModule } from '../database/database.module'

@Module({
  imports : [DatabaseModule],
  providers: [CoinService],
  controllers: [CoinController]
})
export class CoinModule {}
