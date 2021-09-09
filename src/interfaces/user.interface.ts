import { CoreEntity, CoreOutput } from './core.interface';
import { Order } from './order.interface';
import { Product } from './product.interface';
import { Review } from './review.interface';

export interface SignUpOutput extends CoreOutput {}

export interface LoginOutput extends CoreOutput {
  token?: string;
}

export enum Language {
  Korean = 'Korean',
  English = 'English',
}

export enum UserRole {
  Consumer = 'Consumer',
  Provider = 'Provider',
  Admin = 'Admin',
}

export interface User extends CoreEntity {
  email: string;
  username: string;
  password: string;
  role: UserRole;
  verified: boolean;
  language: Language;
  bio?: string;
  phoneNumber: string;
  address: string;
  products: Product[];
  orders: Order[];
  reviews: Review[];
}
