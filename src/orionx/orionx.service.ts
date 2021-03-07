import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ConfigurationService } from 'configuration/configuration.service';
import { exchangeApiUri } from './constants'
import Orionx from 'orionx-sdk'
import { OrionMarketDto } from './dto/orionx-market.dto';
import { CoinDto } from '@coin/dto/coin.dto';
import { cryptos } from 'helpers/crypto.const';
import { LocalindicatorService } from 'localindicator/localindicator.service';
import { CreateCoinCryptoDto } from '@coin/dto/create-coin-crypto.dto';
import moment = require('moment');
import ResponseOrionxMarketBook from './dto/response-orionx-market-book';
import ResponseOrionxMarket from './dto/response-orionx-market';
import { ExchangeService } from '@exchange/exchange.service';
import { exchangeName } from './constants'
import { Exchange } from '@exchange/entities/exchange.entity';
import { CoinCrypto } from '@coin/entities/coin-crypto.entity';
import { CoinCryptoDto } from '@coin/dto/coin-crypto.dto';
import { toCoinCrytoDto } from '@coin/mapper';
import { CoinCryptoService } from '@coin/coin-crypto.service';

@Injectable()
export class OrionxService {
    constructor(private readonly configurationService : ConfigurationService,
                private readonly localIndicatorService : LocalindicatorService,
                private readonly exchangeService: ExchangeService,
                private readonly coinService : CoinCryptoService){
        const apiKey = this.configurationService.getOrionxApiKey()
        const secretKey = this.configurationService.getOrionxSecretKey()
        Orionx.setCredentials({
            apiKey: apiKey,
            secretKey: secretKey,
            apiUri: exchangeApiUri
        })        
    }
    async getAllMarkets() : Promise<OrionMarketDto[]>
    {
        const markets : OrionMarketDto[] = await Orionx.markets()
        return markets
    }

    async getMarket(code : string)
    {
        const market = await Orionx.market({ code })
        return market
    }

    async setupCoins(symbols : Array<string>) : Promise<CoinDto[]>
    {
        const keysCryptos = Object.keys(cryptos)
        const regexs = keysCryptos.map(crypto => new RegExp('^'+crypto+'$'))
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

        const cryp = {}
        names.forEach(name => {
                cryp[name] = cryptos[name] 
        })

        const usdValueInClp : number = await this.localIndicatorService.getUsdCurrentValueInClp()
        let coinsCryptoDto : Array<CreateCoinCryptoDto> = []
        
        const allowedSymbols = ['BTC','BCH','DAI','XLM','LTC','XRP','XLM','ETH']

        names = names.reduce((accumulator,name) => {
            if(allowedSymbols.find(symbol => symbol === name))
            {
                accumulator = [...accumulator,name]
            }
            return accumulator;
        },[])

        for(const name of names)
        {
           const responseMarketBookPrice : ResponseOrionxMarketBook = await Orionx.marketOrderBook({marketCode: `${name}CLP`, limit: 1})
           const responseMarketPrice : ResponseOrionxMarket = await Orionx.market({code: `${name}CLP`})
           const lastPriceClp : number = responseMarketPrice.lastTrade.price
           const askPriceClp : number = responseMarketBookPrice.sell[0].limitPrice
           const bidPriceClp : number = responseMarketBookPrice.buy[0].limitPrice
           const lastPriceUsd : number = lastPriceClp/usdValueInClp 
           const askPriceUsd : number = askPriceClp/usdValueInClp
           const bidPriceUsd : number = bidPriceClp/usdValueInClp

           const lastDate : string = moment().utc().format()
        
           coinsCryptoDto = [...coinsCryptoDto,{
               name : cryp[name],
               symbol : name,
               priceClp : lastPriceClp,
               priceUsd : lastPriceUsd,
               lastUpdate : lastDate,
               askPriceClp : askPriceClp,
               bidPriceClp : bidPriceClp,
               askPriceUsd : askPriceUsd,
               bidPriceUsd : bidPriceUsd
           }]
        }

        const exchange : Exchange = await this.exchangeService.findByName(exchangeName)

        if(!exchange)
        {
            throw(new HttpException('exchange cryptmkt not found',HttpStatus.NOT_FOUND))
        }

        const idExchange : string = exchange.id
        const coinsCreated  : Array<CoinCrypto>  = await this.coinService.createMany(coinsCryptoDto,idExchange)
        const coinsDto : Array<CoinCryptoDto> = coinsCreated.map(coinCreated => toCoinCrytoDto(coinCreated))
        return coinsDto
    }
}
