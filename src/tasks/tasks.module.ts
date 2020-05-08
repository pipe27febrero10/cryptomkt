import { Module } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CryptomktModule } from '@cryptomkt/cryptomkt.module';
import { CoinModule } from '@coin/coin.module'
import { LocalindicatorModule } from 'localindicator/localindicator.module';
import { PoloniexModule } from '@poloniex/poloniex.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CoinHistory } from 'statistics/entity/coin-history.entity';

@Module({
  providers: [TasksService],
  imports : [CryptomktModule,CoinModule,LocalindicatorModule,PoloniexModule,TypeOrmModule.forFeature([CoinHistory])]
})
export class TasksModule {}
