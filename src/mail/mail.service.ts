import { Injectable } from '@nestjs/common';
import { EmailRequestDto } from './dtos/email-request.dto';
import * as sgMail from '@sendgrid/mail';


@Injectable()
export class MailService {
    constructor(){
        sgMail.setApiKey(process.env.SENDGRID_API_KEY)
    }

    async sendMail(emailRequestDto : EmailRequestDto) : Promise<boolean>
    {
        try
        {
            await sgMail.send(emailRequestDto)
        }
        catch(err)
        {
            console.log(err)
            return false
        }
        return true
    }
}
