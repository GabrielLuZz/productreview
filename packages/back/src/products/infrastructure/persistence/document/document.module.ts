import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ProductsDocumentRepository } from './repositories/products.repository';
import { ProductsRepository } from '../products.repository';
import { ProductsSchema, ProductsSchemaDefinition } from './entities/products.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ProductsSchema.name, schema: ProductsSchemaDefinition },
    ]),
  ],
  providers: [
    {
      provide: ProductsRepository,
      useClass: ProductsDocumentRepository,
    },
  ],
  exports: [ProductsRepository],
})
export class PersistenceModule {}
