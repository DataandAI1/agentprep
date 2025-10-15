# AgentPrep - AI-Powered Use Case Collector for Agentic AI

A comprehensive tool for capturing, analyzing, and exporting automation opportunities for agentic AI systems. Built with React, TypeScript, Firebase/PostgreSQL, and Tailwind CSS. **Now featuring AI-powered suggestions and analysis!** ✨

## 🚀 Features

### Core Features
- **Use Case Management**: Capture and organize automation opportunities
- **Process Mapping**: Visual and hierarchical process step definition
- **Data Asset Cataloging**: Track data sources and quality
- **Application Integration**: Document systems and API connectors
- **Business Rules**: Define validation logic and SLAs
- **ROI Calculator**: Automated financial impact analysis
- **Readiness Assessment**: Score automation feasibility
- **Export Functionality**: Generate complete use case packs for agent design
- **SimLab Integration**: Multi-agent system simulation and testing

### 🤖 AI-Powered Features (NEW!)

AgentPrep now includes **optional LLM integration** to accelerate use case development:

#### AgentPrep AI Features
- **🔄 Process Step Suggestions**: AI suggests logical next steps based on your use case
- **📊 Data Field Inference**: Automatically infer database schemas with PII detection
- **📋 Business Rule Generation**: Generate validation, eligibility, and compliance rules
- **💰 ROI Enhancement**: Identify hidden costs, benefits, and risk factors
- **✅ Completeness Checking**: Get quality scores and actionable recommendations

#### SimLab AI Features
- **🎯 Agent Prompt Generation**: Create optimized system prompts for agents
- **⚡ Flow Optimization**: Analyze workflows for performance improvements
- **🧪 Test Scenario Generation**: Auto-generate comprehensive test cases

#### AI Configuration
- **Demo Mode (Default)**: Try AI features with mock responses - no API key required!
- **API Mode**: Connect to Anthropic Claude or OpenAI GPT for production use
- **Privacy First**: API keys stored locally, never sent to our servers
- **Multi-Provider Support**: Anthropic, OpenAI, or custom endpoints

## 📋 Prerequisites

- Node.js 18+ 
- npm or yarn
- PostgreSQL database (local or cloud) OR Firebase account
- Git
- **Optional**: Anthropic or OpenAI API key (for AI features)

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

## 🤖 AI Features Setup (Optional)

AI features are **disabled by default** and completely optional. Enable them when ready:

### Quick Start with Demo Mode

1. Launch the application
2. Navigate to **Settings** → **LLM Configuration**
3. Toggle **Enable LLM Features**
4. Select **Demo Mode** (no API key needed!)
5. Click **Save Configuration**
6. Try AI suggestions throughout the app ✨

**Demo Mode** uses realistic mock responses - perfect for testing and learning!

### Production Setup with API Mode

