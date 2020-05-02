import { Module, HttpModule } from '@nestjs/common';
import { CryptomktService } from './cryptomkt.service';
import { CryptomktController } from './cryptomkt.controller';
import { DatabaseModule } from '../database/database.module'
import { CoinModule } from '@coin/coin.module';
import { ExchangeModule } from '@exchange/exchange.module';
import { LocalindicatorModule } from 'localindicator/localindicator.module';
import { PoloniexModule } from 'poloniex/poloniex.module';


@Module({
  imports : [DatabaseModule,HttpModule,CoinModule,ExchangeModule,LocalindicatorModule,PoloniexModule],
  providers: [CryptomktService],
  controllers: [CryptomktController],
  exports : [CryptomktService]
})
export class CryptomktModule {}
