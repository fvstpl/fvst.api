import { Module } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';
import { UserModule } from './users/user.module';
import { RedisService } from './redis/redis.service';
import { ShopModule } from './shop/shop.module';
import { AuthModule } from './auth/auth.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [UserModule, ShopModule, AuthModule, JwtModule.register({
    secret: 'secretKey',
    signOptions: { expiresIn: '1h' },
  })],
  providers: [PrismaService, RedisService],
  exports: [PrismaService, RedisService],
})
export class AppModule {}
