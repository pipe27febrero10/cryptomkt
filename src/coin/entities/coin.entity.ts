import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { ExchangeEntity } from '@exchange/entities/exchange.entity'

@Entity()
export class CoinEntity{
    @PrimaryGeneratedColumn('uuid')
    id : string;
    @Column()
    name : string;
    @Column({type: 'varchar',length : 3})
    symbol : string;
    @ManyToOne(type => ExchangeEntity,exchangeEntity => exchangeEntity.coins)
    exchange : ExchangeEntity;
    @Column()
    priceClp : number;
    @Column()
    priceUsd : number;
    @Column('date')
    lastUpdate : Date;
}