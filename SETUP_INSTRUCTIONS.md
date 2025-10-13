# Setup Instructions

## Complete the AgentPrep Component

The main AgentPrep component needs to be added to complete the application.

### Step 1: Create the Component File

Create `src/components/AgentPrep.tsx` and copy the full component code from the provided `AgentPrep: Use Case Collector.tsx` document.

The component includes:
- Complete use case management UI
- Process step mapping (with visual and list views)
- Data asset cataloging
- Application and connector management
- Business rules and SLAs
- Metrics and ROI calculator
- Readiness assessment
- Export functionality

### Step 2: Verify Dependencies

Ensure all required dependencies are installed:

```bash
npm install
```

The component uses:
- `react` and `react-dom`
- `lucide-react` for icons
- Tailwind CSS for styling

### Step 3: Test Locally

Start the development server:

```bash
npm run dev
```

### Integration with Firebase

To connect the component with Firebase:

1. **Use Firebase Hooks**: Import `useUseCases` from `src/firebase/hooks.ts`
2. **Save Data**: Use services from `src/firebase/services.ts`
3. **Authentication**: Get user ID from `src/App.tsx` auth state

Example integration in AgentPrep.tsx:

```typescript
import { useUseCases } from '../firebase/hooks';
import { useCaseService } from '../firebase/services';
import { auth } from '../firebase/config';

// In your component:
const user = auth.currentUser;
const { data: useCases, loading } = useUseCases(user?.uid || '');

// Save use case:
const handleSave = async () => {
  await useCaseService.create({
    ...useCase,
    ownerId: user?.uid,
  });
};
```

### Alternative: Standalone Version

For a standalone version without Firebase:

1. Use local state only (useState)
2. Implement localStorage for persistence:

```typescript
const [useCases, setUseCases] = useState(() => {
  const saved = localStorage.getItem('agentprep-usecases');
  return saved ? JSON.parse(saved) : [];
});

useEffect(() => {
  localStorage.setItem('agentprep-usecases', JSON.stringify(useCases));
}, [useCases]);
```

## Additional Files Needed

### ESLint Configuration (Optional)

Create `.eslintrc.cjs`:

```javascript
module.exports = {
  root: true,
  env: { browser: true, es2020: true },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react-hooks/recommended',
  ],
  ignorePatterns: ['dist', '.eslintrc.cjs'],
  parser: '@typescript-eslint/parser',
  plugins: ['react-refresh'],
  rules: {
    'react-refresh/only-export-components': [
      'warn',
      { allowConstantExport: true },
    ],
    '@typescript-eslint/no-explicit-any': 'warn',
  },
}
```

### VS Code Settings (Optional)

Create `.vscode/settings.json`:

```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "typescript.tsdk": "node_modules/typescript/lib"
}
```

## Testing Checklist

- [ ] Application starts without errors
- [ ] Can create a new use case
- [ ] Can add process steps
- [ ] Can add data assets
- [ ] Can add applications
- [ ] Can add business rules
- [ ] Can input metrics
- [ ] ROI calculator works
- [ ] Readiness assessment calculates
- [ ] Export functionality works
- [ ] Data persists (Firebase or localStorage)

## Next Steps

1. Complete the AgentPrep component
2. Test all functionality locally
3. Configure Firebase
4. Deploy to Firebase Hosting
5. Set up authentication if needed
6. Share with your team!

## Need Help?

Check these resources:
- README.md - Overview and features
- DEPLOYMENT.md - Deployment guide
- Firebase Documentation - https://firebase.google.com/docs
- React Documentation - https://react.dev
