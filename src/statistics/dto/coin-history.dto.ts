import { CoinDto } from "@coin/dto/coin.dto";

export class CoinHistoryDto{
    id : string;
    lastVariation: number;
    bidVariation : number;
    askVariation : number;
    dolarPriceClp : number
    timestamp : string;
    coin : CoinDto;
}