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


@Controller()
export class AppController {
  constructor(private readonly appService: AppService,
              private readonly localindicatorService : LocalindicatorService,
              private readonly coinService : CoinService,
              private readonly exchangeService : ExchangeService,
              private readonly poloniexService : PoloniexService,
              private readonly cryptoMktService : CryptomktService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('test')
  async test(@Query('symbol') symbol : string)
  {
    return await this.poloniexService.getMarket(symbol)
  }

  @Get('test1')
  async test1() : Promise<CoinDto>
  {
    const coin : Coin = await this.coinService.getBySymbol('BTC')
    return toCoinDto(coin)
  }

  @Get('test2')
  async test2(@Query('symbol') symbol : string) : Promise<number>
  {
    return await this.cryptoMktService.variationWithRealValue(symbol)
  }
  @Get('test3')
  async test3()
  {
    let btc : Coin = await this.coinService.getBySymbol('ETH')
    let btcPoloniexDto : MarketPoloniexDto = await this.poloniexService.getMarket('ETH')
    return {
      btcCryptoMkt : btc.priceUsd,
      btcPoloniex :  btcPoloniexDto.last
    }
  }
  @Get('test4')
  async test4()
  {
    return await this.localindicatorService.getUsdCurrentValueInClp()
  }
  
  

}