1. Get an API key from [Anthropic](https://console.anthropic.com/) or [OpenAI](https://platform.openai.com/)
2. Go to **Settings** → **LLM Configuration**
3. Enable LLM Features
4. Select **API Mode**
5. Choose your provider (Anthropic or OpenAI)
6. Enter your API key
7. Test the connection
8. Save configuration

**Supported Models:**
- Anthropic: Claude Sonnet 4, Claude Opus 4, Claude 3.5 Sonnet
- OpenAI: GPT-4, GPT-4 Turbo, GPT-3.5 Turbo
- Custom: Any OpenAI-compatible endpoint

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

**LLM Tables** (Optional) - AI usage tracking:
- `llm_configurations` - User LLM settings
- `llm_usage_logs` - Token usage and costs
- `llm_prompt_templates` - Custom prompt templates

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
│   │   ├── AgentPrep.tsx           # Main AgentPrep component
│   │   ├── AgentPrepSections.tsx   # Section components
│   │   ├── LLMSettings.tsx         # AI configuration UI
│   │   ├── AIIndicator.tsx         # AI status indicator
│   │   └── examples/               # AI integration examples
│   │       ├── README.md                      # Examples documentation
│   │       ├── QUICK_START.md                 # 5-minute integration guide
│   │       ├── ProcessStepsExample.tsx        # Process AI integration
│   │       ├── DataFieldsExample.tsx          # Data AI integration
│   │       ├── BusinessRulesExample.tsx       # Rules AI integration
│   │       ├── ROIEnhancementExample.tsx      # ROI AI integration
│   │       └── CompletenessCheckExample.tsx   # Quality AI integration
│   ├── services/        # Business logic services
│   │   └── llm-service.ts          # LLM integration service
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

### Using AI Features

Once enabled in Settings, AI features appear throughout the application:

**In Process Steps:**
- Click **✨ Get AI Suggestions** to get next step recommendations
- Review suggestions in the sidebar
- Click **Add Step** to apply or **Dismiss** to skip

**In Data Assets:**
- Click **✨ Infer Fields** on any data asset
- AI automatically suggests schema with PII detection
- Review and customize field definitions

**In Business Rules:**
- Click **✨ Generate Rules** to create rule suggestions
- AI categorizes rules automatically (validation, eligibility, etc.)
- Apply rules or use as templates

**In Metrics & ROI:**
- Click **✨ Enhance ROI Analysis** for deeper insights
- Get adjusted automation percentages
- See hidden costs and additional benefits
- Review risk factors and recommendations

**In Review:**
- Click **✨ AI Quality Check** for completeness scoring
- Get 0-100 quality score
- See missing items and strengths
- Get actionable recommendations

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
   - 🤖 *AI can suggest next steps*
3. **Data Assets**: Catalog data sources and quality scores
   - 🤖 *AI can infer field schemas*
4. **Applications**: Document systems and API connectors
5. **Rules & SLAs**: Define business logic and service levels
   - 🤖 *AI can generate rules*
6. **Metrics**: Input baseline operational metrics
   - 🤖 *AI can enhance ROI analysis*
7. **Review**: View completion status, readiness score, and ROI projections
   - 🤖 *AI can assess quality and completeness*

### AI Integration Examples

Complete working examples are available in `src/components/examples/`:

```typescript
// Example: Process Step Suggestions
import { llmService } from '@/services/llm-service';

const response = await llmService.suggestProcessSteps({
  useCaseName: useCase.name,
  objective: useCase.objective,
  existingSteps: processSteps
});

if (response.success) {
  setSuggestions(response.data);
}
```

**See the examples directory for:**
- `ProcessStepsExample.tsx` - Complete process AI integration
- `DataFieldsExample.tsx` - Field inference example
- `BusinessRulesExample.tsx` - Rule generation example
- `ROIEnhancementExample.tsx` - ROI analysis example
- `CompletenessCheckExample.tsx` - Quality checking example

**Quick Start Guide**: See `src/components/examples/QUICK_START.md` for 5-minute integration!

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

### LLM Service API

```typescript
import { llmService } from '@/services/llm-service';

// Check if LLM is enabled
const isEnabled = llmService.isEnabled();

// Check if in demo mode
const isDemoMode = llmService.isDemoMode();

// Available methods:
// - suggestProcessSteps(context)
// - inferDataFields(context)
// - generateBusinessRules(context)
// - enhanceROI(context)
// - checkUseCaseCompleteness(useCase)
// - generateAgentPrompt(context)
// - optimizeFlow(graph)
// - generateTestScenarios(graph)
```

See [llm-service.ts](src/services/llm-service.ts) for complete API documentation.

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

### LLM API Security
- API keys stored in browser localStorage only
- Keys never sent to our servers
- All LLM calls made directly from browser to provider
- Optional usage tracking (stored locally or in your database)
- Demo mode available for testing without API keys

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

### Areas for Contribution
- New AI integration examples
- Additional LLM provider support
- Custom prompt templates
- Database query optimizations
- UI/UX improvements
- Documentation enhancements

## 📄 License

This project is open source and available under the MIT License.

## 🙏 Acknowledgments

- Built with React and TypeScript
- Styled with Tailwind CSS
- Backend powered by PostgreSQL (Prisma) or Firebase
- Icons by Lucide React
- Database ORM by Prisma
- AI powered by Anthropic Claude and OpenAI GPT

## 📞 Support

For issues and questions, please use the GitHub Issues page.

## 🗺️ Roadmap

- [x] PostgreSQL database support with Prisma
- [x] SimLab integration for agent system simulation
- [x] AI-powered suggestion engine with LLM integration
- [x] Demo mode for AI features (no API key required)
- [x] Process step suggestions
- [x] Data field inference
- [x] Business rule generation
- [x] ROI enhancement analysis
- [x] Use case completeness checking
- [x] Integration examples and documentation
- [ ] Multi-user collaboration
- [ ] Real-time sync across devices
- [ ] Custom prompt template library
- [ ] Advanced analytics dashboard
- [ ] GraphQL API layer
- [ ] Team sharing and permissions
- [ ] AI usage analytics and cost tracking
- [ ] Additional LLM provider support (Azure, Cohere, etc.)

## 📖 Additional Resources

### Core Documentation
- [Database Setup Guide](docs/DATABASE_SETUP.md) - Complete PostgreSQL setup instructions
- [Prisma Quick Reference](prisma/README.md) - Common database commands
- [Query Examples](src/lib/db/queries.ts) - Pre-built database queries
- [Type Utilities](src/lib/db/types.ts) - TypeScript helpers

### AI Integration Resources
- [AI Examples README](src/components/examples/README.md) - Comprehensive AI integration guide
- [Quick Start Guide](src/components/examples/QUICK_START.md) - 5-minute AI integration
- [LLM Service](src/services/llm-service.ts) - Complete LLM API documentation
- [Integration Examples](src/components/examples/) - Working code examples

### Getting Started with AI Features
1. **Try Demo Mode First**: No API key needed, instant results
2. **Review Examples**: Check out `src/components/examples/`
3. **Read Quick Start**: 5-minute integration guide
4. **Configure API Mode**: When ready for production use
5. **Monitor Usage**: Track tokens and costs

---

## 🌟 What's New

### Version 1.2.0 - AI Integration Release
- ✨ **LLM Integration**: Optional AI-powered features throughout the app
- 🎯 **Demo Mode**: Try AI features without API keys
- 📚 **Integration Examples**: Complete working examples for all AI features
- 🔧 **LLM Service**: Comprehensive service layer for AI integration
- ⚙️ **Settings UI**: Full-featured AI configuration interface
- 🤖 **8 AI Processing Points**: From process steps to test generation
- 📖 **Documentation**: Extensive guides and examples

---

**Part of the Agentic AI Toolkit**

Companion tools:
- **SimLab** - Agent orchestration simulator and designer
- **AgentPrep** - AI-powered use case collector (this tool)

**Ready to supercharge your use case development with AI?** 🚀✨
