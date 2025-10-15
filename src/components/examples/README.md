# LLM Integration Examples

This directory contains practical examples showing how to integrate LLM AI features into your AgentPrep components.

## Overview

Each example demonstrates a specific integration point where LLM can enhance the user experience:

1. **ProcessStepsExample.tsx** - AI-powered process step suggestions
2. **DataFieldsExample.tsx** - Automatic data field inference
3. **BusinessRulesExample.tsx** - AI-generated business rules
4. **ROIEnhancementExample.tsx** - Enhanced ROI analysis
5. **CompletenessCheckExample.tsx** - Use case quality assessment

## How to Use These Examples

### Quick Start

1. **Copy the pattern** you need into your existing component
2. **Import the LLM service**: `import { llmService } from '@/services/llm-service';`
3. **Add state management** for AI suggestions and loading states
4. **Add UI elements** (buttons, suggestion panels)
5. **Handle responses** and update your component state

### Integration Pattern

All examples follow this consistent pattern:

```typescript
import { llmService } from '@/services/llm-service';

// 1. Add state for AI features
const [aiSuggestions, setAiSuggestions] = useState([]);
const [isLoading, setIsLoading] = useState(false);
const [status, setStatus] = useState(null);

// 2. Check if LLM is enabled
const llmEnabled = llmService.isEnabled();

// 3. Create handler for AI action
const handleGetSuggestions = async () => {
  setIsLoading(true);
  
  const response = await llmService.suggestProcessSteps({
    // Your context here
  });
  
  if (response.success) {
    setAiSuggestions(response.data);
    setStatus({ type: 'success', message: 'Got suggestions!' });
  } else {
    setStatus({ type: 'error', message: response.error });
  }
  
  setIsLoading(false);
};

// 4. Add UI button (only shown if LLM enabled)
{llmEnabled && (
  <button onClick={handleGetSuggestions} disabled={isLoading}>
    ✨ Get AI Suggestions
  </button>
)}

// 5. Display suggestions
{aiSuggestions.map(suggestion => (
  <div>
    {/* Render suggestion */}
    <button onClick={() => applySuggestion(suggestion)}>
      Apply
    </button>
  </div>
))}
```

## Available LLM Service Methods

### AgentPrep Methods

```typescript
// Process Steps
await llmService.suggestProcessSteps({
  useCaseName: string,
  objective: string,
  existingSteps: array
});

// Data Fields
await llmService.inferDataFields({
  assetName: string,
  sourceSystem: string,
  objectType: string
});

// Business Rules
await llmService.generateBusinessRules({
  useCaseName: string,
  objective: string,
  processDescription: string
});

// ROI Enhancement
await llmService.enhanceROI({
  metrics: object,
  useCaseDescription: string
});

// Completeness Check
await llmService.checkUseCaseCompleteness(useCase);
```

### SimLab Methods

```typescript
// Agent Prompt Generation
await llmService.generateAgentPrompt({
  role: string,
  tools: array,
  upstreamContext: string
});

// Flow Optimization
await llmService.optimizeFlow({
  nodes: array,
  edges: array
});

// Test Scenario Generation
await llmService.generateTestScenarios({
  nodes: array,
  edges: array
});
```

## Best Practices

### 1. Always Check if LLM is Enabled

```typescript
const llmEnabled = llmService.isEnabled();

// Only show AI features if enabled
{llmEnabled && (
  <AIFeatures />
)}
```

### 2. Provide Clear Loading States

```typescript
<button disabled={isLoading}>
  {isLoading ? (
    <><Loader className="animate-spin" /> Analyzing...</>
  ) : (
    <><Sparkles /> Get Suggestions</>
  )}
</button>
```

### 3. Handle Errors Gracefully

```typescript
if (!response.success) {
  setStatus({ 
    type: 'error', 
    message: response.error || 'Failed to get suggestions' 
  });
  return;
}
```

### 4. Show Success Feedback

```typescript
{status?.type === 'success' && (
  <div className="bg-green-50 text-green-800">
    <CheckCircle /> {status.message}
  </div>
)}
```

### 5. Make Suggestions Actionable

Always provide clear actions for AI suggestions:
- **Apply** button to accept
- **Dismiss** button to reject
- **Edit** option to modify before applying

## Demo Mode vs API Mode

### Demo Mode (Default)
- No API key required
- Returns mock responses
- Great for development and testing
- Instant responses (simulated latency)

### API Mode
- Requires API key
- Real LLM responses
- Production-ready
- Actual token usage and costs

## Styling Guidelines

### AI Feature Colors
- **AI Action Buttons**: Purple/Blue gradient (`from-purple-600 to-blue-600`)
- **Suggestion Panels**: Light purple/blue background (`from-purple-50 to-blue-50`)
- **Success States**: Green (`bg-green-50 text-green-800`)
- **Error States**: Red (`bg-red-50 text-red-800`)
- **Loading States**: Gray (`bg-gray-400`)

### Icons
- **AI Features**: ✨ Sparkles emoji or `<Sparkles />` from lucide-react
- **Loading**: `<Loader className="animate-spin" />`
- **Success**: `<CheckCircle />`
- **Error**: `<AlertCircle />` or `<XCircle />`

## Testing Your Integration

1. **Enable LLM in Settings**: Go to Settings → LLM Configuration
2. **Enable Demo Mode**: Set to "Demo Mode" (no API key needed)
3. **Test the Feature**: Click AI buttons in your component
4. **Verify Mock Responses**: Check that suggestions appear correctly
5. **Test Apply/Dismiss**: Ensure actions work as expected
6. **Test Error Handling**: Disable LLM and verify graceful degradation

## Common Issues

### "AI button not showing"
- Check if LLM is enabled in settings
- Verify `llmService.isEnabled()` returns true
- Check localStorage for 'llm_config'

### "No suggestions returned"
- Check browser console for errors
- Verify context data is being passed correctly
- In demo mode, check if mock responses are defined

### "API errors"
- Verify API key is correct
- Check provider selection matches your key
- Ensure you're not hitting rate limits

## Next Steps

1. Copy an example that matches your use case
2. Adapt it to your component's structure
3. Test in demo mode first
4. Configure API mode when ready for production
5. Monitor usage and costs

## Need Help?

Refer to:
- Main documentation: `/docs/llm-integration-guide.md`
- Service code: `/src/services/llm-service.ts`
- Settings component: `/src/components/LLMSettings.tsx`

Happy coding! 🚀