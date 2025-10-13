# AgentPrep - Use Case Collector for Agentic AI

A comprehensive tool for capturing, analyzing, and exporting automation opportunities for agentic AI systems. Built with React, TypeScript, Firebase, and Tailwind CSS.

## 🚀 Features

- **Use Case Management**: Capture and organize automation opportunities
- **Process Mapping**: Visual and hierarchical process step definition
- **Data Asset Cataloging**: Track data sources and quality
- **Application Integration**: Document systems and API connectors
- **Business Rules**: Define validation logic and SLAs
- **ROI Calculator**: Automated financial impact analysis
- **Readiness Assessment**: Score automation feasibility
- **Export Functionality**: Generate complete use case packs for agent design

## 📋 Prerequisites

- Node.js 18+ 
- npm or yarn
- Firebase account (free tier works)

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

3. Set up Firebase:
```bash
# Install Firebase CLI if not already installed
npm install -g firebase-tools

# Login to Firebase
firebase login

# Initialize Firebase (if not already done)
firebase init
```

4. Configure environment variables:
```bash
cp .env.example .env.local
# Edit .env.local with your Firebase configuration
```

## 🔧 Configuration

### Firebase Setup

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project (or use existing)
3. Enable Firestore Database
4. Enable Authentication (optional, for multi-user)
5. Get your config from Project Settings > General
6. Update `.env.local` with your Firebase credentials

### Project Structure

```
agentprep/
├── public/              # Static assets
├── src/
│   ├── components/      # React components
│   ├── firebase/        # Firebase configuration and services
│   ├── types/          # TypeScript type definitions
│   ├── App.tsx         # Main application component
│   └── main.tsx        # Application entry point
├── firestore.rules     # Firestore security rules
├── firestore.indexes.json  # Firestore index definitions
└── firebase.json       # Firebase configuration
```

## 🚦 Usage

### Development

Start the development server:
```bash
npm run dev
```

The application will open at `http://localhost:3000`

### Using Firebase Emulators (Recommended for Development)

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

### Data Model

See `src/types/index.ts` for complete TypeScript type definitions.

Key collections in Firestore:
- `useCases` - Top-level use case documents
- `useCases/{id}/roles` - Process roles/lanes
- `useCases/{id}/processSteps` - Hierarchical process steps
- `useCases/{id}/dataAssets` - Data source catalog
- `useCases/{id}/applications` - Systems and tools
- `useCases/{id}/rules` - Business rules
- `useCases/{id}/slas` - Service level agreements

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
- Backend powered by Firebase
- Icons by Lucide React

## 📞 Support

For issues and questions, please use the GitHub Issues page.

## 🗺️ Roadmap

- [ ] Multi-user collaboration
- [ ] Real-time sync across devices
- [ ] AI-powered suggestion engine
- [ ] Integration with SimLab for agent design
- [ ] Template library for common use cases
- [ ] Advanced analytics dashboard

---

**Part of the Agentic AI Toolkit**

Companion tools:
- **SimLab** - Agent orchestration simulator and designer
- **AgentPrep** - Use case collector (this tool)
