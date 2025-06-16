import { IsString, IsOptional, IsNotEmpty, IsDate, IsPositive, IsUUID, IsNumber, Min, Max } from 'class-validator';
import { Exclude, Type } from 'class-transformer';

export class Reviews {
  @IsString()
  @IsUUID()
  id: string;

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

  @IsDate()
  @Type(() => Date)
  @Exclude()
  updatedAt: Date;

  @IsDate()
  @Type(() => Date)
  @Exclude()
  createdAt: Date;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  @Exclude()
  deletedAt: Date | undefined;
}
