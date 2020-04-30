import { Controller, Get, UseGuards, HttpException, HttpStatus } from '@nestjs/common';
import { AppService } from './app.service';
import { LocalindicatorService } from 'localindicator/localindicator.service';
import { ValueDto } from 'localindicator/dto/value.dto'


@Controller()
export class AppController {
  constructor(private readonly appService: AppService,private readonly localindicatorService : LocalindicatorService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
  
}
