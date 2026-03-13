import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import 'dotenv/config';

import * as bcrypt from 'bcrypt';

import { AppModule } from './app.module';
import { PrismaService } from './prisma.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 1. ENABLE CORS (Critical for Frontend/Postman connection issues)
  app.enableCors({
    origin: '*', // Allows all origins for development
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  // 2. Global Validation Pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // 3. Swagger Setup
  const config = new DocumentBuilder()
    .setTitle('Taxbridge API')
    .setDescription('API for Taxbridge tax filing platform - Smart AI + Human experts')
    .setVersion('1.0')
    .addTag('filings', 'Tax filing management')
    .addTag('auth', 'Authentication endpoints')
    .addBearerAuth() // <--- ENABLED: Allows you to paste JWT in Swagger UI
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document, {
    customCss: '.swagger-ui .topbar { background-color: #1e40af; }',
    customSiteTitle: 'Taxbridge API Docs',
  });

  // 4. Start Server
  const PORT = process.env.PORT || 3000;
  await app.listen(PORT);
  console.log(`🚀 Application is running on: http://localhost:${PORT}`);
  console.log(`📚 Swagger Docs available at: http://localhost:${PORT}/api`);

  // 5. Seed Admin User
  const prisma = app.get(PrismaService);
  const adminEmail = process.env.ADMIN_EMAIL;
  
  if (adminEmail) {
    try {
      const existingAdmin = await prisma.user.findFirst({
        where: { email: adminEmail, isAdmin: true },
      });
      
      if (!existingAdmin) {
        const hashed = await bcrypt.hash('admin123', 10);
        await prisma.user.create({
          data: {
            firstName: 'Admin',
            lastName: 'User',
            username: 'admin',
            email: adminEmail,
            dateOfBirth: new Date('1990-01-01'),
            password: hashed,
            isAdmin: true,
          },
        });
        console.log('✅ Default admin user created');
      }
    } catch (error) {
      console.error('Error seeding admin:', error);
    }
  }
}
bootstrap();