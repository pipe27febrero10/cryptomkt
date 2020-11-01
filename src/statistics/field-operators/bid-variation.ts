import { IsOptional, IsString } from "class-validator";

export class BidVariation{
    @IsString()
    @IsOptional()
    readonly gte? : string;
    @IsString()
    @IsOptional()
    readonly lte? : string;
  }