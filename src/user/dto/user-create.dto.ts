import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsEmail } from "class-validator"

export class UserCreateDto{
    @ApiProperty()
    @IsString()
    firstName : string;
    @ApiProperty()
    @IsString()
    lastName : string;
    @ApiProperty()
    @IsEmail()
    email : string;
    @ApiProperty()
    @IsString()
    password : string;
}