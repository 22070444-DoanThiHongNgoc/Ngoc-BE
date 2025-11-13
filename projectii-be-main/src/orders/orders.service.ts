import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Order } from './entities/orders.entity';
import { OrderItem } from './entities/order-item.entity';
import { CreateOrderDto } from './dto/request/create-order.dto';
import { UpdateOrderDto } from './dto/request/update-order.dto';
import { OrderResponseDto } from './dto/response/order-response.dto';
import { Customer } from 'src/customers/entities/customer.entity';
import { Product } from 'src/products/entities/product.entity';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepo: Repository<Order>,
    @InjectRepository(OrderItem)
    private readonly itemRepo: Repository<OrderItem>,
    @InjectRepository(Customer)
    private readonly customerRepo: Repository<Customer>,
    @InjectRepository(Product)
    private readonly productRepo: Repository<Product>,
  ) {}

  async create(dto: CreateOrderDto): Promise<OrderResponseDto> {
    const customer = await this.customerRepo.findOne({ where: { id: dto.customerId } });
    if (!customer) throw new NotFoundException('Customer not found');

    const productIds = dto.items.map((i) => i.productId);
    const products = await this.productRepo.findBy({ id: In(productIds) });
    if (products.length !== productIds.length) {
      throw new NotFoundException('One or more products not found');
    }
    const productMap = new Map(products.map((p) => [p.id, p]));

    const order = this.orderRepo.create({
      customer,
      status: 'pending',
      total_price: 0,
      items: [],
    });

    let total = 0;
    order.items = dto.items.map((i) => {
      const product = productMap.get(i.productId)!;
      const lineTotal = Number(product.price) * i.quantity;
      total += lineTotal;
      const item = new OrderItem();
      item.product = product;
      item.quantity = i.quantity;
      item.line_total = lineTotal;
      return item;
    });

    order.total_price = total;

    const saved = await this.orderRepo.save(order);
    return new OrderResponseDto(saved);
  }

  async findAll(): Promise<OrderResponseDto[]> {
    const orders = await this.orderRepo.find();
    return orders.map((o) => new OrderResponseDto(o));
  }

  async findOne(id: number): Promise<OrderResponseDto> {
    const order = await this.orderRepo.findOne({ where: { id } });
    if (!order) throw new NotFoundException('Order not found');
    return new OrderResponseDto(order);
  }

  async update(id: number, dto: UpdateOrderDto): Promise<OrderResponseDto> {
    const order = await this.orderRepo.findOne({ where: { id } });
    if (!order) throw new NotFoundException('Order not found');

    if (dto.status) order.status = dto.status;

    const updated = await this.orderRepo.save(order);
    return new OrderResponseDto(updated);
  }

  async remove(id: number) {
    const result = await this.orderRepo.delete(id);
    if (!result.affected) throw new NotFoundException('Order not found');
    return { message: 'Order deleted successfully' };
  }
}
