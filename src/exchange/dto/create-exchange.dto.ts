import { CreateCoinDto } from "@coin/dto/create-coin.dto";

export class CreateExchangeDto{
    name : string;
    website : string;
    coins? : Array<CreateCoinDto>;
}