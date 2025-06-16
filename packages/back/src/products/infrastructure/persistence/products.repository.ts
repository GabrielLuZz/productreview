import { DeepPartial } from '../../../utils/types/deep-partial.type';
import { NullableType } from '../../../utils/types/nullable.type';
import { Products } from '../../entities/products.entity';
import { Reviews } from 'src/reviews/entities/reviews.entity';

export abstract class ProductsRepository {
  abstract create(
    data: Omit<Products, "createdAt" | "deletedAt" | "updatedAt" | "id">,
  ): Promise<Products>;
  
  abstract findById(id: Products['id']): Promise<NullableType<Products>>;
  
  abstract findAll(): Promise<Products[]>;

  abstract update(
    id: Products['id'],
    payload: DeepPartial<Products>,
  ): Promise<Products | null>;
  
  abstract remove(id: Products['id']): Promise<void>;

  abstract findProductReviews(id: string): Promise<Reviews[]>;
}
