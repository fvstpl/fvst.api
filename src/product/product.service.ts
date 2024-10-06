import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class ProductService {
  constructor(
    private prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async createProduct(data: any, authorization: any): Promise<any> {
    const userId = this.getUserIdFromToken(authorization);
    
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
  private getUserIdFromToken(token: string): string {
    try {
      const decoded = this.jwtService.decode(token, { json: true });
      console.log(decoded);
      return decoded.sub;
    } catch (e) {
      throw new UnauthorizedException('Invalid token');
    }
  }
}
