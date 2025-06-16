import { IsString, IsNotEmpty, IsPositive, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateProductsDto {
  @ApiProperty({
    description: 'Nome do produto',
    example: 'Smartphone XYZ',
    required: true
  })
  @IsString({ message: 'O nome deve ser uma string' })
  @IsNotEmpty({ message: 'O nome é obrigatório' })
  name: string;

  @ApiProperty({
    description: 'Descrição do produto',
    example: 'Um smartphone incrível com as melhores funcionalidades',
    required: true
  })
  @IsString({ message: 'A descrição deve ser uma string' })
  @IsNotEmpty({ message: 'A descrição é obrigatória' })
  description: string;

  @ApiProperty({
    description: 'Preço do produto',
    example: 999.99,
    required: true,
    minimum: 0
  })
  @IsNumber({}, { message: 'O preço deve ser um número' })
  @IsPositive({ message: 'O preço deve ser maior que zero' })
  price: number;

  @ApiProperty({
    description: 'Categoria do produto',
    example: 'Eletrônicos',
    required: true
  })
  @IsString({ message: 'A categoria deve ser uma string' })
  @IsNotEmpty({ message: 'A categoria é obrigatória' })
  category: string;
}

