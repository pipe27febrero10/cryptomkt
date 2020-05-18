import { Controller, Get, UseGuards, HttpException, HttpStatus, Query } from '@nestjs/common';
import { AppService } from './app.service';
import { LocalindicatorService } from 'localindicator/localindicator.service';
import { ValueDto } from 'localindicator/dto/value.dto'
import { CoinService } from '@coin/coin.service';
import { get } from 'http';
import { CreateCoinDto } from '@coin/dto/create-coin.dto';
import { ExchangeService } from '@exchange/exchange.service';
import { Exchange } from '@exchange/entities/exchange.entity';
import { Coin } from '@coin/entities/coin.entity';
import { toCoinDto } from '@coin/mapper';
import { PoloniexService } from 'poloniex/poloniex.service';
import { CoinDto } from '@coin/dto/coin.dto';
import { CryptomktService } from '@cryptomkt/cryptomkt.service';
import { MarketPoloniexDto } from 'poloniex/dto/market-poloniex.dto';
import { ResponseCryptoMkt } from '@cryptomkt/interfaces/response-crypto-mkt.interface';
import { BudaService } from './buda/buda.service';


@Controller()
export class AppController {
  constructor(private readonly appService: AppService,
              private readonly localindicatorService : LocalindicatorService,
              private readonly coinService : CoinService,
              private readonly exchangeService : ExchangeService,
              private readonly poloniexService : PoloniexService,
              private readonly cryptoMktService : CryptomktService,
              private readonly budaService : BudaService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  
  @Get('getVariationReal')
  async getVariationReal(@Query('symbol') symbol : string) : Promise<number>
  {
    return await this.cryptoMktService.variationWithRealValue(symbol)
  }

}
