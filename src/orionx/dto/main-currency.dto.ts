import { ApiProduces, ApiProperty } from "@nestjs/swagger";

export class OrionxCurrency{
    @ApiProperty()
    code: string;
    @ApiProperty()
    name: string;
    @ApiProperty()
    units: number;
}