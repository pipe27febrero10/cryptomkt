import { Module } from '@nestjs/common';
import { User } from 'user/entities/user.entity';
import { Exchange } from 'exchange/entities/exchange.entity';
import { Coin } from 'coin/entities/coin.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CoinHistory } from 'statistics/entity/coin-history.entity';

@Module({   
    imports : [TypeOrmModule.forRoot({
        type: 'mysql',
        host: 'digitalaccount.store',
        port: 11000,
        username : 'root',
        password : 'pipiton27',
        database: 'test',
        entities: [User,Exchange,Coin,CoinHistory],
        synchronize: true,
      })]
})
export class DatabaseModule {}
