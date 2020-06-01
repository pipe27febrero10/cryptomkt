import { CoinDto } from "@coin/dto/coin.dto"
import { Coin } from "@coin/entities/coin.entity"
import { toExchangeDto } from "@exchange/mapper"
import { ExchangeDto } from "@exchange/dto/exchange.dto"
import { CoinCrypto } from "./entities/coin-crypto.entity"
import { CoinCryptoDto } from "./dto/coin-crypto.dto"

export const toCoinDto = (coin : Coin) : CoinDto => {
    const {id,name,symbol,priceClp,priceUsd,lastUpdate} = coin
    
    let coinDto : CoinDto = {
        id: id,
        name : name,
        symbol : symbol,
        priceClp : priceClp,
        priceUsd :priceUsd,
        lastUpdate: lastUpdate,
    }

    return coinDto
}

export const toCoinCrytoDto = (coinCrypto : CoinCrypto) : CoinCryptoDto =>{
    const {id,name,symbol,exchange,priceClp,priceUsd,lastUpdate,
        askPriceClp,bidPriceClp,volume,askPriceUsd,bidPriceUsd} = coinCrypto

 const exchangeDto : ExchangeDto = exchange ? toExchangeDto(exchange) : undefined
 
 let coinCryptoDto : CoinCryptoDto = {
     id: id,
     name : name,
     symbol : symbol,
     priceClp : priceClp,
     priceUsd :priceUsd,
     askPriceClp : askPriceClp,
     bidPriceClp  :bidPriceClp,
     askPriceUsd : askPriceUsd,
     bidPriceUsd : bidPriceUsd,
     volume : volume,
     lastUpdate: lastUpdate,
     exchange : exchangeDto
 }

 return coinCryptoDto
}