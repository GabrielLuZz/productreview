import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
  Request,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductsDto } from './dto/create-products.dto';
import { UpdateProductsDto } from './dto/update-products.dto';
import { Products } from './entities/products.entity';
import { Reviews } from '../reviews/entities/reviews.entity';
import {
  ApiCreatedResponse,
  ApiOkResponse,
  ApiParam,
  ApiTags,
  ApiNoContentResponse,
  ApiOperation,
  ApiBody,
  ApiResponse,
} from '@nestjs/swagger';

@ApiTags('Produtos')
@Controller({
  path: 'products',
  version: '1',
})
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  @ApiOperation({ summary: 'Criar um novo produto' })
  @ApiBody({ type: CreateProductsDto })
  @ApiResponse({ 
    status: 201, 
    description: 'Produto criado com sucesso',
    type: Products
  })
  @ApiResponse({ 
    status: 400, 
    description: 'Dados inválidos fornecidos'
  })
  create(@Body() createProductsDto: CreateProductsDto, @Request() req) {
    return this.productsService.create(createProductsDto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar todos os produtos' })
  @ApiResponse({ 
    status: 200, 
    description: 'Lista de produtos retornada com sucesso',
    type: [Products]
  })
  @HttpCode(HttpStatus.OK)
  findAll() {
    return this.productsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar um produto pelo ID' })
  @ApiParam({ 
    name: 'id', 
    description: 'ID do produto',
    type: String
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Produto encontrado com sucesso',
    type: Products
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Produto não encontrado'
  })
  @HttpCode(HttpStatus.OK)
  findOne(@Param('id') id: string) {
    return this.productsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar um produto' })
  @ApiParam({ 
    name: 'id', 
    description: 'ID do produto',
    type: String
  })
  @ApiBody({ type: UpdateProductsDto })
  @ApiResponse({ 
    status: 200, 
    description: 'Produto atualizado com sucesso',
    type: Products
  })
  @ApiResponse({ 
    status: 400, 
    description: 'Dados inválidos fornecidos'
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Produto não encontrado'
  })
  @HttpCode(HttpStatus.OK)
  update(@Param('id') id: string, @Body() updateProductsDto: UpdateProductsDto) {
    return this.productsService.update(id, updateProductsDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remover um produto' })
  @ApiParam({ 
    name: 'id', 
    description: 'ID do produto',
    type: String
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Produto removido com sucesso'
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Produto não encontrado'
  })
  @HttpCode(HttpStatus.OK)
  remove(@Param('id') id: string) {
    return this.productsService.remove(id);
  }

  @Get(':id/reviews')
  @ApiOperation({ summary: 'Buscar reviews de um produto específico' })
  @ApiParam({ 
    name: 'id', 
    description: 'ID do produto',
    type: String
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Reviews do produto retornadas com sucesso',
    type: [Reviews]
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Produto não encontrado'
  })
  @HttpCode(HttpStatus.OK)
  findProductReviews(@Param('id') id: string) {
    return this.productsService.findProductReviews(id);
  }
}
