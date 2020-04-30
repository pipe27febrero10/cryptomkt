import { ApiProperty } from "@nestjs/swagger";

export class CreateCoinDto{
    @ApiProperty()
    name : string;
    @ApiProperty()
    symbol : string;
    @ApiProperty()
    priceClp : number;
    @ApiProperty()
    priceUsd : number;
    @ApiProperty()
    lastUpdate : Date; 
}