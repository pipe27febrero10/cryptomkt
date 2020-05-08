import { CreateCoinDto } from "@coin/dto/create-coin.dto";
import { ApiProperty } from "@nestjs/swagger";

export class CreateExchangeDto{
    @ApiProperty()
    name : string;
    @ApiProperty()
    website : string;
    @ApiProperty({type : [CreateCoinDto]})
    coins? : Array<CreateCoinDto>;
}