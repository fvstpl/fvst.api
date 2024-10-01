import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../users/user.service';
import { LoginUserDto } from 'src/users/dto/login-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import * as crypto from 'crypto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UserService,
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async signIn(email: string, pass: string, ip?: string): Promise<any> {
    const user = await this.usersService.login({
      email: email,
      password: pass,
      ip: ip || null,
    } as LoginUserDto);
    if (!user || !user.access_token) {
      throw new UnauthorizedException();
    }

    const userId = (await this.prisma.users.findUnique({ where: { email } })).id;
    const accessToken = this.jwtService.sign({ email:email, sub: userId });
    const accountToken = crypto.createHash('sha256').update(user.access_token).digest('hex');

    return { accessToken, accountToken, id: userId };
  }

  async validateToken(token: string) {
    const user = await this.prisma.users.findFirst({ where: { token } });
    return user;
  }
}