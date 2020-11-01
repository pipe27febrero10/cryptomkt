import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CoinHistory } from './entity/coin-history.entity';
import { Repository } from 'typeorm';
import {paginate, Pagination, IPaginationOptions} from 'nestjs-typeorm-paginate';
import { FilterStatistics } from './interface/filter-statistics.interface';
import { CoinService } from '@coin/coin.service';
import { query } from 'express';

@Injectable()
export class StatisticsService {
    constructor(@InjectRepository(CoinHistory) private readonly coinHistoryRepository : Repository<CoinHistory>,
                private readonly coinService : CoinService ){}
    async index(options: IPaginationOptions,filters? : FilterStatistics,coinSymbol? : string,sortType? : "ASC" | "DESC",sortField? : string) : Promise<Pagination<CoinHistory>>
    {
        const operators  = {
            gte : '>=',
            lte : '<='
        }

        let queryBuilder = this.coinHistoryRepository
        .createQueryBuilder('coin-history')

        let countWhere = 0
        filters = filters ? filters : {}
        const { askVariation, bidVariation, lastVariation, dolarPriceClp} = filters 

        if(askVariation)
        {
            if(askVariation.length > 0)
            {
                queryBuilder = askVariation.reduce((query,askVariation) =>{
                    query = countWhere === 0 ? query.where("coin-history.askVariation "+operators[askVariation.operator]+" "+askVariation.value) : query.andWhere("coin-history.askVariation "+operators[askVariation.operator]+" "+askVariation.value)
                    countWhere++
                    return query
                },queryBuilder)
            }
        }
        
        if(bidVariation)
        { 
            if(bidVariation.length > 0){
                queryBuilder = bidVariation.reduce((query,bidVariation) =>{
                    query = countWhere === 0 ? query.where("coin-history.bidVariation "+operators[bidVariation.operator]+" "+bidVariation.value) : query.andWhere("coin-history.bidVariation "+operators[bidVariation.operator]+" "+bidVariation.value)
                    countWhere++
                    return query
                },queryBuilder)
            }
        }

        if(lastVariation)
        {
            if(lastVariation.length > 0)
            {
                queryBuilder = lastVariation.reduce((query,lastVariation) =>{
                    query = countWhere === 0 ? query.where(`coin-history.lastVariation ${operators[lastVariation.operator]} ${lastVariation.value}`) : query.andWhere(`coin-history.lastVariation ${operators[lastVariation.operator]} ${lastVariation.value}`)
                    countWhere++
                    return query
                },queryBuilder)
            }
        }

        if(dolarPriceClp){
            if(dolarPriceClp.length > 0)
            {
                queryBuilder = dolarPriceClp.reduce((query,dolarPriceClp) =>{
                    query = countWhere === 0 ? query.where(`coin-history.dolarPriceClp ${operators[dolarPriceClp.operator]} ${dolarPriceClp.value}`) : query.andWhere(`coin-history.dolarPriceClp ${operators[dolarPriceClp.operator]} ${dolarPriceClp.value}`)
                    countWhere++
                    return query
                },queryBuilder)
            }
        }
        
        if(sortType !== undefined && sortField !== undefined)
        {
            queryBuilder = queryBuilder.orderBy('coin-history.'+sortField,sortType)
        }

        // search coin by symbol and get its uuid 
        const coin = await this.coinService.getBySymbol(coinSymbol)
        const idCoin = coin && coin.id ? coin.id : undefined

        if(idCoin)
        {
            queryBuilder = queryBuilder.innerJoinAndSelect('coin-history.coin','coin','coin.id = :idCoin',{idCoin})
        }

        let coinHistoriesPaginated : Pagination<CoinHistory> = await paginate<CoinHistory>(queryBuilder,options)
        const itemsPromise : Array<Promise<CoinHistory>>= coinHistoriesPaginated.items.map(coinHistory => this.coinHistoryRepository.findOne({relations : ["coin"],where : {id : coinHistory.id}}))
        const items : Array<CoinHistory>= await Promise.all(itemsPromise)    
        coinHistoriesPaginated = new Pagination<CoinHistory>(items,coinHistoriesPaginated.meta,coinHistoriesPaginated.links)
        return coinHistoriesPaginated
    }
}
