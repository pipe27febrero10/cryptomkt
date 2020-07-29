import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsNumber } from "class-validator";

export class CreateCoinDto{
    @ApiProperty()
    @IsString()
    name : string;
    @ApiProperty()
    @IsString()
    symbol : string;
    @ApiProperty()
    @IsNumber()
    priceClp : number;
    @ApiProperty()
    @IsNumber()
    priceUsd : number;
    @ApiProperty()
    @IsString()
    lastUpdate : string; 
}