import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config'

@Injectable()
export class ConfigurationService {
    constructor(private readonly configService : ConfigService){}

    getPortMysql() : number
    {
        const port : number = parseInt(this.configService.get<string>("PORT_MYSQL"))   
        return port
    }

    getUsernameMysql() : string
    {
        const username : string = this.configService.get<string>("USERNAME_MYSQL") 
        return username
    }

    getPasswordMysql() : string
    {
        const password : string = this.configService.get<string>("PASSWORD_MYSQL")
        return password
    }

    getDatabaseMysql() : string
    {
        const database : string = this.configService.get<string>("DATABASE_MYSQL")
        return database
    }
    getHostMysql() : string
    {
        const host : string = this.configService.get<string>("HOST_MYSQL")
        return host
    }

    getOpenExchangeApiKey() : string
    {
        const openExchangeApiKey : string = this.configService.get<string>("OPEN_EXCHANGE_API_KEY")
        return openExchangeApiKey
    }
}
