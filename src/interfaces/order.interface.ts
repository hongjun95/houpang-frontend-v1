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
  destination: string;
  deliverRequest: string;
  orderedAt: string;
}

export interface OrderItem extends CoreEntity {
  order: Order;
  product: Product;
  count: number;
  status: OrderStatus;
}

// Get Orders from Consumer

export interface GetOrdersFromConsumerInput {
  consumerId: string;
}
export interface GetOrdersFromConsumerOutput extends CoreOutput {
  orders?: Order[];
}

// Get Orders from Provider

export interface GetOrdersFromProviderInput {
  providerId: string;
}
export interface GetOrdersFromProviderOutput extends CoreOutput {
  orderItems?: OrderItem[];
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

// Cancel order

export interface CancelOrderItemInput {
  orderItemId: string;
}
export interface CancelOrderItemOutput extends CoreOutput {
  orderItem?: OrderItem;
}

// Update order status

export interface UpdateOrerStatusInput {
  orderItemId: string;
  orderStatus: OrderStatus;
}
export interface UpdateOrerStatusOutput extends CoreOutput {
  orderItem?: OrderItem;
}
