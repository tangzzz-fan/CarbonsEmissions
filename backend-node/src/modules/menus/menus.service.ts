import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Menu } from './entities/menu.entity';
import { CreateMenuDto } from './dto/create-menu.dto';
import { UpdateMenuDto } from './dto/update-menu.dto';

@Injectable()
export class MenusService {
    constructor(
        @InjectRepository(Menu)
        private menusRepository: Repository<Menu>,
    ) { }

    async create(createMenuDto: CreateMenuDto): Promise<Menu> {
        const menu = this.menusRepository.create(createMenuDto);
        return this.menusRepository.save(menu);
    }

    async findAll(): Promise<Menu[]> {
        return this.menusRepository.find({
            relations: ['parent', 'children'],
            order: {
                sort: 'ASC',
            },
        });
    }

    async findOne(id: number): Promise<Menu> {
        const menu = await this.menusRepository.findOne({
            where: { id },
            relations: ['parent', 'children'],
        });

        if (!menu) {
            throw new NotFoundException(`Menu with ID ${id} not found`);
        }

        return menu;
    }

    async getMenuTree(): Promise<Menu[]> {
        const allMenus = await this.menusRepository.find({
            relations: ['children'],
            order: {
                sort: 'ASC',
            },
        });

        // 过滤出顶级菜单（没有父菜单的菜单）
        return allMenus.filter(menu => !menu.parentId);
    }

    async getUserMenus(userId: number): Promise<Menu[]> {
        // 获取用户的菜单，这里需要通过用户的角色来获取
        const query = `
            SELECT DISTINCT m.*
            FROM menus m
            JOIN role_menus rm ON m.id = rm.menu_id
            JOIN user_roles ur ON rm.role_id = ur.role_id
            WHERE ur.user_id = $1 AND m.is_active = true
            ORDER BY m.sort ASC
        `;

        const menus: Partial<Menu>[] = await this.menusRepository.query(query, [userId]);

        // 构建菜单树
        const menuMap = new Map<number, Partial<Menu> & { children: Partial<Menu>[] }>();
        menus.forEach((menu: Partial<Menu>) => {
            if (menu.id !== undefined) {
                menuMap.set(menu.id, {
                    ...menu,
                    children: [],
                });
            }
        });

        const rootMenus: (Partial<Menu> & { children: Partial<Menu>[] })[] = [];
        menus.forEach((menu: Partial<Menu>) => {
            if (menu.id === undefined) return;
            
            const menuWithChildren = menuMap.get(menu.id);
            if (!menuWithChildren) return;

            if (menu.parentId && menuMap.has(menu.parentId)) {
                const parentMenu = menuMap.get(menu.parentId);
                if (parentMenu) {
                    parentMenu.children.push(menuWithChildren);
                }
            } else {
                rootMenus.push(menuWithChildren);
            }
        });

        return rootMenus as Menu[];
    }

    async update(id: number, updateMenuDto: UpdateMenuDto): Promise<Menu> {
        const menu = await this.findOne(id);
        Object.assign(menu, updateMenuDto);
        return this.menusRepository.save(menu);
    }

    async remove(id: number): Promise<void> {
        const menu = await this.findOne(id);
        await this.menusRepository.remove(menu);
    }
}