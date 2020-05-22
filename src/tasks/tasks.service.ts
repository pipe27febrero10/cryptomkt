import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { CryptomktService } from '@cryptomkt/cryptomkt.service'
import { ResponseCryptoMkt } from '@cryptomkt/interfaces/response-crypto-mkt.interface';
import { CoinService } from '@coin/coin.service';
import { toCoinDto } from '@coin/mapper';
import { Coin } from '@coin/entities/coin.entity';
import { ResponseCoin } from '@cryptomkt/interfaces/response-coin.interface';
import { LocalindicatorService } from 'localindicator/localindicator.service';
import { PoloniexService } from '@poloniex/poloniex.service';
import { MarketPoloniexDto } from '@poloniex/dto/market-poloniex.dto';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CoinHistory } from 'statistics/entity/coin-history.entity';
import { ExchangeService } from '@exchange/exchange.service';
import * as cryptomktConstants from '../cryptomkt/constants'
import * as budaConstants from '../buda/constants'
import { Exchange } from '@exchange/entities/exchange.entity';
import { BudaService } from '@buda/buda.service';
import { ResponseBudaTicker } from '@buda/interfaces/response-buda-ticker.interface';
import { ValueDto } from 'localindicator/dto/value.dto';

@Injectable()
export class TasksService {
  constructor(private readonly cryptoMktService : CryptomktService,
              private readonly coinService : CoinService,
              private readonly localIndicatorService : LocalindicatorService,
              private readonly poloniexService : PoloniexService,
              private readonly exchangeService : ExchangeService,
              private readonly budaService : BudaService,
              @InjectRepository(CoinHistory) private readonly coinHistoryRepo : Repository<CoinHistory>){}
  private readonly logger = new Logger(TasksService.name);

  @Cron("*/10 * * * * *")
  async updateCoinsCryptoMkt() {
      let coins : Array<Coin> = await this.coinService.getAll()
      let cryptomktExchange : Exchange = await this.exchangeService.findByName(cryptomktConstants.exchangeName)

      coins = coins.reduce((accumulator,coin) => {
        if(coin.exchange.id === cryptomktExchange.id)
        {
          accumulator = [...accumulator,coin]
        }
        return accumulator
      },[])

      const symbols : Array<string> = coins.map(coin => coin.symbol)
      
      let promises = symbols.map(symbol => this.cryptoMktService.getMarketPrice(symbol+'CLP')) // get markets price in clp
      let responses : Array<ResponseCryptoMkt> = null
      
      responses = await Promise.all(promises)
      let datas : Array<ResponseCoin> = responses.map(({data}) => data[0])
      
      let priceUsdInClp : number = await this.localIndicatorService.getUsdCurrentValueInClp()

      datas.forEach(data => {
        let symbol = data.market.substring(0,3)
        let coin : Coin = coins.find(coin => coin.symbol === symbol)
        if(coin)
        {
            coin.priceClp = data.last_price
            coin.priceUsd = coin.priceClp/priceUsdInClp
            coin.lastUpdate = data.timestamp
            coin.bidPriceClp = data.bid
            coin.askPriceClp = data.ask
            coin.bidPriceUsd = coin.bidPriceClp/priceUsdInClp
            coin.askPriceUsd = coin.askPriceClp/priceUsdInClp
            coin.volume = data.volume
        }
      })

      let coinsSaved : Array<Coin> = await this.coinService.saveMany(coins)
  }

  @Cron("*/10 * * * * *")
  async updateCoinsBuda(){
    let coins : Array<Coin> = await this.coinService.getAll()
    let budaExchange : Exchange = await this.exchangeService.findByName(budaConstants.exchangeName)
    coins = coins.reduce((accumulator,coin) => {
      if(coin.exchange.id === budaExchange.id)
      {
        accumulator = [...accumulator,coin]
      }
      return accumulator
    },[])
    
    const symbols : Array<string> = coins.map(coin => coin.symbol)
    for(let symbol of symbols)
    {
      let responseBudaTicker : ResponseBudaTicker= await this.budaService.getMarketTicker(symbol)
      let currentDate : Date = new Date()
      let usdValueInClp : number = await this.localIndicatorService.getUsdCurrentValueInClp()
      let priceClp : number = Number(responseBudaTicker.ticker.last_price[0])
      let priceUsd : number = priceClp/usdValueInClp
      let askPriceClp : number = Number(responseBudaTicker.ticker.min_ask[0])
      let bidPriceClp : number = Number(responseBudaTicker.ticker.max_bid[0])
      let askPriceUsd : number = askPriceClp/usdValueInClp
      let bidPriceusd : number = bidPriceClp/usdValueInClp
      let volume : number = Number(responseBudaTicker.ticker.volume[0])
      // coin to update information
      let coin  = coins.find(coin => coin.symbol === symbol)
      coin.lastUpdate = currentDate
      coin.bidPriceClp = bidPriceClp
      coin.askPriceClp = askPriceClp
      coin.askPriceUsd = askPriceUsd
      coin.bidPriceUsd = bidPriceusd
      coin.priceClp = priceClp
      coin.priceUsd = priceUsd
      coin.volume = volume

      await this.coinService.save(coin)
            
    }
  }
    
  @Cron("*/10 * * * * *")
  async coinHistory()
  {
    let coins : Array<Coin> = await this.coinService.getAll()
    let dolarPriceClp : number = await this.localIndicatorService.getUsdCurrentValueInClp()

    for(let coin of coins)
    {
      let now = Date()
      let symbol = coin.symbol
     
      let marketPoloniexDto : MarketPoloniexDto = await this.poloniexService.getMarket(symbol)
      
      if(marketPoloniexDto)
      {
        let lastVariation = coin.priceUsd/marketPoloniexDto.last
        let bidVariation = coin.bidPriceUsd/marketPoloniexDto.last
        let askVariation = coin.askPriceUsd/marketPoloniexDto.last

        let coinHistory : CoinHistory = this.coinHistoryRepo.create({
          lastVariation : lastVariation,
          bidVariation : bidVariation,
          askVariation : askVariation,
          dolarPriceClp : dolarPriceClp,
          coin : coin,
          timestamp : now
        })
        let coinHistorySaved = await this.coinHistoryRepo.save(coinHistory)
      }     
    }
  }



}