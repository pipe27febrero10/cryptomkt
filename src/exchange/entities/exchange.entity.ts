import { CoinEntity } from '@coin/entities/coin.entity'
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';

@Entity()
export class ExchangeEntity{
    @PrimaryGeneratedColumn('uuid')
    id : string;
    @Column()
    name : string;
    @Column({type : 'varchar',unique : true})
    website : string;
    @OneToMany(type => CoinEntity,coinEntity => coinEntity.exchange)
    coins : CoinEntity[]
}