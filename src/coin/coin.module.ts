import { Module } from '@nestjs/common';
import { CoinService } from './coin.service';
import { CoinController } from './coin.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Coin } from '@coin/entities/coin.entity';
import { Exchange } from '@exchange/entities/exchange.entity';
import { CoinCrypto } from './entities/coin-crypto.entity';
import { CoinCryptoService } from './coin-crypto.service'
import { CoinCryptoController } from './coin-crypto.controller';


@Module({
  imports : [TypeOrmModule.forFeature([Coin,Exchange,CoinCrypto])],
  providers: [CoinService,CoinCryptoService],
  controllers: [CoinController,CoinCryptoController],
  exports : [CoinService,CoinCryptoService]
})
export class CoinModule {}
