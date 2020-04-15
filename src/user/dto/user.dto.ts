import { ApiProperty } from "@nestjs/swagger";

export class UserDto{
    @ApiProperty()
    id : string;
    @ApiProperty()
    firstName : string;
    @ApiProperty()
    lastName : string;
    @ApiProperty()
    email : string;
}