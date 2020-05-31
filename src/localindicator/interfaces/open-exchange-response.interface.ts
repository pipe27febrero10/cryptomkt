import { OpenExchangeRates } from "./open-exchange-rates.interface";

export interface OpenExchangeResponse{
  disclaimer: string
  license: string
  timestamp: number,
  base: string,
  rates: OpenExchangeRates
}