import { Injectable } from '@nestjs/common';
import { EmailRequestDto } from './dtos/email-request.dto';
import * as sgMail from '@sendgrid/mail';
import { InjectRepository } from '@nestjs/typeorm';
import { Mail } from './entities/mail.entity';
import { Repository } from 'typeorm';
import moment = require('moment');


@Injectable()
export class MailService {
    constructor(@InjectRepository(Mail) private mailRepository : Repository<Mail>){
        sgMail.setApiKey(process.env.SENDGRID_API_KEY)
    }

    async getByEmail(email : string, timestampOrder: 'ASC'| 'DESC') : Promise<Mail[]>
    {
        const mails = await this.mailRepository.find({where: {to: email},order: {timestamp: timestampOrder}})
        return mails
    }

    async sendMail(emailRequestDto : EmailRequestDto) : Promise<boolean>
    {
        const {to, from, subject, text, html } = emailRequestDto
        const currentDate : string = moment().utc().format();

        const mail : Mail = this.mailRepository.create({
            to,
            from,
            subject,
            text,
            html,
            timestamp: currentDate
        })

        try
        {
            await sgMail.send(emailRequestDto)
            mail.emailSend = true
            await this.mailRepository.save(mail).catch(err => console.log(`error by sending email ${err}`))
        }
        catch(err)
        {
            console.log(err)
            mail.emailSend = false
            await this.mailRepository.save(mail).catch(err => console.log(`error by sending email ${err}`))
            return false
        }
        return true
    }
}
