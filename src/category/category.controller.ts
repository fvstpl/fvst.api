import { Controller, Post, Body, Get, Param, UseGuards } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { AuthGuard } from '../guards/auth.guard';

@Controller('category')
@UseGuards(AuthGuard)
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post()
  async createCategory(@Body() categoryData: CreateCategoryDto): Promise<any> {
    return this.categoryService.createCategory(categoryData);
  }

  @Get('shop/:shopId')
  async getCategoriesByShopId(@Param('shopId') shopId: string): Promise<any[]> {
    return this.categoryService.getCategoriesByShopId(shopId);
  }
}
