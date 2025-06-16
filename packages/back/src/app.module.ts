import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import databaseConfig from './database/config/database.config';
import appConfig from './config/app.config';
import { MongooseModule } from '@nestjs/mongoose';
import { MongooseConfigService } from './database/mongoose-config.service';
import { ProductsModule } from './products/products.module';
import { Reviews } from './reviews/entities/reviews.entity';
import { ReviewsModule } from './reviews/reviews.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [databaseConfig, appConfig],
      envFilePath: ['.env'],
    }),
    ProductsModule,
    ReviewsModule,
    MongooseModule.forRootAsync({
      useClass: MongooseConfigService,
    })
],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
