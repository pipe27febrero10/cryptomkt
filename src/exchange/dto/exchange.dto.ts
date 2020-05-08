import { ApiProperty } from "@nestjs/swagger";

export class ExchangeDto{
    @ApiProperty()
    id : string;
    @ApiProperty()
    name: string;
    @ApiProperty()
    website : string;
}