import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { PrismaService } from './prisma.service';
import * as bcrypt from 'bcrypt';

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
    .setDescription(
      'API for Taxbridge tax filing platform - Smart AI + Human experts',
    )
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

  await app.listen(3000); // or 3001 if you changed the port

  // Create default admin user if not exists
  const prisma = app.get(PrismaService);
  const adminEmail = process.env.ADMIN_EMAIL;
  if (adminEmail) {
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
  }
}
void bootstrap();
