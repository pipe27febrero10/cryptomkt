import { ApiProperty } from "@nestjs/swagger";
import { OrionxCurrency } from "./main-currency.dto";

export class OrionMarketDto{
    @ApiProperty()
    code: string;
    @ApiProperty()
    name: string;
    @ApiProperty()
    mainCurrency: OrionxCurrency;
    @ApiProperty()
    secondaryCurrency: OrionxCurrency;
}