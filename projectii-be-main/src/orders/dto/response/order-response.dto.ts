import { Order } from '../../entities/orders.entity';

export class OrderResponseDto {
  id: number;
  customer: {
    id: number;
    name: string;
    email: string;
  };
  items: {
    product: {
      id: number;
      name: string;
      price: number;
    };
    quantity: number;
    line_total: number;
  }[];
  total_price: number;
  status: string;
  created_at: Date;
  updated_at: Date;

  constructor(order: Order) {
    this.id = order.id;
    this.customer = {
      id: order.customer.id,
      name: order.customer.name,
      email: order.customer.email,
    };
    this.items = order.items.map((it) => ({
      product: {
        id: it.product.id,
        name: it.product.name,
        price: Number(it.product.price),
      },
      quantity: it.quantity,
      line_total: Number(it.line_total),
    }));
    this.total_price = Number(order.total_price);
    this.status = order.status;
    this.created_at = order.created_at;
    this.updated_at = order.updated_at;
  }
}
