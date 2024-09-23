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
  UseGuards,
  Headers,
} from '@nestjs/common';
import { ShopService } from './shop.service';
import { CreateShopDto } from './dto/create-shop.dto';
import { Request } from 'express';
import { ApiOkResponse, ApiProperty } from '@nestjs/swagger';
import { StoreOwnerGuard } from '../guards/store-owner.guard';

@Controller('shops')
export class ShopController {
  constructor(private readonly shopService: ShopService) {}

  @Post(':id/new')
  @ApiOkResponse({
    description: 'Shop created successfully',
    type: CreateShopDto,
  })
  @HttpCode(201) 
  @UseGuards(StoreOwnerGuard)
  async createShop(
    @Body() createShopDto: CreateShopDto,
    @Param('id') id: string,
    @Req() req: Request,
    @Headers('authorization') token: string,
  ) {
    const userId = req.user.id;
    return this.shopService.createShop(createShopDto, userId);
  }

  @Get(':id')
  @UseGuards(StoreOwnerGuard)
  async getShop(
    @Param('id') id: string,
    @Req() req: Request,
    @Headers('authorization') token: string,
  ) {
    const userId = req.user.id;
    return this.shopService.findShopById(id);
  }

  @Get('user/:userId')
  async getShopsByUserId(
    @Param('userId') userId: string,
    @Headers('authorization') token: string,
  ) {
    return this.shopService.findShopsByUserId(userId);
  }

  @Put(':id')
  async updateShop(
    @Param('id') id: string,
    @Body() updateData: Partial<CreateShopDto>,
    @Req() req: Request,
    @Headers('authorization') token: string,
  ) {
    const userId = req.user.id;
    return this.shopService.updateShop(id, updateData, userId);
  }

  @Delete(':id')
  @HttpCode(204)
  async deleteShop(
    @Param('id') id: string,
    @Req() req: Request,
    @Headers('authorization') token: string,
  ) {
    const userId = req.user.id;
    return this.shopService.deleteShop(id, userId);
  }
}
