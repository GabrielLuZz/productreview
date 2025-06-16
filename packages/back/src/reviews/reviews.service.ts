import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateReviewsDto } from './dto/create-reviews.dto';
import { UpdateReviewsDto } from './dto/update-reviews.dto';
import { Reviews } from './entities/reviews.entity';
import { ReviewsRepository } from './infrastructure/persistence/reviews.repository';

@Injectable()
export class ReviewsService {
  constructor(
    private readonly reviewsRepository: ReviewsRepository,
  ) {}

  create(createReviewsDto: CreateReviewsDto) {
    return this.reviewsRepository.create(createReviewsDto as Reviews);
  }

  findAll() {
    return this.reviewsRepository.findAll();
  }

  findOne(id: string) {
    return this.reviewsRepository.findById(id);
  }

  update(id: string, updateReviewsDto: UpdateReviewsDto) {
    return this.reviewsRepository.update(id, updateReviewsDto);
  }

  async remove(id: string) {
    const review = await this.reviewsRepository.findById(id);
    if (!review) {
      throw new NotFoundException(`Review with ID ${id} not found`);
    }
    await this.reviewsRepository.remove(id);
    return review;
  }
}
