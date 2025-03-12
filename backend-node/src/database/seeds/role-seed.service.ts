import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Role } from '../../modules/roles/entities/role.entity';
import { Permission } from '../../modules/permissions/entities/permission.entity';
import { Menu } from '../../modules/menus/entities/menu.entity';

@Injectable()
export class RoleSeedService {
    constructor(
        @InjectRepository(Role)
        private readonly roleRepository: Repository<Role>,
        @InjectRepository(Permission)
        private readonly permissionRepository: Repository<Permission>,
        @InjectRepository(Menu)
        private readonly menuRepository: Repository<Menu>,
    ) { }

    async seed(): Promise<void> {
        const count = await this.roleRepository.count();
        if (count > 0) {
            console.log('角色数据已存在，跳过填充');
            return;
        }

        const permissions = await this.permissionRepository.find();
        if (permissions.length === 0) {
            throw new Error('权限数据不存在，请先填充权限数据');
        }

        const menus = await this.menuRepository.find();
        if (menus.length === 0) {
            throw new Error('菜单数据不存在，请先填充菜单数据');
        }

        // 创建管理员角色
        const adminRole = this.roleRepository.create({
            name: 'admin',
            code: 'ADMIN',
            description: '系统管理员',
            isActive: true,
            permissions: permissions, // 所有权限
            menus: menus, // 所有菜单
        });
        await this.roleRepository.save(adminRole);
        console.log('已创建管理员角色');

        // 创建普通用户角色
        const userPermissions = permissions.filter(p =>
            p.code.startsWith('emission:') || p.code === 'user:read' || p.code === 'role:read'
        );

        const userMenus = menus.filter(m =>
            m.name === '首页' || m.name === '碳排放管理' || m.name === '个人中心'
        );

        const userRole = this.roleRepository.create({
            name: 'user',
            code: 'USER',
            description: '普通用户',
            isActive: true,
            permissions: userPermissions,
            menus: userMenus,
        });
        await this.roleRepository.save(userRole);
        console.log('已创建普通用户角色');

        // 创建只读角色
        const readOnlyPermissions = permissions.filter(p => p.code.endsWith(':read'));
        const readOnlyMenus = menus.filter(m => m.name !== '系统管理');

        const readOnlyRole = this.roleRepository.create({
            name: 'readonly',
            code: 'READONLY',
            description: '只读用户',
            isActive: true,
            permissions: readOnlyPermissions,
            menus: readOnlyMenus,
        });
        await this.roleRepository.save(readOnlyRole);
        console.log('已创建只读角色');
    }
} 