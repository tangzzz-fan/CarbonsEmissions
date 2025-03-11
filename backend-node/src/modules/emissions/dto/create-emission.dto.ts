import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString, IsDateString } from 'class-validator';

export class CreateEmissionDto {
    @ApiProperty()
    @IsNumber()
    value: number;

    @ApiProperty()
    @IsString()
    unit: string;

    @ApiProperty()
    @IsString()
    source: string;

    @ApiProperty()
    @IsDateString()
    measurementTime: string;
} 