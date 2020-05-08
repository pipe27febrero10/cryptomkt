import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CoinHistory } from './entity/coin-history.entity';

@Module({
    imports : [TypeOrmModule.forFeature([CoinHistory])]
})
export class StatisticsModule {}
