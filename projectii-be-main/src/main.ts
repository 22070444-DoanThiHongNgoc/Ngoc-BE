import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import * as os from 'os';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

app.enableCors({
  origin: true, // ✅ Tự động chấp nhận origin của request
  credentials: true,
});


  // ✅ Swagger config
  const config = new DocumentBuilder()
    .setTitle('SMS API')
    .setDescription('The sales management system API description')
    .setVersion('1.0')
    .addTag('sms')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'Authorization',
        in: 'header',
      },
      'access-token',
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  // ✅ Lắng nghe tất cả IP trong mạng LAN
  const port = process.env.PORT ?? 3000;
  await app.listen(port, '0.0.0.0');
  console.log(`🚀 Backend running at: http://${getLocalIP()}:${port}`);
}

// ✅ Hàm lấy IP LAN tự động
function getLocalIP(): string {
  const interfaces = os.networkInterfaces();
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name] || []) {
      if (iface.family === 'IPv4' && !iface.internal) {
        return iface.address;
      }
    }
  }
  return 'localhost';
}

bootstrap();

