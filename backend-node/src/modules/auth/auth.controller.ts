import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @Post('login')
    @ApiOperation({ summary: '用户登录' })
    @ApiResponse({ status: 200, description: '登录成功' })
    @ApiResponse({ status: 401, description: '登录失败' })
    async login(@Body() loginDto: LoginDto) {
        return this.authService.login(loginDto);
    }
} 