import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Role } from './entities/role.entity';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { Permission } from '../permissions/entities/permission.entity';
import { Menu } from '../menus/entities/menu.entity';

@Injectable()
export class RolesService {
    constructor(
        @InjectRepository(Role)
        private rolesRepository: Repository<Role>,
        @InjectRepository(Permission)
        private permissionsRepository: Repository<Permission>,
        @InjectRepository(Menu)
        private menusRepository: Repository<Menu>,
    ) { }

    async create(createRoleDto: CreateRoleDto): Promise<Role> {
        const existingRole = await this.rolesRepository.findOne({
            where: { name: createRoleDto.name },
        });

        if (existingRole) {
            throw new ConflictException('Role already exists');
        }

        const role = this.rolesRepository.create({
            name: createRoleDto.name,
            description: createRoleDto.description,
        });

        if (createRoleDto.permissionIds && createRoleDto.permissionIds.length > 0) {
            const permissions = await this.permissionsRepository.findByIds(createRoleDto.permissionIds);
            role.permissions = permissions;
        }

        if (createRoleDto.menuIds && createRoleDto.menuIds.length > 0) {
            const menus = await this.menusRepository.findByIds(createRoleDto.menuIds);
            role.menus = menus;
        }

        return this.rolesRepository.save(role);
    }

    async findAll(): Promise<Role[]> {
        return this.rolesRepository.find({
            relations: ['permissions', 'menus'],
        });
    }

    async findOne(id: number): Promise<Role> {
        const role = await this.rolesRepository.findOne({
            where: { id },
            relations: ['permissions', 'menus'],
        });

        if (!role) {
            throw new NotFoundException(`Role with ID ${id} not found`);
        }

        return role;
    }

    async update(id: number, updateRoleDto: UpdateRoleDto): Promise<Role> {
        const role = await this.findOne(id);

        if (updateRoleDto.name && updateRoleDto.name !== role.name) {
            const existingRole = await this.rolesRepository.findOne({
                where: { name: updateRoleDto.name },
            });

            if (existingRole && existingRole.id !== id) {
                throw new ConflictException('Role name already exists');
            }
        }

        if (updateRoleDto.name) role.name = updateRoleDto.name;
        if (updateRoleDto.description !== undefined) role.description = updateRoleDto.description;

        if (updateRoleDto.permissionIds) {
            const permissions = await this.permissionsRepository.findByIds(updateRoleDto.permissionIds);
            role.permissions = permissions;
        }

        if (updateRoleDto.menuIds) {
            const menus = await this.menusRepository.findByIds(updateRoleDto.menuIds);
            role.menus = menus;
        }

        return this.rolesRepository.save(role);
    }

    async remove(id: number): Promise<void> {
        const role = await this.findOne(id);
        await this.rolesRepository.remove(role);
    }
} 