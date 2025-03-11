import { Controller, Get, Post, Body, Put, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { MenusService } from './menus.service';
import { CreateMenuDto } from './dto/create-menu.dto';
import { UpdateMenuDto } from './dto/update-menu.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../auth/guards/permissions.guard';
import { Permissions } from '../auth/decorators/permissions.decorator';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

interface RequestWithUser extends Request {
    user: {
        userId: number;
        email: string;
    };
}

@ApiTags('menus')
@Controller('menus')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class MenusController {
    constructor(private readonly menusService: MenusService) { }

    @Post()
    @ApiOperation({ summary: '创建菜单' })
    @Permissions('menu:create')
    create(@Body() createMenuDto: CreateMenuDto) {
        return this.menusService.create(createMenuDto);
    }

    @Get()
    @ApiOperation({ summary: '获取所有菜单' })
    @Permissions('menu:read')
    findAll() {
        return this.menusService.findAll();
    }

    @Get('tree')
    @ApiOperation({ summary: '获取菜单树' })
    @Permissions('menu:read')
    getMenuTree() {
        return this.menusService.getMenuTree();
    }

    @Get('user-menus')
    @ApiOperation({ summary: '获取当前用户的菜单' })
    getUserMenus(@Request() req: RequestWithUser) {
        return this.menusService.getUserMenus(req.user.userId);
    }

    @Get(':id')
    @ApiOperation({ summary: '获取指定菜单' })
    @Permissions('menu:read')
    findOne(@Param('id') id: string) {
        return this.menusService.findOne(+id);
    }

    @Put(':id')
    @ApiOperation({ summary: '更新菜单信息' })
    @Permissions('menu:update')
    update(@Param('id') id: string, @Body() updateMenuDto: UpdateMenuDto) {
        return this.menusService.update(+id, updateMenuDto);
    }

    @Delete(':id')
    @ApiOperation({ summary: '删除菜单' })
    @Permissions('menu:delete')
    remove(@Param('id') id: string) {
        return this.menusService.remove(+id);
    }
} 