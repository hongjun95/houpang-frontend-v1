import { CoreEntity, CoreOutput } from './core.interface';
import { OrderItem } from './order.interface';
import { Product } from './product.interface';
import { User } from './user.interface';

export enum RefundStatus {
  Exchanged = '교환',
  Refunded = '환불',
}

export interface Refund extends CoreEntity {
  orderItem: OrderItem;
  count: number;
  problemTitle: string;
  problemDescription: string;
  status: RefundStatus;
  refundee: User;
  recallPlace: string;
  recallDay: Date;
  recallTitle: string;
  recallDescription?: string;
  sendPlace?: string;
  sendDay?: Date;
  refundPay?: number;
}

// Request Refund

export interface RequestRefundInput {
  orderItemId: string;
  count: number;
  problemTitle: string;
  problemDescription: string;
  status: RefundStatus;
  recallPlace: string;
  recallDay: Date;
  recallTitle: string;
  recallDescription?: string;
  sendPlace?: string;
  sendDay?: Date;
  refundPay?: number;
}
export interface RequestRefundOutput extends CoreOutput {
  orderItem?: OrderItem;
}
