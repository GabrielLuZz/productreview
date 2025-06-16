import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { PersistenceModule } from './infrastructure/persistence/document/document.module';

@Module({
  controllers: [
    ProductsController
  ],
  providers: [ProductsService],
  imports: [
    PersistenceModule,
  ],
  exports: [ProductsService]
})
export class ProductsModule {}
