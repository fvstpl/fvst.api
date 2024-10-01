export class CreateProductDto {
  shopId: string;
  label: string;
  icon?: string;
  hasVariants?: boolean;
  variants?: object;
  price: number;
  description: string;
  descriptionHtml: string;
  actions?: object;
  fields?: object;
  categoriesId?: string;
}