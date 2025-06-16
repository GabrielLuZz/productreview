import { IsString, IsNotEmpty, IsDate, IsPositive, IsNumber, Min, Max } from 'class-validator';

export class CreateReviewsDto {
  @IsNotEmpty()
  productId: string | undefined;

  @IsString()
  @IsNotEmpty()
  author: string;

  @IsNumber()
  @Min(1)
  @Max(5)
  rating: number;

  @IsString()
  @IsNotEmpty()
  comment: string;
}
