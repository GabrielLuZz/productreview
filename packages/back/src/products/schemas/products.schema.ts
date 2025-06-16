import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';

export type ProductsDocument = Products & Document;

@Schema({ timestamps: true })
export class Products {
  @ApiProperty({
    description: 'Nome do produto',
    example: 'Smartphone XYZ'
  })
  @Prop({ required: true })
  name: string;

  @ApiProperty({
    description: 'Descrição do produto',
    example: 'Um smartphone incrível com as melhores funcionalidades'
  })
  @Prop({ required: true })
  description: string;

  @ApiProperty({
    description: 'Preço do produto',
    example: 999.99
  })
  @Prop({ required: true, min: 0 })
  price: number;

  @ApiProperty({
    description: 'Categoria do produto',
    example: 'Eletrônicos'
  })
  @Prop({ required: true })
  category: string;

  @ApiProperty({
    description: 'Média das avaliações do produto',
    example: 4.5,
    readOnly: true
  })
  @Prop({ default: 0, min: 0, max: 5 })
  averageRating: number;

  @ApiProperty({
    description: 'Total de avaliações do produto',
    example: 10,
    readOnly: true
  })
  @Prop({ default: 0, min: 0 })
  totalRatings: number;
}

export const ProductsSchema = SchemaFactory.createForClass(Products); 