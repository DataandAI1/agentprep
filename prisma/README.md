# Prisma Database Configuration

This directory contains the Prisma schema and database configuration for AgentPrep.

## Files

- **schema.prisma** - Database schema definition with all tables, relations, and indexes
- **seed.ts** - Database seeding script with sample data

## Quick Commands

### Development
```bash
# Generate Prisma Client
npm run db:generate

# Push schema changes (no migration files)
npm run db:push

# Open database browser
npm run db:studio

# Seed database with sample data
npm run db:seed

# Format schema file
npm run db:format
```

### Production
```bash
# Create migration
npm run db:migrate

# Deploy migrations
npm run db:migrate:deploy

# Reset database (⚠️ deletes all data)
npm run db:reset
```

## Database Schema

### SimLab Tables (Multi-Agent System Simulation)
- `simlab_projects` - Projects containing agent systems
- `simlab_nodes` - Individual nodes (agents, tools, routers)
- `simlab_edges` - Connections between nodes
- `simlab_scenarios` - Test scenarios with configurations
- `simlab_runs` - Execution results and metrics

### AgentPrep Tables (Use Case Analysis)
- `agentprep_use_cases` - Business use cases for automation
- `agentprep_roles` - Stakeholder roles
- `agentprep_process_steps` - Process workflow steps
- `agentprep_data_assets` - Data sources and quality metrics
- `agentprep_applications` - Connected applications/systems
- `agentprep_connectors` - API connectors
- `agentprep_rules` - Business rules
- `agentprep_slas` - Service level agreements
- `agentprep_metrics` - Performance metrics
- `agentprep_roi_results` - ROI calculations
- `agentprep_readiness` - Automation readiness scores

## Setup

See [DATABASE_SETUP.md](../docs/DATABASE_SETUP.md) for complete setup instructions.

### Quick Setup

1. Copy `.env.example` to `.env`
2. Add your database URL
3. Run: `npm run db:push`
4. Run: `npm run db:seed` (optional)

### Connection String Format

```
postgresql://USER:PASSWORD@HOST:PORT/DATABASE?schema=public
```

### Supported Providers
- PostgreSQL (local)
- Supabase
- Railway
- Neon
- Heroku Postgres
- Any PostgreSQL-compatible database

## Migrations

### Creating Migrations

```bash
npm run db:migrate
```

This will:
1. Prompt for migration name
2. Compare schema with database
3. Generate SQL migration file
4. Apply migration

### Migration Files

Migrations are stored in `prisma/migrations/` directory. Each migration includes:
- `migration.sql` - SQL commands
- Metadata about the migration

### Applying Migrations

```bash
# Development
npm run db:migrate

# Production
npm run db:migrate:deploy
```

## Seeding

The seed script (`seed.ts`) populates the database with:
- 1 SimLab project with nodes, edges, and runs
- 1 AgentPrep use case with complete setup

Run seeding:
```bash
npm run db:seed
```

## Prisma Studio

Prisma Studio provides a GUI for browsing and editing data:

```bash
npm run db:studio
```

Access at: http://localhost:5555

## Type Safety

Prisma generates TypeScript types automatically. After schema changes:

```bash
npm run db:generate
```

Import in code:
```typescript
import { PrismaClient } from '@prisma/client'
import type { AgentprepUseCase, SimlabProject } from '@prisma/client'
```

## Best Practices

1. **Always generate client** after schema changes
2. **Use migrations** in production
3. **Use push** for rapid development
4. **Keep schema formatted** with `npm run db:format`
5. **Test migrations** before deploying
6. **Backup database** before major changes

## Troubleshooting

### Client not generated
```bash
npm run db:generate
```

### Schema out of sync
```bash
npm run db:push
```

### Migration conflicts
```bash
npm run db:reset  # ⚠️ Deletes all data
npm run db:migrate
```

### Connection issues
- Check DATABASE_URL in .env
- Verify database server is running
- Check firewall/network settings

## Resources

- [Prisma Documentation](https://www.prisma.io/docs)
- [Full Setup Guide](../docs/DATABASE_SETUP.md)
- [Query Examples](../src/lib/db/queries.ts)
- [Type Utilities](../src/lib/db/types.ts)
