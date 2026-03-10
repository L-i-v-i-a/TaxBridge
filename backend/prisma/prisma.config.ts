// prisma.config.ts
import "dotenv/config";           // loads .env file
import { defineConfig, env } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",  // path relative to this file
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: env("DATABASE_URL"),      // reads from .env
  },
});