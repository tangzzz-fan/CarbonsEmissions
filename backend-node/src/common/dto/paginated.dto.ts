import { ApiProperty } from '@nestjs/swagger';

export class PaginatedDto<T> {
    @ApiProperty()
    total!: number;

    @ApiProperty()
    page!: number;

    @ApiProperty()
    limit!: number;

    @ApiProperty({ isArray: true })
    items!: T[];

    constructor(partial: Partial<PaginatedDto<T>>) {
        Object.assign(this, partial);
    }
} 