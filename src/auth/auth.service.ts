import * as jwt from 'jsonwebtoken';
import { Injectable, Logger } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { User } from '../user/entities/user.entity';
import { UserDto } from '../user/dto/user.dto';
import { debug } from 'console';
import { RegistrationStatus } from './interfaces/registration-status.interface';
import { UserCreateDto } from '../user/dto/user-create.dto';


@Injectable()
export class AuthService {
    constructor(private readonly usersService: UserService) {}

    private readonly logger = new Logger(AuthService.name);
    
    async register(user: UserCreateDto) {
      let status: RegistrationStatus = {
        success: true,
        message: 'user register',
      };
      try {
        await this.usersService.create(user);
      } catch (err) {
        //debug(err);
        status = { success: false, message: err };
      }
      return status;
    }
    createToken(user: User) {
      //debug('get the expiration');
      const expiresIn = 3600;
      //debug('sign the token');
      //debug(user);
  
      const accessToken = jwt.sign(
        {
          id: user.id,
          email: user.email,
          firstname: user.firstName,
          lastname: user.lastName,
        },
        'Codebrains',
        { expiresIn },
      );
      //debug('return the token');
      //debug(accessToken);
      return {
        expiresIn,
        accessToken,
      };
    }
  
    async validateUserToken(payload: JwtPayload): Promise<User> {
      return await this.usersService.findById(payload.id);
    }

    async validateUser(email: string, password: string): Promise<UserDto> {
      const user = await this.usersService.findByEmail(email);
      if (user && user.comparePassword(password)) {
        this.logger.log('password check success');
        const { password, ...result } = user;
        return result;
      }
      return null;
    }
}
