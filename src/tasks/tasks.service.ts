import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { CryptomktService } from '@cryptomkt/cryptomkt.service';
import { ResponseCryptoMkt } from '@cryptomkt/interfaces/response-crypto-mkt.interface';
import { ResponseCoin } from '@cryptomkt/interfaces/response-coin.interface';
import { LocalindicatorService } from 'localindicator/localindicator.service';
import { PoloniexService } from '@poloniex/poloniex.service';
import { MarketPoloniexDto } from '@poloniex/dto/market-poloniex.dto';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CoinHistory } from 'statistics/entity/coin-history.entity';
import { ExchangeService } from '@exchange/exchange.service';
import * as cryptomktConstants from '../cryptomkt/constants';
import * as budaConstants from '../buda/constants';
import { Exchange } from '@exchange/entities/exchange.entity';
import { BudaService } from '@buda/buda.service';
import { ResponseBudaTicker } from '@buda/interfaces/response-buda-ticker.interface';
import { CoinCryptoService } from '@coin/coin-crypto.service';
import { CoinCrypto } from '@coin/entities/coin-crypto.entity';
import * as moment from 'moment';

@Injectable()
export class TasksService {
  constructor(
    private readonly cryptoMktService: CryptomktService,
    private readonly coinServiceCrypto: CoinCryptoService,
    private readonly localIndicatorService: LocalindicatorService,
    private readonly poloniexService: PoloniexService,
    private readonly exchangeService: ExchangeService,
    private readonly budaService: BudaService,
    @InjectRepository(CoinHistory)
    private readonly coinHistoryRepo: Repository<CoinHistory>,
  ) {}
  private readonly logger = new Logger(TasksService.name);

  dolarValue = NaN;

  @Cron('*/10 * * * * *')
  async updateDolarValue() {
    this.dolarValue = await this.localIndicatorService.getUsdCurrentValueInClp();
    
  }

  @Cron('*/10 * * * * *')
  async updateCoinsCryptoMkt() {
    let coinsCrypto: Array<CoinCrypto> = await this.coinServiceCrypto.getAll();
    const cryptomktExchange: Exchange = await this.exchangeService.findByName(
      cryptomktConstants.exchangeName,
    );

    coinsCrypto = coinsCrypto.reduce((accumulator, coinCrypto) => {
      if (coinCrypto.exchange.id === cryptomktExchange.id) {
        accumulator = [...accumulator, coinCrypto];
      }
      return accumulator;
    }, []);

    const symbols: Array<string> = coinsCrypto.map(
      coinCrypto => coinCrypto.symbol,
    );

    const promises = symbols.map(symbol =>
      this.cryptoMktService.getMarketPrice(symbol + 'CLP'),
    ); // get markets price in clp
    let responses: Array<ResponseCryptoMkt> = null;

    responses = await Promise.all(promises);
    const datas: Array<ResponseCoin> = responses.map(({ data }) => data[0]);

    const priceUsdInClp: number = this.dolarValue;

    datas.forEach(data => {
      const symbol = data.market.substring(0, 3);
      const coinCrypto: CoinCrypto = coinsCrypto.find(
        coinCrypto => coinCrypto.symbol === symbol,
      );
      if (coinCrypto) {
        if (priceUsdInClp) {
          coinCrypto.priceClp = data.last_price;
          coinCrypto.priceUsd = coinCrypto.priceClp / priceUsdInClp;
          coinCrypto.lastUpdate = data.timestamp;
          coinCrypto.bidPriceClp = data.bid;
          coinCrypto.askPriceClp = data.ask;
          coinCrypto.bidPriceUsd = coinCrypto.bidPriceClp / priceUsdInClp;
          coinCrypto.askPriceUsd = coinCrypto.askPriceClp / priceUsdInClp;
          coinCrypto.volume = data.volume;
        }
      }
    });
    await this.coinServiceCrypto.saveMany(
      coinsCrypto,
    );
  }

  @Cron('*/10 * * * * *')
  async updateCoinsBuda() {
    let coinsCrypto: Array<CoinCrypto> = await this.coinServiceCrypto.getAll();

    const budaExchange: Exchange = await this.exchangeService.findByName(
      budaConstants.exchangeName,
    );
    if(budaExchange)
    {
      coinsCrypto = coinsCrypto.reduce((accumulator, coinCrypto) => {
        if (coinCrypto.exchange.id === budaExchange.id) {
          accumulator = [...accumulator, coinCrypto];
        }
        return accumulator;
      }, []);
  
      const symbols: Array<string> = coinsCrypto.map(
        coinCrypto => coinCrypto.symbol,
      );
      for (const symbol of symbols) {
        const responseBudaTicker: ResponseBudaTicker = await this.budaService.getMarketTicker(
          symbol,
        );
        const currentDate: string = moment().utc().format();
        const usdValueInClp: number = this.dolarValue;
        if (usdValueInClp) {
          const priceClp = Number(responseBudaTicker.ticker.last_price[0]);
          const priceUsd: number = priceClp / usdValueInClp;
          const askPriceClp = Number(responseBudaTicker.ticker.min_ask[0]);
          const bidPriceClp = Number(responseBudaTicker.ticker.max_bid[0]);
          const askPriceUsd: number = askPriceClp / usdValueInClp;
          const bidPriceusd: number = bidPriceClp / usdValueInClp;
          const volume = Number(responseBudaTicker.ticker.volume[0]);
          // coin to update information
          const coinCrypto = coinsCrypto.find(coin => coin.symbol === symbol);
          coinCrypto.lastUpdate = currentDate;
          coinCrypto.bidPriceClp = bidPriceClp;
          coinCrypto.askPriceClp = askPriceClp;
          coinCrypto.askPriceUsd = askPriceUsd;
          coinCrypto.bidPriceUsd = bidPriceusd;
          coinCrypto.priceClp = priceClp;
          coinCrypto.priceUsd = priceUsd;
          coinCrypto.volume = volume;
  
          await this.coinServiceCrypto.save(coinCrypto);
        }
      }
    }
    
  }

  @Cron('*/10 * * * * *')
  async coinHistory() {
    const coinsCrypto: Array<CoinCrypto> = await this.coinServiceCrypto.getAll();
    const dolarPriceClp: number = this.dolarValue;

    for (const coinCrypto of coinsCrypto) {
      const now = moment().utc().format();
      const symbol = coinCrypto.symbol;

      const marketPoloniexDto: MarketPoloniexDto = await this.poloniexService.getMarket(
        symbol,
      );

      if (marketPoloniexDto) {
        const lastVariation = coinCrypto.priceUsd / marketPoloniexDto.last;
        const bidVariation = coinCrypto.bidPriceUsd / marketPoloniexDto.last;
        const askVariation = coinCrypto.askPriceUsd / marketPoloniexDto.last;
        if (dolarPriceClp) {
          const coinHistory: CoinHistory = this.coinHistoryRepo.create({
            lastVariation: lastVariation,
            bidVariation: bidVariation,
            askVariation: askVariation,
            dolarPriceClp: dolarPriceClp,
            coin: coinCrypto,
            timestamp: now,
          });
          await this.coinHistoryRepo.save(coinHistory);
        }
      }
    }
  }
}
