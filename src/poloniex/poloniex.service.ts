import { Injectable, HttpService } from '@nestjs/common';
import { uri } from './constants'
import { MarketPoloniexDto } from './dto/market-poloniex.dto';


@Injectable()
export class PoloniexService {
    constructor(private readonly httpService : HttpService){}
    async getAllMarkets() : Promise<Array<MarketPoloniexDto>> {
        let response : any = await this.httpService.get(uri+'public?command=returnTicker').toPromise()
        response = response.data
        let markets = Object.keys(response)

        // reduce markets only contains USDT
        markets =  markets.reduce((accumulator,market) => {
            let array = [...market]
            let index = array.findIndex(element => element === '_')
            if(market.substring(0,index) === 'USDT')
            {
                accumulator = [...accumulator,market]
            }
            return accumulator
        },[])

        let marketsPoloniexDto : Array<MarketPoloniexDto> = markets.map(market => {
            let array = [...market]
            let index = array.findIndex(letter => letter === '_')
            let symbol = market.substring(index+1,market.length)
            let marketPoloniexDto : MarketPoloniexDto = {
                ...response[market],
                symbol : symbol
            }
            return marketPoloniexDto
        })

        return marketsPoloniexDto
    }


    async getMarket(symbol : string) : Promise<MarketPoloniexDto>
    {
        const marketsPoloniexDto : Array<MarketPoloniexDto>= await this.getAllMarkets()
        const marketPoloniexDto : MarketPoloniexDto = marketsPoloniexDto.find(marketPoloniexDto => marketPoloniexDto.symbol === symbol)
        return marketPoloniexDto
    }





}
