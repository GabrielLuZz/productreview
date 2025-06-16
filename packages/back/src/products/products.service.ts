import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductsDto } from './dto/create-products.dto';
import { UpdateProductsDto } from './dto/update-products.dto';
import { Products } from './entities/products.entity';
import { ProductsRepository } from './infrastructure/persistence/products.repository';
import { Reviews } from '../reviews/entities/reviews.entity';

@Injectable()
export class ProductsService {
  constructor(
    private readonly productsRepository: ProductsRepository,
  ) {}

  create(createProductsDto: CreateProductsDto) {
    return this.productsRepository.create(createProductsDto as Products);
  }

  findAll() {
    return this.productsRepository.findAll();
  }

  findOne(id: string) {
    return this.productsRepository.findById(id);
  }

  update(id: string, updateProductsDto: UpdateProductsDto) {
    return this.productsRepository.update(id, updateProductsDto);
  }

  async remove(id: string) {
    const product = await this.productsRepository.findById(id);
    console.log(product);
    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }
    await this.productsRepository.remove(id);
    return product;
  }

  findProductReviews(id: string) {
    return this.productsRepository.findProductReviews(id);
  }
}
