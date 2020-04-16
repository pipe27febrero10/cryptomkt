import { Module } from '@nestjs/common';
import { CryptomktService } from './cryptomkt.service';
import { CryptomktController } from './cryptomkt.controller';
import { DatabaseModule } from '../database/database.module'


@Module({
  imports : [DatabaseModule],
  providers: [CryptomktService],
  controllers: [CryptomktController]
})
export class CryptomktModule {}
