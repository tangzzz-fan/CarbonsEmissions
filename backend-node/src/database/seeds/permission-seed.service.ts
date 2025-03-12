import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Permission } from '../../modules/permissions/entities/permission.entity';

@Injectable()
export class PermissionSeedService {
    constructor(
        @InjectRepository(Permission)
        private readonly permissionRepository: Repository<Permission>,
    ) { }

    async seed(): Promise<void> {
        const count = await this.permissionRepository.count();
        if (count > 0) {
            console.log('权限数据已存在，跳过填充');
            return;
        }

        const permissionsData = [
            // 用户权限
            { code: 'user:create', name: '创建用户', description: '允许创建新用户' },
            { code: 'user:read', name: '查看用户', description: '允许查看用户信息' },
            { code: 'user:update', name: '更新用户', description: '允许更新用户信息' },
            { code: 'user:delete', name: '删除用户', description: '允许删除用户' },

            // 角色权限
            { code: 'role:create', name: '创建角色', description: '允许创建新角色' },
            { code: 'role:read', name: '查看角色', description: '允许查看角色信息' },
            { code: 'role:update', name: '更新角色', description: '允许更新角色信息' },
            { code: 'role:delete', name: '删除角色', description: '允许删除角色' },

            // 权限管理
            { code: 'permission:create', name: '创建权限', description: '允许创建新权限' },
            { code: 'permission:read', name: '查看权限', description: '允许查看权限信息' },
            { code: 'permission:update', name: '更新权限', description: '允许更新权限信息' },
            { code: 'permission:delete', name: '删除权限', description: '允许删除权限' },

            // 菜单管理
            { code: 'menu:create', name: '创建菜单', description: '允许创建新菜单' },
            { code: 'menu:read', name: '查看菜单', description: '允许查看菜单信息' },
            { code: 'menu:update', name: '更新菜单', description: '允许更新菜单信息' },
            { code: 'menu:delete', name: '删除菜单', description: '允许删除菜单' },

            // 排放管理
            { code: 'emission:create', name: '创建排放记录', description: '允许创建新排放记录' },
            { code: 'emission:read', name: '查看排放记录', description: '允许查看排放记录' },
            { code: 'emission:update', name: '更新排放记录', description: '允许更新排放记录' },
            { code: 'emission:delete', name: '删除排放记录', description: '允许删除排放记录' },
            { code: 'emission:predict', name: '排放预测', description: '允许使用排放预测功能' },

            // 系统管理
            { code: 'system:config', name: '系统配置', description: '允许修改系统配置' },
            { code: 'system:log', name: '系统日志', description: '允许查看系统日志' },
            { code: 'system:backup', name: '系统备份', description: '允许执行系统备份' },
        ];

        await this.permissionRepository.save(permissionsData);
        console.log(`已创建 ${permissionsData.length} 条权限数据`);
    }
} 