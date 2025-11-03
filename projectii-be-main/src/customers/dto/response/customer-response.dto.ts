import { Customer } from '../../entities/customer.entity';

export class CustomerResponseDto {
  id: number;
  name: string;
  email: string;
  phone: string;
  address?: string;
  created_at: Date;
  updated_at: Date;

  constructor(customer: Customer) {
    this.id = customer.id;
    this.name = customer.name;
    this.email = customer.email;
    this.phone = customer.phone;
    this.address = customer.address;
    this.created_at = customer.created_at;
    this.updated_at = customer.updated_at;
  }
}
