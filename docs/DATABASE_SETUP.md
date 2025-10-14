# Database Setup Guide

This guide walks through setting up PostgreSQL with Prisma for the AgentPrep application.

## Prerequisites

- Node.js 18+ installed
- PostgreSQL database (local or cloud)
- Git

## Quick Start

### 1. Install Dependencies

```bash
npm install
```

This will install Prisma Client and all other dependencies.

### 2. Configure Database Connection

Copy the example environment file:

```bash
cp .env.example .env
```

Edit `.env` and add your database connection string:

```env
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE?schema=public"
DIRECT_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE?schema=public"
```

**Examples:**

**Local PostgreSQL:**
```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/agentprep?schema=public"
```

**Supabase:**
```env
DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@db.YOUR_PROJECT_REF.supabase.co:5432/postgres?pgbouncer=true"
DIRECT_URL="postgresql://postgres:YOUR_PASSWORD@db.YOUR_PROJECT_REF.supabase.co:5432/postgres"
```

**Railway:**
```env
DATABASE_URL="postgresql://postgres:PASSWORD@containers-us-west-XX.railway.app:PORT/railway"
```

**Neon:**
```env
DATABASE_URL="postgresql://USER:PASSWORD@ep-XX-XX-XX.us-east-2.aws.neon.tech/neondb?sslmode=require"
```

### 3. Initialize Database

**Option A: Push schema (for development)**
```bash
npm run db:push
```

This creates tables without migration files. Best for rapid development.

**Option B: Create migration (for production)**
```bash
npm run db:migrate
```

This creates migration files for version control.

### 4. Seed Database (Optional)

```bash
npm run db:seed
```

This populates your database with sample data for testing.

### 5. Verify Setup

Open Prisma Studio to browse your database:

```bash
npm run db:studio
```

This opens a web interface at `http://localhost:5555`

## Database Schema Overview

The database consists of two main sections:

### SimLab Tables
For managing multi-agent system simulations:
- `simlab_projects` - Agent system projects
- `simlab_nodes` - Agent, tool, and router nodes
- `simlab_edges` - Connections between nodes
- `simlab_scenarios` - Test scenarios with inputs/policies
- `simlab_runs` - Execution results and metrics

### AgentPrep Tables
For use case analysis and automation readiness:
- `agentprep_use_cases` - Business use cases
- `agentprep_roles` - Stakeholder roles
- `agentprep_process_steps` - Process hierarchies
- `agentprep_data_assets` - Data sources and quality
- `agentprep_applications` - Connected systems
- `agentprep_connectors` - API integrations
- `agentprep_rules` - Business rules
- `agentprep_slas` - Service level agreements
- `agentprep_metrics` - Baseline performance metrics
- `agentprep_roi_results` - ROI calculations
- `agentprep_readiness` - Automation readiness scores

## Common Operations

### Generate Prisma Client

After schema changes:
```bash
npm run db:generate
```

### Format Schema File

```bash
npm run db:format
```

### Reset Database

⚠️ **Warning: This deletes all data!**

```bash
npm run db:reset
```

### Create a New Migration

```bash
npm run db:migrate
```

You'll be prompted to name the migration.

### Deploy Migrations (Production)

```bash
npm run db:migrate:deploy
```

## Using Prisma Client in Code

### Import the Client

```typescript
import { prisma } from '@/lib/prisma'
```

### Query Examples

**Find all use cases:**
```typescript
const useCases = await prisma.agentprepUseCase.findMany({
  where: {
    ownerId: userId,
    deletedAt: null
  },
  include: {
    metrics: true,
    roiResults: true,
    readiness: true
  }
})
```

**Create a new project:**
```typescript
const project = await prisma.simlabProject.create({
  data: {
    name: 'My Agent System',
    description: 'Customer support automation',
    ownerId: userId
  }
})
```

**Update with relations:**
```typescript
const useCase = await prisma.agentprepUseCase.update({
  where: { id: 'UC-001' },
  data: {
    status: 'approved',
    roles: {
      create: [
        { name: 'Product Manager', type: 'stakeholder' },
        { name: 'Engineer', type: 'primary' }
      ]
    }
  }
})
```

