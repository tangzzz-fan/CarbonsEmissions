import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateRbacTables1703123456790 implements MigrationInterface {
    name = 'CreateRbacTables1703123456790'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // 创建角色表
        await queryRunner.query(`
            CREATE TABLE "roles" (
                "id" SERIAL PRIMARY KEY,
                "name" VARCHAR UNIQUE NOT NULL,
                "description" VARCHAR,
                "isActive" BOOLEAN DEFAULT true,
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now()
            )
        `);

        // 创建权限表
        await queryRunner.query(`
            CREATE TABLE "permissions" (
                "id" SERIAL PRIMARY KEY,
                "code" VARCHAR UNIQUE NOT NULL,
                "name" VARCHAR NOT NULL,
                "description" VARCHAR,
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now()
            )
        `);

        // 创建菜单表
        await queryRunner.query(`
            CREATE TABLE "menus" (
                "id" SERIAL PRIMARY KEY,
                "name" VARCHAR NOT NULL,
                "path" VARCHAR,
                "component" VARCHAR,
                "icon" VARCHAR,
                "sort" INTEGER DEFAULT 0,
                "parentId" INTEGER,
                "isActive" BOOLEAN DEFAULT true,
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "FK_menus_parentId" FOREIGN KEY ("parentId") REFERENCES "menus"("id") ON DELETE SET NULL
            )
        `);

        // 创建用户角色关联表
        await queryRunner.query(`
            CREATE TABLE "user_roles" (
                "user_id" INTEGER NOT NULL,
                "role_id" INTEGER NOT NULL,
                PRIMARY KEY ("user_id", "role_id"),
                CONSTRAINT "FK_user_roles_user_id" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE,
                CONSTRAINT "FK_user_roles_role_id" FOREIGN KEY ("role_id") REFERENCES "roles"("id") ON DELETE CASCADE
            )
        `);

        // 创建角色权限关联表
        await queryRunner.query(`
            CREATE TABLE "role_permissions" (
                "role_id" INTEGER NOT NULL,
                "permission_id" INTEGER NOT NULL,
                PRIMARY KEY ("role_id", "permission_id"),
                CONSTRAINT "FK_role_permissions_role_id" FOREIGN KEY ("role_id") REFERENCES "roles"("id") ON DELETE CASCADE,
                CONSTRAINT "FK_role_permissions_permission_id" FOREIGN KEY ("permission_id") REFERENCES "permissions"("id") ON DELETE CASCADE
            )
        `);

        // 创建角色菜单关联表
        await queryRunner.query(`
            CREATE TABLE "role_menus" (
                "role_id" INTEGER NOT NULL,
                "menu_id" INTEGER NOT NULL,
                PRIMARY KEY ("role_id", "menu_id"),
                CONSTRAINT "FK_role_menus_role_id" FOREIGN KEY ("role_id") REFERENCES "roles"("id") ON DELETE CASCADE,
                CONSTRAINT "FK_role_menus_menu_id" FOREIGN KEY ("menu_id") REFERENCES "menus"("id") ON DELETE CASCADE
            )
        `);

        // 插入初始数据
        await queryRunner.query(`
            INSERT INTO "roles" ("name", "description") VALUES 
            ('admin', '系统管理员'),
            ('user', '普通用户')
        `);

        await queryRunner.query(`
            INSERT INTO "permissions" ("code", "name", "description") VALUES 
            ('user:create', '创建用户', '允许创建新用户'),
            ('user:read', '查看用户', '允许查看用户信息'),
            ('user:update', '更新用户', '允许更新用户信息'),
            ('user:delete', '删除用户', '允许删除用户'),
            ('role:create', '创建角色', '允许创建新角色'),
            ('role:read', '查看角色', '允许查看角色信息'),
            ('role:update', '更新角色', '允许更新角色信息'),
            ('role:delete', '删除角色', '允许删除角色')
        `);

        await queryRunner.query(`
            INSERT INTO "menus" ("name", "path", "component", "icon", "sort") VALUES 
            ('系统管理', '/system', 'Layout', 'setting', 1)
        `);

        await queryRunner.query(`
            INSERT INTO "menus" ("name", "path", "component", "icon", "sort", "parentId") VALUES 
            ('用户管理', 'users', 'system/users/index', 'user', 1, 1),
            ('角色管理', 'roles', 'system/roles/index', 'team', 2, 1)
        `);

        // 为admin角色分配所有权限
        await queryRunner.query(`
            INSERT INTO "role_permissions" ("role_id", "permission_id")
            SELECT 1, id FROM "permissions"
        `);

        // 为admin角色分配所有菜单
        await queryRunner.query(`
            INSERT INTO "role_menus" ("role_id", "menu_id")
            SELECT 1, id FROM "menus"
        `);

        // 为user角色分配基本权限
        await queryRunner.query(`
            INSERT INTO "role_permissions" ("role_id", "permission_id")
            SELECT 2, id FROM "permissions" WHERE "code" IN ('user:read', 'role:read')
        `);

        // 为user角色分配基本菜单
        await queryRunner.query(`
            INSERT INTO "role_menus" ("role_id", "menu_id")
            SELECT 2, id FROM "menus" WHERE "name" IN ('系统管理', '用户管理')
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "role_menus"`);
        await queryRunner.query(`DROP TABLE "role_permissions"`);
        await queryRunner.query(`DROP TABLE "user_roles"`);
        await queryRunner.query(`DROP TABLE "menus"`);
        await queryRunner.query(`DROP TABLE "permissions"`);
        await queryRunner.query(`DROP TABLE "roles"`);
    }
} 