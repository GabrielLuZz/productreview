import { DeepPartial } from '../../../utils/types/deep-partial.type';
import { NullableType } from '../../../utils/types/nullable.type';
import { Reviews } from '../../entities/reviews.entity';

export abstract class ReviewsRepository {
  abstract create(
    data: Omit<Reviews, "createdAt" | "deletedAt" | "updatedAt" | "id">,
  ): Promise<Reviews>;
  
  abstract findById(id: Reviews['id']): Promise<NullableType<Reviews>>;
  
  abstract findAll(): Promise<Reviews[]>;

  abstract update(
    id: Reviews['id'],
    payload: DeepPartial<Reviews>,
  ): Promise<Reviews | null>;
  
  abstract remove(id: Reviews['id']): Promise<void>;
}
