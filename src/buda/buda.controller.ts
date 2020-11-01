import { Controller, Get } from '@nestjs/common';
import { ExchangeDto } from '@exchange/dto/exchange.dto';
import { exchangeName, exchangeWebsite } from './constants';
import { ExchangeService } from '@exchange/exchange.service';
import { CreateExchangeDto } from '@exchange/dto/create-exchange.dto';
import { Exchange } from '@exchange/entities/exchange.entity';
import { toExchangeDto } from '@exchange/mapper';
import { ApiTags } from '@nestjs/swagger';
import { BudaService } from './buda.service';
import { ResponseBudaMarkets } from './interfaces/response-buda-markets.interface';
import { CoinService } from '@coin/coin.service';
import { Coin } from '@coin/entities/coin.entity';
import { LocalindicatorService } from 'localindicator/localindicator.service';

@Controller('buda')
@ApiTags('Buda')
export class BudaController {
    constructor(private readonly exchangeService : ExchangeService,
                private readonly budaService : BudaService,
                private readonly coinService : CoinService,
                private readonly localIndicatorService : LocalindicatorService){}

    @Get('/setup_buda_coins') 
    async setCoins() : Promise<any>  //Promise<CoinDto[]>
    {
        const budaMarkets : ResponseBudaMarkets = await this.budaService.getAllMarkets()        
        const regex = /-CLP$/
        const symbols : Array<string> = budaMarkets.markets.reduce((accumulator,market) => {
            if(regex.test(market.id))
            {
                accumulator = [...accumulator,market.base_currency]
            }
            return accumulator
        },[])

        const exchange : Exchange = await this.exchangeService.findByName(exchangeName)
        const coins : Array<Coin> = await this.budaService.setupCoins(symbols,exchange.id)
        return coins
    }

    @Get('/setup_buda_exchange')
    async setExchange() : Promise<ExchangeDto>
    {
        const budaExchange : CreateExchangeDto = {
            name : exchangeName,
            website : exchangeWebsite
        }
        const exchange : Exchange = await this.exchangeService.create(budaExchange)
        const exchangeDto = toExchangeDto(exchange)
        return exchangeDto
    }
}
