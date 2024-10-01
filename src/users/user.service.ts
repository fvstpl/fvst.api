import { Injectable, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { ResetRequestDto } from './dto/reset-request.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService
  ) {}

  async createUser(email: string, password: string) {
    const existingUser = await this.prisma.users.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);
    const payload = { email, sub: email };
    const token = this.jwtService.sign(payload);

    const user = await this.prisma.users.create({
      data: {
        email,
        password: hashedPassword,
        salt,
        token,
      },
    });

    return {
      access_token: token,
    };
  }

  async login(loginUserDto: LoginUserDto) {
    const user = await this.prisma.users.findUnique({
      where: { email: loginUserDto.email },
    });

    if (user && await bcrypt.compare(loginUserDto.password, user.password)) {
      const payload = { email: user.email, sub: user.id };
      const token = this.jwtService.sign(payload);
      await this.prisma.users.update({
        where: { email: user.email },
        data: { token },
      });
      return {
        access_token: token,
      };
    }

    return null;
  }

  async requestPasswordReset(email: string) {
    const user = await this.prisma.users.findUnique({
      where: { email },
    });

    if (!user) {
      return {
        error: true,
        code: 404,
        message: 'User not found',
      };
    }

    const resetToken = this.jwtService.sign({ email: user.email }, { expiresIn: '1h' });
    return {
      statusCode: 200,
      message: 'Password reset token generated',
      resetToken,
    };
  }

  async resetPassword(token: string, newPassword: string) {
    let email: string;
    try {
      const decoded = this.jwtService.verify(token);
      email = decoded.email;
    } catch (e) {
      return {
        error: true,
        code: 400,
        message: 'Invalid or expired token',
      };
    }

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    await this.prisma.users.update({
      where: { email },
      data: { password: hashedPassword, salt },
    });

    return {
      statusCode: 200,
      message: 'Password reset successfully',
    };
  }
}
