import {
    Controller,
    UseGuards,
    HttpStatus,
    Response,
    Request,
    Get,
    Post,
    Body,
    Put,
    Param,
    Delete,
  } from '@nestjs/common';

import { ApiTags } from '@nestjs/swagger'
import { AuthService } from './auth.service'
import { UserService } from '../user/user.service'
import { UserCreateDto } from '../user/dto/user-create.dto'
import { AuthGuard } from '@nestjs/passport';
import { LoginUserDto } from './dto/login-user.dto'
import { RolesGuard } from './roles.guard'
import { Roles } from './roles.decorator';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
    constructor(
        private readonly authService: AuthService,
        private readonly userService: UserService,
      ) {}

      @Post('register')
      public async register(@Response() res, @Body() userCreateDto : UserCreateDto) {
        const result = await this.authService.register(userCreateDto);
        if (!result.success) {
          return res.status(HttpStatus.BAD_REQUEST).json(result);
        }
        return res.status(HttpStatus.OK).json(result);
      }

  @UseGuards(AuthGuard('local'))
  @Post('login')
  public async login(@Response() res, @Body() login: LoginUserDto) {
    const user = await this.userService.findByEmail(login.email);
    if (!user) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: 'User Not Found',
      });
    } else {
      //debug('start getting the token');
      const token = this.authService.createToken(user);
      //debug(token.accessToken);
      return res.status(HttpStatus.OK).json(token);
    }
  }
  @Get('test')
  @Roles('pipe27febrero30@hotmail.com')
  @UseGuards(AuthGuard('jwt'),RolesGuard)
  public test(@Response() res,@Request() req)
  {
    console.log("tercero")
    return res.status(200).send("hello world")
  }

    
}
