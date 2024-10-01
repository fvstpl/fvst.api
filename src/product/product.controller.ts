import { Controller, Post, Body, Get, Param, UseGuards } from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { AuthGuard } from '../guards/auth.guard';
import { StoreOwnerGuard } from '../guards/store-owner.guard';

@Controller('product')
@UseGuards(AuthGuard)
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  @UseGuards(StoreOwnerGuard)
  async createProduct(@Body() productData: CreateProductDto): Promise<any> {
    return this.productService.createProduct(productData);
  }

  @Get('shop/:shopId')
  async getProductsByShopId(@Param('shopId') shopId: string): Promise<any[]> {
    return this.productService.getProductsByShopId(shopId);
  }
}
