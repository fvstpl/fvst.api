import { Controller, Post, Get, Delete, Param, Body, Req, Res } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Request, Response } from 'express';
import { verifyShopOwnership } from '../utils/verifyShopOwnership';

// Extend Request to include 'shop' property
interface CustomRequest extends Request {
  shop?: {
    id: string;
    categories: any[];
    limits: {
      categories: number;
    };
  };
}

@Controller('shop')
export class ShopController {
  constructor(private readonly prisma: PrismaService) {}

  @Post(':categoryId/product')
  async createProduct(
    @Param('categoryId') categoryId: string,
    @Body() body: any,
    @Req() req: CustomRequest,
    @Res() res: Response,
  ) {
    if (!body.name) {
      return res
        .status(400)
        .json({ error: true, code: 400, message: '"name" is missing' });
    }

    try {
      if (!req.shop) {
        return res.status(401).json({ error: true, code: 401, message: "Unauthorized" });
      }

      const shop = await this.prisma.shops.findUnique({
        where: { id: req.shop.id },
        include: { categories: true },
      });

      if (!shop.categories.find(cat => cat.id === categoryId)) {
        return res.status(404).json({
          error: true,
          code: 404,
          message: `Cannot find category "${categoryId}"`,
        });
      }

      if (shop.categories.length >= shop.limits.categories) {
        return res.status(400).json({ error: true, code: 400, message: "You have reached the limit of categories" });
      }

      const product = await this.prisma.products.create({
        data: {
          ...body,
          shopId: req.shop.id,
          categoryId: categoryId,
        },
      });

      return res.status(200).json(product);
    } catch (err) {
      return res
        .status(500)
        .json({ error: true, code: 500, message: "Server Error" });
    }
  }

  @Get(':categoryId/products')
  async getProducts(
    @Param('categoryId') categoryId: string,
    @Req() req: CustomRequest,
    @Res() res: Response,
  ) {
    try {
      if (!req.shop) {
        return res.status(401).json({ error: true, code: 401, message: "Unauthorized" });
      }

      const products = await this.prisma.products.findMany({
        where: {
          shopId: req.shop.id,
          categoryId: categoryId,
        },
      });

      return res.status(200).json(products);
    } catch (err) {
      return res
        .status(500)
        .json({ error: true, code: 500, message: "Server Error" });
    }
  }

  @Delete(':categoryId/product/:productId')
  async deleteProduct(
    @Param('categoryId') categoryId: string,
    @Param('productId') productId: string,
    @Req() req: CustomRequest,
    @Res() res: Response,
  ) {
    try {
      if (!req.shop) {
        return res.status(401).json({ error: true, code: 401, message: "Unauthorized" });
      }

      const shop = await this.prisma.shops.findUnique({
        where: { id: req.shop.id },
        include: { categories: true },
      });

      if (!shop.categories.find(cat => cat.id === categoryId)) {
        return res.status(404).json({
          error: true,
          code: 404,
          message: `Cannot find category "${categoryId}"`,
        });
      }

      await this.prisma.products.delete({
        where: { id: productId },
      });

      return res.status(200).json({ status: "OK" });
    } catch (err) {
      return res
        .status(500)
        .json({ error: true, code: 500, message: "Server Error" });
    }
  }
}
