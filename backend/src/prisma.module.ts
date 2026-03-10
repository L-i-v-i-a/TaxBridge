import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

// A dedicated module that makes the PrismaService available application-wide.
// Marking the module as @Global() means you don't have to import it in every
// feature module – once AppModule imports it, the provider is available
// everywhere without additional imports.

@Global()
@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}
