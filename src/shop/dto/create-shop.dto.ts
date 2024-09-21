import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateShopDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ example: 'testowy sklep' })
  label: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ example: 'sklep' })
  name: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ example: 'localhost:3000' })

  domain?: string;  
  
}