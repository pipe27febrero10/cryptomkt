import { Controller, Get, Post, Body, HttpCode } from '@nestjs/common';
import { UserDto } from './dto/user.dto';
import { UserCreateDto } from './dto/user-create.dto'
import { UserService } from './user.service';
import { User } from './entities/user.entity'
import { toUserDto } from './mapper'
import { ApiTags } from '@nestjs/swagger'

@ApiTags('Users')
@Controller('users')
export class UserController {
    constructor(private readonly userService : UserService){}
    @Get()
    async findAll() : Promise<UserDto[]>
    {
        const users : User[] = await this.userService.getAll()
        const usersDto : UserDto[] = users.map(user => toUserDto(user))
        return usersDto
    }

    @Post()
    @HttpCode(201)
    async create(@Body() payload : UserCreateDto) : Promise<UserDto>
    {
        const user : User = await this.userService.create(payload)
        const userDto = toUserDto(user)
        return userDto
    }


   
}
