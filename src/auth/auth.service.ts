import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../users/user.service';
import { LoginUserDto } from 'src/users/dto/login-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AuthService {
  constructor(private usersService: UserService, private readonly prisma: PrismaService) {}

  async signIn(email: string, pass: string, ip?: string): Promise<any> {
    const user = await this.usersService.login({
        email: email,
        password: pass,
        ip: ip || null,
    } as LoginUserDto);
    if (!user || !user.access_token) {
      throw new UnauthorizedException();
    }
    const token = user.access_token;
    const userId = (await this.prisma.users.findUnique({ where: { email } })).id;

    return { token, id: userId };
  }

  async validateToken(token: string) {
    const user = await this.prisma.users.findFirst({ where: { token } });
    return user;
  }
}