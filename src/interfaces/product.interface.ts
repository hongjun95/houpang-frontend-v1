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

// Add product

export interface AddProductInput {
  name: string;
  price: number;
  stock: number;
  categoryName: string;
  images: string[];
  info: Array<InfoItem>;
}
export interface AddProductOutput extends CoreOutput {
  product?: Product;
}
export interface AddProductForm {
  name: string;
  price: number;
  stock: number;
  categoryName: string;
  images: Array<File>;
}
export interface AddProductInfoForm {
  [key: string]: string;
}

// Find Product by Id

export interface FindProductByIdInput {
  productId: string;
}
export interface FindProductByIdOutput extends CoreOutput {
  product?: Product;
}
