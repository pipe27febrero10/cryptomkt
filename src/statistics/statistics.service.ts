import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CoinHistory } from './entity/coin-history.entity';
import { Repository } from 'typeorm';
import {paginate, Pagination, IPaginationOptions} from 'nestjs-typeorm-paginate';

@Injectable()
export class StatisticsService {
    constructor(@InjectRepository(CoinHistory) private readonly coinHistoryRepository : Repository<CoinHistory>){}
    async index(options: IPaginationOptions,sortType? : "ASC" | "DESC",sortField? : string) : Promise<Pagination<CoinHistory>>
    {
        let queryBuilder = this.coinHistoryRepository
        .createQueryBuilder('coin-history')
        .leftJoinAndSelect('coin-history.coin', 'coin')

        if(sortType !== undefined && sortField !== undefined)
        {
            queryBuilder = this.coinHistoryRepository
            .createQueryBuilder('coin-history')
            .leftJoinAndSelect('coin-history.coin', 'coin')
            .orderBy('coin-history.'+sortField,sortType)
        }
        
        const coinHistoriesPaginated : Pagination<CoinHistory> = await paginate<CoinHistory>(queryBuilder,options)
        return coinHistoriesPaginated
    }
}
