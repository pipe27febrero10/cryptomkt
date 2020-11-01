import { IsOptional, IsString } from "class-validator";

export class AskVariation{
    @IsString()
    @IsOptional()
    readonly gte? : string;
    @IsString()
    @IsOptional()
    readonly lte? : string;
  }