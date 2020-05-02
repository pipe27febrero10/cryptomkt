export  class MarketPoloniexDto{
    symbol : string;
    id: number;
    last: number;
    lowestAsk: number;
    highestBid: number;
    percentChange: number;
    baseVolume: number;
    quoteVolume: number;
    isFrozen: number;
    high24hr: number;
    low24hr: number;
}