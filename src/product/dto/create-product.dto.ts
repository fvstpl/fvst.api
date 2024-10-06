import { IsNotEmpty, IsOptional, IsString, IsNumber } from 'class-validator';

export class CreateProductDto {
  @IsNotEmpty({ message: 'Label is required' })
  @IsString()
  label: string;

  @IsOptional()
  @IsString()
  icon?: string;

  @IsOptional()
  hasVariants?: boolean;

  @IsOptional()
  variants?: any;

  @IsNotEmpty({ message: 'Price is required' })
  @IsNumber()
  price: number;

  @IsNotEmpty({ message: 'Description is required' })
  @IsString()
  description: string;

  @IsOptional()
  actions?: any;

  @IsOptional()
  fields?: any;

  @IsNotEmpty({ message: 'Shop ID is required' })
  @IsString()
  shopId: string;

  @IsOptional()
  categoriesId?: string | null;
}
