import { Controller, Get, Query, HttpException, HttpStatus } from '@nestjs/common';
import { StatisticsService } from './statistics.service';
import { monthsShort } from 'moment';
import { camelCase } from 'lodash'

@Controller('statistics')
export class StatisticsController {
    constructor(private readonly statisticsService : StatisticsService){}
    @Get("coin-history")
    async getAll(@Query("page") page : number = 1,@Query("limit") limit : number = 10,@Query("sort_by") sortBy : string)
    {
      limit = limit > 100 ? 100 : limit
      if(sortBy !== undefined)
      {
        const sortFields = sortBy.split(".")
        if(sortFields.length !== 2)
        {
            throw(new HttpException("sort_by does not have a valid format",HttpStatus.BAD_REQUEST))
        }
        let sortField = sortBy.split(".")[0].toLowerCase()
        const sortType = sortBy.split(".")[1].toUpperCase()
        const regexTypeOrder  = /^ASC$|^DESC$/
        const regexFieldOrder = /^timestamp$|^last_variation$|^ask_variation|^bid_variation$|^dolar_price_clp$/
        
        if(!regexTypeOrder.test(sortType))
        {
            throw(new HttpException(sortType+" is not valid operation type",HttpStatus.BAD_REQUEST))
        }

        if(!regexFieldOrder.test(sortField))
        {
            throw(new HttpException(sortField+" is not valid field order",HttpStatus.BAD_REQUEST))
        }
        
        sortField = camelCase(sortField)
        return this.statisticsService.index({
            limit,
            page
        },sortType === "ASC" ? "ASC" : "DESC",sortField)
      }
      return this.statisticsService.index({
        limit,
        page
      })
    }
}
