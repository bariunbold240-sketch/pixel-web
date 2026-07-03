import { defineConfig } from 'prisma/config'

export default defineConfig({
  datasource: {
    // Resolved from the process env at command time. Falls back to an empty
    // string so `prisma generate` (which only reads the schema) never fails on
    // env resolution during the Vercel build. Runtime uses lib/db.ts, not this.
    url: process.env.DATABASE_URL ?? '',
  },
  migrations: {
    seed: 'tsx prisma/seed.ts',
  },
})
