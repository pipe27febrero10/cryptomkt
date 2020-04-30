import { Controller, Get, Param } from '@nestjs/common';
import { CryptomktService } from '@cryptomkt/cryptomkt.service'
import { ResponseCryptoMkt } from '@cryptomkt/interfaces/response-crypto-mkt.interface';
import { CreateExchangeDto } from '@exchange/dto/create-exchange.dto';
import { ExchangeService } from '@exchange/exchange.service';
import { toExchangeDto } from '@exchange/mapper';
import { ExchangeDto } from '@exchange/dto/exchange.dto';
import { exchangeWebsite,exchangeName } from './constants';
const { cryptos } = require('../helpers/crypto.const')


@Controller('cryptomkt')
export class CryptomktController {
    constructor(private readonly cryptomktService : CryptomktService,
                private readonly exchangeService : ExchangeService){}    
    //high limit rate ocuped
    @Get('markets')
    async getAllMarketsPrice() : Promise<ResponseCryptoMkt>
    {
        return await this.cryptomktService.getAllMarketsPrice()
    }

    @Get('markets/:market')
    async getMarketPrice(@Param('market') market : string)
    {
        return await this.cryptomktService.getMarketPrice(market)
    }

    //set coins available to exchange manually
    @Get('/setup_cryptomkt_coins')
    async setCoins()
    {
        let responseGetAllMarkets : ResponseCryptoMkt = await this.cryptomktService.getAllMarkets()
        let markets : Array<string> = responseGetAllMarkets.data
        let symbols : Array<string> = markets.map(market => market.substring(0,3))
        return this.cryptomktService.setupCoins(symbols)
    }

    @Get('/setup_cryptomkt_exchange')
    async setExchange() : Promise<ExchangeDto>
    {
        let createExchangeDto : CreateExchangeDto = {
            name : exchangeName,
            website : exchangeWebsite
        }
        let exchangeCreated = await this.exchangeService.create(createExchangeDto)
        return toExchangeDto(exchangeCreated)
    }
}
