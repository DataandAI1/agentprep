# LLM Integration - Quick Start Guide

## 🎯 5-Minute Setup

Get AI-powered features running in AgentPrep in just 5 minutes!

## Step 1: Install Files (Already Done! ✅)

The following files have been added to your repository:

```
src/
├── services/
│   └── llm-service.ts              # Core LLM service
├── components/
│   ├── LLMSettings.tsx             # Settings UI
│   └── AIIndicator.tsx             # Status badge
```

## Step 2: Add Settings Route

Add a route to access LLM settings. Update your routing configuration:

### For React Router

```typescript
// In your App.tsx or routes file
import LLMSettings from './components/LLMSettings';

// Add to your routes
<Route path="/settings/llm" element={<LLMSettings />} />
```

### For Next.js

```typescript
// Create pages/settings/llm.tsx or app/settings/llm/page.tsx
import LLMSettings from '@/components/LLMSettings';

export default function LLMSettingsPage() {
  return <LLMSettings />;
}
```

## Step 3: Add Navigation Link

Add a link to LLM settings in your navigation:

```typescript
import { Settings } from 'lucide-react';

<nav>
  {/* Your other links */}
  <a href="/settings/llm" className="...">
    <Settings className="w-5 h-5" />
    LLM Settings
  </a>
</nav>
```

## Step 4: Add AI Indicator (Optional)

Show when AI is enabled by adding the indicator to your layout:

```typescript
import AIIndicator from './components/AIIndicator';

function Layout({ children }) {
  return (
    <div>
      <AIIndicator />
      {/* Your existing layout */}
      {children}
    </div>
  );
}
```

## Step 5: Try Demo Mode!

1. Navigate to `/settings/llm`
2. Toggle "Enable LLM Features" to ON
3. Leave it in "Demo Mode" (default)
4. Click "Save Configuration"
5. You should see "AI Demo Mode" badge in top-right

**That's it!** You now have AI features enabled with mock responses. No API key required!

## Step 6: Add AI Features to Components (Next)

Now you can add AI buttons to your existing components. Here's a simple example:

```typescript
import { llmService } from '@/services/llm-service';
import { Sparkles } from 'lucide-react';

function YourComponent() {
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleGetSuggestions = async () => {
    if (!llmService.isEnabled()) {
      alert('Enable LLM features in Settings first!');
      return;
    }

    setLoading(true);
    
    const response = await llmService.suggestProcessSteps({
      useCaseName: 'Your Use Case',
      objective: 'Your objective here',
      existingSteps: []
    });

    if (response.success) {
      setSuggestions(response.data);
    }
    
    setLoading(false);
  };

  return (
    <div>
      {llmService.isEnabled() && (
        <button 
          onClick={handleGetSuggestions}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
        >
          <Sparkles className="w-4 h-4" />
          {loading ? 'Analyzing...' : 'Get AI Suggestions'}
        </button>
      )}
      
      {/* Display suggestions */}
      {suggestions.map((item, idx) => (
        <div key={idx}>{item.title}</div>
      ))}
    </div>
  );
}
```

## Step 7: Test with Real API (Optional)

Ready to use real AI?

1. Get an API key:
   - [Anthropic](https://console.anthropic.com/) - Usually has free credits
   - [OpenAI](https://platform.openai.com/) - Pay as you go

2. Go to Settings > LLM Configuration
3. Switch to "API Mode"
4. Select provider and enter API key
5. Click "Test Connection"
6. Save!

## 🎉 You're Done!

You now have:
- ✅ LLM service installed
- ✅ Settings UI configured  
- ✅ Demo mode working
- ✅ Ready to add AI features

## Next Steps

1. **Read the full guide**: See `docs/LLM_INTEGRATION.md` for complete details
2. **View examples**: Check `docs/LLM_EXAMPLES.tsx` for integration patterns
3. **Add features**: Start adding AI buttons to your components
4. **Test thoroughly**: Use demo mode first, then try real API

## 🆘 Need Help?

**Not seeing the badge?**
- Check that you saved the configuration
- Refresh the page
- Make sure AIIndicator is in your layout

**AI button not showing?**
- Verify LLM is enabled in settings
- Check `llmService.isEnabled()` returns true
- Look for console errors

**Want to disable AI?**
- Just toggle off in settings
- All AI buttons will disappear
- No code changes needed

---

**Questions?** Open an issue on GitHub or check the full documentation!
