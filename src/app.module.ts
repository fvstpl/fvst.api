import { Module } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';
import { UserModule } from './users/user.module';
import { RedisService } from './redis/redis.service';
import { ShopModule } from './shop/shop.module';
import { AuthModule } from './auth/auth.module';
import { JwtModule } from '@nestjs/jwt';
import { ProductModule } from './product/product.module';
import { CategoryModule } from './category/category.module';
import { AuthGuard } from './guards/auth.guard';
import { StoreOwnerGuard } from './guards/store-owner.guard';
import { ShopService } from './shop/shop.service'; // Dodano import

@Module({
  imports: [
    UserModule,
    ShopModule,
    AuthModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'secretKey', // Upewnij się, że ten klucz jest taki sam jak używany do generowania tokenów
      signOptions: { expiresIn: '1h' },
    }),
    ProductModule,
    CategoryModule,
  ],
  providers: [PrismaService, RedisService, AuthGuard, StoreOwnerGuard, ShopService], // Dodano ShopService
  exports: [PrismaService, RedisService],
})
export class AppModule {}
