import { CoreEntity } from "./core.interface";
import { Product } from './product.interface';
import { User } from './user.interface';

export interface Review extends CoreEntity {
  content: string;
  commenter: User;
  product: Product;
}
