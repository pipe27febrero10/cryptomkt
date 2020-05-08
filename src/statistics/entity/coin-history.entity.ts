import { Entity, Column, PrimaryGeneratedColumn, OneToOne, ManyToOne } from "typeorm";
import { Coin } from "@coin/entities/coin.entity";


@Entity()
export class CoinHistory{
    @PrimaryGeneratedColumn("uuid")
    id : string;
    @Column({type : "float"})
    variation: number;
    @Column({type: "datetime"})
    timestamp : Date;
    @ManyToOne(type => Coin,coin => coin.coinsHistory)
    coin : Coin;
}