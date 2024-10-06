import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';

@Injectable()
export class ProductService {
  constructor(private prisma: PrismaService) {}

  async createProduct(data: any): Promise<any> {
    const createData = {
      ...data,
    };
  
    return this.prisma.products.create({
      data: createData,
    });
  }
  

  async getProductsByShopId(shopId: string): Promise<any[]> {
    return this.prisma.products.findMany({
      where: { shopId },
    });
  }
}
