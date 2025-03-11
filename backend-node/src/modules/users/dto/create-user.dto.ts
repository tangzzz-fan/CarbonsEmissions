import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEmail, MinLength, IsArray, IsNumber, IsOptional } from 'class-validator';

export class CreateUserDto {
    @ApiProperty()
    @IsString()
    username: string;

    @ApiProperty()
    @IsEmail()
    email: string;

    @ApiProperty()
    @IsString()
    @MinLength(6)
    password: string;

    @ApiProperty({ type: [Number], required: false })
    @IsArray()
    @IsNumber({}, { each: true })
    @IsOptional()
    roleIds?: number[];
} 