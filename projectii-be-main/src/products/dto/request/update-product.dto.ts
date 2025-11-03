import { PartialType } from '@nestjs/mapped-types';
import { CreateProductDto } from './create-product.dto';

export class UpdateProductDto extends PartialType(CreateProductDto) {

  name?: string;
  description?: string;
  price?: number;
  quantity?: number;
  image?: string;
  isActive?: boolean;
}
