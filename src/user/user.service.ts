import { Injectable, Inject } from '@nestjs/common';
import { User } from './entities/user.entity'
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm'
import { UserCreateDto } from './dto/user-create.dto'

@Injectable()
export class UserService {
    constructor(@InjectRepository(User) private userRepository : Repository<User>) {}

    async getAll() : Promise<User[]> {
        let users : User[] = await this.userRepository.find()
        return users
    }

    async findById(id: string) : Promise<User>
    {
       let user : User = await this.userRepository.findOne(id)
       return user
    }

    async findByEmail(email: string) : Promise<User>
    {
        let user : User = await this.userRepository.findOne({email : email})
        return user
    }

    async create(userCreateDto : UserCreateDto) : Promise<User>{
        let {firstName,lastName,password,email} = userCreateDto
        let user : User = this.userRepository.create({firstName,lastName,password,email})
        await this.userRepository.save(user)
        return user
    }
}
