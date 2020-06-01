import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToOne, OneToMany, TableInheritance } from "typeorm";


@Entity()
@TableInheritance({ column: { type: "varchar", name: "type" } })
export class Coin{
    @PrimaryGeneratedColumn('uuid')
    id : string;
    @Column()
    name : string;
    @Column({type: 'varchar',length : 3})
    symbol : string;
    @Column('decimal',{precision : 11,scale: 2})
    priceClp : number;
    @Column('decimal',{precision: 11,scale : 2})
    priceUsd : number;
    @Column({type: 'varchar'})
    lastUpdate : string;
}

