import { Module } from '@nestjs/common';
import { User } from 'user/entities/user.entity';
import { Exchange } from 'exchange/entities/exchange.entity';
import { Coin } from 'coin/entities/coin.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({   
    imports : [TypeOrmModule.forRoot({
        type: 'mysql',
        host: 'digitalaccount.store',
        port: 8306,
        username : 'root',
        password : 'pipiton27',
        database: 'test',
        entities: [User,Exchange,Coin],
        synchronize: true,
      })]
})
export class DatabaseModule {}
