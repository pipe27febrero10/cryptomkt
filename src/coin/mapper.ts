import { CoinDto } from "@coin/dto/coin.dto"
import { Coin } from "@coin/entities/coin.entity"
import { toExchangeDto } from "@exchange/mapper"
import { ExchangeDto } from "@exchange/dto/exchange.dto"

export const toCoinDto = (coin : Coin) : CoinDto => {
    const {id,name,symbol,exchange,priceClp,priceUsd,lastUpdate} = coin
    const exchangeDto : ExchangeDto = exchange ? toExchangeDto(exchange) : undefined
    return {
        id: id,
        name : name,
        symbol : symbol,
        priceClp : priceClp,
        priceUsd :priceUsd,
        lastUpdate: lastUpdate,
        exchange : exchangeDto
    }
}