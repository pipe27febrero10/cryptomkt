import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Observable } from 'rxjs';
import { Reflector } from '@nestjs/core';
import { JwtPayload } from './interfaces/jwt-payload.interface';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector : Reflector){}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const roles = this.reflector.get<string[]>('roles', context.getHandler());
    if(!roles)
    {
        return true
    }
   
    const req = context.switchToHttp().getRequest();
    const user : JwtPayload = req.user 
    let found = roles.find(role => role === user.email)
    if(!found)
    {
        return false
    }

    return true
   
  }
}
