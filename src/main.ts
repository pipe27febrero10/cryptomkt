import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  const options = new DocumentBuilder()
    .setTitle('Exchanges Crypto')
    .setDescription('Exchanges Crypto stock values')
    .setVersion('1.0.0')
    .addTag('users')
    .addTag('auth')
    .addTag('cryptomkt')
    .addTag('coins')
    .addTag('exchanges')
    .addTag('buda')
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api', app, document);

  await app.listen(3000);
}
bootstrap();
