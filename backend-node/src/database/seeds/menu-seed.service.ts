import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Menu } from '../../modules/menus/entities/menu.entity';

@Injectable()
export class MenuSeedService {
    constructor(
        @InjectRepository(Menu)
        private readonly menuRepository: Repository<Menu>,
    ) { }

    async seed(): Promise<void> {
        const count = await this.menuRepository.count();
        if (count > 0) {
            console.log('菜单数据已存在，跳过填充');
            return;
        }

        // 创建顶级菜单
        const dashboard = await this.menuRepository.save({
            name: '首页',
            path: '/dashboard',
            component: 'Layout',
            icon: 'dashboard',
            sort: 1,
        });

        const emissions = await this.menuRepository.save({
            name: '碳排放管理',
            path: '/emissions',
            component: 'Layout',
            icon: 'carbon',
            sort: 2,
        });

        const system = await this.menuRepository.save({
            name: '系统管理',
            path: '/system',
            component: 'Layout',
            icon: 'setting',
            sort: 3,
        });

        const profile = await this.menuRepository.save({
            name: '个人中心',
            path: '/profile',
            component: 'Layout',
            icon: 'user',
            sort: 4,
        });

        // 创建子菜单
        // Dashboard 子菜单
        await this.menuRepository.save([
            {
                name: '工作台',
                path: 'workplace',
                component: 'dashboard/workplace/index',
                icon: 'desktop',
                sort: 1,
                parent: dashboard,
            },
            {
                name: '数据分析',
                path: 'analysis',
                component: 'dashboard/analysis/index',
                icon: 'bar-chart',
                sort: 2,
                parent: dashboard,
            },
        ]);

        // 排放管理子菜单
        await this.menuRepository.save([
            {
                name: '排放记录',
                path: 'records',
                component: 'emissions/records/index',
                icon: 'file-text',
                sort: 1,
                parent: emissions,
            },
            {
                name: '数据统计',
                path: 'statistics',
                component: 'emissions/statistics/index',
                icon: 'pie-chart',
                sort: 2,
                parent: emissions,
            },
            {
                name: '排放预测',
                path: 'prediction',
                component: 'emissions/prediction/index',
                icon: 'line-chart',
                sort: 3,
                parent: emissions,
            },
        ]);

        // 系统管理子菜单
        await this.menuRepository.save([
            {
                name: '用户管理',
                path: 'users',
                component: 'system/users/index',
                icon: 'team',
                sort: 1,
                parent: system,
            },
            {
                name: '角色管理',
                path: 'roles',
                component: 'system/roles/index',
                icon: 'safety-certificate',
                sort: 2,
                parent: system,
            },
            {
                name: '权限管理',
                path: 'permissions',
                component: 'system/permissions/index',
                icon: 'key',
                sort: 3,
                parent: system,
            },
            {
                name: '菜单管理',
                path: 'menus',
                component: 'system/menus/index',
                icon: 'menu',
                sort: 4,
                parent: system,
            },
        ]);

        // 个人中心子菜单
        await this.menuRepository.save([
            {
                name: '个人设置',
                path: 'settings',
                component: 'profile/settings/index',
                icon: 'setting',
                sort: 1,
                parent: profile,
            },
        ]);

        console.log('已创建菜单数据');
    }
} 