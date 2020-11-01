import { Filter } from "filter.interface";

export interface FilterStatistics{
    
    askVariation? : Filter[]; 

    bidVariation? : Filter[];

    lastVariation? : Filter[];

    dolarPriceClp? : Filter[];
}