import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { EntityDocumentHelper } from 'src/utils/document-entity.helper';

export type ProductsDocument = ProductsSchema & Document;

@Schema({
  timestamps: true,
  toJSON: { virtuals: true },
})
export class ProductsSchema extends EntityDocumentHelper {

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true, type: Number })
  price: number;

  @Prop({ required: false })
  category?: string;

  @Prop()
  createdAt: Date;

  @Prop()
  updatedAt: Date;

  @Prop()
  deletedAt?: Date;
}

export const ProductsSchemaDefinition = SchemaFactory.createForClass(ProductsSchema);
ProductsSchemaDefinition.index({ deletedAt: 1 });
