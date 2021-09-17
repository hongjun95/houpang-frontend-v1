import { Category } from './category.interface';
import { CoreEntity, CoreOutput, PaginationInput, PaginationOutput } from './core.interface';
import { OrderItem, OrderStatus } from './order.interface';
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

// Get products from provider

export const SortStates = [
  ['createdAt desc', '최신순'],
  ['price desc', '높은가격순'],
  ['price asc', '낮은가격순'],
] as const;
export type SortState = typeof SortStates[number][0];

export interface GetProductsFromProviderInput extends PaginationInput {
  sort?: SortState;
}
export interface GetProductsFromProviderOutput extends PaginationOutput {
  products?: Product[];
}

// Update product

export interface EditProductInput {
  name: string;
  price: number;
  stock: number;
  categoryName: string;
  images: string[];
  info: Array<InfoItem>;
}
export interface EditProductOutput extends CoreOutput {
  product?: Product;
}
export interface EditProductForm {
  name: string;
  price: number;
  stock: number;
  categoryName: string;
  images: Array<File>;
}
export interface EditProductInfoForm {
  [key: string]: string;
}
