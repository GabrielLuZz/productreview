import { IsEnum, IsString, IsDecimal, IsOptional, IsNotEmpty, IsDate, Length, ValidateNested, IsPositive, IsInt, IsUUID, IsEmail, IsNumber } from 'class-validator';
import { Exclude, Type } from 'class-transformer';

export class Products {
  @IsString()
  @IsUUID()
  id: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsNumber()
  @IsPositive()
  price: number;

  @IsString()
  @IsNotEmpty()
  category: string;

  @IsNumber()
  @IsOptional()
  averageRating: number;

  @IsNumber()
  @IsOptional()
  totalReviews: number;

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
