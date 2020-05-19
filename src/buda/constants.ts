import { ResponseBudaMarkets } from "./interfaces/response-buda-markets.interface"

export const exchangeName : string = 'Buda'
export const exchangeWebsite : string = 'http://www.buda.com'
export const uriApiBuda : string = 'https://www.buda.com/api/v2/'
export const manualResponseBudaMarkets : ResponseBudaMarkets =  {
    markets : [
        {
            "id": "BTC-CLP",
            "name": "btc-clp",
            "base_currency": "BTC",
            "quote_currency": "CLP",
            "minimum_order_amount": [
                "0.00002",
                "BTC"
            ],
            "disabled": false,
            "illiquid": false
        },
        {
            "id": "BTC-COP",
            "name": "btc-cop",
            "base_currency": "BTC",
            "quote_currency": "COP",
            "minimum_order_amount": [
                "0.00002",
                "BTC"
            ],
            "disabled": false,
            "illiquid": false
        },
        {
            "id": "ETH-CLP",
            "name": "eth-clp",
            "base_currency": "ETH",
            "quote_currency": "CLP",
            "minimum_order_amount": [
                "0.001",
                "ETH"
            ],
            "disabled": false,
            "illiquid": false
        },
        {
            "id": "ETH-BTC",
            "name": "eth-btc",
            "base_currency": "ETH",
            "quote_currency": "BTC",
            "minimum_order_amount": [
                "0.001",
                "ETH"
            ],
            "disabled": false,
            "illiquid": false
        },
        {
            "id": "BTC-PEN",
            "name": "btc-pen",
            "base_currency": "BTC",
            "quote_currency": "PEN",
            "minimum_order_amount": [
                "0.00002",
                "BTC"
            ],
            "disabled": false,
            "illiquid": false
        },
        {
            "id": "ETH-PEN",
            "name": "eth-pen",
            "base_currency": "ETH",
            "quote_currency": "PEN",
            "minimum_order_amount": [
                "0.001",
                "ETH"
            ],
            "disabled": false,
            "illiquid": false
        },
        {
            "id": "ETH-COP",
            "name": "eth-cop",
            "base_currency": "ETH",
            "quote_currency": "COP",
            "minimum_order_amount": [
                "0.001",
                "ETH"
            ],
            "disabled": false,
            "illiquid": false
        },
        {
            "id": "BCH-BTC",
            "name": "bch-btc",
            "base_currency": "BCH",
            "quote_currency": "BTC",
            "minimum_order_amount": [
                "0.001",
                "BCH"
            ],
            "disabled": false,
            "illiquid": false
        },
        {
            "id": "BCH-CLP",
            "name": "bch-clp",
            "base_currency": "BCH",
            "quote_currency": "CLP",
            "minimum_order_amount": [
                "0.001",
                "BCH"
            ],
            "disabled": false,
            "illiquid": false
        },
        {
            "id": "BCH-COP",
            "name": "bch-cop",
            "base_currency": "BCH",
            "quote_currency": "COP",
            "minimum_order_amount": [
                "0.001",
                "BCH"
            ],
            "disabled": false,
            "illiquid": true
        },
        {
            "id": "BCH-PEN",
            "name": "bch-pen",
            "base_currency": "BCH",
            "quote_currency": "PEN",
            "minimum_order_amount": [
                "0.001",
                "BCH"
            ],
            "disabled": false,
            "illiquid": false
        },
        {
            "id": "BTC-ARS",
            "name": "btc-ars",
            "base_currency": "BTC",
            "quote_currency": "ARS",
            "minimum_order_amount": [
                "0.00002",
                "BTC"
            ],
            "disabled": false,
            "illiquid": true
        },
        {
            "id": "ETH-ARS",
            "name": "eth-ars",
            "base_currency": "ETH",
            "quote_currency": "ARS",
            "minimum_order_amount": [
                "0.001",
                "ETH"
            ],
            "disabled": false,
            "illiquid": false
        },
        {
            "id": "BCH-ARS",
            "name": "bch-ars",
            "base_currency": "BCH",
            "quote_currency": "ARS",
            "minimum_order_amount": [
                "0.001",
                "BCH"
            ],
            "disabled": false,
            "illiquid": true
        },
        {
            "id": "LTC-BTC",
            "name": "ltc-btc",
            "base_currency": "LTC",
            "quote_currency": "BTC",
            "minimum_order_amount": [
                "0.003",
                "LTC"
            ],
            "disabled": false,
            "illiquid": false
        },
        {
            "id": "LTC-CLP",
            "name": "ltc-clp",
            "base_currency": "LTC",
            "quote_currency": "CLP",
            "minimum_order_amount": [
                "0.003",
                "LTC"
            ],
            "disabled": false,
            "illiquid": false
        },
        {
            "id": "LTC-COP",
            "name": "ltc-cop",
            "base_currency": "LTC",
            "quote_currency": "COP",
            "minimum_order_amount": [
                "0.003",
                "LTC"
            ],
            "disabled": false,
            "illiquid": true
        },
        {
            "id": "LTC-PEN",
            "name": "ltc-pen",
            "base_currency": "LTC",
            "quote_currency": "PEN",
            "minimum_order_amount": [
                "0.003",
                "LTC"
            ],
            "disabled": false,
            "illiquid": false
        },
        {
            "id": "LTC-ARS",
            "name": "ltc-ars",
            "base_currency": "LTC",
            "quote_currency": "ARS",
            "minimum_order_amount": [
                "0.003",
                "LTC"
            ],
            "disabled": false,
            "illiquid": true
        }
    ]
} 