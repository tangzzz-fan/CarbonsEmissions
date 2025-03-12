import { Command, CommandRunner } from 'nest-commander';
import { UserSeedService } from './user-seed.service';
import { EmissionSeedService } from './emission-seed.service';
import { RoleSeedService } from './role-seed.service';
import { PermissionSeedService } from './permission-seed.service';
import { MenuSeedService } from './menu-seed.service';

@Command({ name: 'seed', description: '填充数据库种子数据' })
export class SeedCommand extends CommandRunner {
    constructor(
        private readonly userSeedService: UserSeedService,
        private readonly emissionSeedService: EmissionSeedService,
        private readonly roleSeedService: RoleSeedService,
        private readonly permissionSeedService: PermissionSeedService,
        private readonly menuSeedService: MenuSeedService,
    ) {
        super();
    }

    async run(): Promise<void> {
        try {
            console.log('开始填充种子数据...');

            // 按顺序填充数据
            await this.permissionSeedService.seed();
            await this.menuSeedService.seed();
            await this.roleSeedService.seed();
            await this.userSeedService.seed();
            await this.emissionSeedService.seed();

            console.log('种子数据填充完成！');
        } catch (error) {
            console.error('填充种子数据时出错:', error);
            throw error;
        }
    }
} 