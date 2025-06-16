import { Products } from '../../../../entities/products.entity';
import { Types } from 'mongoose';
import { ProductsSchema } from '../entities/products.entity';

export class ProductsMapper {
  static toDomain(raw: ProductsSchema & { averageRating?: number; totalReviews?: number }): Products {
    const productRes = new Products();
    productRes.id = raw._id.toString();
    productRes.name = raw.name;
    productRes.description = raw.description;
    productRes.price = raw.price;
    productRes.category = raw.category || '';
    productRes.averageRating = raw.averageRating || 0;
    productRes.totalReviews = raw.totalReviews || 0;
    productRes.createdAt = raw.createdAt;
    productRes.updatedAt = raw.updatedAt;
    productRes.deletedAt = raw.deletedAt;
    return productRes;
  }

  static toPersistence(domain: Products): ProductsSchema {
    const schema = new ProductsSchema();

    if (domain.id) {
      schema._id = domain.id.toString();
    }
    schema.name = domain.name;
    schema.description = domain.description;
    schema.price = domain.price;
    schema.category = domain.category || '';
    schema.createdAt = domain.createdAt;
    schema.updatedAt = domain.updatedAt;
    schema.deletedAt = domain.deletedAt;
    return schema;
  }
}