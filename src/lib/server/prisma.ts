import { PrismaClient } from '@prisma/client'
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3'

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient }

function createClient(): PrismaClient {
	if (process.env.VERCEL) {
		// Production on Vercel: standard PostgreSQL client.
		// DATABASE_URL is set automatically by the Neon integration.
		return new PrismaClient({ log: ['error'] })
	}
	// Local development: SQLite via better-sqlite3 adapter.
	const url = (process.env.DATABASE_URL ?? 'file:./prisma/dev.db').replace(/^file:/, '')
	return new PrismaClient({ adapter: new PrismaBetterSqlite3({ url }) })
}

export const prisma = globalForPrisma.prisma ?? createClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
