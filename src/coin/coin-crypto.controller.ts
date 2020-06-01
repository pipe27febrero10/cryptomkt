import { Controller, Post, Body, Param } from '@nestjs/common';
import { Coin } from './entities/coin.entity';
import { toCoinDto } from './mapper';
import { CoinDto } from './dto/coin.dto';
import { ApiTags } from '@nestjs/swagger';
import { CoinCryptoService } from './coin-crypto.service';
import { CreateCoinCryptoDto } from './dto/create-coin-crypto.dto';

@Controller('coins_crypto')
@ApiTags('CoinsCrypto')
export class CoinCryptoController {
    constructor(private coinCryptoService : CoinCryptoService) {}

    @Post('/:id_exchange')
    async create(@Body() createCoinDto : CreateCoinCryptoDto,@Param('id_exchange') idExchange : string) : Promise<CoinDto>
    {
        let coin : Coin =  await this.coinCryptoService.create(createCoinDto,idExchange)
        let coinDto : CoinDto = toCoinDto(coin)
        return coinDto
    }
}
