import { Controller, Get, Param } from '@nestjs/common';
import { CryptomktService } from '@cryptomkt/cryptomkt.service'
import { ResponseCryptoMkt } from '@cryptomkt/interfaces/response-crypto-mkt.interface';
import { CreateExchangeDto } from '@exchange/dto/create-exchange.dto';
import { ExchangeService } from '@exchange/exchange.service';
import { toExchangeDto } from '@exchange/mapper';
import { ExchangeDto } from '@exchange/dto/exchange.dto';
import { exchangeWebsite,exchangeName } from './constants';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CoinDto } from '@coin/dto/coin.dto';

@Controller('cryptomkt')
@ApiTags('Cryptomkt')
export class CryptomktController {
    constructor(private readonly cryptomktService : CryptomktService,
                private readonly exchangeService : ExchangeService){}    
    //high limit rate ocuped
    @Get('markets')
    @ApiOperation({deprecated: true, summary: 'Get all market prices'})
    async getAllMarketsPrice() : Promise<ResponseCryptoMkt>
    {
        return await this.cryptomktService.getAllMarketsPrice()
    }

    @Get('markets/:market')
    @ApiOperation({deprecated: true,summary: 'Get market price '})
    async getMarketPrice(@Param('market') market : string) : Promise<ResponseCryptoMkt>
    {
        return await this.cryptomktService.getMarketPrice(market)
    }

    //set coins available to exchange manually
    @Get('/setup_cryptomkt_coins')
    @ApiOperation({deprecated: true, summary: 'Setup cryptomkt coins'})
    async setCoins() : Promise<CoinDto[]>
    {
        const responseGetAllMarkets : ResponseCryptoMkt = await this.cryptomktService.getAllMarkets()
        const markets : Array<string> = responseGetAllMarkets.data
        const symbols : Array<string> = markets.map(market => market.substring(0,3))
        return this.cryptomktService.setupCoins(symbols)
    }

    @Get('/setup_cryptomkt_exchange')
    @ApiOperation({deprecated: true, summary: 'Setup cryptomkt exchange'})
    async setExchange() : Promise<ExchangeDto>
    {
        const createExchangeDto : CreateExchangeDto = {
            name : exchangeName,
            website : exchangeWebsite
        }
        const exchangeCreated = await this.exchangeService.create(createExchangeDto)
        return toExchangeDto(exchangeCreated)
    }
}
