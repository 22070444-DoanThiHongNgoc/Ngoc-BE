import { MiddlewareConsumer, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './databases/database.module';
import { AuthModule } from './modules/auth/auth.module';
import { ProductsModule } from './products/products.module';
import { CustomersModule } from './customers/customers.module';
import { LoggerMiddleware } from './common/middlewares/logger/logger.middleware';

@Module({
  imports: [
    // Load biến môi trường .env
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    // Kết nối database (qua module riêng)
    DatabaseModule,

    // Các module nghiệp vụ
    AuthModule,
    ProductsModule,
    CustomersModule, // ✅ thêm module customer
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*'); // ✅ middleware hoạt động toàn app
  }
}
