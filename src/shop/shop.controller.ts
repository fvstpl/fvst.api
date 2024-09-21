import {
  Controller,
  Post,
  Get,
  Param,
  Body,
  Put,
  Delete,
  Req,
  HttpCode,
} from '@nestjs/common';
import { ShopService } from './shop.service';
import { CreateShopDto } from './dto/create-shop.dto';
import { Request } from 'express';
import { ApiOkResponse, ApiProperty } from '@nestjs/swagger';

@Controller('shops')
export class ShopController {
  constructor(private readonly shopService: ShopService) {}

  @Post(':id/new')
  @ApiOkResponse({
    description: 'Shop created successfully',
    type: CreateShopDto,
  })
  @HttpCode(201) 
  async createShop(
    @Body() createShopDto: CreateShopDto,
    @Param('id') id: string,
    @Req() req: Request,
  ) {
    const userId = id; 
    return this.shopService.createShop(createShopDto, userId);
  }

  @Get(':id')
  async getShop(@Param('id') id: string) {
    return this.shopService.findShopById(id);
  }

  @Get('user/:userId')
  async getShopsByUserId(@Param('userId') userId: string) {
    return this.shopService.findShopsByUserId(userId);
  }

  @Put(':id')
  async updateShop(
    @Param('id') id: string,
    @Body() updateData: Partial<CreateShopDto>,
    @Req() req: Request,
  ) {
    const userId = req.user.id;
    return this.shopService.updateShop(id, updateData, userId);
  }

  @Delete(':id')
  @HttpCode(204)
  async deleteShop(@Param('id') id: string, @Req() req: Request) {
    const userId = req.user.id;
    return this.shopService.deleteShop(id, userId);
  }
}
