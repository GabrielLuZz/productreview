import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Reviews } from '../../../../entities/reviews.entity';
import { ReviewsMapper } from '../mappers/reviews.mapper';
import { NullableType } from 'src/utils/types/nullable.type';
import { ReviewsDocument, ReviewsSchema } from '../entities/reviews.entity';
import { ProductsSchema } from 'src/products/infrastructure/persistence/relational/entities/products.entity';

@Injectable()
export class ReviewsDocumentRepository {
  constructor(
    @InjectModel(ReviewsSchema.name) private readonly model: Model<ReviewsDocument>,
    @InjectModel(ProductsSchema.name) private readonly productModel: Model<ProductsSchema>
  ) {}

  async create(data: Reviews): Promise<Reviews> {
    // Garante que o productId seja um ObjectId
    const productId = data.productId ? new Types.ObjectId(data.productId) : undefined;
    
    const doc = new this.model({
      ...ReviewsMapper.toPersistence(data),
      productId
    });
    
    const reviewRes = await doc.save();
    return ReviewsMapper.toDomain(reviewRes);
  }

  async findById(id: string): Promise<NullableType<Reviews>> {
    const review = await this.model.findOne({ _id: id, deletedAt: null }).exec();
    if (!review) return null;
    return ReviewsMapper.toDomain(review);
  }

  async findAll(): Promise<Reviews[]> {
    const list = await this.model.find({ deletedAt: null }).exec() as ReviewsSchema[];
    return list.map(item => ReviewsMapper.toDomain(item));
  }

  async update(id: string, payload: Partial<Reviews>): Promise<NullableType<Reviews>> {
    const oldReview = await this.model.findById(id);
    if (!oldReview) return null;

    // Se o productId foi atualizado, converte para ObjectId
    const updateData = { ...payload };
    if (updateData.productId) {
      updateData.productId = new Types.ObjectId(updateData.productId) as any;
    }

    const updated = await this.model
      .findByIdAndUpdate(id, updateData, { new: true })
      .exec();

    if (!updated) return null;
    return ReviewsMapper.toDomain(updated);
  }

  async remove(id: string): Promise<void> {
    await this.model.findByIdAndUpdate(id, { deletedAt: new Date() }).exec();
  }
}