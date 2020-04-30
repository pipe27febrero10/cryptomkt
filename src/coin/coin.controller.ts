import { Controller, Post, Body, Param } from '@nestjs/common';
import { CoinService } from './coin.service';
import { CreateCoinDto } from './dto/create-coin.dto';
import { Coin } from './entities/coin.entity';
import { toCoinDto } from './mapper';
import { CoinDto } from './dto/coin.dto';

@Controller('coins')
export class CoinController {
    constructor(private coinService : CoinService) {}

    @Post('/:id_exchange')
    async create(@Body() createCoinDto : CreateCoinDto,@Param('id_exchange') idExchange : string) : Promise<CoinDto>
    {
        let coin : Coin =  await this.coinService.create(createCoinDto,idExchange)
        let coinDto : CoinDto = toCoinDto(coin)
        return coinDto
    }
}
