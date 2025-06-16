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

  @Prop({ required: true })
  category: string;

  @Prop({ type: Number, default: 0, select: false })
  averageRating: number;

  @Prop({ type: Number, default: 0, select: false })
  totalRatings: number;

  @Prop()
  createdAt: Date;

  @Prop()
  updatedAt: Date;

  @Prop()
  deletedAt?: Date;
}

export const ProductsSchemaDefinition = SchemaFactory.createForClass(ProductsSchema);

// Configuração para não permitir atualização direta dos campos calculados
ProductsSchemaDefinition.pre('save', function(next) {
  if (this.isModified('averageRating') || this.isModified('totalRatings')) {
    return next(new Error('Não é permitido atualizar averageRating ou totalRatings diretamente'));
  }
  next();
});

// Configuração para não permitir atualização via findOneAndUpdate
ProductsSchemaDefinition.pre('findOneAndUpdate', function(next) {
  const update = this.getUpdate() as any;
  if (update && (update.$set?.averageRating || update.$set?.totalRatings)) {
    return next(new Error('Não é permitido atualizar averageRating ou totalRatings diretamente'));
  }
  next();
});

ProductsSchemaDefinition.index({ deletedAt: 1 });
ProductsSchemaDefinition.index({ category: 1 });
ProductsSchemaDefinition.index({ averageRating: -1 }); 