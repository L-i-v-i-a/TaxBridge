import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';  // ← Add these imports

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Your existing global validation pipe (keep it)
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // ── Swagger setup starts here ──
  const config = new DocumentBuilder()
    .setTitle('Taxbridge API')
    .setDescription('API for Taxbridge tax filing platform - Smart AI + Human experts')
    .setVersion('1.0')
    .addTag('refund-calculator', 'Endpoints for refund estimation')
    .addTag('features', 'Core features listing')
    // Add more tags later for auth, chat, etc.
    // .addBearerAuth()  // Uncomment later when you add JWT/auth
    .build();

  const document = SwaggerModule.createDocument(app, config);

  // Setup Swagger UI at /api (or change to /docs, /swagger, etc.)
  SwaggerModule.setup('api', app, document, {
    // Optional: Customize UI look
    customCss: '.swagger-ui .topbar { background-color: #1e40af; }', // Example: blue theme
    customSiteTitle: 'Taxbridge API Docs',
  });
  // ── Swagger setup ends here ──

  await app.listen(3000);  // or 3001 if you changed the port
}
bootstrap();