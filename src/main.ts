import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import { ConfigurationType } from './core/config/configuration';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  //подключение глобального валидационного pipe https://docs.nestjs.com/techniques/validation
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

  //разрешены запросы с любых доменов
  app.enableCors({
    origin: '*', // Разрешает запросы с любых доменов
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE', // Разрешенные методы
    credentials: true, // Включает передачу cookies
  });

  //получение конфиг сервиса https://docs.nestjs.com/techniques/configuration#using-in-the-maints
  const configService = app.get(ConfigService<ConfigurationType>);

  //добавлеяем Swagger
  const swaggerConfig = new DocumentBuilder()
    .setTitle('Blog API')
    .setDescription('Personal blog')
    .setVersion('0.1')
    .build();

  const swaggerDocument = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api/v1', app, swaggerDocument);

  const port = configService.get('PORT', { infer: true })!;
  await app.listen(port);
}
// eslint-disable-next-line
bootstrap();
