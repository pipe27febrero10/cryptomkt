import { Module, HttpModule } from '@nestjs/common';
import { BudaService } from './buda.service';
import { BudaController } from './buda.controller';
import { ExchangeModule } from '@exchange/exchange.module';
import { CoinModule } from '@coin/coin.module';
import { LocalindicatorModule } from 'localindicator/localindicator.module';

@Module({
  providers: [BudaService],
  controllers: [BudaController],
  imports : [ExchangeModule,HttpModule,CoinModule,LocalindicatorModule],
  exports : [BudaService]
})
export class BudaModule {}
