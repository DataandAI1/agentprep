# Prisma Database Setup - Complete Summary

This document summarizes all the files and configurations added for PostgreSQL database support with Prisma ORM.

## ✅ Files Added/Modified

### Configuration Files
1. **`.env.example`** - Updated with DATABASE_URL and PostgreSQL configuration examples
2. **`package.json`** - Added Prisma dependencies and database scripts
3. **`tsconfig.json`** - Updated to include Prisma directory
4. **`.gitignore`** - Added Prisma and database-related entries

### Database Schema & Seeding
5. **`prisma/schema.prisma`** - Complete database schema with:
   - SimLab tables (projects, nodes, edges, scenarios, runs)
   - AgentPrep tables (use cases, roles, steps, data assets, apps, rules, SLAs, metrics, ROI, readiness)
   - All relations, indexes, and constraints
   
6. **`prisma/seed.ts`** - Database seeding script with sample data for both SimLab and AgentPrep

### Database Utilities
7. **`src/lib/prisma.ts`** - Prisma client singleton pattern
8. **`src/lib/db/queries.ts`** - Reusable query functions for:
   - SimLab: Project management, metrics, graph queries
   - AgentPrep: Use case management, readiness scoring, ROI calculations
   - Shared utilities: Pagination, soft delete, existence checks

9. **`src/lib/db/types.ts`** - TypeScript utilities:
   - Type definitions for complex queries
   - Type guards and validators
   - Data transformers (Decimal to number, etc.)
   - Helper functions (formatting, calculations)

### Documentation
10. **`docs/DATABASE_SETUP.md`** - Comprehensive setup guide covering:
    - Quick start instructions
    - Database provider setup (Supabase, Railway, Neon, Local)
    - Common operations and troubleshooting
    - Production deployment
    - Performance optimization

11. **`prisma/README.md`** - Quick reference for:
    - Common Prisma commands
    - Schema overview
    - Migration workflow
    - Best practices

12. **`README.md`** - Updated main README with:
    - Database architecture overview
    - Setup instructions for PostgreSQL
    - Database command reference
    - Usage examples

## 🎯 Database Schema Overview

### SimLab (Multi-Agent System Simulation)
```
simlab_projects
├── simlab_nodes (agents, tools, routers)
├── simlab_edges (connections)
├── simlab_scenarios (test configs)
└── simlab_runs (execution results)
```

### AgentPrep (Use Case Analysis)
```
agentprep_use_cases
├── agentprep_roles
├── agentprep_process_steps (hierarchical)
├── agentprep_data_assets
├── agentprep_applications
│   └── agentprep_connectors
├── agentprep_rules
├── agentprep_slas
├── agentprep_metrics (1:1)
├── agentprep_roi_results (1:1)
└── agentprep_readiness (1:1)
```

## 📦 New Dependencies Added

```json
{
  "dependencies": {
    "@prisma/client": "^5.20.0"
  },
  "devDependencies": {
    "@types/node": "^20.14.0",
    "prisma": "^5.20.0",
    "tsx": "^4.7.0"
  }
}
```

## 🚀 Quick Start Commands

### Initial Setup
```bash
# Install dependencies
npm install

# Configure database
cp .env.example .env
# Edit .env with your DATABASE_URL

# Push schema to database
npm run db:push

# Seed with sample data
npm run db:seed

# Open database browser
npm run db:studio
```

### Development Workflow
```bash
# Make schema changes in prisma/schema.prisma

# Generate Prisma Client
npm run db:generate

# Push changes (development)
npm run db:push

# OR create migration (production)
npm run db:migrate
```

### Common Operations
```bash
npm run db:generate          # Generate Prisma Client
npm run db:push             # Push schema (no migration files)
npm run db:migrate          # Create migration files
npm run db:migrate:deploy   # Deploy migrations (production)
npm run db:seed            # Seed sample data
npm run db:studio          # Open database browser
npm run db:reset           # Reset database (⚠️ deletes data)
npm run db:format          # Format schema file
```

## 🔌 Supported Database Providers

### Local Development
```bash
# Docker PostgreSQL
docker run --name agentprep-db \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=agentprep \
  -p 5432:5432 \
  -d postgres:16-alpine

# .env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/agentprep?schema=public"
```

### Cloud Providers

**Supabase** (Free tier available)
```env
DATABASE_URL="postgresql://postgres:PASSWORD@db.PROJECT.supabase.co:5432/postgres?pgbouncer=true"
DIRECT_URL="postgresql://postgres:PASSWORD@db.PROJECT.supabase.co:5432/postgres"
```

