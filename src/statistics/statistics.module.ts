import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CoinHistory } from './entity/coin-history.entity';
import { StatisticsController } from './statistics.controller';
import { StatisticsService } from './statistics.service';

@Module({
    imports : [TypeOrmModule.forFeature([CoinHistory])],
    controllers: [StatisticsController],
    providers: [StatisticsService]
})
export class StatisticsModule {}
