import {
  Injectable,
  HttpService,
  HttpException,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ValueDto } from './dto/value.dto';
import { apiUri, bcentralDolar, openExchangesApiUri } from './constants';
import * as cheerio from 'cheerio';
import { LocalIndicatorException } from './exception/localindicator.exception';
import { OpenExchangeResponse } from './interfaces/open-exchange-response.interface';
import { OpenExchangeRates } from './interfaces/open-exchange-rates.interface';
import { CoinService } from '@coin/coin.service';
import * as moment from 'moment'
import { Coin } from '@coin/entities/coin.entity';
import { CreateCoinDto } from '@coin/dto/create-coin.dto';
import { ConfigurationService } from 'configuration/configuration.service';

@Injectable()
export class LocalindicatorService {
  constructor(private readonly httpService: HttpService,
              private readonly coinService : CoinService,
              private readonly configurationService : ConfigurationService) {}
  // get all indicators
  async getAll(): Promise<any> {
    let result: any = null;
    try {
      result = await this.httpService.get(apiUri).toPromise();
    } catch (err) {
      throw new LocalIndicatorException(
        'LocalIndicator SERVICE ERROR',
        'HTTP REQUEST FAILED',
        err.toString(),
      );
    }

    let data: any = result.data;
    return data;
  }

  // dolar observado p
  async getUsdValueInClp(): Promise<ValueDto> {
    let result: any = null;
    result = await this.getAll();
    const usdValueDto: ValueDto = result.dolar;
    return usdValueDto;
  }

  //current dolar observado
  //async getUsdCurrentValueInClp(): Promise<number> {
   // let valueDto: ValueDto = await this.getCurrentUsdValue();
   // let lastValue: number = valueDto.valor;
   // return lastValue;
  //}

  async getUsdCurrentValueInClp(): Promise<number> {
    let dateNow : moment.Moment = moment().utc()
    let coin : Coin = await this.coinService.getBySymbol('USD')
    let value : number
    let openExchangeApiKey : string = this.configurationService.getOpenExchangeApiKey()
    const url =
      openExchangesApiUri +
      '/latest.json?base=USD&symbols=CLP&app_id='+openExchangeApiKey;
    let resultRequest = null;
    
    if(coin)
    {
      let limitTime : moment.Moment = moment(coin.lastUpdate).utc().add(50,"minutes")
      if(moment(limitTime).isBefore(dateNow))
      {
        try {
          resultRequest = await this.httpService.get(url).toPromise();
        } catch (err) {
          if (err.response) {
            throw new Error(err.response.data.toString());
          } else {
            throw new Error('http error');
          }
        }
      
        coin.lastUpdate = dateNow.format()
        await this.coinService.save(coin)
        const openExchangeResponse: OpenExchangeResponse = resultRequest.data;
        value = openExchangeResponse.rates['CLP'];
      }
      else{
        value = coin.priceClp 
      }  
    }
    else{
      try {
        resultRequest = await this.httpService.get(url).toPromise();
      } catch (err) {
        if (err.response) {
          throw new Error(err.response.data.toString());
        } else {
          throw new Error('http error');
        }
      }
      const openExchangeResponse: OpenExchangeResponse = resultRequest.data;
      value = openExchangeResponse.rates['CLP'];
      const dolarCoin : CreateCoinDto = {
        name : "Dólar",
        symbol : "USD",
        priceClp : value,
        priceUsd : 1,
        lastUpdate : moment().utc().format()
      }

      try
      {
        await this.coinService.create(dolarCoin)
      }
      catch(err)
      {
        throw(new Error("database error: "+err.toString()))
      }
      
      
    }
    return value
  }

  async getUFValueInCLP(): Promise<ValueDto> {
    let result: any = null;
    result = await this.getAll();
    let ufValueDto: ValueDto = result.uf;
    return ufValueDto;
  }

  async getUTMValueInCLP() {
    let result: any = null;
    result = await this.getAll();
    let utmValueDto: ValueDto = result.utm;
    return utmValueDto;
  }

  async getUnemPloyment() {
    let result: any = null;
    result = await this.getAll();
    let unemploymentDto: ValueDto = result.tasa_desempleo;
    return unemploymentDto;
  }

  async getCurrentUsdValue(): Promise<ValueDto> {
    let response: any = null;
    let cookie: string = '';
    //let response : any = await this.httpService.get(bcentralDolar,{headers : {Cookie : "ASP.NET_SessionId=wj3mod4p1fzozv05w5zrmdyo; Path=/; Domain=si3.bcentral.cl; HttpOnly;"}}).toPromise()
    //get redirect resposne to get cookies
    try {
      response = await this.httpService
        .get(bcentralDolar, { maxRedirects: 0 })
        .toPromise();
    } catch (err) {
      let codeRegex = /^3\d\d$/;
      // if there any response
      if (err.response) {
        // if code belongs to redirections codes get cookie
        if (codeRegex.test(err.response.status)) {
          cookie = err.response.headers['set-cookie'][0];
        } else {
          throw new LocalIndicatorException(
            'LocalIndicator SERVICE ERROR',
            'HTTP REQUEST ERROR',
            err.toString(),
          );
        }
      }
      // if there no any resposne
      else {
        throw new LocalIndicatorException(
          'LocalIndicator SERVICE ERROR',
          'HTTP REQUEST ERROR',
          err.toString(),
        );
      }
    }

    // make request with cookie set

    try {
      response = await this.httpService
        .get(bcentralDolar, {
          headers: {
            Cookie: cookie,
          },
          maxRedirects: 0,
        })
        .toPromise();
    } catch (err) {
      if (err.response) {
        throw new HttpException('' + err, err.response.status);
      } else {
        throw new HttpException('' + err, HttpStatus.INTERNAL_SERVER_ERROR);
      }
    }

    let html = response.data;
    const $ = cheerio.load(html);
    let historicValue: Array<any> = [];

    $('tr').each(function(index, element) {
      historicValue = [...historicValue, $(element).html()];
    });

    let currentValue: string = $('td', historicValue[0])
      .next()
      .text();
    let day: string = $('td', historicValue).text();
    const current: Date = new Date();

    let valueDto: ValueDto = {
      codigo: 'dolar',
      nombre: 'Dólar actual',
      unidad_medida: 'Pesos',
      fecha: current,
      valor: parseFloat(currentValue),
    };
    return valueDto;
  }
}
