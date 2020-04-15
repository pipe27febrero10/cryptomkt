import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { PassportModule } from '@nestjs/passport';
import { UserModule } from '../user/user.module'
import { LocalStrategy } from './local.strategy';
import { JwtStrategy } from './jwt.strategy';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports : [PassportModule,UserModule,JwtModule.register({
    secret: 'Codebrains',
    signOptions: { expiresIn: 3600 },
  })],
  controllers: [AuthController],
  providers: [AuthService,LocalStrategy,JwtStrategy],
  exports : [AuthService,LocalStrategy,JwtStrategy]
})
export class AuthModule {}
