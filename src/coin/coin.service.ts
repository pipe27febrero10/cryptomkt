import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { Coin } from '@coin/entities/coin.entity'
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCoinDto } from './dto/create-coin.dto';
import { Exchange } from '@exchange/entities/exchange.entity';


@Injectable()
export class CoinService {
    constructor(@InjectRepository(Coin) private coinRepository : Repository<Coin>,
                @InjectRepository(Exchange) private exchangeRepository : Repository<Exchange>){}

    async create(createCoinDto : CreateCoinDto,idExchange : string) : Promise<Coin>
    {
        let exchange : Exchange = await this.exchangeRepository.findOne(idExchange)
        if(!exchange)
        {
            throw(new HttpException('Not found',HttpStatus.NOT_FOUND))
        }
        let coin : Coin = this.coinRepository.create({
            name : createCoinDto.name,
            symbol : createCoinDto.symbol,
            priceClp : createCoinDto.priceClp,
            priceUsd : createCoinDto.priceUsd,
            lastUpdate : createCoinDto.lastUpdate,
            exchange : exchange
        })

        try
        {
            await this.coinRepository.save(coin)
        }   
        catch(err)
        {
            throw(new HttpException(err.message,HttpStatus.INTERNAL_SERVER_ERROR))
        }

        return coin
    }

    async createMany(createCoinsDto : Array<CreateCoinDto>,idExchange : string) : Promise<Array<Coin>>
    {
        let coins : Array<Coin> = []
        let promises : any =  createCoinsDto.map(createCoinDto => this.create(createCoinDto,idExchange))
        try
        {
           coins  = await Promise.all(promises)
        }
        catch(err)
        {
            throw(new HttpException('Internal Server Error',HttpStatus.INTERNAL_SERVER_ERROR))
        }
        return coins
    }

    async getAll() : Promise<Array<Coin>>
    {
        let coins : Array<Coin> = await this.coinRepository.find()
        return coins
    }
}
