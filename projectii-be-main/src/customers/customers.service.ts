import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Customer } from './entities/customer.entity';
import { CreateCustomerDto } from './dto/request/create-customer.dto';
import { UpdateCustomerDto } from './dto/request/update-customer.dto';
import { CustomerResponseDto } from './dto/response/customer-response.dto';

@Injectable()
export class CustomersService {
  constructor(
    @InjectRepository(Customer)
    private readonly customerRepo: Repository<Customer>,
  ) {}

  async create(dto: CreateCustomerDto): Promise<CustomerResponseDto> {
    const customer = this.customerRepo.create(dto);
    const saved = await this.customerRepo.save(customer);
    return new CustomerResponseDto(saved);
  }

  async findAll(): Promise<CustomerResponseDto[]> {
    const customers = await this.customerRepo.find();
    return customers.map(c => new CustomerResponseDto(c));
  }

  async findOne(id: number): Promise<CustomerResponseDto> {
    const customer = await this.customerRepo.findOne({ where: { id } });
    if (!customer) throw new NotFoundException('Customer not found');
    return new CustomerResponseDto(customer);
  }

  async update(id: number, dto: UpdateCustomerDto): Promise<CustomerResponseDto> {
    const customer = await this.customerRepo.findOne({ where: { id } });
    if (!customer) throw new NotFoundException('Customer not found');

    Object.assign(customer, dto);
    const updated = await this.customerRepo.save(customer);
    return new CustomerResponseDto(updated);
  }

  async remove(id: number): Promise<{ message: string }> {
    const result = await this.customerRepo.delete(id);
    if ((result.affected ?? 0) === 0) throw new NotFoundException('Customer not found');
    return { message: 'Customer deleted successfully' };
  }
}
