import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { UserModule } from './user/user.module'
import { AuthModule } from './auth/auth.module';
import { CryptomktModule } from './cryptomkt/cryptomkt.module';
import { CoinModule } from './coin/coin.module';
import { ExchangeModule } from './exchange/exchange.module';
import { LocalindicatorModule } from './localindicator/localindicator.module';
import { ScheduleModule } from '@nestjs/schedule'
import { TasksModule } from './tasks/tasks.module';
import { PoloniexModule } from './poloniex/poloniex.module';


@Module({
  imports: [ScheduleModule.forRoot(),DatabaseModule, UserModule, AuthModule, CryptomktModule, CoinModule, ExchangeModule, LocalindicatorModule, TasksModule, PoloniexModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
