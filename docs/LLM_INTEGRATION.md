# LLM Integration Guide

## 🚀 Overview

This guide covers the complete LLM API integration for AgentPrep, providing AI-powered features throughout the application while maintaining a safe demo mode by default.

## ✨ Features

### AgentPrep AI Features
- **Process Step Suggestions**: AI suggests logical next steps based on your use case
- **Data Field Inference**: Automatically infer schema and detect PII
- **Business Rule Generation**: Generate relevant validation, eligibility, and compliance rules
- **ROI Enhancement**: Get deeper insights into cost/benefit analysis
- **Completeness Checking**: AI reviews your use case for gaps and quality

### SimLab AI Features
- **Agent Prompt Generation**: Create optimized system prompts for agents
- **Flow Optimization**: Get recommendations to improve performance and reduce costs
- **Test Scenario Generation**: Automatically create comprehensive test cases

## 🎯 Quick Start

### Step 1: Enable LLM Features

1. Navigate to **Settings > LLM Configuration** (you'll need to add this route)
2. Toggle "Enable LLM Features" to ON
3. Choose your mode:
   - **Demo Mode** (Default): No API key needed, uses mock responses
   - **API Mode**: Connect to real LLM providers

### Step 2: Configure (API Mode Only)

1. Select your provider:
   - Anthropic (Claude)
   - OpenAI (GPT)
   - Custom endpoint

2. Enter your API key
3. Configure model and parameters
4. Test the connection
5. Save configuration

### Step 3: Use AI Features

Look for the ✨ sparkle icon throughout the application:
- In **Process Steps**: "✨ Get Suggestions"
- In **Data Assets**: "✨ Infer Fields"
- In **Business Rules**: "✨ Generate Rules"
- In **ROI Analysis**: "✨ Enhance Analysis"
- In **Review**: "✨ AI Quality Check"

## 📁 File Structure

```
src/
├── services/
│   └── llm-service.ts          # Core LLM service layer
├── components/
│   ├── LLMSettings.tsx         # Settings UI
│   └── AIIndicator.tsx         # Status indicator
└── ... (your existing components will integrate LLM features)
```

## 🔧 Integration into Components

### Example: Adding AI to Process Steps

```typescript
import { llmService } from '@/services/llm-service';

const YourComponent = () => {
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleGetSuggestions = async () => {
    if (!llmService.isEnabled()) {
      alert('Please enable LLM features in Settings');
      return;
    }

    setLoading(true);
    
    const response = await llmService.suggestProcessSteps({
      useCaseName: useCase.name,
      objective: useCase.objective,
      existingSteps: processSteps
    });

    if (response.success) {
      setSuggestions(response.data);
    } else {
      alert(`Error: ${response.error}`);
    }
    
    setLoading(false);
  };

  return (
    <div>
      {/* Your existing UI */}
      
      {llmService.isEnabled() && (
        <button 
          onClick={handleGetSuggestions}
          disabled={loading}
        >
          {loading ? 'Analyzing...' : '✨ Get Suggestions'}
        </button>
      )}
      
      {/* Display suggestions */}
    </div>
  );
};
```

## 🎨 UI/UX Guidelines

### Visual Indicators

1. **AI Indicator Badge**: Shows when AI is enabled (top-right)
   ```typescript
   import AIIndicator from '@/components/AIIndicator';
   
   // Add to your main layout
   <AIIndicator />
   ```

2. **Sparkle Icons**: Use ✨ emoji for all AI-powered actions

3. **Color Scheme**:
   - Purple/Indigo: AI actions
   - Blue: Analysis
   - Green: Success/Savings
   - Amber: Warnings/Checks

### Loading States

Always show loading indicators:
```typescript
<button disabled={loading}>
  {loading ? 'Analyzing...' : '✨ Get Suggestions'}
</button>
```

### Error Handling

```typescript
if (!response.success) {
  // Show user-friendly error
  toast.error(`AI Error: ${response.error}`);
  return;
}
```

## 🔐 Security

### API Key Storage
- Stored in `localStorage` (client-side only)
- Never sent to your backend
- Use masked input fields
- Users can clear at any time

### Rate Limiting

Built-in rate limiting prevents excessive API calls:
- Client-side throttling
- Configurable limits
- Cost tracking

## 💰 Cost Management

### Token Tracking

The service tracks token usage:
```typescript
const response = await llmService.suggestProcessSteps(context);
console.log(`Used ${response.tokens} tokens`);
console.log(`Latency: ${response.latency}ms`);
```

### Budget Alerts

Set budget limits in Settings:
- Daily token limits
- Monthly spending caps
- Automatic warnings

## 📊 Available API Methods

### AgentPrep Methods

```typescript
// Suggest process steps
await llmService.suggestProcessSteps({
  useCaseName: string,
  objective: string,
  existingSteps: Step[]
});

// Infer data fields
await llmService.inferDataFields({
  assetName: string,
  sourceSystem: string,
  objectType: string
});

// Generate business rules
await llmService.generateBusinessRules({
  useCaseName: string,
  objective: string,
  processDescription: string
});

// Enhance ROI analysis
await llmService.enhanceROI({
  metrics: object,
  useCaseDescription: string
});

// Check use case completeness
await llmService.checkUseCaseCompleteness(useCase);
```

### SimLab Methods

```typescript
// Generate agent prompt
await llmService.generateAgentPrompt({
  role: string,
  tools: string[],
  upstreamContext: string
});

// Optimize workflow
await llmService.optimizeFlow({
  nodes: Node[],
  edges: Edge[]
});

// Generate test scenarios
await llmService.generateTestScenarios({
  nodes: Node[],
  edges: Edge[]
});
```

## 🧪 Testing

### Demo Mode Testing

1. Enable LLM features
2. Keep in Demo mode
3. Test all AI features with mock responses
4. No API key required
5. Instant responses (simulated latency)

### API Mode Testing

1. Get free trial API keys:
   - [Anthropic Console](https://console.anthropic.com/)
   - [OpenAI Platform](https://platform.openai.com/)

2. Configure in Settings
3. Test connection
4. Try each feature
5. Monitor token usage

## 🐛 Troubleshooting

### Common Issues

**"LLM not configured" error**
- Enable LLM features in Settings
- Save configuration
- Refresh the page

**"API key invalid"**
- Verify key format (should start with `sk-ant-` for Anthropic)
- Check provider selection matches your key
- Test connection in Settings

**"Rate limit exceeded"**
- Wait a few minutes
- Check your API provider dashboard
- Consider upgrading API tier

**Slow responses**
- Normal for first request (cold start)
- Check your internet connection
- Try a different model

## 📈 Performance Tips

1. **Use Demo Mode for Development**: Test UI/UX without API costs
2. **Cache Common Queries**: Service includes built-in caching
3. **Batch Requests**: Where possible, combine multiple operations
4. **Choose Appropriate Models**: Use faster models for simple tasks
5. **Set Token Limits**: Prevent runaway costs

## 🔄 Next Steps

### Phase 1: Basic Integration (Current)
- ✅ LLM service layer
- ✅ Settings UI
- ✅ Demo mode
- ✅ Basic AI features

### Phase 2: Enhanced Features (Upcoming)
- [ ] Streaming responses
- [ ] Custom instructions per user
- [ ] Response history
- [ ] A/B testing different models
- [ ] Analytics dashboard

### Phase 3: Enterprise Features (Future)
- [ ] Team-wide settings
- [ ] Usage analytics
- [ ] Custom prompt templates
- [ ] Audit logs
- [ ] SSO integration

## 📞 Support

For issues or questions:
1. Check this documentation
2. Review code examples
3. Test in demo mode
4. Open GitHub issue

## 🎓 Resources

- [Anthropic API Documentation](https://docs.anthropic.com/)
- [OpenAI API Documentation](https://platform.openai.com/docs)
- [Prompt Engineering Guide](https://www.promptingguide.ai/)
- [LLM Best Practices](https://github.com/openai/openai-cookbook)

---

**Ready to add AI superpowers to your AgentPrep workflow!** 🚀
