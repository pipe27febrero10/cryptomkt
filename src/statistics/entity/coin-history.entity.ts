import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from "typeorm";
import { CoinCrypto } from "@coin/entities/coin-crypto.entity";


@Entity()
export class CoinHistory{
    @PrimaryGeneratedColumn("uuid")
    id : string;
    @Column({type : "float"})
    lastVariation: number;
    @Column({type: "float" })
    bidVariation : number;
    @Column({type: "float"})
    askVariation : number;
    @Column({type: 'float'})
    dolarPriceClp : number
    @Column({type: "varchar"})
    timestamp : string;
    @ManyToOne(type => CoinCrypto,coinCrypto => coinCrypto.coinsHistory)
    coin : CoinCrypto;

}