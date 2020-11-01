import { Controller, Post, Body, HttpException, HttpStatus, Get } from '@nestjs/common';
import { CreateExchangeDto } from './dto/create-exchange.dto';
import { ExchangeService } from '@exchange/exchange.service'
import { Exchange } from '@exchange/entities/exchange.entity'
import { ExchangeDto } from './dto/exchange.dto';
import { toExchangeDto } from '@exchange/mapper'
import { ApiTags } from '@nestjs/swagger';


@Controller('exchanges')
@ApiTags('Exchanges')
export class ExchangeController {
    constructor(private exchangeService : ExchangeService) {}

    @Post('')
    async create(@Body() createExchangeDto : CreateExchangeDto) : Promise<ExchangeDto>
    {
        let exchange : Exchange = null
        try{
            exchange = await this.exchangeService.create(createExchangeDto)
        }
        catch(err)
        {
           throw(new HttpException(err,HttpStatus.INTERNAL_SERVER_ERROR)) 
        }
        
        const exchangeDto : ExchangeDto = toExchangeDto(exchange)
        return exchangeDto
    }

    @Get('')
    async index() : Promise<Array<ExchangeDto>>
    {
        let exchanges : Array<Exchange> = []
        try{
           exchanges = await this.exchangeService.getAll()
        }
        catch(err)
        {
            throw(new HttpException('getAll() service error',HttpStatus.INTERNAL_SERVER_ERROR))
        }
        const exchangeDto : Array<ExchangeDto> = exchanges.map(exchange => toExchangeDto(exchange))
        return exchangeDto
    }
}
