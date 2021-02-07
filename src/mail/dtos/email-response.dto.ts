import { ApiProperty } from "@nestjs/swagger";

export class EmailResponseDto{
    @ApiProperty()
    success: boolean;
    @ApiProperty()
    message: string;
}