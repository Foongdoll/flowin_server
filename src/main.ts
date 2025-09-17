import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { existsSync, mkdirSync } from 'fs';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({ origin: true, credentials: true });
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  const uploads = join(process.cwd(), 'uploads', 'docs');
  if (!existsSync(uploads)) mkdirSync(uploads, { recursive: true });

  const port = Number(process.env.PORT) || 3000;
  await app.listen(port);

  console.log(`API listening on http://localhost:${port}`);
}
bootstrap();
