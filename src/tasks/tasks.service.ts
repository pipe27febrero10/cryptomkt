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
import * as orionxConstants from '../orionx/constants';
import { Exchange } from '@exchange/entities/exchange.entity';
import { BudaService } from '@buda/buda.service';
import { ResponseBudaTicker } from '@buda/interfaces/response-buda-ticker.interface';
import { CoinCryptoService } from '@coin/coin-crypto.service';
import { CoinCrypto } from '@coin/entities/coin-crypto.entity';
import * as moment from 'moment';
import { MailService } from 'mail/mail.service';
import { EmailRequestDto } from 'mail/dtos/email-request.dto';
import { Mail } from 'mail/entities/mail.entity';
import ResponseOrionxMarketBook from 'orionx/dto/response-orionx-market-book';
import ResponseOrionxMarket from 'orionx/dto/response-orionx-market';
import Orionx from 'orionx-sdk'

const coinsToNotify = ["0a0d65ec-1ca6-4e82-b4b4-8c765664aa50","2dfb8c26-f2c8-4bb8-b4c7-b9d827adab0a","597f1d7b-47ec-4207-a8b4-452043e0795c","88b17771-4dd3-44d2-95bc-cbe5cfa50567","b42ded5d-2105-487c-a322-f11964e20f1c","d58f1a70-8b4c-4531-8ad7-14a34b57dd1d","f403926c-2892-4c24-b7e0-aa9aad236124","f5f372a3-5862-4365-a4fc-fc7e6978bb8c"]
const rangeCoins = {
  lte: 0.98,
  gte: 1.06 
}

@Injectable()
export class TasksService {
  constructor(
    private readonly cryptoMktService: CryptomktService,
    private readonly coinServiceCrypto: CoinCryptoService,
    private readonly localIndicatorService: LocalindicatorService,
    private readonly poloniexService: PoloniexService,
    private readonly exchangeService: ExchangeService,
    private readonly budaService: BudaService,
    private readonly mailService: MailService,
    @InjectRepository(CoinHistory)
    private readonly coinHistoryRepo: Repository<CoinHistory>,
  ) {}
  private readonly logger = new Logger(TasksService.name);

  dolarValue = NaN;

  @Cron('*/20 * * * * *')
  async updateDolarValue() {
    this.dolarValue = await this.localIndicatorService.getUsdCurrentValueInClp();
    
  }

  @Cron('*/20 * * * * *')
  async updateCoinsOrionx() {
    let coinsCrypto: Array<CoinCrypto> = await this.coinServiceCrypto.getAll();

    const cryptomktExchange: Exchange = await this.exchangeService.findByName(
      orionxConstants.exchangeName
    );
    
    coinsCrypto = coinsCrypto.reduce((accumulator, coinCrypto) => {
      if (coinCrypto.exchange.id === cryptomktExchange.id) {
        accumulator = [...accumulator, coinCrypto];
      }
      return accumulator;
    }, []);

    let symbols: Array<string> = coinsCrypto.map(
      coinCrypto => coinCrypto.symbol,
    );

    // cryptocurrencies availables in poloniex and orionx
    const allowedSymbols = ['BTC','BCH','DAI','XLM','LTC','XRP','XLM','ETH']

    symbols = symbols.reduce((accumulator,symbol) => {
      if(allowedSymbols.find(s => s === symbol))
      {
          accumulator = [...accumulator,symbol]
      }
      return accumulator;
  },[])

    for (const symbol of symbols) {
      const responseMarketBookPrice : ResponseOrionxMarketBook = await Orionx.marketOrderBook({marketCode: `${symbol}CLP`, limit: 1})
      const responseMarketPrice : ResponseOrionxMarket = await Orionx.market({code: `${symbol}CLP`})

      const currentDate: string = moment().utc().format();
      const usdValueInClp: number = this.dolarValue;

      if (usdValueInClp) {
        const priceClp = responseMarketPrice.lastTrade.price
        const priceUsd = priceClp/usdValueInClp 
        const askPriceClp = responseMarketBookPrice.sell[0].limitPrice
        const bidPriceClp = responseMarketBookPrice.buy[0].limitPrice
        const askPriceUsd: number = askPriceClp/usdValueInClp
        const bidPriceusd: number = bidPriceClp/usdValueInClp
        // coin to update information
        const coinCrypto = coinsCrypto.find(coin => coin.symbol === symbol);

        coinCrypto.lastUpdate = currentDate;
        coinCrypto.bidPriceClp = bidPriceClp;
        coinCrypto.askPriceClp = askPriceClp;
        coinCrypto.askPriceUsd = askPriceUsd;
        coinCrypto.bidPriceUsd = bidPriceusd;
        coinCrypto.priceClp = priceClp;
        coinCrypto.priceUsd = priceUsd;

        await this.coinServiceCrypto.save(coinCrypto);
      }
    }

    
  }

  @Cron('*/20 * * * * *')
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
      this.cryptoMktService.getMarketPrice(symbol + 'CLP')
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

  @Cron('*/20 * * * * *')
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

  @Cron('*/20 * * * * *')
  async coinHistory() {
    const coinsCrypto: Array<CoinCrypto> = await this.coinServiceCrypto.getAll();
    const dolarPriceClp: number = this.dolarValue;
    let emailsBody = []

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
          const emailRequest : EmailRequestDto = {
            to: 'feleteli@egresados.ubiobio.cl',
            from: 'no-reply@digitalhomex.xyz',
            subject: '',
            text: ''
          }

          try{
            await this.coinHistoryRepo.save(coinHistory);
            if(coinsToNotify.includes(coinCrypto.id)){
              const mails : Mail[] = await this.mailService.getByEmail('feleteli@egresados.ubiobio.cl','DESC')
              const lastMail : Mail = mails.length ? mails[0] : null
              const lastDatemail = lastMail ? lastMail.timestamp : null;
              const nextDateMail = lastDatemail ? moment(lastDatemail).utc().add('30','minutes') : now
              
              if(bidVariation >= rangeCoins.gte)
              {
                emailRequest.subject = `Precio de venta de criptomonedas favorable`
                emailRequest.text = `Los compradores estan ofreciendo mas que el rango ajustado de  ${rangeCoins.gte} de la criptomoneda: ${coinCrypto.name}`
                if(moment(nextDateMail).isSameOrBefore(now))
                {
                  emailsBody = [...emailsBody,emailRequest]
                }     
              }

              if(askVariation <= rangeCoins.lte)
              {
                emailRequest.subject = `Precio de compra de criptomonedas favorable`
                emailRequest.text = `Los vendedores estan ofreciendo menos que el rango ajustado de  ${rangeCoins.lte} de la criptomoneda: ${coinCrypto.name}`
                if(moment(nextDateMail).isSameOrBefore(now))
                {
                  emailsBody = [...emailsBody,emailRequest]
                }
              }
            }
          }
          catch(err)
          {
            console.log(err)
          }
        }
      }
    }

    for(const email of emailsBody)
    {
      console.log('sending email.....')
      try{
        await this.mailService.sendMail(email)
      }
      catch(err)
      {
        console.log(err)
      }
    }
  }
}
