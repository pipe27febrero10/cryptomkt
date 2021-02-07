import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { EmailRequestDto } from './dtos/email-request.dto';
import { EmailResponseDto } from './dtos/email-response.dto';
import { MailService } from './mail.service';

@Controller('mail')
export class MailController {
  constructor(private readonly mailService: MailService){}
  @Post()
  @ApiTags('mail')
  async sendEmail(@Body() emailRequest: EmailRequestDto) : Promise<EmailResponseDto>
  {
    const emailSent = await this.mailService.sendMail(emailRequest);
    const emailResponse : EmailResponseDto= {
        message: emailSent ? 'Email sent successfully' : 'There was an error sending email',
        success: emailSent
    };
    return emailResponse;
  }
}
