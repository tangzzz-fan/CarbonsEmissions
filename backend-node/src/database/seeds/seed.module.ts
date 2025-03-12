import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SeedCommand } from './seed.command';
import { UserSeedService } from './user-seed.service';
import { EmissionSeedService } from './emission-seed.service';
import { RoleSeedService } from './role-seed.service';
import { PermissionSeedService } from './permission-seed.service';
import { MenuSeedService } from './menu-seed.service';
import configuration from '../../config/configuration';
import { User } from '../../modules/users/entities/user.entity';
import { Emission } from '../../modules/emissions/entities/emission.entity';
import { Role } from '../../modules/roles/entities/role.entity';
import { Permission } from '../../modules/permissions/entities/permission.entity';
import { Menu } from '../../modules/menus/entities/menu.entity';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            load: [configuration],
        }),
        TypeOrmModule.forRootAsync({
            imports: [ConfigModule],
            useFactory: (configService: ConfigService) => ({
                type: 'postgres',
                host: configService.get('database.host'),
                port: configService.get('database.port'),
                username: configService.get('database.username'),
                password: configService.get('database.password'),
                database: configService.get('database.database'),
                entities: [User, Emission, Role, Permission, Menu],
                synchronize: false,
            }),
            inject: [ConfigService],
        }),
        TypeOrmModule.forFeature([User, Emission, Role, Permission, Menu]),
    ],
    providers: [
        SeedCommand,
        UserSeedService,
        EmissionSeedService,
        RoleSeedService,
        PermissionSeedService,
        MenuSeedService,
    ],
})
export class SeedModule { } 