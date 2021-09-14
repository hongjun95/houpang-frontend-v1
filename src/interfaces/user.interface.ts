import { CoreEntity, CoreOutput } from './core.interface';
import { Order } from './order.interface';
import { Product } from './product.interface';
import { Review } from './review.interface';

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
  userImg?: string;
  phoneNumber: string;
  address: string;
  products: Product[];
  orders: Order[];
  reviews: Review[];
}

export interface SignUpInput {
  email: string;
  username: string;
  password: string;
  verifyPassword: string;
  language: Language;
  phoneNumber: string;
  address: string;
  bio?: string;
}
export interface SignUpOutput extends CoreOutput {}

export interface SignInInput {
  email: string;
  password: string;
}

export interface SignInOutput extends CoreOutput {
  token?: string;
}

export interface EditProfileInput {
  email: string;
  username: string;
  language: Language;
  phoneNumber: string;
  address: string;
  bio?: string;
}
export interface EditProfileOutput extends CoreOutput {}

export interface ChangePasswordInput {
  currentPassword: string;
  newPassword: string;
  verifyPassword: string;
}
export interface ChangePasswordOutput extends CoreOutput {}
