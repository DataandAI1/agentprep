import { PrismaClient } from '@prisma/client'
import { performance } from 'node:perf_hooks'

class MissingEnvironmentError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'MissingEnvironmentError'
  }
}

function maskConnectionString(connectionString: string): string {
  try {
    const url = new URL(connectionString)
    if (url.password) {
      url.password = '****'
    }
    return url.toString()
  } catch (error) {
    return 'Unable to parse connection string'
  }
}

function ensureEnvironmentVariables(): { databaseUrl: string; directUrl?: string } {
  const missingEnv = ['DATABASE_URL'].filter(name => !process.env[name])

  if (missingEnv.length > 0) {
    throw new MissingEnvironmentError(
      `Missing required environment variables: ${missingEnv.join(', ')}`
    )
  }

  const databaseUrl = process.env.DATABASE_URL as string
  const directUrl = process.env.DIRECT_URL || undefined

  return { databaseUrl, directUrl }
}

async function verifyPrismaConnection() {
  const { databaseUrl, directUrl } = ensureEnvironmentVariables()

  console.log('\u2139\ufe0f Verifying Prisma configuration...')
  console.log(` - DATABASE_URL: ${maskConnectionString(databaseUrl)}`)
  console.log(
    ` - DIRECT_URL: ${directUrl ? maskConnectionString(directUrl) : 'Not set (falling back to DATABASE_URL)'}`
  )

  const prisma = new PrismaClient({
    log: ['error']
  })

  const start = performance.now()

  try {
    await prisma.$connect()
    await prisma.$queryRaw`SELECT 1`
    const duration = Math.round(performance.now() - start)

    console.log('\u2705 Successfully connected to the database!')
    console.log(` - Connection validated in ${duration}ms`)
  } catch (error) {
    console.error('\u274c Failed to connect to the database.')
    console.error(error)
    process.exitCode = 1
  } finally {
    await prisma.$disconnect()
  }
}

verifyPrismaConnection().catch(error => {
  if (error instanceof MissingEnvironmentError) {
    console.error('\u274c Missing required environment variables.')
    console.error(error.message)
    console.error('Please update your .env file before running this check.')
  } else {
    console.error('\u274c Unexpected error while verifying Prisma connection:')
    console.error(error)
  }
  process.exitCode = 1
})
