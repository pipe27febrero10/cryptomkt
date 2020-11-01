import { Controller, Post, Body, Param } from '@nestjs/common';
import { CoinService } from './coin.service';
import { CreateCoinDto } from './dto/create-coin.dto';
import { Coin } from './entities/coin.entity';
import { toCoinDto } from './mapper';
import { CoinDto } from './dto/coin.dto';
import { ApiTags } from '@nestjs/swagger';

@Controller('coins')
@ApiTags('Coins')
export class CoinController {
    constructor(private coinService : CoinService) {}

    @Post('')
    async create(@Body() createCoinDto : CreateCoinDto) : Promise<CoinDto>
    {
        const coin : Coin =  await this.coinService.create(createCoinDto)
        const coinDto : CoinDto = toCoinDto(coin)
        return coinDto
    }
}
