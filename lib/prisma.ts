import { PrismaClient } from '@prisma/client'
import { PrismaNeon } from '@prisma/adapter-neon'
import { neonConfig } from '@neondatabase/serverless'

// Configure Neon for serverless
// Only use ws in development (Node.js environment)
// In production (Vercel), use native WebSocket
if (typeof window === 'undefined' && process.env.NODE_ENV === 'development') {
  neonConfig.webSocketConstructor = require('ws')
}

const prismaClientSingleton = () => {
  const connectionString = process.env.DATABASE_URL

  // Ensure DATABASE_URL is available
  if (!connectionString) {
    console.error('DATABASE_URL is not set. Available env vars:', Object.keys(process.env))
    throw new Error(
      'DATABASE_URL environment variable is not set. ' +
      'Please add it to your .env file locally or in Vercel environment variables.'
    )
  }

  console.log('Creating Prisma client with Neon adapter, connection string exists:', !!connectionString)

  // Create Neon adapter with connection string directly
  const adapter = new PrismaNeon({ connectionString })

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
