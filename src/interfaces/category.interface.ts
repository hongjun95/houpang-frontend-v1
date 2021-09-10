import { CoreEntity, CoreOutput } from './core.interface';
import { Product } from './product.interface';

export interface Category extends CoreEntity {
  name: string;
  coverImg: string;
  slug: string;
  products: Product[];
}

export interface GetAllCategoriesOutput extends CoreOutput {
  categories?: Category[];
}
