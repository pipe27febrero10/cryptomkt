import { Injectable, HttpService } from '@nestjs/common';
import { ValueDto } from './dto/value.dto'
import { apiUri } from './constants'

@Injectable()
export class LocalindicatorService {
    constructor(private readonly httpService : HttpService){}
    // get all indicators
    async getAll() : Promise<any>
    {
        let result : any  = null
        result  = await this.httpService.get(apiUri).toPromise()
        let data : any = result.data
        return data
    }

    // dolar observado
    async getUsdValueInClp() : Promise<ValueDto>
    {
        let result : any = null
        result = await this.getAll()
        const usdValueDto : ValueDto = result.dolar
        return usdValueDto
    }

    //current dolar
    async getUsdCurrentValueInClp() : Promise<any>
    {
        let result = await this.httpService.get(apiUri+'/dolar').toPromise()
        let dolarHistory = result.data
        let lastValue : number = Number(dolarHistory.serie[0].valor)
        return lastValue
    }

    async getUFValueInCLP() : Promise<ValueDto>
    {
        let result : any = null
        result = await this.getAll()
        let ufValueDto : ValueDto = result.uf
        return ufValueDto
    }

    async getUTMValueInCLP()
    {
        let result : any = null
        result = await this.getAll()
        let utmValueDto : ValueDto = result.utm
        return utmValueDto
    }


    async getUnemPloyment()
    {
        let result : any = null
        result = await this.getAll()
        let unemploymentDto : ValueDto = result.tasa_desempleo
        return unemploymentDto
    }
}
