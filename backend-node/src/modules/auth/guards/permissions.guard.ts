import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UsersService } from '../../users/users.service';

@Injectable()
export class PermissionsGuard implements CanActivate {
    constructor(
        private reflector: Reflector,
        private usersService: UsersService,
    ) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const requiredPermissions = this.reflector.get<string[]>('permissions', context.getHandler());
        if (!requiredPermissions) {
            return true;
        }

        const request = context.switchToHttp().getRequest();
        const user = await this.usersService.findByEmail(request.user.email);

        if (!user) {
            return false;
        }

        const userPermissions = user.roles
            .flatMap(role => role.permissions)
            .map(permission => permission.code);

        return requiredPermissions.some(permission => userPermissions.includes(permission));
    }
} 