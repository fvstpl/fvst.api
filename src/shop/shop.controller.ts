import {
  Controller,
  Post,
  Get,
  Param,
  Body,
  Put,
  Delete,
  HttpCode,
  UseGuards,
  Headers,
} from '@nestjs/common';
import { ShopService } from './shop.service';
import { CreateShopDto } from './dto/create-shop.dto';
import { ApiHeader, ApiOkResponse } from '@nestjs/swagger';
import { StoreOwnerGuard } from '../guards/store-owner.guard';

@Controller('shops')
export class ShopController {
  constructor(private readonly shopService: ShopService) {}

  @Post('new')
  @ApiOkResponse({
    description: 'Shop created successfully',
    type: CreateShopDto,
  })
  @HttpCode(201)
  async createShop(
    @Body() createShopDto: CreateShopDto,
    @Headers('authorization') authorization: string | undefined,
  ) {
    if (!authorization) {
      throw new Error('Authorization header is missing');
    }

    return this.shopService.createShop(createShopDto, authorization);
  }

  @Get(':id')
  @UseGuards(StoreOwnerGuard)
  async getShop(
    @Param('id') id: string,
    @Headers('authorization') authorization: string | undefined,
  ) {
    if (!authorization) {
      throw new Error('Authorization header is missing');
    }

    return this.shopService.findShopById(id);
  }

  @Get('user/:userId')
  async getShopsByUserId(
    @Param('userId') userId: string,
    @Headers('authorization') authorization: string | undefined,
  ) {
    if (!authorization) {
      throw new Error('Authorization header is missing');
    }

    return this.shopService.findShopsByUserId(userId);
  }

  @Put(':id')
  @UseGuards(StoreOwnerGuard)
  async updateShop(
    @Param('id') id: string,
    @Body() updateData: Partial<CreateShopDto>,
    @Headers('authorization') authorization: string | undefined,
  ) {
    if (!authorization) {
      throw new Error('Authorization header is missing');
    }

    return this.shopService.updateShop(id, updateData, authorization);
  }

  @Delete(':id')
  @UseGuards(StoreOwnerGuard)
  @HttpCode(204)
  async deleteShop(
    @Param('id') id: string,
    @Headers('authorization') authorization: string | undefined,
  ) {
    if (!authorization) {
      throw new Error('Authorization header is missing');
    }

    return this.shopService.deleteShop(id, authorization);
  }
}
