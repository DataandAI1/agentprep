# Quick Integration Guide

This guide shows you how to quickly add LLM features to your existing AgentPrep components.

## 🚀 5-Minute Integration

### Step 1: Import the LLM Service

```typescript
import { llmService } from '@/services/llm-service';
```

### Step 2: Add State Management

```typescript
const [aiSuggestions, setAiSuggestions] = useState([]);
const [isLoading, setIsLoading] = useState(false);
const [status, setStatus] = useState(null);

// Check if LLM is enabled
const llmEnabled = llmService.isEnabled();
```

### Step 3: Create Handler Function

```typescript
const handleGetSuggestions = async () => {
  setIsLoading(true);
  
  // Call appropriate LLM service method
  const response = await llmService.suggestProcessSteps({
    useCaseName: useCase.name,
    objective: useCase.objective,
    existingSteps: steps
  });
  
  if (response.success) {
    setAiSuggestions(response.data);
    setStatus({ type: 'success', message: 'Got suggestions!' });
  } else {
    setStatus({ type: 'error', message: response.error });
  }
  
  setIsLoading(false);
};
```

### Step 4: Add UI Button

```typescript
{llmEnabled && (
  <button
    onClick={handleGetSuggestions}
    disabled={isLoading}
    className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg"
  >
    {isLoading ? (
      <><Loader className="animate-spin" /> Analyzing...</>
    ) : (
      <><Sparkles /> Get AI Suggestions</>
    )}
  </button>
)}
```

### Step 5: Display Suggestions

```typescript
{aiSuggestions.map(suggestion => (
  <div key={suggestion.id} className="p-3 bg-purple-50 rounded-lg">
    <h4>{suggestion.title}</h4>
    <p>{suggestion.description}</p>
    <button onClick={() => applySuggestion(suggestion)}>
      Apply
    </button>
  </div>
))}
```

## 📋 Integration Checklist

- [ ] Import `llmService` from services
- [ ] Add state for suggestions, loading, and status
- [ ] Check if LLM is enabled with `llmService.isEnabled()`
- [ ] Create async handler to call LLM service
- [ ] Add UI button (only visible if LLM enabled)
- [ ] Display loading state while processing
- [ ] Show suggestions with apply/dismiss actions
- [ ] Handle errors gracefully
- [ ] Show success feedback

## 🎯 Component-Specific Integrations

### StepsSection Component

**Where:** Process steps management  
**Method:** `llmService.suggestProcessSteps()`  
**Example:** See `ProcessStepsExample.tsx`

```typescript
const response = await llmService.suggestProcessSteps({
  useCaseName: useCase.name,
  objective: useCase.objective,
  existingSteps: processSteps
});
```

### DataSection Component

**Where:** Data assets management  
**Method:** `llmService.inferDataFields()`  
**Example:** See `DataFieldsExample.tsx`

```typescript
const response = await llmService.inferDataFields({
  assetName: asset.name,
  sourceSystem: asset.system,
  objectType: asset.object_type
});
```

### RulesSection Component

**Where:** Business rules management  
**Method:** `llmService.generateBusinessRules()`  
**Example:** See `BusinessRulesExample.tsx`

```typescript
const response = await llmService.generateBusinessRules({
  useCaseName: useCase.name,
  objective: useCase.objective,
  processDescription: getProcessDescription()
});
```

### MetricsSection Component

**Where:** ROI calculation  
**Method:** `llmService.enhanceROI()`  
**Example:** See `ROIEnhancementExample.tsx`

```typescript
const response = await llmService.enhanceROI({
  metrics: metricsData,
  useCaseDescription: useCase.objective
});
```

### ReviewSection Component

**Where:** Use case review  
**Method:** `llmService.checkUseCaseCompleteness()`  
**Example:** See `CompletenessCheckExample.tsx`

```typescript
const response = await llmService.checkUseCaseCompleteness({
  ...useCase,
  processSteps,
  dataAssets,
  applications,
  rules,
  metrics
});
```

## 🎨 UI/UX Best Practices

### 1. Visual Consistency

Use consistent colors for AI features:
- **AI Buttons:** `from-purple-600 to-blue-600`
- **Suggestion Panels:** `from-purple-50 to-blue-50`
- **Success:** `bg-green-50 text-green-800`
- **Error:** `bg-red-50 text-red-800`

### 2. Loading States

Always show loading feedback:
```typescript
{isLoading ? (
  <><Loader className="animate-spin" /> Analyzing...</>
) : (
  <><Sparkles /> Get Suggestions</>
)}
```

### 3. Status Messages

Provide clear feedback:
```typescript
{status && (
  <div className={status.type === 'success' ? 'bg-green-50' : 'bg-red-50'}>
    <CheckCircle /> {status.message}
  </div>
)}
```

### 4. Suggestion Actions

Make suggestions actionable:
```typescript
<button onClick={() => apply(suggestion)}>Apply</button>
<button onClick={() => dismiss(suggestion)}>Dismiss</button>
```

## 🔧 Testing Your Integration

### Test in Demo Mode

1. Go to Settings → LLM Configuration
2. Enable LLM features
3. Select "Demo Mode" (no API key needed)
4. Test your new AI feature
5. Verify suggestions appear correctly
6. Test apply and dismiss actions

### Test Error Handling

1. Disable LLM in settings
2. Verify button doesn't show
3. Test with invalid inputs
4. Verify error messages display

## 📚 Full Examples

Check out complete working examples in `src/components/examples/`:
- `ProcessStepsExample.tsx`
- `DataFieldsExample.tsx`
- `BusinessRulesExample.tsx`
- `ROIEnhancementExample.tsx`
- `CompletenessCheckExample.tsx`

## 🆘 Common Issues

### "Button not showing"
✅ Check if `llmService.isEnabled()` returns true  
✅ Verify LLM is enabled in settings  
✅ Check localStorage for 'llm_config'

### "No suggestions returned"
✅ Check browser console for errors  
✅ Verify context data is correct  
✅ In demo mode, check mock responses exist

### "TypeScript errors"
✅ Import types from service  
✅ Define proper interfaces for suggestions  
✅ Handle null/undefined cases

## 🎓 Next Steps

1. Copy an example that matches your use case
2. Adapt to your component structure
3. Test in demo mode
4. Configure API mode when ready
5. Monitor usage and costs

## 📖 Documentation

- Full guide: `/docs/llm-integration-guide.md`
- Service code: `/src/services/llm-service.ts`
- Settings UI: `/src/components/LLMSettings.tsx`
- Examples: `/src/components/examples/`

Happy integrating! ✨
