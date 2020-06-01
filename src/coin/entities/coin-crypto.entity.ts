import { Entity, Column, OneToMany, ManyToOne, PrimaryGeneratedColumn, ChildEntity } from "typeorm";
import { Coin } from "./coin.entity";
import { CoinHistory } from "statistics/entity/coin-history.entity";
import { Exchange } from "@exchange/entities/exchange.entity";

@ChildEntity()
export class CoinCrypto extends Coin{
    @Column('decimal',{precision: 11,scale : 2})
    askPriceClp : number;
    @Column('decimal',{precision: 11, scale: 2})
    bidPriceClp : number;
    @Column('decimal',{precision: 11,scale:2})
    askPriceUsd : number;
    @Column('decimal',{precision: 11,scale : 2})
    bidPriceUsd : number;
    @Column('decimal',{precision: 11,scale : 2})
    volume : number;
    @OneToMany(type => CoinHistory,coinHistory => coinHistory.coin)
    coinsHistory : Array<CoinHistory>
    @ManyToOne(type => Exchange,exchange => exchange.coins)
    exchange : Exchange;
}