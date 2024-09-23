import { Injectable, NotFoundException, HttpStatus } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateShopDto } from './dto/create-shop.dto';
import * as crypto from 'crypto';
@Injectable()
export class ShopService {
  constructor(private readonly prisma: PrismaService) {}

  async createShop(createShopDto: CreateShopDto, userId: string) {
    const apiKey = await this.generateApiKey();
    const shop = await this.prisma.shops.create({
      data: {
        name: createShopDto.name,
        label: createShopDto.label,
        domain: createShopDto.domain,
        apiKey: apiKey, 
        user: {
          connect: {
            id: userId
          }
        }
      },
    });
    return {
      statusCode: HttpStatus.CREATED, 
      data: shop,
    };
  }

  async generateApiKey(): Promise<string> {
    return new Promise((resolve, reject) => {
      crypto.randomBytes(16, (err, buffer) => {
        if (err) {
          reject(err);
        } else {
          resolve(buffer.toString('hex'));
        }
      });
    });
  }

  async findShopById(shopId: string) {
    const shop = await this.prisma.shops.findUnique({ where: { id: shopId } });
    if (!shop) throw new NotFoundException('Shop not found');
    return {
      statusCode: HttpStatus.OK, 
      data: shop,
    };
  }

  async findShopsByUserId(userId: string) {
    const shops = await this.prisma.shops.findMany({ where: { userId } });
    return {
      statusCode: HttpStatus.OK, 
      data: shops,
    };
  }
  async updateShop(
    shopId: string,
    updateData: Partial<CreateShopDto>,
    userId: string,
  ) {
    const shop = await this.findShopById(shopId);
    if (shop.data.userId !== userId) throw new NotFoundException('Unauthorized');

    const updatedShop = await this.prisma.shops.update({
      where: { id: shopId },
      data: updateData,
    });
    return {
      statusCode: HttpStatus.OK, 
      data: updatedShop,
    };
  }

  async deleteShop(shopId: string, userId: string) {
    const shop = await this.findShopById(shopId);
    if (shop.data.userId !== userId) throw new NotFoundException('Unauthorized');

    await this.prisma.shops.delete({ where: { id: shopId } });
    return {
      statusCode: HttpStatus.NO_CONTENT, 
    };
  }

  async getShopStatus(shopId: string) {
    const shop = await this.findShopById(shopId);
    return {
      statusCode: HttpStatus.OK, 
      data: {
        id: shop.data.id,
        name: shop.data.name,
      },
    };
  }

  async getAllShopsStatus() {
    const shops = await this.prisma.shops.findMany();
    return {
      statusCode: HttpStatus.OK, 
      data: shops.map(shop => ({
        id: shop.id,
        name: shop.name,
      })),
    };
  }
}