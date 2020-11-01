import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CoinHistory } from './entity/coin-history.entity';
import { StatisticsController } from './statistics.controller';
import { StatisticsService } from './statistics.service';
import { CoinModule } from '../coin/coin.module'

@Module({
    imports : [TypeOrmModule.forFeature([CoinHistory]), CoinModule],
    controllers: [StatisticsController],
    providers: [StatisticsService]
})
export class StatisticsModule {}
