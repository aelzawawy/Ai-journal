import { PrismaClient } from '@prisma/client'

// Define a type for the global object that includes our Prisma instance
// This is necessary because TypeScript doesn't know about our custom global property
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

// Create a singleton instance of PrismaClient
// If it already exists in the global scope, use that instance
// Otherwise, create a new instance
export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: ['error'],
  })

// In development, save the instance to the global object to prevent
// creating multiple instances during hot reloading
// This prevents exhausting your database connections
if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma
}
