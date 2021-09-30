import { CoreEntity, CoreOutput, PaginationInput, PaginationOutput } from './core.interface';
import { OrderItem } from './order.interface';
import { User } from './user.interface';

export enum RefundStatus {
  Exchanged = '교환',
  Refunded = '환불',
}

export interface Refund extends CoreEntity {
  refundedAt: string;
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

// Get Refunds from Consumer

export interface GetRefundsFromConsumerInput extends PaginationInput {
  consumerId: string;
}

export interface GetRefundsFromConsumerOutput extends PaginationOutput {
  refundItems?: Refund[];
}

// Get Refunds from Consumer

export interface GetRefundsFromProviderInput extends PaginationInput {
  providerId: string;
}
export interface GetRefundsFromProviderOutput extends PaginationOutput {
  refundItems?: Refund[];
}
