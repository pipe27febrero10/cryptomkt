import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException, Logger } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserDto } from '../user/dto/user.dto'

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super({
      usernameField: 'email',
      passwordField: 'password',
    });
  }

  private readonly logger = new Logger(AuthService.name);

  async validate(username: string, password: string): Promise<UserDto> {
    const user = await this.authService.validateUser(username, password);
    this.logger.log(user);
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}