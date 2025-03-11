import { Controller, Get, Post, Body, Put, Param, Delete, UseGuards } from '@nestjs/common';
import { PermissionsService } from './permissions.service';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../auth/guards/permissions.guard';
import { Permissions } from '../auth/decorators/permissions.decorator';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('permissions')
@Controller('permissions')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class PermissionsController {
    constructor(private readonly permissionsService: PermissionsService) { }

    @Post()
    @ApiOperation({ summary: '创建权限' })
    @Permissions('permission:create')
    create(@Body() createPermissionDto: CreatePermissionDto) {
        return this.permissionsService.create(createPermissionDto);
    }

    @Get()
    @ApiOperation({ summary: '获取所有权限' })
    @Permissions('permission:read')
    findAll() {
        return this.permissionsService.findAll();
    }

    @Get(':id')
    @ApiOperation({ summary: '获取指定权限' })
    @Permissions('permission:read')
    findOne(@Param('id') id: string) {
        return this.permissionsService.findOne(+id);
    }

    @Put(':id')
    @ApiOperation({ summary: '更新权限信息' })
    @Permissions('permission:update')
    update(@Param('id') id: string, @Body() updatePermissionDto: UpdatePermissionDto) {
        return this.permissionsService.update(+id, updatePermissionDto);
    }

    @Delete(':id')
    @ApiOperation({ summary: '删除权限' })
    @Permissions('permission:delete')
    remove(@Param('id') id: string) {
        return this.permissionsService.remove(+id);
    }
} 