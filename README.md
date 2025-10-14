# AgentPrep - Use Case Collector for Agentic AI

A comprehensive tool for capturing, analyzing, and exporting automation opportunities for agentic AI systems. Built with React, TypeScript, Firebase/PostgreSQL, and Tailwind CSS.

## 🚀 Features

- **Use Case Management**: Capture and organize automation opportunities
- **Process Mapping**: Visual and hierarchical process step definition
- **Data Asset Cataloging**: Track data sources and quality
- **Application Integration**: Document systems and API connectors
- **Business Rules**: Define validation logic and SLAs
- **ROI Calculator**: Automated financial impact analysis
- **Readiness Assessment**: Score automation feasibility
- **Export Functionality**: Generate complete use case packs for agent design
- **SimLab Integration**: Multi-agent system simulation and testing

## 📋 Prerequisites

- Node.js 18+ 
- npm or yarn
- PostgreSQL database (local or cloud) OR Firebase account
- Git

## 🛠️ Installation

1. Clone the repository:
```bash
git clone https://github.com/DataandAI1/agentprep.git
cd agentprep
```

2. Install dependencies:
```bash
npm install
```

3. Choose your database backend:
   - **Option A: PostgreSQL with Prisma** (recommended for production)
   - **Option B: Firebase/Firestore** (good for prototyping)

### Option A: PostgreSQL Setup

4a. Configure database:
```bash
cp .env.example .env
# Edit .env with your DATABASE_URL
```

5a. Initialize database:
```bash
npm run db:push      # Push schema to database
npm run db:seed      # Add sample data (optional)
npm run db:studio    # Open database browser
```

See [DATABASE_SETUP.md](docs/DATABASE_SETUP.md) for detailed instructions.

### Option B: Firebase Setup

4b. Set up Firebase:
```bash
# Install Firebase CLI if not already installed
npm install -g firebase-tools

# Login to Firebase
firebase login

# Initialize Firebase (if not already done)
firebase init
```

5b. Configure environment variables:
```bash
cp .env.example .env.local
# Edit .env.local with your Firebase configuration
```

## 🗄️ Database Architecture

### PostgreSQL Schema (Prisma)

The application uses PostgreSQL with Prisma ORM for production deployments:

**SimLab Tables** - Multi-agent system simulation:
- `simlab_projects` - Agent system projects
- `simlab_nodes` - Agent, tool, and router nodes
- `simlab_edges` - Node connections
- `simlab_scenarios` - Test scenarios
- `simlab_runs` - Execution results and metrics

**AgentPrep Tables** - Use case analysis:
- `agentprep_use_cases` - Business use cases
- `agentprep_roles` - Stakeholder roles
- `agentprep_process_steps` - Process hierarchies
- `agentprep_data_assets` - Data sources and quality
- `agentprep_applications` - Connected systems
- `agentprep_connectors` - API integrations
- `agentprep_rules` - Business rules
- `agentprep_slas` - Service level agreements
- `agentprep_metrics` - Performance metrics
- `agentprep_roi_results` - ROI calculations
- `agentprep_readiness` - Automation readiness scores

See the [Prisma README](prisma/README.md) for quick reference.

### Database Commands

```bash
# Generate Prisma Client
npm run db:generate

# Push schema changes
npm run db:push

# Create migration
npm run db:migrate

# Seed sample data
npm run db:seed

# Open database browser
npm run db:studio

# Format schema
npm run db:format
```

## 🔧 Configuration

### Firebase Setup (Alternative)

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project (or use existing)
3. Enable Firestore Database
4. Enable Authentication (optional, for multi-user)
5. Get your config from Project Settings > General
6. Update `.env.local` with your Firebase credentials

### Supported Database Providers

- **Local**: PostgreSQL with Docker
- **Supabase**: Free tier available
- **Railway**: One-click PostgreSQL
- **Neon**: Serverless PostgreSQL
- **Heroku Postgres**: Managed PostgreSQL
- **Firebase/Firestore**: NoSQL alternative

### Project Structure

