import { Injectable, NotFoundException, HttpStatus, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateShopDto } from './dto/create-shop.dto';
import { JwtService } from '@nestjs/jwt';
import * as crypto from 'crypto';

@Injectable()
export class ShopService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async createShop(createShopDto: CreateShopDto, token: string) {
    console.log(token);
    const userId = this.getUserIdFromToken(token);
    
    const existingShop = await this.prisma.shops.findUnique({
      where: { name: createShopDto.name },
    });
  
    if (existingShop) {
      throw new UnauthorizedException(`Shop with name ${createShopDto.name} already exists the name is unique.`);
    }
  
    const apiKey = await this.generateApiKey();
    
    const shop = await this.prisma.shops.create({
      data: {
        name: createShopDto.name,
        label: createShopDto.label,
        domain: createShopDto.domain,
        apiKey: apiKey,
        user: {
          connect: {
            id: userId,
          },
        },
      },
    });
  
    return {
      statusCode: HttpStatus.CREATED,
      data: shop,
    };
  }
  

  private getUserIdFromToken(token: string): string {
    try {
      const decoded = this.jwtService.decode(token, {json: true});
      console.log(decoded);
      return decoded.sub;
    } catch (e) {
      throw new UnauthorizedException('Invalid token');
    }
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
    token: string,
  ) {
    const userId = this.getUserIdFromToken(token);
    const shop = await this.findShopById(shopId);
    if (shop.data.userId !== userId) throw new UnauthorizedException('Unauthorized');

    const updatedShop = await this.prisma.shops.update({
      where: { id: shopId },
      data: updateData,
    });
    return {
      statusCode: HttpStatus.OK,
      data: updatedShop,
    };
  }

  async deleteShop(shopId: string, token: string) {
    const userId = this.getUserIdFromToken(token);
    const shop = await this.findShopById(shopId);
    if (shop.data.userId !== userId) throw new UnauthorizedException('Unauthorized');

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