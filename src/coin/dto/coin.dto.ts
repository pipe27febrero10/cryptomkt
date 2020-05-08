import { ExchangeDto } from "@exchange/dto/exchange.dto";
import { ApiProperty } from "@nestjs/swagger";

export class CoinDto{
    @ApiProperty()
    id : string;
    @ApiProperty()
    name : string;
    @ApiProperty()
    symbol : string;
    @ApiProperty()
    exchange : ExchangeDto;
    @ApiProperty()
    priceClp : number;
    @ApiProperty()
    priceUsd : number;
    @ApiProperty()
    lastUpdate : Date;
}