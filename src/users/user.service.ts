import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { sendEmailTemplate } from '../utils/mail.service';
import { sendWebhook } from '../utils/discordlogs.util';
import moment from 'moment';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);

  constructor(private readonly prisma: PrismaService) {}

  async createUser(email: string, password: string) {
    const existingUser = await this.prisma.users.findFirst({ where: { email } });
    if (existingUser) {
      return { error: true, code: 400, message: 'Account with this email already exists' };
    }

    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(password, salt);
    const token = Buffer.from(`${Math.floor(Math.random() * 10)}.${Date.now().toString()}.${email}`).toString('base64');

    const user = await this.prisma.users.create({
      data: { email, password: hashedPassword, salt, token },
    });

    this.logger.log(`Account created by ${email}`);

    await sendWebhook(
      'https://discord.com/api/webhooks/1236070665304543332/tdVt1j315AVALBtM1YOzO-3y_kabzstkkCJolRFbMsyuCmZbz3hudq-uFUbSnjGbYITj',
      'User Created',
      user,
    );

    await sendEmailTemplate('welcome', email, 'Witaj na pokładzie');

    return { token, id: user.id };
  }

  async requestPasswordReset(email: string) {
    const user = await this.prisma.users.findFirst({ where: { email } });
    if (!user) {
      return { error: true, code: 404, message: 'Account with this email does not exist' };
    }

    const token = Buffer.from(`${Math.floor(Math.random() * 100)}.${Date.now().toString()}.${email}`).toString('base64');

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

  async login(email: string, password: string, ip?: string) {
    const user = await this.prisma.users.findFirst({ where: { email } });
    if (!user || !bcrypt.compareSync(password, user.password)) {
      return { error: true, code: 403, message: 'Bad credentials' };
    }

    if (ip) {
      const response = await fetch(`http://ip-api.com/json/${ip}`);
      let geo = null;
      if (response.ok) {
        geo = await response.json();
      }
      const date = moment().locale('pl').format('hh:mm DD.MM.YYYY');
      await sendEmailTemplate('login', user.email, 'Nowe logowanie', ip, geo, date);
    }

    this.logger.log(`User ${user.email} logged in from ${ip}`);

    return { token: user.token, id: user.id };
  }

  async updateUserCache(id: string) {
    // Implementacja aktualizacji cache, jeśli to konieczne
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
