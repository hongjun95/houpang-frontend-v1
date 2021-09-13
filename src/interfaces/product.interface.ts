import { Category } from './category.interface';
import { CoreEntity, CoreOutput } from './core.interface';
import { OrderItem } from './order.interface';
import { Review } from './review.interface';
import { User } from './user.interface';

export interface InfoItem {
  key: string;
  value: string;
}

export interface Product extends CoreEntity {
  name: string;
  provider: User;
  price: number;
  stock: number;
  images: string[];
  category: Category;
  info?: InfoItem[];
  orderItems: OrderItem[];
  reviews: Review[];
}

export interface AddProductInput {
  name: string;
  price: number;
  stock: number;
  categoryName: string;
  images: Array<File>;
}

export interface AddProductInfoInput {
  [key: string]: string;
}

export interface AddProductOutput extends CoreOutput {
  product?: Product;
}
