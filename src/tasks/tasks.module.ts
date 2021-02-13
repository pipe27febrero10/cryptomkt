import { Module } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CryptomktModule } from '@cryptomkt/cryptomkt.module';
import { CoinModule } from '@coin/coin.module'
import { LocalindicatorModule } from 'localindicator/localindicator.module';
import { PoloniexModule } from '@poloniex/poloniex.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CoinHistory } from 'statistics/entity/coin-history.entity';
import { ExchangeModule } from '@exchange/exchange.module';
import { BudaModule } from '@buda/buda.module';
import { MailModule } from 'mail/mail.module';

@Module({
  providers: [TasksService],
  imports: [CryptomktModule, BudaModule, CoinModule, LocalindicatorModule, PoloniexModule, TypeOrmModule.forFeature([CoinHistory]), ExchangeModule, MailModule]
})
export class TasksModule { }