### Using Helper Queries

The repo includes pre-built query helpers in `src/lib/db/queries.ts`:

```typescript
import { simlabQueries, agentprepQueries } from '@/lib/db/queries'

// Get projects with counts
const projects = await simlabQueries.getProjects(userId)

// Get complete use case
const useCase = await agentprepQueries.getUseCaseComplete('UC-001')

// Get use cases by readiness
const ready = await agentprepQueries.getUseCasesByReadiness(userId, 7.0)
```

## Database Providers

### Local PostgreSQL with Docker

```bash
docker run --name agentprep-db \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=agentprep \
  -p 5432:5432 \
  -d postgres:16-alpine
```

Then set:
```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/agentprep?schema=public"
```

### Supabase

1. Create project at https://supabase.com
2. Go to Settings > Database
3. Copy connection string (use "Connection Pooling" for DATABASE_URL)
4. Use "Direct Connection" for DIRECT_URL

### Railway

1. Create project at https://railway.app
2. Add PostgreSQL service
3. Copy `DATABASE_URL` from service variables

### Neon

1. Create project at https://neon.tech
2. Copy connection string from dashboard
3. Append `?sslmode=require` to the URL

## Troubleshooting

### "Can't reach database server"

- Check your DATABASE_URL is correct
- Ensure database server is running
- Check firewall rules if using cloud database
- For cloud databases, verify your IP is whitelisted

### "P1001: Can't reach database server"

For Supabase:
- Make sure you're using port 5432 (not 6543)
- Use connection pooling URL for DATABASE_URL
- Use direct connection for DIRECT_URL

### "Schema does not match"

```bash
npm run db:push
```

This syncs your database with the schema.

### "Migration failed"

1. Check the error message
2. Roll back if needed: `npm run db:reset`
3. Fix the issue
4. Try again: `npm run db:migrate`

### Prisma Client not generated

```bash
npm run db:generate
```

## Production Deployment

### Environment Variables

Set these in your production environment:

```env
DATABASE_URL="your_production_database_url"
DIRECT_URL="your_production_database_url"
NODE_ENV="production"
```

### Database Migration

```bash
# Build the app
npm run build

# Deploy migrations
npm run db:migrate:deploy

# Start app
npm start
```

### Connection Pooling

For production, use connection pooling:

**Supabase:** Use the pooler URL (port 6543)
**Railway/Neon:** Connection pooling is built-in
**Custom:** Use PgBouncer

### Backup Strategy

- Enable automated backups on your database provider
- For Supabase: Automatic daily backups
- For Railway: Enable backups in project settings
- For self-hosted: Setup pg_dump cron jobs

## Performance Optimization

### Indexes

The schema includes optimized indexes for:
- Owner/user queries
- Status and priority filtering
- Hierarchical relationships
- Time-based sorting

### Query Optimization

Use `include` and `select` strategically:

```typescript
// Good: Only fetch needed fields
const projects = await prisma.simlabProject.findMany({
  select: {
    id: true,
    name: true,
    _count: { select: { nodes: true } }
  }
})

// Avoid: Fetching all fields and relations
const projects = await prisma.simlabProject.findMany({
  include: { nodes: true, edges: true, scenarios: true }
})
```

### Connection Pool Settings

Add to your `.env`:

```env
DATABASE_POOL_MIN=2
DATABASE_POOL_MAX=10
DATABASE_TIMEOUT=30000
```

## Next Steps

1. Review the schema in `prisma/schema.prisma`
2. Explore helper queries in `src/lib/db/queries.ts`
3. Check type utilities in `src/lib/db/types.ts`
4. Build your API routes using Prisma Client
5. Add custom queries as needed

## Resources

- [Prisma Documentation](https://www.prisma.io/docs)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Prisma Best Practices](https://www.prisma.io/docs/guides/performance-and-optimization)
- [Database Schema Design](https://www.prisma.io/docs/concepts/components/prisma-schema)
