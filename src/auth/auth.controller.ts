import {
    Controller,
    UseGuards,
    HttpStatus,
    Response,
    Post,
    Body,
    HttpException,
  } from '@nestjs/common';

import { ApiTags } from '@nestjs/swagger'
import { AuthService } from './auth.service'
import { UserService } from '../user/user.service'
import { UserCreateDto } from '../user/dto/user-create.dto'
import { AuthGuard } from '@nestjs/passport';
import { LoginUserDto } from './dto/login-user.dto'
import { TokenResponse } from './interfaces/token-response.interface';
import { RegistrationStatus } from './interfaces/registration-status.interface';

@Controller('auth')
@ApiTags('Auth')
export class AuthController {
    constructor(
        private readonly authService: AuthService,
        private readonly userService: UserService,
      ) {}

      @Post('register')
      public async register(@Response() res, @Body() userCreateDto : UserCreateDto) : Promise<RegistrationStatus> {
        const registrationStatus : RegistrationStatus = await this.authService.register(userCreateDto);
        if (!registrationStatus.success) {
          throw(new HttpException("registration failed",HttpStatus.INTERNAL_SERVER_ERROR))
        }
        return registrationStatus
      }

  @UseGuards(AuthGuard('local'))
  @Post('login')
  public async login(@Response() res, @Body() login: LoginUserDto) : Promise<TokenResponse> {
    const user = await this.userService.findByEmail(login.email);
    if (!user) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: 'User Not Found',
      });
    } else {
      //debug('start getting the token');
      const token : TokenResponse = this.authService.createToken(user);
      //debug(token.accessToken);
      return res.status(HttpStatus.OK).json(token);
    }
  } 
}
