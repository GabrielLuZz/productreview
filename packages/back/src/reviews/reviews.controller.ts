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
import { ReviewsService } from './reviews.service';
import { CreateReviewsDto } from './dto/create-reviews.dto';
import { UpdateReviewsDto } from './dto/update-reviews.dto';
import { Reviews } from './entities/reviews.entity';
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

@ApiTags('Reviews')
@Controller({
  path: 'reviews',
  version: '1',
})
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Post()
  @ApiOperation({ summary: 'Criar uma nova review' })
  @ApiBody({ type: CreateReviewsDto })
  @ApiResponse({ 
    status: 201, 
    description: 'Review criada com sucesso',
    type: Reviews
  })
  @ApiResponse({ 
    status: 400, 
    description: 'Dados inválidos fornecidos'
  })
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createReviewsDto: CreateReviewsDto, @Request() req) {
    return this.reviewsService.create(createReviewsDto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar todas as reviews' })
  @ApiResponse({ 
    status: 200, 
    description: 'Lista de reviews retornada com sucesso',
    type: [Reviews]
  })
  @HttpCode(HttpStatus.OK)
  findAll() {
    return this.reviewsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar uma review pelo ID' })
  @ApiParam({ 
    name: 'id', 
    description: 'ID da review',
    type: String
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Review encontrada com sucesso',
    type: Reviews
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Review não encontrada'
  })
  @HttpCode(HttpStatus.OK)
  findOne(@Param('id') id: string) {
    return this.reviewsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar uma review' })
  @ApiParam({ 
    name: 'id', 
    description: 'ID da review',
    type: String
  })
  @ApiBody({ type: UpdateReviewsDto })
  @ApiResponse({ 
    status: 200, 
    description: 'Review atualizada com sucesso',
    type: Reviews
  })
  @ApiResponse({ 
    status: 400, 
    description: 'Dados inválidos fornecidos'
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Review não encontrada'
  })
  @HttpCode(HttpStatus.OK)
  update(@Param('id') id: string, @Body() updateReviewsDto: UpdateReviewsDto) {
    return this.reviewsService.update(id, updateReviewsDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remover uma review' })
  @ApiParam({ 
    name: 'id', 
    description: 'ID da review',
    type: String
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Review removida com sucesso',
    type: Reviews
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Review não encontrada'
  })
  @HttpCode(HttpStatus.OK)
  async remove(@Param('id') id: string) {
    const review = await this.reviewsService.findOne(id);
    await this.reviewsService.remove(id);
    return review;
  }
}
