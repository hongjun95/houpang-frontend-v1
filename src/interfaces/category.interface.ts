import { CoreEntity, CoreOutput, PaginationInput, PaginationOutput } from './core.interface';
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

export interface GetProductsOnCategoryInput extends PaginationInput {
  slug?: string;
}
export interface GetProductsOnCategoryOutput extends PaginationOutput {
  products?: Product[];
}

export interface GetProductsByCategoryIdInput extends PaginationInput {
  categoryId: string;
  order?: string;
}
export interface GetProductsByCategoryIdOutput extends PaginationOutput {
  products?: Product[];
  categoryName: string;
}
