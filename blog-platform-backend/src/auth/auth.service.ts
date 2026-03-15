import { Injectable, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '@/prisma/prisma.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

interface MockUser {
  id: string;
  email: string;
  username: string;
  passwordHash: string;
}

// Global mock users storage shared with JwtStrategy
export const mockUsersStorage = new Map<string, MockUser>();

@Injectable()
export class AuthService {
  private mockUsers: Map<string, MockUser> = mockUsersStorage;
  private mockUsersByEmail: Map<string, MockUser> = new Map();

  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  private generateId(): string {
    return 'user_' + Math.random().toString(36).substr(2, 9);
  }

  async register(registerDto: RegisterDto) {
    const { email, username, password } = registerDto;

    try {
      // Try to use database if connected
      const existingUser = await this.prisma.user.findFirst({
        where: {
          OR: [{ email }, { username }],
        },
      });

      if (existingUser) {
        throw new BadRequestException('Email or username already exists');
      }

      const passwordHash = await bcrypt.hash(password, 10);

      const user = await this.prisma.user.create({
        data: {
          email,
          username,
          passwordHash,
        },
      });

      const token = this.jwtService.sign({
        sub: user.id,
        email: user.email,
        username: user.username,
      });

      return {
        access_token: token,
        user: {
          id: user.id,
          email: user.email,
          username: user.username,
        },
      };
    } catch (error) {
      // Fall back to mock storage
      if (this.mockUsersByEmail.has(email)) {
        throw new BadRequestException('Email already exists');
      }

      const mockUser = this.mockUsers.get(username);
      if (mockUser) {
        throw new BadRequestException('Username already exists');
      }

      const userId = this.generateId();
      const passwordHash = await bcrypt.hash(password, 10);

      const newUser: MockUser = {
        id: userId,
        email,
        username,
        passwordHash,
      };

      this.mockUsers.set(userId, newUser);
      this.mockUsersByEmail.set(email, newUser);

      const token = this.jwtService.sign({
        sub: userId,
        email,
        username,
      });

      return {
        access_token: token,
        user: {
          id: userId,
          email,
          username,
        },
      };
    }
  }

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;

    try {
      // Try to use database if connected
      const user = await this.prisma.user.findUnique({
        where: { email },
      });

      if (!user) {
        throw new UnauthorizedException('Invalid credentials');
      }

      const isPasswordValid = await bcrypt.compare(password, user.passwordHash);

      if (!isPasswordValid) {
        throw new UnauthorizedException('Invalid credentials');
      }

      const token = this.jwtService.sign({
        sub: user.id,
        email: user.email,
        username: user.username,
      });

      return {
        access_token: token,
        user: {
          id: user.id,
          email: user.email,
          username: user.username,
        },
      };
    } catch (error) {
      // Fall back to mock storage
      const mockUser = this.mockUsersByEmail.get(email);

      if (!mockUser) {
        throw new UnauthorizedException('Invalid credentials');
      }

      const isPasswordValid = await bcrypt.compare(password, mockUser.passwordHash);

      if (!isPasswordValid) {
        throw new UnauthorizedException('Invalid credentials');
      }

      const token = this.jwtService.sign({
        sub: mockUser.id,
        email: mockUser.email,
        username: mockUser.username,
      });

      return {
        access_token: token,
        user: {
          id: mockUser.id,
          email: mockUser.email,
          username: mockUser.username,
        },
      };
    }
  }

  async validateUser(userId: string) {
    try {
      // Try database first
      return await this.prisma.user.findUnique({
        where: { id: userId },
        select: {
          id: true,
          email: true,
          username: true,
        },
      });
    } catch (error) {
      // Fall back to mock storage
      const mockUser = this.mockUsers.get(userId);
      if (mockUser) {
        return {
          id: mockUser.id,
          email: mockUser.email,
          username: mockUser.username,
        };
      }
      return null;
    }
  }
}
