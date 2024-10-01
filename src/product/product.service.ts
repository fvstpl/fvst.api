import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';

@Injectable()
export class ProductService {
  constructor(private prisma: PrismaService) {}

  async createProduct(data: CreateProductDto): Promise<any> {
    return this.prisma.products.create({
      data,
    });
  }

  async getProductsByShopId(shopId: string): Promise<any[]> {
    return this.prisma.products.findMany({
      where: { shopId },
    });
  }
}
