import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as bodyParser from 'body-parser';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  // ✅ Khởi tạo NestJS dạng Express
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // ✅ Cho phép truy cập file ảnh từ thư mục uploads
  app.useStaticAssets(join(__dirname, '..', 'uploads'), {
    prefix: '/uploads/',
  });

  // ✅ Tăng giới hạn dung lượng file upload (fix lỗi 413)
  app.use(bodyParser.json({ limit: '10mb' }));
  app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));

  // ✅ Cho phép frontend truy cập API qua mạng LAN
  app.enableCors({
    origin: '*', // hoặc "http://192.168.88.135:3001"
  });

  // ✅ Cấu hình Swagger (tài liệu API)
  const config = new DocumentBuilder()
    .setTitle('🚀 Product Management API')
    .setDescription('API documentation for your NestJS backend (Products, Customers, Auth, etc.)')
    .setVersion('1.0')
    .addTag('products')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document); // đường dẫn: /api

  // ✅ Chạy backend tại 3000
  await app.listen(3000, '0.0.0.0');

  console.log('✅ Swagger: http://192.168.88.135:3000/api');
  console.log('🚀 Backend running at: http://192.168.88.135:3000');
  console.log('📂 Static files: /uploads/');
}

bootstrap();
