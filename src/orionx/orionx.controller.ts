import { CreateExchangeDto } from '@exchange/dto/create-exchange.dto';
import { ExchangeDto } from '@exchange/dto/exchange.dto';
import { Controller, Get } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { OrionMarketDto } from './dto/orionx-market.dto';
import { OrionxService } from './orionx.service';
import { exchangeName, exchangeWebsite} from './constants'
import { ExchangeService } from '@exchange/exchange.service';
import { toExchangeDto } from '@exchange/mapper';
import { CoinDto } from '@coin/dto/coin.dto';
import { MarketPoloniexDto } from '@poloniex/dto/market-poloniex.dto';
import { get } from 'http';

@Controller('orionx')
@ApiTags('Orionx')
export class OrionxController {
    constructor(private readonly orionxService : OrionxService,
                private readonly exchangeService : ExchangeService){}
    @Get('markets')
    @ApiResponse({
        description: 'List markets accessed successfully',
        type: [OrionMarketDto]
    })
    async getAllMarkets() : Promise<OrionMarketDto[]>
    {
        const markets = await this.orionxService.getAllMarkets()
        return markets
    }

    @Get('/setup_orionx_exchange')
    async setExchange() : Promise<ExchangeDto>
    {
        const createExchangeDto : CreateExchangeDto = {
            name : exchangeName,
            website : exchangeWebsite
        }
        const exchangeCreated = await this.exchangeService.create(createExchangeDto)
        return toExchangeDto(exchangeCreated)
    }

    @Get('/setup_orionx_coins') 
    async setCoins() : Promise<CoinDto[]>
    {
        const markets = await this.orionxService.getAllMarkets()
        const symbols = markets.map(({ mainCurrency }) => mainCurrency.code)
        return this.orionxService.setupCoins(symbols)
    }
}
