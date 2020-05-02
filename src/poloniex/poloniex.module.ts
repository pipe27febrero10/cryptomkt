import { Module, HttpModule } from '@nestjs/common';
import { PoloniexService } from './poloniex.service';

@Module({
  providers: [PoloniexService],
  imports : [HttpModule],
  exports : [PoloniexService]
})
export class PoloniexModule {}
