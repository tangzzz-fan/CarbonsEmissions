import { Controller, Get, Post, Body, Put, Param, Delete, UseGuards, Query } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../auth/guards/permissions.guard';
import { Permissions } from '../auth/decorators/permissions.decorator';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';

@ApiTags('users')
@Controller('users')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class UsersController {
    constructor(private readonly usersService: UsersService) { }

    @Post()
    @ApiOperation({ summary: '创建用户' })
    @Permissions('user:create')
    create(@Body() createUserDto: CreateUserDto) {
        return this.usersService.create(createUserDto);
    }

    @Get()
    @ApiOperation({ summary: '获取所有用户' })
    @ApiQuery({ name: 'username', required: false })
    @ApiQuery({ name: 'email', required: false })
    @Permissions('user:read')
    findAll(@Query('username') username?: string, @Query('email') email?: string) {
        return this.usersService.findAll();
    }

    @Get(':id')
    @ApiOperation({ summary: '获取指定用户' })
    @Permissions('user:read')
    findOne(@Param('id') id: string) {
        return this.usersService.findOne(+id);
    }

    @Put(':id')
    @ApiOperation({ summary: '更新用户信息' })
    @Permissions('user:update')
    update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
        return this.usersService.update(+id, updateUserDto);
    }

    @Post(':id/reset-password')
    @ApiOperation({ summary: '重置用户密码' })
    @Permissions('user:update')
    resetPassword(@Param('id') id: string) {
        return this.usersService.resetPassword(+id);
    }

    @Delete(':id')
    @ApiOperation({ summary: '删除用户' })
    @Permissions('user:delete')
    remove(@Param('id') id: string) {
        return this.usersService.remove(+id);
    }
} 