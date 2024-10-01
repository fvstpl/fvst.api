import { Module } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CategoryController } from './category.controller';
import { PrismaService } from '../prisma/prisma.service';
import { AuthModule } from 'src/auth/auth.module';
import { PrismaModule } from 'src/prisma/prisma.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [AuthModule, PrismaModule, JwtModule.register({
    secret: process.env.JWT_SECRET || 'secretKey',
    signOptions: { expiresIn: '1h' },
  })],
  providers: [CategoryService, PrismaService],
  controllers: [CategoryController],
})
export class CategoryModule {}
