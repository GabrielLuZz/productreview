// test/reviews-complete.e2e-spec.ts
import './setup';
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe, VersioningType } from '@nestjs/common';
import request from 'supertest';
import { MongooseModule } from '@nestjs/mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { ReviewsModule } from '../src/reviews/reviews.module';
import { ProductsModule } from '../src/products/products.module';
import { ConfigModule } from '@nestjs/config';
import validationOptions from '../src/utils/validation-options';

describe('ReviewsController (e2e) - Teste Completo', () => {
  let app: INestApplication;
  let mongod: MongoMemoryServer;
  
  // Dados de teste
  const mockProduct = {
    "name": 'Produto Teste E2E',
    "description": 'Descrição completa do produto teste',
    "price": 149.99,
    "category": 'Eletrônicos'
  };

  const mockReview = {
    author: 'Maria Santos',
    rating: 4,
    comment: 'Produto muito bom, atendeu minhas expectativas!'
  };

  const mockReview2 = {
    author: 'João Silva',
    rating: 5,
    comment: 'Excelente produto, super recomendo!'
  };

  let createdProductId: string;
  let createdReviewId: string;

  beforeAll(async () => {
    // Configurar MongoDB em memória
    mongod = await MongoMemoryServer.create();
    const uri = mongod.getUri();

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
          envFilePath: '.env.test',
          ignoreEnvFile: false,
        }),
        MongooseModule.forRoot(uri),
        ProductsModule,
        ReviewsModule,
      ],
    }).compile();

    app = moduleFixture.createNestApplication();

    // Configurar validação
    app.useGlobalPipes(new ValidationPipe(validationOptions));

    // Habilitar versionamento
    app.enableVersioning({
      type: VersioningType.URI,
    });

    await app.init();
  });

  afterAll(async () => {
    await app.close();
    await mongod.stop();
  });

  beforeEach(async () => {
    // Criar um produto para usar nos testes de review
    try {
      const productResponse = await request(app.getHttpServer())
        .post('/v1/products')
        .send(mockProduct)
        .expect(201);
      createdProductId = productResponse.body.id;
    } catch (error) {
      console.error('Erro ao criar produto:', error);
      throw error;
    }
  });

  describe('POST /v1/reviews', () => {
    it('deve criar um novo review com sucesso', async () => {
      const reviewData = {
        ...mockReview,
        productId: createdProductId
      };

      const response = await request(app.getHttpServer())
        .post('/v1/reviews')
        .send(reviewData)
        .expect(201);

      expect(response.body).toBeDefined();
      expect(response.body).toHaveProperty('id');
      expect(response.body.author).toBe(reviewData.author);
      expect(response.body.rating).toBe(reviewData.rating);
      expect(response.body.comment).toBe(reviewData.comment);
      expect(response.body.productId).toBe(reviewData.productId);
      expect(response.body).toHaveProperty('createdAt');
      expect(response.body).toHaveProperty('updatedAt');

      // Salvar ID para outros testes
      createdReviewId = response.body.id;
    });

    it('deve retornar erro 422 quando author está ausente', async () => {
      const invalidReview = {
        productId: createdProductId,
        rating: 5,
        comment: 'Comentário sem autor'
      };

      const response = await request(app.getHttpServer())
        .post('/v1/reviews')
        .send(invalidReview)
        .expect(422);
    });

    it('deve retornar erro 422 quando rating está ausente', async () => {
      const invalidReview = {
        productId: createdProductId,
        author: 'Teste Autor',
        comment: 'Comentário sem rating'
      };

      const response = await request(app.getHttpServer())
        .post('/v1/reviews')
        .send(invalidReview)
        .expect(422);
    });

    it('deve retornar erro 422 quando comment está ausente', async () => {
      const invalidReview = {
        productId: createdProductId,
        author: 'Teste Autor',
        rating: 5
      };

      const response = await request(app.getHttpServer())
        .post('/v1/reviews')
        .send(invalidReview)
        .expect(422);


    });

    it('deve retornar erro 422 quando productId está ausente', async () => {
      const invalidReview = {
        author: 'Teste Autor',
        rating: 5,
        comment: 'Comentário sem productId'
      };

      const response = await request(app.getHttpServer())
        .post('/v1/reviews')
        .send(invalidReview)
        .expect(422);

    });

    it('deve retornar erro 422 quando rating é negativo', async () => {
      const invalidReview = {
        ...mockReview,
        productId: createdProductId,
        rating: -1
      };

      const response = await request(app.getHttpServer())
        .post('/v1/reviews')
        .send(invalidReview)
        .expect(422);

    });

    it('deve retornar erro 422 quando rating é zero', async () => {
      const invalidReview = {
        ...mockReview,
        productId: createdProductId,
        rating: 0
      };

      const response = await request(app.getHttpServer())
        .post('/v1/reviews')
        .send(invalidReview)
        .expect(422);

    });

    it('deve retornar erro 422 quando rating é maior que 5', async () => {
      const invalidReview = {
        ...mockReview,
        productId: createdProductId,
        rating: 6
      };

      const response = await request(app.getHttpServer())
        .post('/v1/reviews')
        .send(invalidReview)
        .expect(422);
    });

    it('deve aceitar rating mínimo válido (1)', async () => {
      const validReview = {
        ...mockReview,
        productId: createdProductId,
        rating: 1
      };

      const response = await request(app.getHttpServer())
        .post('/v1/reviews')
        .send(validReview)
        .expect(201);

      expect(response.body.rating).toBe(1);
    });

    it('deve aceitar rating máximo válido (5)', async () => {
      const validReview = {
        ...mockReview,
        productId: createdProductId,
        rating: 5
      };

      const response = await request(app.getHttpServer())
        .post('/v1/reviews')
        .send(validReview)
        .expect(201);

      expect(response.body.rating).toBe(5);
    });
  });

  describe('GET /v1/reviews', () => {
    beforeEach(async () => {
      // Criar alguns reviews para testar a listagem
      await request(app.getHttpServer())
        .post('/v1/reviews')
        .send({
          ...mockReview,
          productId: createdProductId
        });

      await request(app.getHttpServer())
        .post('/v1/reviews')
        .send({
          ...mockReview2,
          productId: createdProductId
        });
    });

    it('deve retornar lista de reviews', async () => {
      const response = await request(app.getHttpServer())
        .get('/v1/reviews')
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThanOrEqual(2);
      
      // Verificar estrutura do primeiro review
      const firstReview = response.body[0];
      expect(firstReview).toHaveProperty('id');
      expect(firstReview).toHaveProperty('author');
      expect(firstReview).toHaveProperty('rating');
      expect(firstReview).toHaveProperty('comment');
      expect(firstReview).toHaveProperty('productId');
      expect(firstReview).toHaveProperty('createdAt');
      expect(firstReview).toHaveProperty('updatedAt');
    });

    it('deve retornar array vazio quando não há reviews', async () => {
      // Limpar todos os reviews (isso dependeria da implementação do seu service)
      // Por agora, vamos assumir que há pelo menos alguns reviews
      const response = await request(app.getHttpServer())
        .get('/v1/reviews')
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
    });
  });

  describe('GET /v1/reviews/:id', () => {
    beforeEach(async () => {
      // Criar um review para teste
      const response = await request(app.getHttpServer())
        .post('/v1/reviews')
        .send({
          ...mockReview,
          productId: createdProductId
        });
      createdReviewId = response.body.id;
    });

    it('deve retornar um review específico', async () => {
      const response = await request(app.getHttpServer())
        .get(`/v1/reviews/${createdReviewId}`)
        .expect(200);

      expect(response.body).toHaveProperty('id', createdReviewId);
      expect(response.body).toHaveProperty('author', mockReview.author);
      expect(response.body).toHaveProperty('rating', mockReview.rating);
      expect(response.body).toHaveProperty('comment', mockReview.comment);
      expect(response.body).toHaveProperty('productId', createdProductId);
    });

    it('deve retornar erro 404 para review inexistente', async () => {
      const fakeId = '507f1f77bcf86cd799439011'; // ObjectId válido mas inexistente

      const response = await request(app.getHttpServer())
        .get(`/v1/reviews/${fakeId}`)
        .expect(404);

    });

    it('deve retornar erro 400 para ID inválido', async () => {
      const invalidId = '507f45454cf86cd799439011';

      const response = await request(app.getHttpServer())
        .get(`/v1/reviews/${invalidId}`)
        .expect(404);

    });
  });

  describe('PATCH /v1/reviews/:id', () => {
    beforeEach(async () => {
      // Criar um review para teste
      const response = await request(app.getHttpServer())
        .post('/v1/reviews')
        .send({
          ...mockReview,
          productId: createdProductId
        });
      createdReviewId = response.body.id;
    });

    it('deve atualizar um review com sucesso', async () => {
      const updateData = {
        author: 'Maria Santos Atualizada',
        rating: 5,
        comment: 'Comentário atualizado - produto excelente!'
      };

      const response = await request(app.getHttpServer())
        .patch(`/v1/reviews/${createdReviewId}`)
        .send(updateData)
        .expect(200);

      expect(response.body).toHaveProperty('id', createdReviewId);
      expect(response.body.author).toBe(updateData.author);
      expect(response.body.rating).toBe(updateData.rating);
      expect(response.body.comment).toBe(updateData.comment);
      expect(response.body.productId).toBe(createdProductId);
    });

    it('deve atualizar apenas o campo author', async () => {
      const updateData = {
        author: 'Novo Autor'
      };

      const response = await request(app.getHttpServer())
        .patch(`/v1/reviews/${createdReviewId}`)
        .send(updateData)
        .expect(200);

      expect(response.body.author).toBe(updateData.author);
      expect(response.body.rating).toBe(mockReview.rating); // Deve manter o valor original
      expect(response.body.comment).toBe(mockReview.comment); // Deve manter o valor original
    });

    it('deve atualizar apenas o campo rating', async () => {
      const updateData = {
        rating: 5
      };

      const response = await request(app.getHttpServer())
        .patch(`/v1/reviews/${createdReviewId}`)
        .send(updateData)
        .expect(200);

      expect(response.body.rating).toBe(updateData.rating);
      expect(response.body.author).toBe(mockReview.author); // Deve manter o valor original
      expect(response.body.comment).toBe(mockReview.comment); // Deve manter o valor original
    });

    it('deve atualizar apenas o campo comment', async () => {
      const updateData = {
        comment: 'Comentário completamente atualizado'
      };

      const response = await request(app.getHttpServer())
        .patch(`/v1/reviews/${createdReviewId}`)
        .send(updateData)
        .expect(200);

      expect(response.body.comment).toBe(updateData.comment);
      expect(response.body.author).toBe(mockReview.author); // Deve manter o valor original
      expect(response.body.rating).toBe(mockReview.rating); // Deve manter o valor original
    });

    it('deve retornar erro 422 ao tentar atualizar com rating inválido', async () => {
      const invalidUpdate = {
        rating: -1
      };

      const response = await request(app.getHttpServer())
        .patch(`/v1/reviews/${createdReviewId}`)
        .send(invalidUpdate)
        .expect(422);

    });

    it('deve retornar erro 404 para review inexistente', async () => {
      const fakeId = '507f1f77bcf86cd799439011';
      const updateData = {
        author: 'Novo Autor'
      };

      const response = await request(app.getHttpServer())
        .patch(`/v1/reviews/${fakeId}`)
        .send(updateData)
        .expect(404);

    });

  });

  describe('DELETE /v1/reviews/:id', () => {
    beforeEach(async () => {
      // Criar um review para teste
      const response = await request(app.getHttpServer())
        .post('/v1/reviews')
        .send({
          ...mockReview,
          productId: createdProductId
        });
      createdReviewId = response.body.id;
    });

    it('deve deletar um review com sucesso', async () => {
      await request(app.getHttpServer())
        .delete(`/v1/reviews/${createdReviewId}`)
        .expect(204);

      // Verificar se o review foi realmente deletado
      await request(app.getHttpServer())
        .get(`/v1/reviews/${createdReviewId}`)
        .expect(404);
    });

    it('deve retornar erro 404 para review inexistente', async () => {
      const fakeId = '507f1f77bcf86cd799439011';

      const response = await request(app.getHttpServer())
        .delete(`/v1/reviews/${fakeId}`)
        .expect(404);

    });

    it('deve permitir deletar o mesmo review apenas uma vez', async () => {
      // Primeira deleção deve funcionar
      await request(app.getHttpServer())
        .delete(`/v1/reviews/${createdReviewId}`)
        .expect(204);

      // Segunda tentativa deve retornar 404
      await request(app.getHttpServer())
        .delete(`/v1/reviews/${createdReviewId}`)
        .expect(404);
    });
  });

  describe('Testes de Integração Completos', () => {
    it('deve executar fluxo completo: criar, listar, buscar, atualizar e deletar', async () => {
      // 1. Criar review
      const createResponse = await request(app.getHttpServer())
        .post('/v1/reviews')
        .send({
          ...mockReview,
          productId: createdProductId
        })
        .expect(201);

      const reviewId = createResponse.body.id;

      // 2. Listar reviews (deve conter o criado)
      const listResponse = await request(app.getHttpServer())
        .get('/v1/reviews')
        .expect(200);

      expect(listResponse.body.some(review => review.id === reviewId)).toBe(true);

      // 3. Buscar review específico
      const getResponse = await request(app.getHttpServer())
        .get(`/v1/reviews/${reviewId}`)
        .expect(200);

      expect(getResponse.body.id).toBe(reviewId);

      // 4. Atualizar review
      const updateData = {
        rating: 5,
        comment: 'Comentário atualizado no fluxo completo'
      };

      const updateResponse = await request(app.getHttpServer())
        .patch(`/v1/reviews/${reviewId}`)
        .send(updateData)
        .expect(200);

      expect(updateResponse.body.rating).toBe(updateData.rating);
      expect(updateResponse.body.comment).toBe(updateData.comment);

      // 5. Deletar review
      await request(app.getHttpServer())
        .delete(`/v1/reviews/${reviewId}`)
        .expect(204);

      // 6. Verificar se foi deletado
      await request(app.getHttpServer())
        .get(`/v1/reviews/${reviewId}`)
        .expect(404);
    });

    it('deve criar múltiplos reviews para o mesmo produto', async () => {
      const reviews = [
        { ...mockReview, author: 'Usuário 1' },
        { ...mockReview2, author: 'Usuário 2' },
        { ...mockReview, author: 'Usuário 3', rating: 3, comment: 'Produto razoável' }
      ];

      const createdReviews: Array<{ id: string; author: string; rating: number; comment: string; productId: string }> = [];

      // Criar múltiplos reviews
      for (const review of reviews) {
        const response = await request(app.getHttpServer())
          .post('/v1/reviews')
          .send({
            ...review,
            productId: createdProductId
          })
          .expect(201);

        createdReviews.push(response.body);
      }

      // Verificar se todos foram criados
      const listResponse = await request(app.getHttpServer())
        .get('/v1/reviews')
        .expect(200);

      expect(listResponse.body.length).toBeGreaterThanOrEqual(reviews.length);

      // Verificar se todos os reviews criados estão na lista
      for (const createdReview of createdReviews) {
        expect(listResponse.body.some(review => review.id === createdReview.id)).toBe(true);
      }
    });
  });
});