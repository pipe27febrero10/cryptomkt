import { Injectable, HttpService, HttpException, HttpCode, HttpStatus } from '@nestjs/common';
import { ResponseCryptoMkt } from '@cryptomkt/interfaces/response-crypto-mkt.interface'
import { CoinService } from '@coin/coin.service';
import { CreateCoinDto } from '@coin/dto/create-coin.dto';
import { ExchangeService } from '@exchange/exchange.service';
import { CreateExchangeDto } from '@exchange/dto/create-exchange.dto';
import { toUserDto } from '@user/mapper';
import { toExchangeDto } from '@exchange/mapper';
import { ExchangeDto } from '@exchange/dto/exchange.dto';
import { exchangeName } from './constants'
import { Exchange } from '@exchange/entities/exchange.entity';
import { Coin } from '@coin/entities/coin.entity';
import { toCoinDto } from '@coin/mapper';
import { CoinDto } from '@coin/dto/coin.dto';
import { LocalindicatorService } from 'localindicator/localindicator.service';
import { ValueDto } from 'localindicator/dto/value.dto';
import { PoloniexService } from 'poloniex/poloniex.service';
import { MarketPoloniexDto } from 'poloniex/dto/market-poloniex.dto';
const { cryptos } = require('../helpers/crypto.const')



@Injectable()
export class CryptomktService {
    constructor(private readonly httpService: HttpService,
                private readonly coinService : CoinService,
                private readonly exchangeService : ExchangeService,
                private readonly localIndicatorService : LocalindicatorService,
                private readonly poloniexService : PoloniexService){}

    async getAllMarkets() : Promise<ResponseCryptoMkt>
    {
        let response = null
        try
        {
            response   = await this.httpService.get('https://api.cryptomkt.com/v1/market').toPromise()
        }
        catch(err)
        {
            throw(new HttpException(err.response.data,err.response.status))
        }
        let responseCryptoMkt : ResponseCryptoMkt = {
            status : response.data.status,
            data : response.data.data
        }
        return responseCryptoMkt
    }
    // example market : ETHCLP
    //get current price from some market
    async getMarketPrice(market : string) : Promise<ResponseCryptoMkt>
    {
        let response = null
        try{
            response = await this.httpService.get(`https://api.cryptomkt.com/v1/ticker?market=${market}`).toPromise()
        }
        catch(err)
        {
            throw(new HttpException(err.response.data,err.response.status))
        }
        const responseCryptoMkt : ResponseCryptoMkt = {
            status : response.data.status,
            data : response.data.data
        }
        return responseCryptoMkt
    }

   // get current price from all markets 
    async getAllMarketsPrice() : Promise<ResponseCryptoMkt>
    {
        let responseAllMarketsPrice : ResponseCryptoMkt = {
            status : 'success',
            data : []
        }
        const responseAllMarkets : ResponseCryptoMkt = await this.getAllMarkets()
        const markets : Array<string> = responseAllMarkets.data
    
        let promises : Array<Promise<ResponseCryptoMkt>> = []
        for(let market of markets)
        {
           promises = [...promises,this.getMarketPrice(market)]
        }

        await Promise.all(promises).then(values => {
            values.map(value => {
                responseAllMarketsPrice.data = [...responseAllMarketsPrice.data,value.data]
            })
            return responseAllMarketsPrice
        }).catch(err => {
            throw(new HttpException(err.response,err.status))
        })

        return responseAllMarketsPrice
        
    }

    async setupCoins(symbols : Array<string>) : Promise<Array<CoinDto>>
    {
        let regexs = Object.keys(cryptos).map(crypto => new RegExp('^'+crypto+'$'))
        let keysCryptos = Object.keys(cryptos)
        let names : Array<string> = []

        regexs.forEach((regex,i) => {
            symbols.forEach(symbol => {
                if(regex.test(symbol))
                {
                    names = [...names,keysCryptos[i]]
                }
            })
        })

        names = names.reduce((accumulator,name) => {

           if(!accumulator.find(acc => acc === name))
           {
             accumulator = [...accumulator,name]
           }
           return accumulator
        },[])

        let cryp = {}
        names.forEach(name => {
                cryp[name] = cryptos[name] 
        })

        let coins : Array<CreateCoinDto> = []
        const usdValueInClp : number = await this.localIndicatorService.getUsdCurrentValueInClp()
        for(let name of names)
        {
           let responseMarketPrice : ResponseCryptoMkt = await this.getMarketPrice(name+'CLP')
           let lastPriceClp : number = Number(responseMarketPrice.data[0].last_price)
           let lastPriceUsd : number = lastPriceClp/usdValueInClp // change this to variable price usd
           let lastDate : Date = responseMarketPrice.data[0].timestamp
           coins = [...coins,{
               name : cryp[name],
               symbol : name,
               priceClp : lastPriceClp,
               priceUsd : lastPriceUsd,
               lastUpdate : lastDate
           }]
        }
        let exchange : Exchange = await this.exchangeService.findByName(exchangeName)
        let idExchange : string = exchange.id
        let coinsCreated  : Array<Coin>  = await this.coinService.createMany(coins,idExchange)
        let coinsDto : Array<CoinDto> = coinsCreated.map(coinCreated => toCoinDto(coinCreated))
        return coinsDto
    }

    async setupExchange(createExchangeDto : CreateExchangeDto) : Promise<ExchangeDto>
    {
        let exchange = await this.exchangeService.create(createExchangeDto)
        return toExchangeDto(exchange)
    }

    // compare real value (using poloniex btc- usd , eth -usd etc) with usd value in cryptomkt
    async variationWithRealValue(symbol : string) : Promise<number>
    {
        let coin : Coin = await this.coinService.getBySymbol(symbol)

        if(!coin)
        {
            throw(new HttpException('coin not found in database',HttpStatus.NOT_FOUND))
        }

        let marketPoloniexDto : MarketPoloniexDto = await this.poloniexService.getMarket(symbol)
       
        if(!marketPoloniexDto)
        {
            throw(new HttpException('market not found in poloniex exchange',HttpStatus.NOT_FOUND))
        }

        let variation : number = (coin.priceUsd/marketPoloniexDto.last)
        return variation
    }
    
}
