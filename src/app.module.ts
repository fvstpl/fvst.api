import { Module } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';
import { UserModule } from './users/user.module';
import { RedisService } from './redis/redis.service';
import { ShopModule } from './shop/shop.module';
@Module({
  imports: [UserModule, ShopModule],
  providers: [PrismaService, RedisService],
  exports: [PrismaService, RedisService],
})
export class AppModule {}
