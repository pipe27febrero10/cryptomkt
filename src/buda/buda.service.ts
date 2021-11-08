import { Injectable, HttpService, HttpException } from '@nestjs/common';
import { ResponseBudaMarkets } from './interfaces/response-buda-markets.interface';
import { uriApiBuda,manualResponseBudaMarkets } from './constants'
import { ResponseBudaMarket } from './interfaces/response-buda-market.interface';
import { CoinDto } from '@coin/dto/coin.dto';
import { ResponseBudaTicker } from './interfaces/response-buda-ticker.interface';
import { LocalindicatorService } from 'localindicator/localindicator.service';
import { ValueDto } from 'localindicator/dto/value.dto';
import { CreateCoinDto } from '@coin/dto/create-coin.dto';
import { cryptos } from '../helpers/crypto.const';
import { Coin } from '@coin/entities/coin.entity';
import { CreateCoinCryptoDto } from '@coin/dto/create-coin-crypto.dto';
import { CoinCryptoService } from '@coin/coin-crypto.service';
import { CoinCrypto } from '@coin/entities/coin-crypto.entity';
import * as moment from 'moment'


@Injectable()
export class BudaService {
    headers : Object;
    constructor(private readonly httpService : HttpService,
                private readonly localIndicatorService : LocalindicatorService,
                private readonly coinService : CoinCryptoService) {
        this.headers = {
            Accept : '*/*'
        }
    }


    async getAllMarkets() : Promise<ResponseBudaMarkets>
    {
        let response : any 
        try{
            response = await this.httpService.get(uriApiBuda+'markets',{headers : this.headers}).toPromise()
        }
        catch(err)
        {
            console.log("there was an error by trying to get markets from buda")
            console.log(err)
            return manualResponseBudaMarkets
        }
        const markets : ResponseBudaMarkets = {
            markets : response.data.markets
        }
        return markets
    }

    //market example BTC-CLP  ETH-CLP
    async getMarket(market : string) : Promise<ResponseBudaMarket>
    {
        const response : any = await this.httpService.get(uriApiBuda+'markets/'+market,{headers : this.headers}).toPromise()
        const marketResponse : ResponseBudaMarket = {
            market : response.data.market
        }
        return marketResponse
    }

    async setupCoins(symbols : Array<string>,idExchange : string) : Promise<CoinCrypto[]>
    {
        let createCoinsDto : Array<CreateCoinCryptoDto> = []
        for(let symbol of symbols)
        {
            let marketTicker : ResponseBudaTicker = await this.getMarketTicker(symbol)
           
            let currentDate : string = moment().utc().format()
            let usdValueInClp : number = await this.localIndicatorService.getUsdCurrentValueInClp()
            let priceClp : number = Number(marketTicker.ticker.last_price[0])
            let priceUsd : number = priceClp/usdValueInClp
            let askPriceClp : number = Number(marketTicker.ticker.min_ask[0])
            let bidPriceClp : number = Number(marketTicker.ticker.max_bid[0])
            let askPriceUsd : number = askPriceClp/usdValueInClp
            let bidPriceusd : number = bidPriceClp/usdValueInClp
            let volume : number = Number(marketTicker.ticker.volume[0])

            const subStringLength : number = marketTicker.ticker.market_id.substring(0,4) === 'USDC' ? 4 : 3;
            
            let createCoinDto : CreateCoinCryptoDto = {
                name : cryptos[marketTicker.ticker.market_id.substring(0,subStringLength)],
                symbol : marketTicker.ticker.market_id.substring(0,subStringLength),
                priceClp : priceClp,
                priceUsd : priceUsd,
                askPriceClp : askPriceClp,
                bidPriceClp : bidPriceClp,
                askPriceUsd : askPriceUsd,
                bidPriceUsd : bidPriceusd,
                volume : volume,
                lastUpdate : currentDate
            }
            createCoinsDto = [...createCoinsDto,createCoinDto]
        }
        let coins : Array<CoinCrypto> =  []
        coins = await this.coinService.createMany(createCoinsDto,idExchange)
        return coins
    }

    async getMarketTicker(market : string) : Promise<ResponseBudaTicker>
    {
        let response : any = null 
        try
        {
           response = await this.httpService.get(uriApiBuda+'markets/'+market+'-CLP/ticker.json',{headers : this.headers}).toPromise()
        }
        catch(err)
        {
            throw(new Error(err.toString()))
        }
        
        const responseBudaTicker : ResponseBudaTicker = {
            ticker : response.data.ticker
        }
        return responseBudaTicker
    }

    async getMarketTickers(markets : Array<string>) : Promise<ResponseBudaTicker[]>
    {
        let prePromises = [...markets.map(market => this.getMarketTicker(market))]
        let marketTickers : Array<ResponseBudaTicker> = await Promise.all(prePromises)
        return marketTickers
    }
}
