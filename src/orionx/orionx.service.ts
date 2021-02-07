import { Injectable } from '@nestjs/common';
import { ConfigurationService } from 'configuration/configuration.service';
import { exchangeApiUri } from './constants'
import Orionx from 'orionx-sdk'
import { OrionMarketDto } from './dto/orionx-market.dto';
import { CoinDto } from '@coin/dto/coin.dto';
import { cryptos } from 'helpers/crypto.const';
import { LocalindicatorService } from 'localindicator/localindicator.service';

@Injectable()
export class OrionxService {
    constructor(private readonly configurationService : ConfigurationService,
                private readonly localIndicatorService : LocalindicatorService){
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
        console.log(await this.getMarket('BTCCLP'))

        return null
    }
}
