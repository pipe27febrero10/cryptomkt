import { ExchangeModule } from '@exchange/exchange.module';
import { Module } from '@nestjs/common';
import { ConfigurationModule } from 'configuration/configuration.module';
import { LocalindicatorModule } from 'localindicator/localindicator.module';
import { OrionxController } from './orionx.controller';
import { OrionxService } from './orionx.service';

@Module({
  controllers: [OrionxController],
  providers: [OrionxService],
  imports: [ConfigurationModule,ExchangeModule,LocalindicatorModule]
})
export class OrionxModule {}
