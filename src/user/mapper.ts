import { User } from './entities/user.entity'
import { UserDto } from './dto/user.dto'

export const toUserDto = (user : User) => {
   const {id,firstName,lastName,email} = user
   let userDto : UserDto = {
       id,
       firstName,
       lastName,
       email
   }
   return userDto
}


