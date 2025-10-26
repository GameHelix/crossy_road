import { PrismaClient } from '@prisma/client'
import { PrismaNeon } from '@prisma/adapter-neon'
import { Pool, neonConfig } from '@neondatabase/serverless'
import ws from 'ws'

const prismaClientSingleton = () => {
  // Use Neon adapter for serverless environments (Vercel)
  if (process.env.DATABASE_URL) {
    neonConfig.webSocketConstructor = ws
    const pool = new Pool({ connectionString: process.env.DATABASE_URL })
    const adapter = new PrismaNeon(pool as any)
    return new PrismaClient({ adapter } as any)
  }
  return new PrismaClient()
}

declare global {
  var prismaGlobal: undefined | ReturnType<typeof prismaClientSingleton>
}

const prisma = globalThis.prismaGlobal ?? prismaClientSingleton()

export default prisma

if (process.env.NODE_ENV !== 'production') globalThis.prismaGlobal = prisma
