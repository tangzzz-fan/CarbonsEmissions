import { Command, CommandRunner } from 'nest-commander';
import { Injectable, Logger } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { faker } from '@faker-js/faker';
import { User } from '../../modules/users/entities/user.entity';
import { Role } from '../../modules/roles/entities/role.entity';
import { Permission } from '../../modules/permissions/entities/permission.entity';
import { Menu } from '../../modules/menus/entities/menu.entity';
import { Option } from 'nest-commander';

@Injectable()
@Command({ name: 'seed', description: '填充测试数据到数据库' })
export class SeedCommand extends CommandRunner {
  private readonly logger = new Logger(SeedCommand.name);
  private readonly batchSize = 5; // 统一的批处理大小

  constructor(private dataSource: DataSource) {
    super();
    this.logger.log('SeedCommand initialized');
  }

  @Option({
    flags: '-c, --count <number>',
    description: '指定要生成的每种数据的数量'
  })
  parseCount(val: string): number {
    return parseInt(val, 10);
  }

  @Option({
    flags: '--clear',
    description: '在填充数据前清空现有数据'
  })
  parseClear(): boolean {
    return true;
  }

  async run(passedParams: string[], options?: { count?: number; clear?: boolean }): Promise<void> {
    this.logger.log('Starting seed command...');
    if (process.env.NODE_ENV === 'production') {
      this.logger.error('禁止在生产环境中运行数据填充!');
      return;
    }

    const count = options?.count || 10;
    const shouldClear = options?.clear || false;
    this.logger.log(`开始填充数据，每种类型生成 ${count} 条记录...`);

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      if (shouldClear) {
        this.logger.log('清空现有数据...');
        // 确保正确的删除顺序
        await queryRunner.manager.query('DROP TABLE IF EXISTS role_permissions CASCADE');
        await queryRunner.manager.query('DROP TABLE IF EXISTS role_menus CASCADE');
        await queryRunner.manager.query('DROP TABLE IF EXISTS user_roles CASCADE');
        await queryRunner.manager.query('TRUNCATE TABLE roles CASCADE');
        await queryRunner.manager.query('TRUNCATE TABLE permissions CASCADE');
        await queryRunner.manager.query('TRUNCATE TABLE menus CASCADE');
        await queryRunner.manager.query('TRUNCATE TABLE users CASCADE');
        this.logger.log('现有数据已清空');
      }

      // 创建权限 - 使用预定义的权限配置
      const permissionConfigs = [
        // 用户管理权限
        { name: '创建用户', code: 'USER_CREATE', description: '创建新用户的权限' },
        { name: '编辑用户', code: 'USER_EDIT', description: '编辑用户信息的权限' },
        { name: '删除用户', code: 'USER_DELETE', description: '删除用户的权限' },
        { name: '查看用户', code: 'USER_VIEW', description: '查看用户信息的权限' },
        // 角色管理权限
        { name: '创建角色', code: 'ROLE_CREATE', description: '创建新角色的权限' },
        { name: '编辑角色', code: 'ROLE_EDIT', description: '编辑角色信息的权限' },
        { name: '删除角色', code: 'ROLE_DELETE', description: '删除角色的权限' },
        { name: '查看角色', code: 'ROLE_VIEW', description: '查看角色信息的权限' },
        // 权限管理权限
        { name: '分配权限', code: 'PERMISSION_ASSIGN', description: '为角色分配权限的权限' },
        { name: '查看权限', code: 'PERMISSION_VIEW', description: '查看权限信息的权限' }
      ];

      // 生成额外的权限
      const resources = ['MENU', 'REPORT', 'SETTING', 'LOG', 'FILE', 'DASHBOARD', 'SYSTEM', 'AUDIT'];
      const actions = ['CREATE', 'READ', 'UPDATE', 'DELETE', 'EXPORT', 'IMPORT', 'APPROVE', 'REJECT'];

      const additionalPermissions = [];
      const usedCodes = new Set(permissionConfigs.map(p => p.code));

      // 生成额外的权限配置
      for (const resource of resources) {
        for (const action of actions) {
          const code = `${resource}_${action}`;
          if (!usedCodes.has(code)) {
            usedCodes.add(code);
            if (additionalPermissions.length < count * 2 - permissionConfigs.length) {
              additionalPermissions.push({
                name: `${resource.toLowerCase()} ${action.toLowerCase()}`,
                code,
                description: `Permission to ${action.toLowerCase()} ${resource.toLowerCase()}`,
                createdAt: new Date(),
                updatedAt: new Date()
              });
            }
          }
        }
      }

      // 分批插入权限数据
      for (let i = 0; i < permissionConfigs.length; i += this.batchSize) {
        const batch = permissionConfigs.slice(i, i + this.batchSize).map(config => ({
          ...config,
          createdAt: new Date(),
          updatedAt: new Date()
        }));

        try {
          await queryRunner.manager
            .getRepository(Permission)
            .createQueryBuilder()
            .insert()
            .values(batch)
            .execute();

          this.logger.log(`已插入预定义权限批次 ${i / this.batchSize + 1}`);
        } catch (error) {
          this.logger.error(`插入预定义权限批次 ${i / this.batchSize + 1} 失败:`, error);
          throw error;
        }
      }

      if (additionalPermissions.length > 0) {
        for (let i = 0; i < additionalPermissions.length; i += this.batchSize) {
          const batch = additionalPermissions.slice(i, i + this.batchSize);

          try {
            await queryRunner.manager
              .getRepository(Permission)
              .createQueryBuilder()
              .insert()
              .values(batch)
              .execute();

            this.logger.log(`已插入额外权限批次 ${i / this.batchSize + 1}`);
          } catch (error) {
            this.logger.error(`插入额外权限批次 ${i / this.batchSize + 1} 失败:`, error);
            throw error;
          }
        }
      }

      this.logger.log('已创建所有权限数据');

      // 创建角色 - 使用预定义的角色配置
      const roleConfigs = [
        { name: '超级管理员', code: 'SUPER_ADMIN', description: '系统超级管理员，拥有所有权限' },
        { name: '管理员', code: 'ADMIN', description: '系统管理员，负责日常运维管理' },
        { name: '运营', code: 'OPERATOR', description: '运营人员，负责内容运营和用户管理' },
        { name: '编辑', code: 'EDITOR', description: '内容编辑，负责内容编辑和审核' },
        { name: '访客', code: 'GUEST', description: '访客用户，具有基本的查看权限' }
      ];

      // 生成额外的角色（如果需要）
      const additionalRoles = Array.from({ length: Math.max(0, count - roleConfigs.length) }, (_, index) => {
        const timestamp = Date.now() + index;
        const roleName = `测试角色 ${index + 1}`;
        return {
          name: roleName,
          code: `TEST_ROLE_${timestamp}`,
          description: `测试用角色 ${index + 1}`,
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date()
        };
      });

      // 分批插入角色数据
      for (let i = 0; i < roleConfigs.length; i += this.batchSize) {
        const batch = roleConfigs.slice(i, i + this.batchSize).map(config => ({
          ...config,
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date()
        }));

        try {
          await queryRunner.manager
            .getRepository(Role)
            .createQueryBuilder()
            .insert()
            .values(batch)
            .execute();

          this.logger.log(`已插入预定义角色批次 ${i / this.batchSize + 1}`);
        } catch (error) {
          this.logger.error(`插入预定义角色批次 ${i / this.batchSize + 1} 失败:`, error);
          throw error;
        }
      }

      if (additionalRoles.length > 0) {
        for (let i = 0; i < additionalRoles.length; i += this.batchSize) {
          const batch = additionalRoles.slice(i, i + this.batchSize);

          try {
            await queryRunner.manager
              .getRepository(Role)
              .createQueryBuilder()
              .insert()
              .values(batch)
              .execute();

            this.logger.log(`已插入额外角色批次 ${i / this.batchSize + 1}`);
          } catch (error) {
            this.logger.error(`插入额外角色批次 ${i / this.batchSize + 1} 失败:`, error);
            throw error;
          }
        }
      }

      this.logger.log('已创建所有角色数据');

      // 修改菜单创建逻辑，使用分批插入
      const menuConfigs = [
        { name: '仪表盘', path: '/dashboard', icon: 'dashboard', sort: 1 },
        { name: '用户管理', path: '/users', icon: 'user', sort: 2 },
        { name: '角色管理', path: '/roles', icon: 'team', sort: 3 },
        { name: '权限管理', path: '/permissions', icon: 'safety', sort: 4 },
        { name: '菜单管理', path: '/menus', icon: 'menu', sort: 5 }
      ];

      const additionalMenus = Array.from({ length: Math.max(0, count - menuConfigs.length) }, (_, index) => {
        const timestamp = Date.now() + index;
        return {
          name: `测试菜单 ${index + 1}`,
          path: `/test-menu-${timestamp}`,
          icon: `icon-${faker.word.noun().toLowerCase()}`,
          sort: menuConfigs.length + index + 1,
          createdAt: new Date(),
          updatedAt: new Date()
        };
      });

      // 分批插入菜单
      for (let i = 0; i < menuConfigs.length; i += this.batchSize) {
        const batch = menuConfigs.slice(i, i + this.batchSize).map(config => ({
          ...config,
          createdAt: new Date(),
          updatedAt: new Date()
        }));

        await queryRunner.manager
          .getRepository(Menu)
          .createQueryBuilder()
          .insert()
          .values(batch)
          .execute();
      }

      if (additionalMenus.length > 0) {
        for (let i = 0; i < additionalMenus.length; i += this.batchSize) {
          const batch = additionalMenus.slice(i, i + this.batchSize);
          await queryRunner.manager
            .getRepository(Menu)
            .createQueryBuilder()
            .insert()
            .values(batch)
            .execute();
        }
      }

      this.logger.log('已创建菜单数据');

      // 修改用户创建逻辑，使用分批插入
      const users = Array.from({ length: count }, (_, index) => {
        const timestamp = Date.now() + index;
        return {
          username: `user${timestamp}`,
          email: `user${timestamp}@example.com`,
          password: 'password123',
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date()
        };
      });

      for (let i = 0; i < users.length; i += this.batchSize) {
        const batch = users.slice(i, i + this.batchSize);
        await queryRunner.manager
          .getRepository(User)
          .createQueryBuilder()
          .insert()
          .values(batch)
          .execute();
      }

      this.logger.log('已创建用户数据');

      // 提交事务
      await queryRunner.commitTransaction();
      this.logger.log('数据填充完成!');
    } catch (error) {
      await queryRunner.rollbackTransaction();
      this.logger.error('数据填充失败:', error instanceof Error ? error.stack : String(error));
      throw error;
    } finally {
      await queryRunner.release();
    }
  }
}