export interface TickerBuda{
    market_id : string;
    last_price : Array<string>;
    min_ask : Array<string>;
    max_bid : Array<string>;
    volume : Array<string>;
    price_variation_24h : string;
    price_variation_7d : string;
}