import { CoreEntity } from './core.interface';
import { Product } from './product.interface';
import { User } from './user.interface';

export interface Review extends CoreEntity {
  commenter: User;
  product: Product;
  content: string;
  grade: number;
  images: string[];
}
