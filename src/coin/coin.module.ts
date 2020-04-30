import { Module } from '@nestjs/common';
import { CoinService } from './coin.service';
import { CoinController } from './coin.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Coin } from '@coin/entities/coin.entity';
import { Exchange } from '@exchange/entities/exchange.entity';


@Module({
  imports : [TypeOrmModule.forFeature([Coin,Exchange])],
  providers: [CoinService],
  controllers: [CoinController],
  exports : [CoinService]
})
export class CoinModule {}
