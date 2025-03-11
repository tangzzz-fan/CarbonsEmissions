import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsNumber, IsBoolean } from 'class-validator';

export class CreateMenuDto {
    @ApiProperty()
    @IsString()
    name: string;

    @ApiProperty({ required: false })
    @IsString()
    @IsOptional()
    path?: string;

    @ApiProperty({ required: false })
    @IsString()
    @IsOptional()
    component?: string;

    @ApiProperty({ required: false })
    @IsString()
    @IsOptional()
    icon?: string;

    @ApiProperty({ required: false, default: 0 })
    @IsNumber()
    @IsOptional()
    sort?: number;

    @ApiProperty({ required: false })
    @IsNumber()
    @IsOptional()
    parentId?: number;

    @ApiProperty({ required: false, default: true })
    @IsBoolean()
    @IsOptional()
    isActive?: boolean;
} 