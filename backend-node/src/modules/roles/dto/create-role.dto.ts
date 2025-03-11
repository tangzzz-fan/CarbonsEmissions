import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsArray, IsNumber } from 'class-validator';

export class CreateRoleDto {
    @ApiProperty()
    @IsString()
    name: string;

    @ApiProperty({ required: false })
    @IsString()
    @IsOptional()
    description?: string;

    @ApiProperty({ type: [Number], required: false })
    @IsArray()
    @IsNumber({}, { each: true })
    @IsOptional()
    permissionIds?: number[];

    @ApiProperty({ type: [Number], required: false })
    @IsArray()
    @IsNumber({}, { each: true })
    @IsOptional()
    menuIds?: number[];
} 