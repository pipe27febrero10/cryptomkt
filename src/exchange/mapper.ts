import { Exchange } from '@exchange/entities/exchange.entity'
import { ExchangeDto } from '@exchange/dto/exchange.dto'

export const toExchangeDto  = (exchange : Exchange) : ExchangeDto => {
    let { id , name , website } = exchange
    const exchangeDto = {
        id,
        name,
        website
    }
    return exchangeDto
}
