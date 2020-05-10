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
import { StatisticsModule } from './statistics/statistics.module';
import { ConfigModule } from '@nestjs/config';
import { ConfigurationModule } from './configuration/configuration.module';

@Module({
  imports: [ConfigModule.forRoot({isGlobal : true}),ScheduleModule.forRoot(),DatabaseModule, UserModule, AuthModule, CryptomktModule, CoinModule, ExchangeModule, LocalindicatorModule, TasksModule, PoloniexModule, StatisticsModule, ConfigurationModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
