import { PrismaClient } from '@prisma/client'
import { PrismaNeon } from '@prisma/adapter-neon'
import { Pool, neonConfig } from '@neondatabase/serverless'

// Configure Neon for serverless
// Only use ws in development (Node.js environment)
// In production (Vercel), use native WebSocket
if (typeof window === 'undefined' && process.env.NODE_ENV === 'development') {
  neonConfig.webSocketConstructor = require('ws')
}

const prismaClientSingleton = () => {
  // Ensure DATABASE_URL is available
  if (!process.env.DATABASE_URL) {
    throw new Error(
      'DATABASE_URL environment variable is not set. ' +
      'Please add it to your .env file locally or in Vercel environment variables.'
    )
  }

  // Create Neon connection pool with explicit configuration
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL
  })

  const adapter = new PrismaNeon(pool as any)

  return new PrismaClient({
    adapter: adapter as any,
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  })
}

declare global {
  var prismaGlobal: undefined | ReturnType<typeof prismaClientSingleton>
}

const prisma = globalThis.prismaGlobal ?? prismaClientSingleton()

export default prisma

if (process.env.NODE_ENV !== 'production') globalThis.prismaGlobal = prisma
