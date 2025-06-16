import { Reviews } from '../../../../entities/reviews.entity';
import { Types } from 'mongoose';
import { ReviewsSchema } from '../entities/reviews.entity';

export class ReviewsMapper {
  static toDomain(raw: ReviewsSchema): Reviews {
    const reviewRes = new Reviews();
    reviewRes.id = raw._id.toString();
    reviewRes.productId = raw.productId?.toString();
    reviewRes.author = raw.author;
    reviewRes.rating = raw.rating;
    reviewRes.comment = raw.comment;
    reviewRes.createdAt = raw.createdAt;
    reviewRes.updatedAt = raw.updatedAt;
    reviewRes.deletedAt = raw.deletedAt;
    return reviewRes;
  }

  static toPersistence(domain: Reviews): ReviewsSchema {
    const schema = new ReviewsSchema();
    if (domain.id) {
      schema._id = domain.id
    }
    if (domain.productId) {
      schema.productId = new Types.ObjectId(domain.productId);
    }
    schema.author = domain.author;
    schema.rating = domain.rating;
    schema.comment = domain.comment;
    schema.createdAt = domain.createdAt;
    schema.updatedAt = domain.updatedAt;
    schema.deletedAt = domain.deletedAt;
    return schema;
  }
}
