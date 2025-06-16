import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { EntityDocumentHelper } from 'src/utils/document-entity.helper';

export type ReviewsDocument = ReviewsSchema & Document;

@Schema({
  timestamps: true,
  toJSON: { virtuals: true },
})
export class ReviewsSchema extends EntityDocumentHelper {
  @Prop({ type: Types.ObjectId, ref: 'Products', required: false })
  productId?: Types.ObjectId;

  @Prop({ required: true })
  author: string;

  @Prop({ required: true, type: Number })
  rating: number;

  @Prop({ required: true })
  comment: string;

  @Prop()
  createdAt: Date;

  @Prop()
  updatedAt: Date;

  @Prop()
  deletedAt?: Date;
}

export const ReviewsSchemaDefinition = SchemaFactory.createForClass(ReviewsSchema);
ReviewsSchemaDefinition.index({ deletedAt: 1 });
ReviewsSchemaDefinition.index({ productId: 1 });
