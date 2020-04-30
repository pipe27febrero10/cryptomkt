import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Exchange } from '@exchange/entities/exchange.entity';
import { Repository } from 'typeorm';
import { CreateExchangeDto } from './dto/create-exchange.dto';
import { toExchangeDto } from './mapper';
import { ExchangeDto } from './dto/exchange.dto';

@Injectable()
export class ExchangeService {
    constructor(@InjectRepository(Exchange) private exchangeRepository : Repository<Exchange>){}

    async create(createExchangeDto : CreateExchangeDto)
    {
      let exchange : Exchange = this.exchangeRepository.create({
          name : createExchangeDto.name,
          website : createExchangeDto.website,
          coins : []
      })

      try
      {
        await this.exchangeRepository.save(exchange)
      }
      catch(err)
      {
         throw(err.message)
      }
      
      return exchange
    }

    async getAll() : Promise<Array<Exchange>>
    {
        let exchanges : Array<Exchange> = await this.exchangeRepository.find()
        return exchanges
    }

    async findByName(name : string) : Promise<Exchange>
    {
       return await this.exchangeRepository.findOne({name})
    }

}
