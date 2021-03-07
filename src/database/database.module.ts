import { Module } from '@nestjs/common';
import { User } from 'user/entities/user.entity';
import { Exchange } from 'exchange/entities/exchange.entity';
import { Coin } from 'coin/entities/coin.entity';
import { Mail } from 'mail/entities/mail.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CoinHistory } from 'statistics/entity/coin-history.entity';
import { ConfigurationModule } from 'configuration/configuration.module';
import { ConfigurationService } from 'configuration/configuration.service';
import { CoinCrypto } from '@coin/entities/coin-crypto.entity';

@Module({   
    imports : [TypeOrmModule.forRootAsync({
      imports : [ConfigurationModule],
      useFactory : (configurationService : ConfigurationService) => {
        return {
          type: 'mysql',
          host: configurationService.getHostMysql(),
          port: configurationService.getPortMysql(),
          username : configurationService.getUsernameMysql(),
          password : configurationService.getPasswordMysql(),
          database: configurationService.getDatabaseMysql(),
          entities: [User,Exchange,Coin,CoinHistory,CoinCrypto,Mail],
          synchronize: true,
          timezone : 'Z'
        }
      },
      inject : [ConfigurationService]
    })]
})


export class DatabaseModule {
}
