import { ExchangeDto } from "@exchange/dto/exchange.dto";
import { ApiProperty } from "@nestjs/swagger";

export class CoinCryptoDto{
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
    askPriceClp : number;
    @ApiProperty()
    bidPriceClp : number;
    @ApiProperty()
    askPriceUsd : number;
    @ApiProperty()
    bidPriceUsd : number;
    @ApiProperty()
    volume : number
    @ApiProperty()
    lastUpdate : string;
}