import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { CreateProductDto } from './dto/request/create-product.dto';
import { UpdateProductDto } from './dto/request/update-product.dto';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private productRepo: Repository<Product>,
  ) {}

  create(dto: CreateProductDto) {
    const product = this.productRepo.create(dto);
    return this.productRepo.save(product);
  }

  findAll(search?: string, isActive?: boolean) {
    const qb = this.productRepo.createQueryBuilder('product');

    if (search) {
      qb.andWhere('LOWER(product.name) LIKE :search OR LOWER(product.description) LIKE :search', { search: `%${search.toLowerCase()}%` });
    }

    if (isActive !== undefined) {
      qb.andWhere('product.isActive = :isActive', { isActive });
    }

    return qb.getMany();
  }

  findTopByPrice(limit = 5) {
    return this.productRepo.createQueryBuilder('product')
      .orderBy('product.price', 'DESC')
      .limit(limit)
      .getMany();
  }

  findOne(id: number) {
    return this.productRepo.findOneBy({ id });
  }

  update(id: number, dto: UpdateProductDto) {
    return this.productRepo.update(id, dto);
  }

  remove(id: number) {
    return this.productRepo.delete(id);
  }
}
