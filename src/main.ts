import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as process from 'node:process';
import { ValidationPipe } from '@nestjs/common';

const apiVersion: string = process.env.API_VERSION!;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix(apiVersion);
   app.useGlobalPipes(new ValidationPipe({
    whitelist:true
  }))
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
