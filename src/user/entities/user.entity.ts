import { Entity, PrimaryGeneratedColumn, Column, BeforeInsert } from "typeorm";
import * as bcrypt from 'bcrypt'
import { UserDto } from '../dto/user.dto'

@Entity()
export class User{
    @PrimaryGeneratedColumn()
    id : string;
    @Column({nullable : false})
    firstName : string;
    @Column({nullable : false})
    lastName : string;
    @Column({nullable : false,unique : true})
    email : string;
    @Column({nullable :false})
    password : string;

    @BeforeInsert()
    async hashPassword()
    {
        this.password = await bcrypt.hash(this.password,10)
    }

    async comparePassword(attempt: string): Promise<Boolean> {
        return await bcrypt.compare(attempt, this.password);
    }

    toUserDto(user : User)  {
        const {id,firstName,lastName,email} = user
        let userDto : UserDto = {
            id,
            firstName,
            lastName,
            email
        }
        return userDto
     }
     
}