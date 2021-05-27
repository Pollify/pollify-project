import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  SwaggerModule.setup(
    'docs',
    app,
    SwaggerModule.createDocument(
      app,
      new DocumentBuilder()
        .setTitle('Pollify API')
        .addServer('/api', 'Kubernetes')
        .setDescription('API overview')
        .setVersion('1.0')
        .build(),
    ),
  );

  await app.listen(configService.get('PORT'));
}

bootstrap();
