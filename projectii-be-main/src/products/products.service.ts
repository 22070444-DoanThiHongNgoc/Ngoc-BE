import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, ILike } from 'typeorm';
import { Product } from './entities/product.entity';
import { CreateProductDto } from './dto/request/create-product.dto';
import { UpdateProductDto } from './dto/request/update-product.dto';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly repo: Repository<Product>,
  ) {}

  // 🟢 CREATE PRODUCT
  async create(dto: CreateProductDto) {
    const product = this.repo.create(dto);
    return this.repo.save(product);
  }

  // 🔍 GET ALL PRODUCTS (with optional filters)
  async findAll(search?: string, isActive?: boolean) {
    const where: any = {};
    if (search) where.name = ILike(`%${search}%`);
    if (isActive !== undefined) where.isActive = isActive;

    return this.repo.find({
      where,
      order: { id: 'DESC' },
    });
  }

  // 🔝 GET TOP PRODUCTS BY PRICE
  async findTopByPrice() {
    return this.repo.find({
      order: { price: 'DESC' },
      take: 5,
    });
  }

  // 🔍 GET ONE PRODUCT
  async findOne(id: number) {
    const product = await this.repo.findOne({ where: { id } });
    if (!product) throw new NotFoundException('Product not found');
    return product;
  }

  // ✏️ UPDATE PRODUCT
  async update(id: number, dto: UpdateProductDto) {
    const product = await this.findOne(id);
    if (!product) throw new NotFoundException('Product not found');
    await this.repo.update(id, dto);
    return this.findOne(id);
  }

  // 🗑️ DELETE PRODUCT
  async remove(id: number) {
    const result = await this.repo.delete(id);
    if (result.affected === 0) throw new NotFoundException('Product not found');
    return { message: 'Product deleted successfully' };
  }
}
