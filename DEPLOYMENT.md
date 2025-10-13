# AgentPrep Deployment Guide

## Prerequisites

- Node.js 18+
- Firebase CLI installed (`npm install -g firebase-tools`)
- Firebase project created
- Git repository cloned

## Initial Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Firebase Configuration

#### Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project"
3. Follow the setup wizard
4. Enable Firestore Database
   - Go to "Build" > "Firestore Database"
   - Click "Create database"
   - Start in production mode (we have security rules)
   - Choose a location close to your users

#### Get Firebase Configuration

1. In Firebase Console, go to Project Settings (gear icon)
2. Scroll to "Your apps" section
3. Click the web icon (`</>`)
4. Register your app
5. Copy the config object

#### Set Environment Variables

```bash
cp .env.example .env.local
```

Edit `.env.local` with your Firebase configuration:

```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id
```

### 3. Firebase CLI Setup

```bash
# Login to Firebase
firebase login

# Initialize Firebase (if not already done)
firebase init

# Select:
# - Firestore
# - Hosting
# Use existing project
# Select your project
# Accept default files (firestore.rules, firestore.indexes.json)
# For hosting, set public directory to: dist
# Configure as single-page app: Yes
```

Update `.firebaserc`:

```json
{
  "projects": {
    "default": "your-project-id"
  }
}
```

### 4. Deploy Firestore Rules and Indexes

```bash
firebase deploy --only firestore:rules
firebase deploy --only firestore:indexes
```

## Development

### Local Development

```bash
npm run dev
```

Application will open at `http://localhost:3000`

### Using Firebase Emulators (Recommended)

Start emulators:

```bash
npm run firebase:emulators
```

In another terminal:

```bash
npm run dev
```

Update `.env.local`:

```env
VITE_USE_FIREBASE_EMULATOR=true
VITE_FIRESTORE_EMULATOR_HOST=localhost
VITE_FIRESTORE_EMULATOR_PORT=8080
```

## Building for Production

```bash
npm run build
```

This creates optimized production files in the `dist/` directory.

Test the production build locally:

```bash
npm run preview
```

## Deployment

### Deploy to Firebase Hosting

```bash
npm run deploy
```

Or manually:

```bash
npm run build
firebase deploy --only hosting
```

### Deploy Everything

Deploy rules, indexes, and hosting:

```bash
npm run build
firebase deploy
```

## Post-Deployment

### 1. Test the Deployed Application

Visit your Firebase Hosting URL:
- `https://your-project-id.web.app`
- `https://your-project-id.firebaseapp.com`

### 2. Enable Authentication (Optional)

For multi-user support:

1. Go to Firebase Console > Authentication
2. Click "Get started"
3. Enable sign-in methods (Email/Password, Google, etc.)
4. Update security rules if needed
5. Modify `src/App.tsx` to add proper login flow

### 3. Set Up Custom Domain (Optional)

1. Go to Firebase Console > Hosting
2. Click "Add custom domain"
3. Follow the DNS configuration steps

## Monitoring

### View Logs

Firebase Console > Firestore > Usage tab shows:
- Read/Write operations
- Storage usage
- Query performance

### Performance Monitoring (Optional)

```bash
firebase init
# Select: Performance Monitoring
```

Add to your app:

```typescript
import { getPerformance } from 'firebase/performance';
const perf = getPerformance(app);
```

## Troubleshooting

### Common Issues

#### "Permission denied" errors

- Check Firestore rules are deployed: `firebase deploy --only firestore:rules`
- Verify user is authenticated
- Check ownerId matches authenticated user

#### Build failures

- Clear cache: `rm -rf node_modules dist && npm install`
- Check Node.js version: `node --version` (should be 18+)
- Verify all dependencies installed

#### Deployment fails

- Check Firebase CLI is logged in: `firebase login`
- Verify project is set: `firebase use your-project-id`
- Ensure billing is enabled for Firebase project

#### Data not appearing

- Check browser console for errors
- Verify Firestore rules allow read access
- Check network tab for failed requests
- Test with Firebase Emulators locally

## Security Checklist

- [ ] Firestore security rules deployed
- [ ] Environment variables not committed to git
- [ ] Authentication enabled for production
- [ ] CORS configured if using external APIs
- [ ] SSL/HTTPS enabled (automatic with Firebase Hosting)
- [ ] API keys restricted (Firebase Console > Project Settings > API Keys)

## Backup Strategy

### Export Firestore Data

```bash
# Using Firebase CLI
firebase firestore:export gs://your-bucket/backups

# Or using gcloud
gcloud firestore export gs://your-bucket/backups
```

### Schedule Automatic Backups

Use Google Cloud Console to set up scheduled exports:

1. Go to Google Cloud Console
2. Navigate to Firestore
3. Click "Import/Export"
4. Set up Cloud Scheduler for automatic exports

## Scaling Considerations

- Firestore has generous free tier (50K reads/day)
- Monitor usage in Firebase Console
- Consider caching strategies for frequently accessed data
- Use Firestore indexes for complex queries
- Enable compression in hosting config

## Cost Optimization

- Use Firebase Emulators for development (no costs)
- Implement pagination for large datasets
- Cache data in React state/context
- Use Firestore offline persistence
- Monitor and optimize query patterns

## Support

For issues:
- Check Firebase Status: https://status.firebase.google.com/
- Firebase Documentation: https://firebase.google.com/docs
- GitHub Issues: https://github.com/DataandAI1/agentprep/issues
