import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { JwtMiddleware } from './middleware/jwt.middleware';
import { JwtService } from '@nestjs/jwt';
import { RedisService } from './redis/redis.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const jwtService = app.get(JwtService);
  const redisService = app.get(RedisService);

  app.use(new JwtMiddleware(jwtService, redisService).use);

  const config = new DocumentBuilder()
    .setTitle('fvst')
    .setDescription('API do zarządzania projektem fvst')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(3000);
}
bootstrap();
