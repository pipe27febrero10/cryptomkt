import { IsOptional, IsString } from "class-validator";

export class LastVariation{
    @IsString()
    @IsOptional()
    readonly gte? : string;
    @IsString()
    @IsOptional()
    readonly lte? : string;
  }