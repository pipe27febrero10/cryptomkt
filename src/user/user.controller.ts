import { Controller, Get, Post, Body, HttpException, UseGuards } from '@nestjs/common';
import { UserDto } from './dto/user.dto';
import { UserCreateDto } from './dto/user-create.dto'
import { UserService } from './user.service';
import { User } from './entities/user.entity'
import { toUserDto } from './mapper'
import { ApiTags } from '@nestjs/swagger'
import { AuthGuard } from '@nestjs/passport';

@ApiTags('users')
@Controller('users')
export class UserController {
    constructor(private readonly userService : UserService){}
    @UseGuards(AuthGuard('jwt'))
    @Get()
    async findAll() : Promise<UserDto[]>
    {
        let users : User[] = await this.userService.getAll()
        let usersDto : UserDto[] = users.map(user => toUserDto(user))
        return usersDto
    }

    @Post()
    async create(@Body() payload : UserCreateDto) : Promise<UserDto>
    {
        const user : User = await this.userService.create(payload)
        const userDto = toUserDto(user)
        return userDto
    }
}
