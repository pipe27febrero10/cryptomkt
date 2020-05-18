export interface MarketBuda{
    id : string;
    name : string;
    base_currency : string;
    quote_currency : string;
    minimum_order_amount : Array<string>;
    disabled : boolean;
    illiquid : boolean;
}