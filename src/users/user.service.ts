import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { sendEmailTemplate } from '../utils/mail.service';
import * as bcrypt from 'bcrypt';
import * as moment from 'moment';
import { LoginUserDto } from './dto/login-user.dto';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);

  constructor(private readonly prisma: PrismaService) {}

  async createUser(email: string, password: string) {
    const existingUser = await this.prisma.users.findFirst({
      where: { email },
    });
    if (existingUser) {
      return {
        error: true,
        code: 400,
        message: 'Account with this email already exists',
      };
    }

    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(password, salt);
    const token = Buffer.from(
      `${Math.floor(Math.random() * 10)}.${Date.now().toString()}.${email}`,
    ).toString('base64');

    const user = await this.prisma.users.create({
      data: { email, password: hashedPassword, salt, token },
    });

    this.logger.log(`Account created by ${email}`);

    await sendEmailTemplate('welcome', email, 'Witaj na pokładzie');

    return { token, id: user.id };
  }

  async requestPasswordReset(email: string) {
    const user = await this.prisma.users.findFirst({ where: { email } });
    if (!user) {
      return {
        error: true,
        code: 404,
        message: 'Account with this email does not exist',
      };
    }

    const token = Buffer.from(
      `${Math.floor(Math.random() * 100)}.${Date.now().toString()}.${email}`,
    ).toString('base64');

    await sendEmailTemplate('reset', email, 'Resetowanie hasła', token);

    this.logger.log(`Password reset requested by ${email} sent`);

    return { status: 'OK' };
  }

  async resetPassword(token: string, password: string) {
    const email = await this.prisma.users.findFirst({ where: { token } });
    if (!email) {
      return { error: true, code: 404, message: 'Invalid or expired token' };
    }

    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(password, salt);

    await this.prisma.users.update({
      where: { email: `${email}` },
      data: { password: hashedPassword, salt },
    });

    this.logger.log(`Password reset for ${email} completed`);

    return { status: 'OK' };
  }

  async login(loginUserDto: LoginUserDto) {
    const user = await this.prisma.users.findFirst({ where: { email: loginUserDto.email } });
    if (!user || !bcrypt.compareSync(loginUserDto.password, user.password)) {
      return { error: true, code: 403, message: 'Bad credentials' };
    }

    if (loginUserDto.ip) {
      const response = await fetch(`http://ip-api.com/json/${loginUserDto.ip}`);
      let geo = null;
      if (response.ok) {
        geo = await response.json();
      }
      const date = moment().locale('pl').format('hh:mm DD.MM.YYYY');
      await sendEmailTemplate(
        'login',
        user.email,
        'Nowe logowanie',
        loginUserDto.ip,
        geo,
        date,
      );
    }

    this.logger.log(`User ${user.email} logged in from ${loginUserDto.ip}`);

    return { token: user.token, id: user.id, code: 200 };
  }

  async updateUserCache(id: string) {
   
    return { status: 'OK' };
  }

  async getUserInfo(id: string) {
    const user = await this.prisma.users.findFirst({ where: { id } });
    if (!user) {
      return { error: true, code: 404, message: 'User not found' };
    }
    return user;
  }
}
