import { Module } from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { ReviewsController } from './reviews.controller';
import { PersistenceModule } from './infrastructure/persistence/relational/relational.module';

@Module({
  controllers: [
    ReviewsController
  ],
  providers: [ReviewsService],
  imports: [
    PersistenceModule,
  ],
  exports: [ReviewsService]
})
export class ReviewsModule {}
