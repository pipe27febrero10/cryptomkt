import { Module, HttpModule } from '@nestjs/common';
import { CryptomktService } from './cryptomkt.service';
import { CryptomktController } from './cryptomkt.controller';
import { DatabaseModule } from '../database/database.module'
import { CoinModule } from '@coin/coin.module';
import { ExchangeModule } from '@exchange/exchange.module';
import { LocalindicatorModule } from 'localindicator/localindicator.module';


@Module({
  imports : [DatabaseModule,HttpModule,CoinModule,ExchangeModule,LocalindicatorModule],
  providers: [CryptomktService],
  controllers: [CryptomktController]
})
export class CryptomktModule {}
