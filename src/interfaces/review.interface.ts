import { CoreOutput, CoreEntity, PaginationInput, PaginationOutput } from './core.interface';
import { Product } from './product.interface';
import { User } from './user.interface';

export interface Review extends CoreEntity {
  commenter: User;
  product: Product;
  content: string;
  rating: number;
  images: string[];
}

// create review
export interface CreateReviewInput extends Pick<Review, 'content' | 'rating' | 'images'> {
  productId: string;
}
export interface CreateReviewOutput extends CoreOutput {
  review?: Review;
}
export interface CreateReviewForm extends Pick<Review, 'content'> {
  images: Array<File>;
}

// Get Review on Product
export interface GetReviewsOnProductInput extends PaginationInput {
  productId: string;
}
export interface GetReviewsOnProductOutput extends PaginationOutput {
  reviews?: Review[];
  avgRating?: number;
}
