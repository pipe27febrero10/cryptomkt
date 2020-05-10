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
    askPriceClp : number;
    @ApiProperty()
    bidPriceClp : number;
    @ApiProperty()
    askPriceUsd : number;
    @ApiProperty()
    bidPriceUsd : number;
    @ApiProperty()
    volume : number;
    @ApiProperty()
    lastUpdate : Date; 
}