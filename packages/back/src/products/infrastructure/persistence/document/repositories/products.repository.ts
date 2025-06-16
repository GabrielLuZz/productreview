import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, FilterQuery, Types } from 'mongoose';
import { Products } from '../../../../entities/products.entity';
import { ProductsMapper } from '../mappers/products.mapper';
import { NullableType } from 'src/utils/types/nullable.type';
import { ProductsDocument, ProductsSchema } from '../entities/products.entity';
import { Reviews } from 'src/reviews/entities/reviews.entity';

@Injectable()
export class ProductsDocumentRepository {
  constructor(
    @InjectModel(ProductsSchema.name) private readonly model: Model<ProductsDocument>
  ) {}

  async create(data: Products): Promise<Products> {
    const doc = new this.model(ProductsMapper.toPersistence(data));
    const res = await doc.save();
    return ProductsMapper.toDomain(res);
  }

  async findById(id: string): Promise<NullableType<Products>> {
    const pipeline = [
      {
        $match: {
          _id: new Types.ObjectId(id),
          deletedAt: null
        }
      },
      {
        $lookup: {
          from: 'reviewsschemas',
          localField: '_id',
          foreignField: 'productId',
          as: 'reviews'
        }
      },
      {
        $addFields: {
          averageRating: {
            $cond: {
              if: { $gt: [{ $size: '$reviews' }, 0] },
              then: { $avg: '$reviews.rating' },
              else: 0
            }
          },
          totalReviews: { $size: '$reviews' }
        }
      }
    ];

    const [findRes] = await this.model.aggregate(pipeline).exec();
    if (!findRes) return null;
    return ProductsMapper.toDomain(findRes);
  }

  async findAll(): Promise<Products[]> {
    const pipeline = [
      {
        $match: {
          deletedAt: null
        }
      },
      {
        $lookup: {
          from: 'reviewsschemas',
          localField: '_id',
          foreignField: 'productId',
          as: 'reviews'
        }
      },
      {
        $addFields: {
          averageRating: {
            $cond: {
              if: { $gt: [{ $size: '$reviews' }, 0] },
              then: { $avg: '$reviews.rating' },
              else: 0
            }
          },
          totalReviews: { $size: '$reviews' }
        }
      }
    ];

    const list = await this.model.aggregate(pipeline).exec();
    return list.map(item => ProductsMapper.toDomain(item));
  }

  async update(id: string, payload: Partial<Products>): Promise<NullableType<Products>> {
    const updated = await this.model
      .findByIdAndUpdate(id, payload, { new: true })
      .exec();
    if (!updated) return null;

    // Após atualizar, buscamos com as avaliações
    return this.findById(id);
  }

  async remove(id: string): Promise<void> {
    await this.model.findByIdAndUpdate(id, { deletedAt: new Date() }).exec();
  }

  async findProductReviews(id: string): Promise<Reviews[]> {
    const pipeline = [
      {
        $match: {
          _id: new Types.ObjectId(id),
          deletedAt: null
        }
      },
      {
        $lookup: {
          from: 'reviewsschemas',
          localField: '_id',
          foreignField: 'productId',
          as: 'reviews'
        }
      },
      {
        $project: {
          _id: 0,
          reviews: 1
        }
      }
    ];

    const [result] = await this.model.aggregate(pipeline).exec();
    if (!result) return [];

    return result.reviews.map(review => ({
      id: review._id.toString(),
      productId: review.productId.toString(),
      author: review.author,
      rating: review.rating,
      comment: review.comment,
      createdAt: review.createdAt,
      updatedAt: review.updatedAt,
      deletedAt: review.deletedAt
    }));
  }
}