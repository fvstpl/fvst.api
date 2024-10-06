import { Controller, Post, Body, Get, Param, UseGuards, Headers, UsePipes, ValidationPipe } from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { AuthGuard } from '../guards/auth.guard';
import { StoreOwnerGuard } from '../guards/store-owner.guard';

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  @UseGuards(StoreOwnerGuard)
  @UsePipes(new ValidationPipe({ transform: true }))
  async createProduct(
    @Body() productData: CreateProductDto,
    @Headers('authorization') authorization: string | undefined,
  ): Promise<any> {
    return this.productService.createProduct(productData, authorization);
  }

  @Get('shop/:shopId')
  async getProductsByShopId(@Param('shopId') shopId: string): Promise<any[]> {
    return this.productService.getProductsByShopId(shopId);
  }
}
