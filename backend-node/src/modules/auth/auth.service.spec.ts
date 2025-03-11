import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { ConfigService } from '@nestjs/config';
import { UnauthorizedException } from '@nestjs/common';

describe('AuthService', () => {
  let service: AuthService;
  let usersService: UsersService;
  let jwtService: JwtService;

  const mockUser = {
    id: 1,
    username: 'testuser',
    password: '$2a$10$YmvMTrLvGj8Sy.Zx9jzY.OqRi4D4ICe6ZYxBcBxEVfX5UhQe3KKSe', // 'password123'
    email: 'test@example.com',
    roles: ['user']
  };

  const mockUsersService = {
    findByUsername: jest.fn(),
    findById: jest.fn()
  };

  const mockJwtService = {
    sign: jest.fn(),
    verify: jest.fn()
  };

  const mockConfigService = {
    get: jest.fn()
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: mockUsersService
        },
        {
          provide: JwtService,
          useValue: mockJwtService
        },
        {
          provide: ConfigService,
          useValue: mockConfigService
        }
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    usersService = module.get<UsersService>(UsersService);
    jwtService = module.get<JwtService>(JwtService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('validateUser', () => {
    it('should return user object when credentials are valid', async () => {
      mockUsersService.findByUsername.mockResolvedValue(mockUser);
      const result = await service.validateUser('testuser', 'password123');
      expect(result).toEqual({
        id: mockUser.id,
        username: mockUser.username,
        email: mockUser.email,
        roles: mockUser.roles
      });
    });

    it('should return null when user is not found', async () => {
      mockUsersService.findByUsername.mockResolvedValue(null);
      const result = await service.validateUser('wronguser', 'password123');
      expect(result).toBeNull();
    });

    it('should return null when password is invalid', async () => {
      mockUsersService.findByUsername.mockResolvedValue(mockUser);
      const result = await service.validateUser('testuser', 'wrongpassword');
      expect(result).toBeNull();
    });
  });

  describe('login', () => {
    it('should return access token when login is successful', async () => {
      const mockToken = 'mock.jwt.token';
      mockJwtService.sign.mockReturnValue(mockToken);

      const result = await service.login(mockUser);

      expect(result).toEqual({
        access_token: mockToken,
        user: {
          id: mockUser.id,
          username: mockUser.username,
          email: mockUser.email,
          roles: mockUser.roles
        }
      });
    });
  });

  describe('verifyToken', () => {
    it('should return decoded token when token is valid', async () => {
      const mockDecodedToken = { userId: 1, username: 'testuser' };
      mockJwtService.verify.mockReturnValue(mockDecodedToken);
      mockUsersService.findById.mockResolvedValue(mockUser);

      const result = await service.verifyToken('valid.token');

      expect(result).toEqual(mockUser);
    });

    it('should throw UnauthorizedException when token is invalid', async () => {
      mockJwtService.verify.mockImplementation(() => {
        throw new Error('Invalid token');
      });

      await expect(service.verifyToken('invalid.token')).rejects.toThrow(
        UnauthorizedException
      );
    });
  });
});