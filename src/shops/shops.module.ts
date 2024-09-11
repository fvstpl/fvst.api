import { Module } from '@nestjs/common';
import { ShopController } from './shops.controller';
import { } from './shops.service';
import { PrismaService } from '../prisma/prisma.service';


@Module({
  controllers: [ShopController],
  providers: [
    ShopsService,
    PrismaService,

  ],
})
export class ShopsModule {}
