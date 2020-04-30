import { Coin } from 'coin/entities/coin.entity'
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';

@Entity()
export class Exchange{
    @PrimaryGeneratedColumn('uuid')
    id : string;
    @Column({unique : true})
    name : string;
    @Column({type : 'varchar'})
    website : string;
    @OneToMany(type => Coin,coinEntity => coinEntity.exchange)
    coins : Coin[]
}