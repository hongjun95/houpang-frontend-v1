import { CoreEntity, CoreOutput } from './core.interface';
import { Product } from './product.interface';
import { User } from './user.interface';

export enum OrderStatus {
  Checking = '확인중',
  Received = '주문 접수',
  Delivering = '배달중',
  Delivered = '배달 완료',
  Canceled = '주문 취소',
}

export interface Order extends CoreEntity {
  consumer: User;
  orderItems: OrderItem[];
  total: number;
  status: OrderStatus;
  destination: string;
  deliverRequest: string;
  orderedAt: string;
}

export interface OrderItem extends CoreEntity {
  order: Order;
  product: Product;
  count: number;
}

// Create order

export interface OrderForm {
  deliverRequest?: string;
}

export interface CreateOrderItemInput {
  productId: string;
  count: number;
}
export interface CreateOrderInput {
  createOrderItems: CreateOrderItemInput[];
  destination: string;
  deliverRequest: string;
}
export interface CreateOrderOutput extends CoreOutput {
  orderId?: string;
}

// Get Orders
export interface GetOrdersFromConsumerInput {
  status?: OrderStatus;
  consumerId: string;
}

export interface GetOrdersFromConsumerOutput extends CoreOutput {
  orders?: Order[];
}
