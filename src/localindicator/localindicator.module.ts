import { Module, HttpModule } from '@nestjs/common';
import { LocalindicatorService } from './localindicator.service';
import { CoinModule } from '@coin/coin.module';
import { ConfigurationModule } from 'configuration/configuration.module';

@Module({
  imports : [HttpModule,CoinModule,ConfigurationModule],
  providers: [LocalindicatorService],
  exports : [LocalindicatorService]
})
export class LocalindicatorModule {}
