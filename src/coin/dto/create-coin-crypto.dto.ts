import { ApiProperty } from "@nestjs/swagger";
import { CreateCoinDto } from "./create-coin.dto";
import { IsNumber } from "class-validator";

export class CreateCoinCryptoDto extends CreateCoinDto{
    @ApiProperty()
    @IsNumber()
    askPriceClp : number;
    @ApiProperty()
    @IsNumber()
    bidPriceClp : number;
    @ApiProperty()
    @IsNumber()
    askPriceUsd : number;
    @ApiProperty()
    @IsNumber()
    bidPriceUsd : number;
    @ApiProperty()
    @IsNumber()
    volume : number;
}