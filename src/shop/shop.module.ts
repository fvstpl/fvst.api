import { Module } from '@nestjs/common';
import { ShopService } from './shop.service';
import { ShopController } from './shop.controller';
import { PrismaService } from '../prisma/prisma.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { StoreOwnerGuard } from 'src/guards/store-owner.guard';
import { AuthModule } from '../auth/auth.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [AuthModule, PrismaModule, JwtModule.register({
    secret: 'secretKey',
    signOptions: { expiresIn: '1h' },
  })],
  controllers: [ShopController],
  exports: [ShopService],
  providers: [ShopService, PrismaService, StoreOwnerGuard],
})
export class ShopModule {}
