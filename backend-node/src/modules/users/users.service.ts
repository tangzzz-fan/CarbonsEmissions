import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcryptjs';
import { Role } from '../roles/entities/role.entity';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private usersRepository: Repository<User>,
        @InjectRepository(Role)
        private rolesRepository: Repository<Role>,
    ) { }

    async create(createUserDto: CreateUserDto): Promise<User> {
        const existingUser = await this.usersRepository.findOne({
            where: [
                { email: createUserDto.email },
                { username: createUserDto.username },
            ],
        });

        if (existingUser) {
            throw new ConflictException('User already exists');
        }

        const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
        const user = this.usersRepository.create({
            ...createUserDto,
            password: hashedPassword,
        });

        if (createUserDto.roleIds && createUserDto.roleIds.length > 0) {
            const roles = await this.rolesRepository.findByIds(createUserDto.roleIds);
            user.roles = roles;
        }

        return this.usersRepository.save(user);
    }

    async findAll(username?: string, email?: string): Promise<User[]> {
        const queryBuilder = this.usersRepository.createQueryBuilder('user')
            .leftJoinAndSelect('user.roles', 'role');

        if (username) {
            queryBuilder.andWhere('user.username LIKE :username', { username: `%${username}%` });
        }

        if (email) {
            queryBuilder.andWhere('user.email LIKE :email', { email: `%${email}%` });
        }

        return queryBuilder.getMany();
    }

    async findOne(id: number): Promise<User> {
        const user = await this.usersRepository.findOne({
            where: { id },
            relations: ['roles'],
        });

        if (!user) {
            throw new NotFoundException(`User with ID ${id} not found`);
        }

        return user;
    }

    async findByEmail(email: string): Promise<User | null> {
        return this.usersRepository.findOne({
            where: { email },
            relations: ['roles', 'roles.permissions', 'roles.menus'],
        });
    }

    async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
        const user = await this.findOne(id);

        if (updateUserDto.password) {
            updateUserDto.password = await bcrypt.hash(updateUserDto.password, 10);
        }

        if (updateUserDto.roleIds) {
            const roles = await this.rolesRepository.findByIds(updateUserDto.roleIds);
            user.roles = roles;
        }

        Object.assign(user, updateUserDto);
        return this.usersRepository.save(user);
    }

    async resetPassword(id: number): Promise<User> {
        const user = await this.findOne(id);
        const defaultPassword = '123456'; // 默认密码
        user.password = await bcrypt.hash(defaultPassword, 10);
        return this.usersRepository.save(user);
    }

    async remove(id: number): Promise<void> {
        const user = await this.findOne(id);
        await this.usersRepository.remove(user);
    }
} 