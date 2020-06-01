import { Injectable, HttpService, HttpException, HttpCode, HttpStatus } from '@nestjs/common';
import { ResponseCryptoMkt } from '@cryptomkt/interfaces/response-crypto-mkt.interface'
import { ExchangeService } from '@exchange/exchange.service';
import { CreateExchangeDto } from '@exchange/dto/create-exchange.dto';
import { toExchangeDto } from '@exchange/mapper';
import { ExchangeDto } from '@exchange/dto/exchange.dto';
import { exchangeName } from './constants'
import { Exchange } from '@exchange/entities/exchange.entity';
import { LocalindicatorService } from 'localindicator/localindicator.service';
import { ValueDto } from 'localindicator/dto/value.dto';
import { PoloniexService } from 'poloniex/poloniex.service';
import { MarketPoloniexDto } from 'poloniex/dto/market-poloniex.dto';
import { response } from 'express';
import { CoinCrypto } from '@coin/entities/coin-crypto.entity';
import { CoinCryptoDto } from '@coin/dto/coin-crypto.dto';
import { CreateCoinCryptoDto } from '@coin/dto/create-coin-crypto.dto';
import { CoinCryptoService } from '@coin/coin-crypto.service';
import { toCoinCrytoDto } from '@coin/mapper';
import moment = require('moment');
const { cryptos } = require('../helpers/crypto.const')



@Injectable()
export class CryptomktService {
    constructor(private readonly httpService: HttpService,
                private readonly coinService : CoinCryptoService,
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

    async setupCoins(symbols : Array<string>) : Promise<Array<CoinCryptoDto>>
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

        let coinsCryptoDto : Array<CreateCoinCryptoDto> = []
        const usdValueInClp : number = await this.localIndicatorService.getUsdCurrentValueInClp()
        for(let name of names)
        {
           let responseMarketPrice : ResponseCryptoMkt = await this.getMarketPrice(name+'CLP')
           let lastPriceClp : number = Number(responseMarketPrice.data[0].last_price)
           let askPriceClp : number = Number(responseMarketPrice.data[0].ask)
           let bidPriceClp : number = Number(responseMarketPrice.data[0].bid)
           let volume : number = Number(responseMarketPrice.data[0].volume)
           let lastPriceUsd : number = lastPriceClp/usdValueInClp 
           let askPriceUsd : number = askPriceClp/usdValueInClp
           let bidPriceUsd : number = bidPriceClp/usdValueInClp

           let lastDate : string = moment().utc().format()
        
           coinsCryptoDto = [...coinsCryptoDto,{
               name : cryp[name],
               symbol : name,
               priceClp : lastPriceClp,
               priceUsd : lastPriceUsd,
               lastUpdate : lastDate,
               askPriceClp : askPriceClp,
               bidPriceClp : bidPriceClp,
               askPriceUsd : askPriceUsd,
               bidPriceUsd : bidPriceUsd,
               volume : volume
           }]
        }

        let exchange : Exchange = await this.exchangeService.findByName(exchangeName)
       
        if(!exchange)
        {
            throw(new HttpException('exchange cryptmkt not found',HttpStatus.NOT_FOUND))
        }
        let idExchange : string = exchange.id
        let coinsCreated  : Array<CoinCrypto>  = await this.coinService.createMany(coinsCryptoDto,idExchange)
        console.log(coinsCreated)
        let coinsDto : Array<CoinCryptoDto> = coinsCreated.map(coinCreated => toCoinCrytoDto(coinCreated))
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
        let coinCrypto : CoinCrypto = await this.coinService.getBySymbol(symbol)

        if(!coinCrypto)
        {
            throw(new HttpException('coin not found in database',HttpStatus.NOT_FOUND))
        }

        let marketPoloniexDto : MarketPoloniexDto = await this.poloniexService.getMarket(symbol)
       
        if(!marketPoloniexDto)
        {
            throw(new HttpException('market not found in poloniex exchange',HttpStatus.NOT_FOUND))
        }

        let variation : number = (coinCrypto.priceUsd/marketPoloniexDto.last)
        return variation
    }
    
}
