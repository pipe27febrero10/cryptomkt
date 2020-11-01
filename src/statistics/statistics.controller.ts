import { Controller, Get, Query, HttpException, HttpStatus } from '@nestjs/common';
import { StatisticsService } from './statistics.service';
import { camelCase } from 'lodash'
import { FilterStatistics } from './interface/filter-statistics.interface';
import { ApiTags } from '@nestjs/swagger';
import { BidVariation } from './field-operators/bid-variation';
import { DolarPriceClp } from './field-operators/dolar-price-clp';
import { AskVariation } from './field-operators/ask-variation';
import { LastVariation } from './field-operators/last-variation';
import {askVariationOperators, bidVariationOperators, lastVariationOperators, dolarPriceOperators } from './field-operators/operators'

@Controller('statistics')
@ApiTags('Statistics')
export class StatisticsController {
    constructor(private readonly statisticsService : StatisticsService){}
    @Get("coin-history")
    async getAll(@Query("page") page  = 1,@Query("limit") limit = 10,
                 @Query("sort_by") sortBy : string,@Query("ask_variation") askVariation : AskVariation,
                 @Query("bid_variation") bidVariation : BidVariation,@Query("last_variation") lastVariation : LastVariation,
                 @Query("dolar_price_clp") dolarPriceClp : DolarPriceClp,@Query('coin_symbol') coinSymbol : string)
    {
      let filters : FilterStatistics = {}

      if(askVariation)
      {
        const operators : string[] = Object.keys(askVariation)
        const validOperator : boolean = operators.every(operator =>{
          return askVariationOperators.find(askVariationOperator => askVariationOperator === operator) !== undefined
        })

        if(!validOperator)
        {
          throw(new HttpException('operator must be '+askVariationOperators.toString(),HttpStatus.BAD_REQUEST))
        }

        const askVariationFilter = operators.reduce((accumulator,operator) => {
            accumulator = [...accumulator,{
              operator : operator,
              value : askVariation[operator]
            }]
            return accumulator
        },[])
        
        filters  = {...filters,askVariation : askVariationFilter}
      }

      if(bidVariation)
      {
        const operators : string[] = Object.keys(bidVariation)
        const validOperator : boolean = operators.every((operator) =>{
          return bidVariationOperators.find(bidVariationOperator => bidVariationOperator === operator) !== undefined
        })
        if(!validOperator)
        {
          throw(new HttpException('operator must be '+bidVariationOperators.toString(),HttpStatus.BAD_REQUEST))
        }

        const bidVariationFilter = operators.reduce((accumulator,operator) => {
          accumulator = [...accumulator,{
            operator : operator,
            value : bidVariation[operator]
          }]
          return accumulator
          },[])
          filters  = {...filters,bidVariation : bidVariationFilter}
      }

      if(lastVariation)
      {
        const operators : string[] = Object.keys(lastVariation)
        const validOperator : boolean = operators.every((operator) =>{
          return lastVariationOperators.find(lastVariationOperator => lastVariationOperator === operator) !== undefined
        })

        if(!validOperator)
        {
          throw(new HttpException('operator must be '+lastVariationOperators.toString(),HttpStatus.BAD_REQUEST))
        }

        const lastVariationFilter = operators.reduce((accumulator,operator) => {
          accumulator = [...accumulator,{
            operator : operator,
            value : lastVariation[operator]
          }]
          return accumulator
          },[])
          filters  = {...filters,lastVariation : lastVariationFilter}
      }
   
      if(dolarPriceClp)
      {
        const operators : string[] = Object.keys(dolarPriceClp)
        const validOperator : boolean = operators.every((operator) =>{
          return dolarPriceOperators.find(dolarPriceOperator => dolarPriceOperator === operator) !== undefined
        })

        if(!validOperator)
        {
          throw(new HttpException('operator must be '+dolarPriceOperators.toString(),HttpStatus.BAD_REQUEST))
        }

        const dolarPriceClpFilter = operators.reduce((accumulator,operator) => {
          accumulator = [...accumulator,{
            operator : operator,
            value : dolarPriceClp[operator]
          }]
          return accumulator
          },[])
          filters  = {...filters,dolarPriceClp : dolarPriceClpFilter}
      }
      
      limit = limit > 100 ? 100 : limit
      page = page <= 0 ? 1 : page

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
        },filters,coinSymbol,(sortType as 'ASC' | 'DESC'),sortField)
      }

      return this.statisticsService.index({
        limit,
        page
      },filters,coinSymbol)
    }
  }

