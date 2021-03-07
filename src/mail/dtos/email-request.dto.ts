import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class EmailRequestDto{
    @ApiProperty()
    to: string;
    @ApiProperty()
    from: string;
    @ApiProperty()
    subject: string;
    @ApiProperty()
    text: string;
    @ApiPropertyOptional()
    html?: string;
}