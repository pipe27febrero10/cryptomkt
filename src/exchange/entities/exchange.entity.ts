import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { CoinCrypto } from '@coin/entities/coin-crypto.entity';

@Entity()
export class Exchange{
    @PrimaryGeneratedColumn('uuid')
    id : string;
    @Column({unique : true})
    name : string;
    @Column({type : 'varchar'})
    website : string;
    @OneToMany(type => CoinCrypto,coinCrypto => coinCrypto.exchange)
    coins : CoinCrypto[]
}