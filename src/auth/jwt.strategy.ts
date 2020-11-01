import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserDto } from '@user/dto/user.dto';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: 'Codebrains',
    });
  }

  async validate(payload: any, done: Function) {
    const userDto : UserDto = await this.authService.validateUserToken(payload);
    if (!userDto) {
      return done(new UnauthorizedException(), false);
    }
    done(null, userDto);
  }
}