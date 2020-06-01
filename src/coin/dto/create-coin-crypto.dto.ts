import { ApiProperty } from "@nestjs/swagger";
import { CreateCoinDto } from "./create-coin.dto";

export class CreateCoinCryptoDto extends CreateCoinDto{
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
}