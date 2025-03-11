import { Controller, Get, Post, Body, Put, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { EmissionsService } from './emissions.service';
import { CreateEmissionDto } from './dto/create-emission.dto';
import { UpdateEmissionDto } from './dto/update-emission.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

interface RequestWithUser extends Request {
    user: {
        userId: number;
        email: string;
    };
}

@ApiTags('emissions')
@Controller('emissions')
@UseGuards(JwtAuthGuard)
export class EmissionsController {
    constructor(private readonly emissionsService: EmissionsService) { }

    @Post()
    @ApiOperation({ summary: '创建排放记录' })
    create(@Request() req: RequestWithUser, @Body() createEmissionDto: CreateEmissionDto) {
        return this.emissionsService.create(createEmissionDto, req.user.userId);
    }

    @Get()
    @ApiOperation({ summary: '获取所有排放记录' })
    findAll() {
        return this.emissionsService.findAll();
    }

    @Get(':id')
    @ApiOperation({ summary: '获取指定排放记录' })
    findOne(@Param('id') id: string) {
        return this.emissionsService.findOne(+id);
    }

    @Put(':id')
    @ApiOperation({ summary: '更新排放记录' })
    update(@Param('id') id: string, @Body() updateEmissionDto: UpdateEmissionDto) {
        return this.emissionsService.update(+id, updateEmissionDto);
    }

    @Delete(':id')
    @ApiOperation({ summary: '删除排放记录' })
    remove(@Param('id') id: string) {
        return this.emissionsService.remove(+id);
    }

    @Post('predict')
    @ApiOperation({ summary: '预测排放量' })
    predict(@Body() data: any) {
        return this.emissionsService.predict(data);
    }
} 