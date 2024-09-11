import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Request } from 'express';
import { CreateCategoryDto } from './dto/create-category.dto';
import { CreateProductDto } from './dto/create-product.dto';

@Injectable()
export class ShopsService {
  constructor(
    private readonly prismaService: PrismaService,

  ) {}

  async createCategory(createCategoryDto: CreateCategoryDto, req: Request) {
    const { name } = createCategoryDto;

    if (!name) {
      throw new Error('Missing category name');
    }

    if (req.shop.categories.length >= req.shop.limits.categories) {
      throw new Error('You have reached the limit of categories');
    }

    const category = await this.prismaService.categories.create({
      data: {
        label: name,
        shopId: req.shop.id,
      },
    });



  
    return category;
  }

  async getCategories(req: Request) {
    return req.shop.categories;
  }

  async deleteCategory(categoryId: string, req: Request) {
    const categoryExists = req.shop.categories.some(cat => cat.id === categoryId);

    if (!categoryExists) {
      throw new Error(`Cannot find "${categoryId}"`);
    }

    const category = await this.prismaService.categories.delete({
      where: { id: categoryId },
    });


    return { status: 'OK' };
  }

  async createProduct(categoryId: string, createProductDto: CreateProductDto, req: Request) {
    const { name, price } = createProductDto;

    if (!name || !price) {
      throw new Error('Missing product name or price');
    }

    // Ensure the category exists
    const category = await this.prismaService.categories.findUnique({
      where: { id: categoryId },
    });

    if (!category) {
      throw new Error(`Category "${categoryId}" not found`);
    }

    const product = await this.prismaService.products.create({
      data: {
        name: name,
        price: price,
        categoryId: categoryId,
      },
    });

 
    return product;
  }

  async getProducts(categoryId: string, req: Request) {
    // Ensure the category exists
    const category = await this.prismaService.categories.findUnique({
      where: { id: categoryId },
      include: { products: true },
    });

    if (!category) {
      throw new Error(`Category "${categoryId}" not found`);
    }

    return category.products;
  }

  async deleteProduct(categoryId: string, productId: string, req: Request) {
    // Ensure the category exists
    const category = await this.prismaService.categories.findUnique({
      where: { id: categoryId },
    });

    if (!category) {
      throw new Error(`Category "${categoryId}" not found`);
    }

    const product = await this.prismaService.products.findUnique({
      where: { id: productId },
    });

    if (!product || product.categoryId !== categoryId) {
      throw new Error(`Product "${productId}" not found in category "${categoryId}"`);
    }

    await this.prismaService.products.delete({
      where: { id: productId },
    });

  
    return { status: 'OK' };
  }
}
