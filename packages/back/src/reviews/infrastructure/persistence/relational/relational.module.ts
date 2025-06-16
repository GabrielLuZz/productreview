import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ReviewsDocumentRepository } from './repositories/reviews.repository';
import { ReviewsRepository } from '../reviews.repository';
import { ReviewsSchema, ReviewsSchemaDefinition } from './entities/reviews.entity';
import { ProductsSchema, ProductsSchemaDefinition } from 'src/products/infrastructure/persistence/relational/entities/products.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ReviewsSchema.name, schema: ReviewsSchemaDefinition },
      { name: ProductsSchema.name, schema: ProductsSchemaDefinition },
    ]),
  ],
  providers: [
    {
      provide: ReviewsRepository,
      useClass: ReviewsDocumentRepository,
    },
  ],
  exports: [ReviewsRepository],
})
export class PersistenceModule {}
