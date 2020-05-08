import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToOne, OneToMany } from "typeorm";
import { Exchange } from 'exchange/entities/exchange.entity'
import { CoinHistory } from "statistics/entity/coin-history.entity";

@Entity()
export class Coin{
    @PrimaryGeneratedColumn('uuid')
    id : string;
    @Column()
    name : string;
    @Column({type: 'varchar',length : 3})
    symbol : string;
    @ManyToOne(type => Exchange,exchange => exchange.coins)
    exchange : Exchange;
    @Column('decimal',{precision : 11,scale: 2})
    priceClp : number;
    @Column('decimal',{precision: 11,scale : 2})
    priceUsd : number;
    @Column({type: 'datetime'})
    lastUpdate : Date;
    @OneToMany(type => CoinHistory,coinHistory => coinHistory.coin)
    coinsHistory : Array<CoinHistory>

}

