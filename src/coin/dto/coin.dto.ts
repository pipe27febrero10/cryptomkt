import { ExchangeDto } from "@exchange/dto/exchange.dto";

export class CoinDto{
    id : string;
    name : string;
    symbol : string;
    exchange : ExchangeDto;
    priceClp : number;
    priceUsd : number;
    lastUpdate : Date;
}