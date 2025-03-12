import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { faker } from '@faker-js/faker/locale/zh_CN';
import { Emission } from '../../modules/emissions/entities/emission.entity';
import { User } from '../../modules/users/entities/user.entity';

@Injectable()
export class EmissionSeedService {
    constructor(
        @InjectRepository(Emission)
        private readonly emissionRepository: Repository<Emission>,
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
    ) { }

    async seed(): Promise<void> {
        const count = await this.emissionRepository.count();
        if (count > 0) {
            console.log('排放数据已存在，跳过填充');
            return;
        }

        const users = await this.userRepository.find();
        if (users.length === 0) {
            throw new Error('用户数据不存在，请先填充用户数据');
        }

        const emissionSources = [
            '工厂生产', '交通运输', '建筑能耗', '农业活动', '废物处理',
            '电力生产', '供暖', '工业过程', '商业活动', '居民生活'
        ];

        const emissionUnits = ['吨CO2', 'kg CO2', 'g CO2'];

        const mockEmissions = [];
        // 为每个用户创建多条排放记录
        for (const user of users) {
            const recordCount = faker.number.int({ min: 5, max: 15 });

            for (let i = 0; i < recordCount; i++) {
                // 创建过去一年内的记录
                const measurementTime = faker.date.past({ years: 1 });

                // 使用兼容的方式生成浮点数
                const value = parseFloat((faker.number.float({ min: 0.1, max: 1000, fractionDigits: 2 })).toFixed(2));

                mockEmissions.push({
                    value,
                    unit: faker.helpers.arrayElement(emissionUnits),
                    source: faker.helpers.arrayElement(emissionSources),
                    measurementTime,
                    user,
                });
            }
        }

        await this.emissionRepository.save(mockEmissions);
        console.log(`已创建 ${mockEmissions.length} 条模拟排放数据`);
    }
} 