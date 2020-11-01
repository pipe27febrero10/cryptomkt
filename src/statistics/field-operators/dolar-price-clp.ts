import { IsOptional, IsString } from "class-validator";

export class DolarPriceClp{
    @IsString()
    @IsOptional()
    readonly gte? : string;
    @IsString()
    @IsOptional()
    readonly lte? : string;
  }