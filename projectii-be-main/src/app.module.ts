import { MiddlewareConsumer, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './databases/database.module';
import { AuthModule } from './modules/auth/auth.module';
import { ProductsModule } from './products/products.module';
import { CustomersModule } from './customers/customers.module';
import { OrdersModule } from './orders/orders.module'; // ✅ import thêm module Orders
import { LoggerMiddleware } from './common/middlewares/logger/logger.middleware';

@Module({
  imports: [
    // 🔹 Load biến môi trường từ file .env
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    // 🔹 Kết nối database qua module riêng
    DatabaseModule,

    // 🔹 Các module nghiệp vụ
    AuthModule,
    ProductsModule,
    CustomersModule,
    OrdersModule, // ✅ thêm module Order
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    // ✅ middleware hoạt động toàn bộ ứng dụng
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
