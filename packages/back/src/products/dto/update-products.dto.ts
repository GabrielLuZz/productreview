import { IsString, IsOptional, IsNotEmpty, IsPositive, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateProductsDto {
  @ApiProperty({
    description: 'Nome do produto',
    example: 'Smartphone XYZ',
    required: false
  })
  @IsString({ message: 'O nome deve ser uma string' })
  @IsOptional()
  @IsNotEmpty({ message: 'O nome não pode ser vazio' })
  name?: string;

  @ApiProperty({
    description: 'Descrição do produto',
    example: 'Um smartphone incrível com as melhores funcionalidades',
    required: false
  })
  @IsString({ message: 'A descrição deve ser uma string' })
  @IsOptional()
  @IsNotEmpty({ message: 'A descrição não pode ser vazia' })
  description?: string;

  @ApiProperty({
    description: 'Preço do produto',
    example: 999.99,
    required: false,
    minimum: 0
  })
  @IsNumber({}, { message: 'O preço deve ser um número' })
  @IsOptional()
  @IsPositive({ message: 'O preço deve ser maior que zero' })
  price?: number;

  @ApiProperty({
    description: 'Categoria do produto',
    example: 'Eletrônicos',
    required: false
  })
  @IsString({ message: 'A categoria deve ser uma string' })
  @IsOptional()
  @IsNotEmpty({ message: 'A categoria não pode ser vazia' })
  category?: string;
}
