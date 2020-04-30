import { Module, HttpModule } from '@nestjs/common';
import { LocalindicatorService } from './localindicator.service';

@Module({
  imports : [HttpModule],
  providers: [LocalindicatorService],
  exports : [LocalindicatorService]
})
export class LocalindicatorModule {}
