import { Module } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CryptomktModule } from '@cryptomkt/cryptomkt.module';
import { CoinModule } from '@coin/coin.module'
import { LocalindicatorModule } from 'localindicator/localindicator.module';

@Module({
  providers: [TasksService],
  imports : [CryptomktModule,CoinModule,LocalindicatorModule]
})
export class TasksModule {}
