import { Injectable } from '@nestjs/common';
import { Coin } from '@coin/entities/coin.entity'
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Exchange } from '@exchange/entities/exchange.entity';
import { CoinCrypto } from './entities/coin-crypto.entity';
import { CreateCoinCryptoDto } from './dto/create-coin-crypto.dto';


@Injectable()
export class CoinCryptoService {
    constructor(@InjectRepository(CoinCrypto) private coinRepository : Repository<CoinCrypto>,
                @InjectRepository(Exchange) private exchangeRepository : Repository<Exchange>){}

    async create(createCoinDto : CreateCoinCryptoDto,idExchange : string) : Promise<CoinCrypto>
    {
        let exchange : Exchange = await this.exchangeRepository.findOne(idExchange)
        if(!exchange)
        {
            throw(new Error('exchange with id :'+idExchange+' not found'))
        }

        let coinCrypto : CoinCrypto = this.coinRepository.create({
            name : createCoinDto.name,
            symbol : createCoinDto.symbol,
            priceClp : createCoinDto.priceClp,
            priceUsd : createCoinDto.priceUsd,
            askPriceClp : createCoinDto.askPriceClp,
            bidPriceClp : createCoinDto.bidPriceClp,
            askPriceUsd : createCoinDto.askPriceUsd,
            bidPriceUsd : createCoinDto.bidPriceUsd,
            volume : createCoinDto.volume,
            lastUpdate : createCoinDto.lastUpdate,
            exchange : exchange
        })

        try
        {
            await this.coinRepository.save(coinCrypto)
        }   
        catch(err)
        {
            throw(new Error(err.message))
        }

        return coinCrypto
    }


    async save(coinCrypto : CoinCrypto) : Promise<CoinCrypto>
    {
        let coinCryptoSaved : CoinCrypto = await this.coinRepository.save(coinCrypto)
        return coinCryptoSaved
    }

    async saveMany(coinsCrypto : Array<CoinCrypto>) : Promise<Array<CoinCrypto>>
    {
        let coinsSaved = null
        try
        {
           coinsSaved = await this.coinRepository.save(coinsCrypto)
        } 
        catch(err)
        {
            throw(new Error(err.toString()))
        }
        return coinsSaved
    }

    async createMany(createCoinsCryptoDto : Array<CreateCoinCryptoDto>,idExchange : string) : Promise<Array<CoinCrypto>>
    {
        let coins : Array<CoinCrypto> = []
        let promises : any =  createCoinsCryptoDto.map(createCoinCryptoDto => this.create(createCoinCryptoDto,idExchange))
        try
        {
           coins  = await Promise.all(promises)
        }
        catch(err)
        {    
            console.log(err)
            throw(new Error(err.toString()))
        }
        return coins
    }

    async getAll() : Promise<Array<CoinCrypto>>
    {
        let coinsCrypto : Array<CoinCrypto> = await this.coinRepository.find({relations : ['exchange']})
        return coinsCrypto
    }

    async getBySymbol(symbol : string) : Promise<CoinCrypto>
    {
        let coin : CoinCrypto = await this.coinRepository.findOne({where : {symbol}, relations : ['exchange']})
        return coin
    }
}
