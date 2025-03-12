import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { faker } from '@faker-js/faker/locale/zh_CN';
import * as bcrypt from 'bcryptjs';
import { User } from '../../modules/users/entities/user.entity';
import { Role } from '../../modules/roles/entities/role.entity';

@Injectable()
export class UserSeedService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        @InjectRepository(Role)
        private readonly roleRepository: Repository<Role>,
    ) { }

    async seed(): Promise<void> {
        const count = await this.userRepository.count();
        if (count > 0) {
            console.log('用户数据已存在，跳过填充');
            return;
        }

        const adminRole = await this.roleRepository.findOne({ where: { name: 'admin' } });
        const userRole = await this.roleRepository.findOne({ where: { name: 'user' } });

        if (!adminRole || !userRole) {
            throw new Error('角色数据不存在，请先填充角色数据');
        }

        // 创建管理员用户
        const adminPassword = await bcrypt.hash('admin123', 10);
        const admin = this.userRepository.create({
            username: 'admin',
            email: 'admin@example.com',
            password: adminPassword,
            isActive: true,
            roles: [adminRole],
        });
        await this.userRepository.save(admin);
        console.log('已创建管理员用户');

        // 创建普通用户
        const userPassword = await bcrypt.hash('user123', 10);
        const user = this.userRepository.create({
            username: 'user',
            email: 'user@example.com',
            password: userPassword,
            isActive: true,
            roles: [userRole],
        });
        await this.userRepository.save(user);
        console.log('已创建普通用户');

        // 创建模拟用户
        const mockUsers = [];
        for (let i = 0; i < 20; i++) {
            const password = await bcrypt.hash('password123', 10);
            mockUsers.push({
                username: faker.internet.userName(),
                email: faker.internet.email(),
                password: password,
                isActive: faker.number.int({ min: 0, max: 100 }) < 90, // 90% 的用户是活跃的
                roles: [userRole],
            });
        }

        await this.userRepository.save(mockUsers);
        console.log(`已创建 ${mockUsers.length} 个模拟用户`);
    }
} 