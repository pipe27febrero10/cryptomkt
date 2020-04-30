import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { Exchange } from 'exchange/entities/exchange.entity'

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
    @Column('date')
    lastUpdate : Date;
}

