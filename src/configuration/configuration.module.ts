import { Module } from '@nestjs/common';
import { ConfigurationService } from './configuration.service';
import { ConfigModule,ConfigService } from '@nestjs/config'

@Module({
  imports : [ConfigModule.forRoot({isGlobal : true})],
  providers: [ConfigurationService,ConfigService],
  exports : [ConfigurationService]
})
export class ConfigurationModule {}
