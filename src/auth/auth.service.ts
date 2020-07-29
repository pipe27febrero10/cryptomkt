import * as jwt from 'jsonwebtoken';
import { Injectable, Logger } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { User } from '../user/entities/user.entity';
import { UserDto } from '../user/dto/user.dto';
import { debug } from 'console';
import { RegistrationStatus } from './interfaces/registration-status.interface';
import { UserCreateDto } from '../user/dto/user-create.dto';
import { TokenResponse } from './interfaces/token-response.interface';
import { toUserDto } from '@user/mapper';


@Injectable()
export class AuthService {
    constructor(private readonly usersService: UserService) {}

    private readonly logger = new Logger(AuthService.name);
    
    async register(user: UserCreateDto) : Promise<RegistrationStatus>{
      let status: RegistrationStatus = {
        success: true,
        message: 'user register successfully',
      };
      try {
        await this.usersService.create(user);
      } catch (err) {
        status = { success: false, message: err };
      }
      return status;
    }

    createToken(user: User) : TokenResponse{
      const expiresIn = 3600;
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
      const tokenResponse : TokenResponse = {
        expiresIn,
        accessToken
      }
      return tokenResponse;
    }
  
    async validateUserToken(payload: JwtPayload): Promise<UserDto> {
      const user : User = await this.usersService.findById(payload.id)
      const userDto : UserDto = toUserDto(user)
      return userDto
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
