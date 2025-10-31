// src/products/dto/request/update-product.dto.ts
import { PartialType } from '@nestjs/mapped-types';
import { CreateProductDto } from './create-product.dto';

export class UpdateProductDto {
  name?: string;
  description?: string;
  price?: number;
  quantity?: number;
  image?: string;
  isActive?: boolean;
}
