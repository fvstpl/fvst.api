import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { PrismaService } from '../prisma/prisma.service';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { AuthModule } from 'src/auth/auth.module';
import { PrismaModule } from 'src/prisma/prisma.module';
import { ShopModule } from 'src/shop/shop.module';

@Module({
  imports: [
    AuthModule,
    PrismaModule,
    ShopModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'secretKey',
      signOptions: { expiresIn: '1h' },
    }),
  ],
  providers: [ProductService, PrismaService],
  controllers: [ProductController],
})
export class ProductModule {}
