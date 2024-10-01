import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

import { CreateCategoryDto } from './dto/create-category.dto';

@Injectable()
export class CategoryService {
  constructor(private prisma: PrismaService) {}

  async createCategory(data: CreateCategoryDto): Promise<any> {
    return this.prisma.categories.create({
      data,
    });
  }

  async getCategoriesByShopId(shopId: string): Promise<any[]> {
    return this.prisma.categories.findMany({
      where: { shopId },
    });
  }
}
