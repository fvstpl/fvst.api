export class CreateProductDto {
  label: string;
  icon?: string;
  hasVariants?: boolean;
  variants?: any;
  price: number;
  description: string;
  actions?: any;
  fields?: any;
  shopId: string;
  categoriesId?: string | null; // Dodaj `| null`, jeśli może przyjmować wartość null
}
