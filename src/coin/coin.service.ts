import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { Coin } from '@coin/entities/coin.entity'
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCoinDto } from './dto/create-coin.dto';


@Injectable()
export class CoinService {
    constructor(@InjectRepository(Coin) private coinRepository : Repository<Coin>){}

    async create(createCoinDto : CreateCoinDto) : Promise<Coin>
    {
        let coin : Coin = this.coinRepository.create(createCoinDto)

        try
        {
            await this.coinRepository.save(coin)
        }   
        catch(err)
        {
            throw(new Error(err.toString()))
        }
        return coin
    }


    async save(coin : Coin) : Promise<Coin>
    {
        let coinSaved : Coin = await this.coinRepository.save(coin)
        return coinSaved
    }

    async saveMany(coins : Array<Coin>) : Promise<Array<Coin>>
    {
        let coinsSaved = null
        try{
            coinsSaved = await this.coinRepository.save(coins)
        }
        catch(err)
        {
            throw(new Error(err.toString()))
        }
        return coinsSaved
    }

    async createMany(createCoinsDto : Array<CreateCoinDto>) : Promise<Array<Coin>>
    {
        let coins : Array<Coin> = []
        let promises : any =  createCoinsDto.map(createCoinDto => this.create(createCoinDto))
        try
        {
           coins  = await Promise.all(promises)
        }
        catch(err)
        {    
            throw(new Error('Internal Server Error'))
        }
        return coins
    }

    async getAll() : Promise<Array<Coin>>
    {
        let coins : Array<Coin> = await this.coinRepository.find()
        return coins
    }

    async getBySymbol(symbol : string) : Promise<Coin>
    {
        let coin : Coin = await this.coinRepository.findOne({where : {symbol}})
        return coin
    }
}