**Railway** (One-click PostgreSQL)
```env
DATABASE_URL="postgresql://postgres:PASSWORD@containers-us-west-XX.railway.app:PORT/railway"
```

**Neon** (Serverless PostgreSQL)
```env
DATABASE_URL="postgresql://USER:PASSWORD@ep-XX-XX-XX.us-east-2.aws.neon.tech/neondb?sslmode=require"
```

## 💡 Usage Examples

### Basic Queries
```typescript
import { prisma } from '@/lib/prisma'

// Create a use case
const useCase = await prisma.agentprepUseCase.create({
  data: {
    id: 'UC-002',
    name: 'Invoice Processing',
    objective: 'Automate invoice processing',
    scope: 'Process 500 invoices daily',
    ownerId: userId,
    priority: 'high',
    status: 'draft'
  }
})

// Query with relations
const project = await prisma.simlabProject.findUnique({
  where: { id: projectId },
  include: {
    nodes: true,
    edges: true,
    scenarios: true
  }
})
```

### Using Helper Queries
```typescript
import { agentprepQueries, simlabQueries } from '@/lib/db/queries'

// Get all use cases with filters
const useCases = await agentprepQueries.getUseCases(userId, {
  status: 'analysis',
  priority: 'high'
})

// Get complete use case with all relations
const completeUseCase = await agentprepQueries.getUseCaseComplete('UC-001')

// Get projects with counts
const projects = await simlabQueries.getProjects(userId, 0, 10)

// Get project with graph
const projectGraph = await simlabQueries.getProjectWithGraph(projectId)
```

### Type Safety
```typescript
import type { 
  AgentprepUseCase,
  SimlabProject,
  AgentprepUseCaseComplete 
} from '@prisma/client'

import { 
  serializeReadiness,
  formatCurrency,
  getReadinessColor 
} from '@/lib/db/types'

// Type-safe queries
const useCase: AgentprepUseCase = await prisma.agentprepUseCase.findFirst(...)

// Transform Decimal fields to numbers
const serialized = serializeReadiness(readiness)

// Format values
const cost = formatCurrency(123456.78) // "$123,456.78"
const color = getReadinessColor(8.5) // "green"
```

## 🎨 Key Features

### Type Safety
- Fully typed with TypeScript
- Auto-generated types from schema
- Type guards and validators
- Custom type utilities

### Relationships
- One-to-many (Project → Nodes)
- Many-to-many ready (extensible)
- Hierarchical (Process Steps)
- One-to-one (UseCase → Metrics)

### Performance
- Optimized indexes on:
  - Owner/user queries
  - Status and priority filters
  - Time-based sorting
  - Hierarchical lookups
- Connection pooling support
- Query result pagination

### Data Integrity
- Foreign key constraints
- Cascade deletes
- Soft delete support
- JSON field validation

## 🔄 Next Steps

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Set up database**
   - Choose a provider (Local, Supabase, Railway, Neon)
   - Configure DATABASE_URL in .env
   - Run `npm run db:push`

3. **Seed sample data** (optional)
   ```bash
   npm run db:seed
   ```

4. **Explore the database**
   ```bash
   npm run db:studio
   ```

5. **Start building**
   - Use helper queries from `src/lib/db/queries.ts`
   - Add custom queries as needed
   - Reference types from `src/lib/db/types.ts`

## 📚 Additional Resources

- [Prisma Documentation](https://www.prisma.io/docs)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Database Setup Guide](./DATABASE_SETUP.md)
- [Prisma Quick Reference](../prisma/README.md)
- [Query Examples](../src/lib/db/queries.ts)
- [Type Utilities](../src/lib/db/types.ts)

## 🐛 Troubleshooting

### "Can't reach database server"
- Verify DATABASE_URL is correct
- Check database server is running
- Verify network/firewall settings
- For cloud: Check IP whitelist

### "Prisma Client not generated"
```bash
npm run db:generate
```

### "Schema does not match database"
```bash
npm run db:push
```

### "Migration failed"
1. Check error message
2. Fix schema issues
3. Try `npm run db:reset` (⚠️ deletes data)
4. Run `npm run db:migrate` again

## ✨ Summary

You now have a complete PostgreSQL database setup with:
- ✅ Full schema definition (SimLab + AgentPrep)
- ✅ Type-safe database client
- ✅ Helper query functions
- ✅ Type utilities and transformers
- ✅ Seeding script with sample data
- ✅ Comprehensive documentation
- ✅ Development and production workflows
- ✅ Support for multiple database providers

**Ready to start building!** 🚀