```
agentprep/
├── docs/                # Documentation
│   └── DATABASE_SETUP.md   # Complete database setup guide
├── prisma/              # Database schema and migrations
│   ├── schema.prisma    # Prisma schema definition
│   ├── seed.ts         # Database seeding script
│   └── README.md       # Prisma quick reference
├── public/              # Static assets
├── src/
│   ├── components/      # React components
│   ├── firebase/        # Firebase configuration (if using)
│   ├── lib/
│   │   ├── prisma.ts   # Prisma client singleton
│   │   └── db/         # Database utilities
│   │       ├── queries.ts  # Reusable queries
│   │       └── types.ts    # Type utilities
│   ├── types/          # TypeScript type definitions
│   ├── App.tsx         # Main application component
│   └── main.tsx        # Application entry point
├── .env.example        # Environment variables template
├── firestore.rules     # Firestore security rules (if using Firebase)
├── firestore.indexes.json  # Firestore indexes (if using Firebase)
├── firebase.json       # Firebase configuration (if using Firebase)
└── package.json        # Dependencies and scripts
```

## 🚦 Usage

### Development

Start the development server:
```bash
npm run dev
```

The application will open at `http://localhost:5173`

### Using Firebase Emulators (if using Firebase)

```bash
npm run firebase:emulators
```

Then in another terminal:
```bash
npm run dev
```

Set `VITE_USE_FIREBASE_EMULATOR=true` in `.env.local`

### Building for Production

```bash
npm run build
```

### Deployment

Deploy to Firebase Hosting:
```bash
npm run deploy
```

Or manually:
```bash
npm run build
firebase deploy
```

## 📚 Documentation

### Use Case Workflow

1. **Overview**: Define use case name, objective, scope, and sponsor
2. **Process Steps**: Map the current workflow with roles and timing
3. **Data Assets**: Catalog data sources and quality scores
4. **Applications**: Document systems and API connectors
5. **Rules & SLAs**: Define business logic and service levels
6. **Metrics**: Input baseline operational metrics
7. **Review**: View completion status, readiness score, and ROI projections

### Using the Database Utilities

```typescript
import { agentprepQueries, simlabQueries } from '@/lib/db/queries'

// Get all use cases for a user
const useCases = await agentprepQueries.getUseCases(userId)

// Get complete use case with all relations
const useCase = await agentprepQueries.getUseCaseComplete('UC-001')

// Get SimLab projects
const projects = await simlabQueries.getProjects(userId)

// Get project with full graph
const project = await simlabQueries.getProjectWithGraph(projectId)
```

See [queries.ts](src/lib/db/queries.ts) for all available helper functions.

### Data Model

See `src/types/index.ts` for Firebase type definitions.  
See `src/lib/db/types.ts` for Prisma type utilities.

### Export Format

Use cases export as JSON with the following structure:
```json
{
  "useCase": { ... },
  "process": {
    "roles": [...],
    "steps": [...]
  },
  "dataAssets": [...],
  "applications": [...],
  "connectors": [...],
  "rules": [...],
  "slas": [...],
  "metrics": { ... },
  "readiness": { ... },
  "roi": { ... },
  "exportedAt": "2025-10-13T...",
  "version": "1.0"
}
```

## 🔒 Security

### PostgreSQL Security
- Connection strings stored in `.env` (not committed to git)
- Row-level security through application layer
- Prepared statements prevent SQL injection
- Database credentials rotated regularly

### Firebase Security
Firestore security rules ensure:
- Users can only access their own use cases
- All operations require authentication (when enabled)
- Data integrity through validation rules

See `firestore.rules` for complete security configuration.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is open source and available under the MIT License.

## 🙏 Acknowledgments

- Built with React and TypeScript
- Styled with Tailwind CSS
- Backend powered by PostgreSQL (Prisma) or Firebase
- Icons by Lucide React
- Database ORM by Prisma

## 📞 Support

For issues and questions, please use the GitHub Issues page.

## 🗺️ Roadmap

- [x] PostgreSQL database support with Prisma
- [x] SimLab integration for agent system simulation
- [ ] Multi-user collaboration
- [ ] Real-time sync across devices
- [ ] AI-powered suggestion engine
- [ ] Template library for common use cases
- [ ] Advanced analytics dashboard
- [ ] GraphQL API layer

## 📖 Additional Resources

- [Database Setup Guide](docs/DATABASE_SETUP.md) - Complete PostgreSQL setup instructions
- [Prisma Quick Reference](prisma/README.md) - Common database commands
- [Query Examples](src/lib/db/queries.ts) - Pre-built database queries
- [Type Utilities](src/lib/db/types.ts) - TypeScript helpers

---

**Part of the Agentic AI Toolkit**

Companion tools:
- **SimLab** - Agent orchestration simulator and designer
- **AgentPrep** - Use case collector (this tool)
