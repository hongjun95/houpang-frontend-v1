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

// sign up

export interface SignUpInput
  extends Pick<User, 'email' | 'username' | 'password' | 'language' | 'phoneNumber' | 'address' | 'bio'> {
  verifyPassword: string;
  userImg?: string;
}
export interface SignUpOutput extends CoreOutput {}
export interface SignUpForm
  extends Pick<User, 'email' | 'username' | 'password' | 'language' | 'phoneNumber' | 'address' | 'bio'> {
  images?: Array<File>;
  verifyPassword: string;
}

// sign in

export interface SignInInput {
  email: string;
  password: string;
}
export interface SignInOutput extends CoreOutput {
  token?: string;
}

// edit profile

export interface EditProfileInput
  extends Pick<User, 'email' | 'username' | 'language' | 'phoneNumber' | 'address' | 'bio'> {
  userImg?: string;
}
export interface EditProfileOutput extends CoreOutput {}
export interface EditProfileForm
  extends Pick<User, 'email' | 'username' | 'language' | 'phoneNumber' | 'address' | 'bio'> {
  images?: Array<File>;
}

// Change password

export interface ChangePasswordInput {
  currentPassword: string;
  newPassword: string;
  verifyPassword: string;
}
export interface ChangePasswordOutput extends CoreOutput {}
