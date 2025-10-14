// services/llm-service.ts
/**
 * LLM Service for AgentPrep
 * Provides AI-powered suggestions and analysis throughout the application
 */

export interface LLMConfig {
  enabled: boolean;
  mode: 'demo' | 'api';
  provider: 'anthropic' | 'openai' | 'custom';
  apiKey: string;
  model: string;
  temperature: number;
  maxTokens: number;
  endpoint?: string;
}

export interface LLMResponse {
  success: boolean;
  data?: any;
  error?: string;
  tokens?: number;
  latency?: number;
}

// Processing point instructions
const INSTRUCTIONS = {
  // AgentPrep Processing Points
  processStepSuggestions: `You are an expert business process analyst. Given a use case description and existing process steps, suggest logical next steps or missing steps.

Consider:
- Natural workflow progression
- Common process patterns (approvals, validations, notifications)
- Error handling and exception paths
- Parallel vs sequential execution
- Human vs automated steps

Return a JSON array of suggested steps with: type, role, title, description, execution_mode`,

  dataFieldInference: `You are a data architect. Given a data asset name and source system, infer the likely fields/schema.

Consider:
- Common database conventions
- Industry standard data models
- PII detection (name, email, SSN, phone, address, etc.)
- Data types and constraints

Return a JSON array of field objects with: name, type, description, isPII, isRequired`,

  businessRuleGeneration: `You are a business rules expert. Given a use case and process description, suggest relevant business rules.

Consider:
- Validation rules (data quality, completeness)
- Eligibility rules (who/what qualifies)
- Routing rules (where does it go)
- Compliance rules (regulatory requirements)
- Calculation rules (pricing, scoring)

Return a JSON array of rules with: name, category, description, expression (in pseudo-code)`,

  roiEnhancement: `You are a financial analyst specializing in automation ROI. Review the provided metrics and suggest improvements to the ROI calculation.

Consider:
- Hidden costs (training, maintenance, errors)
- Soft benefits (employee satisfaction, speed)
- Risk factors (complexity, change management)
- Industry benchmarks
- Realistic automation percentage (may not be 70%)

Return JSON with: adjustedAutomationPercent, additionalCosts, additionalBenefits, riskFactors, recommendations`,

  useCaseCompleteness: `You are a use case quality reviewer. Analyze the use case for completeness and quality.

Check for:
- Clear objective and scope
- Well-defined process steps
- Identified data sources
- System integrations mapped
- Business rules documented
- Metrics and success criteria
- Missing sections or gaps

Return JSON with: score (0-100), missingItems (array), recommendations (array), strengths (array)`,

  // SimLab Processing Points
  agentPromptGeneration: `You are an AI prompt engineer. Generate an effective system prompt for an AI agent given its role and context.

Consider:
- Clear role definition
- Expected inputs and outputs
- Tone and style
- Error handling instructions
- Tool usage guidelines

Return JSON with: systemPrompt (string), suggestedTemperature (number), suggestedMaxTokens (number)`,

  flowOptimization: `You are a workflow optimization expert. Analyze the agent graph and suggest improvements.

Consider:
- Parallel execution opportunities
- Redundant paths
- Error handling gaps
- Performance bottlenecks
- Cost optimization (model selection)

Return JSON with: optimizations (array of {type, description, impact}), estimatedImprovement (string)`,

  testScenarioGeneration: `You are a QA engineer. Generate test scenarios for the agent workflow.

Consider:
- Happy path scenarios
- Edge cases
- Error conditions
- Load testing scenarios
- Security test cases

Return JSON array of scenarios with: name, description, inputs, expectedBehavior, successCriteria`,
};

// Demo mode responses
const DEMO_RESPONSES = {
  processStepSuggestions: [
    {
      type: 'task',
      role: 'System',
      title: 'Validate Input Data',
      description: 'Ensure all required fields are present and properly formatted',
      execution_mode: 'sequential'
    },
    {
      type: 'decision',
      role: 'System',
      title: 'Check Eligibility',
      description: 'Determine if request meets basic criteria for processing',
      execution_mode: 'sequential'
    },
    {
      type: 'approval',
      role: 'Manager',
      title: 'Manager Review',
      description: 'Manager reviews and approves/rejects the request',
      execution_mode: 'sequential'
    }
  ],

  dataFieldInference: [
    { name: 'id', type: 'string', description: 'Unique identifier', isPII: false, isRequired: true },
    { name: 'email', type: 'string', description: 'Email address', isPII: true, isRequired: true },
    { name: 'created_at', type: 'timestamp', description: 'Creation timestamp', isPII: false, isRequired: true },
    { name: 'status', type: 'string', description: 'Current status', isPII: false, isRequired: true }
  ],

  businessRuleGeneration: [
    {
      name: 'Amount Threshold Check',
      category: 'validation',
      description: 'Validate transaction amount is within allowed limits',
      expression: 'amount > 0 AND amount <= max_allowed_amount'
    },
    {
      name: 'Eligibility Check',
      category: 'eligibility',
      description: 'User must have active account and sufficient balance',
      expression: 'account.status == "active" AND account.balance >= required_amount'
    }
  ],

  roiEnhancement: {
    adjustedAutomationPercent: 65,
    additionalCosts: ['Training: $5,000', 'Ongoing monitoring: $2,000/month'],
    additionalBenefits: ['Improved accuracy', 'Faster processing time', 'Better compliance'],
    riskFactors: ['Medium complexity', 'Change management required'],
    recommendations: [
      'Consider phased rollout to reduce risk',
      'Build in 6-month review cycle',
      'Track quality metrics closely'
    ]
  },

  useCaseCompleteness: {
    score: 75,
    missingItems: ['SLA definitions', 'Error handling procedures'],
    recommendations: [
      'Define clear success metrics',
      'Add exception handling steps',
      'Document data retention policies'
    ],
    strengths: ['Well-defined scope', 'Clear ROI', 'Good stakeholder identification']
  },

  agentPromptGeneration: {
    systemPrompt: 'You are a helpful assistant that processes customer requests. Be professional, concise, and accurate. Always validate inputs before processing.',
    suggestedTemperature: 0.7,
    suggestedMaxTokens: 1000
  },

  flowOptimization: {
    optimizations: [
      { type: 'parallelization', description: 'Steps 3 and 4 can run in parallel', impact: 'high' },
      { type: 'caching', description: 'Cache frequently accessed data', impact: 'medium' },
      { type: 'model_selection', description: 'Use faster model for simple validations', impact: 'medium' }
    ],
    estimatedImprovement: '30% faster, 20% cost reduction'
  },

  testScenarioGeneration: [
    {
      name: 'Happy Path - Valid Request',
      description: 'Test standard request with all valid inputs',
      inputs: { request_type: 'standard', amount: 100 },
      expectedBehavior: 'Request processed successfully',
      successCriteria: 'Status = approved, response time < 2s'
    },
    {
      name: 'Edge Case - Maximum Amount',
      description: 'Test request at maximum allowed amount',
      inputs: { request_type: 'standard', amount: 999999 },
      expectedBehavior: 'Request processed with additional validation',
      successCriteria: 'Status = pending_review'
    }
  ]
};

class LLMService {
  private config: LLMConfig | null = null;

  constructor() {
    this.loadConfig();
  }

  loadConfig(): void {
    const saved = localStorage.getItem('llm_config');
    if (saved) {
      this.config = JSON.parse(saved);
    }
  }

  isEnabled(): boolean {
    return this.config?.enabled ?? false;
  }

  isDemoMode(): boolean {
    return this.config?.mode === 'demo';
  }

  /**
   * Core LLM API call
   */
  private async callLLM(prompt: string, systemPrompt: string): Promise<LLMResponse> {
    const startTime = Date.now();

    // Demo mode - return mock data
    if (this.isDemoMode()) {
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate latency
      return {
        success: true,
        data: { content: 'Demo mode response' },
        tokens: 100,
        latency: Date.now() - startTime
      };
    }

    if (!this.config) {
      return { success: false, error: 'LLM not configured' };
    }

    try {
      if (this.config.provider === 'anthropic') {
        return await this.callAnthropic(prompt, systemPrompt);
      } else if (this.config.provider === 'openai') {
        return await this.callOpenAI(prompt, systemPrompt);
      } else {
        return await this.callCustom(prompt, systemPrompt);
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        latency: Date.now() - startTime
      };
    }
  }

  private async callAnthropic(prompt: string, systemPrompt: string): Promise<LLMResponse> {
    const startTime = Date.now();
    
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': this.config!.apiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: this.config!.model,
        max_tokens: this.config!.maxTokens,
        temperature: this.config!.temperature,
        system: systemPrompt,
        messages: [{ role: 'user', content: prompt }]
      })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || 'API call failed');
    }

    const data = await response.json();
    
    return {
      success: true,
      data: { content: data.content[0].text },
      tokens: data.usage.input_tokens + data.usage.output_tokens,
      latency: Date.now() - startTime
    };
  }

  private async callOpenAI(prompt: string, systemPrompt: string): Promise<LLMResponse> {
    const startTime = Date.now();
    
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.config!.apiKey}`
      },
      body: JSON.stringify({
        model: this.config!.model,
        max_tokens: this.config!.maxTokens,
        temperature: this.config!.temperature,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: prompt }
        ]
      })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || 'API call failed');
    }

    const data = await response.json();
    
    return {
      success: true,
      data: { content: data.choices[0].message.content },
      tokens: data.usage.total_tokens,
      latency: Date.now() - startTime
    };
  }

  private async callCustom(prompt: string, systemPrompt: string): Promise<LLMResponse> {
    const startTime = Date.now();
    
    const response = await fetch(this.config!.endpoint!, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.config!.apiKey}`
      },
      body: JSON.stringify({
        prompt: `${systemPrompt}\n\n${prompt}`,
        max_tokens: this.config!.maxTokens,
        temperature: this.config!.temperature
      })
    });

    if (!response.ok) {
      throw new Error('API call failed');
    }

    const data = await response.json();
    
    return {
      success: true,
      data,
      latency: Date.now() - startTime
    };
  }

  /**
   * AgentPrep Processing Points
   */

  async suggestProcessSteps(context: {
    useCaseName: string;
    objective: string;
    existingSteps: any[];
  }): Promise<LLMResponse> {
    if (this.isDemoMode()) {
      await new Promise(resolve => setTimeout(resolve, 800));
      return {
        success: true,
        data: DEMO_RESPONSES.processStepSuggestions,
        latency: 800
      };
    }

    const prompt = `Use Case: ${context.useCaseName}
Objective: ${context.objective}

Existing Steps:
${JSON.stringify(context.existingSteps, null, 2)}

Suggest 3-5 logical next steps or missing steps that would improve this process.`;

    const response = await this.callLLM(prompt, INSTRUCTIONS.processStepSuggestions);
    
    if (response.success && response.data?.content) {
      try {
        const parsed = JSON.parse(response.data.content);
        return { ...response, data: parsed };
      } catch {
        return { ...response, error: 'Failed to parse response' };
      }
    }
    
    return response;
  }

  async inferDataFields(context: {
    assetName: string;
    sourceSystem: string;
    objectType: string;
  }): Promise<LLMResponse> {
    if (this.isDemoMode()) {
      await new Promise(resolve => setTimeout(resolve, 800));
      return {
        success: true,
        data: DEMO_RESPONSES.dataFieldInference,
        latency: 800
      };
    }

    const prompt = `Data Asset: ${context.assetName}
Source System: ${context.sourceSystem}
Object Type: ${context.objectType}

Infer the likely fields/schema for this data asset.`;

    const response = await this.callLLM(prompt, INSTRUCTIONS.dataFieldInference);
    
    if (response.success && response.data?.content) {
      try {
        const parsed = JSON.parse(response.data.content);
        return { ...response, data: parsed };
      } catch {
        return { ...response, error: 'Failed to parse response' };
      }
    }
    
    return response;
  }

  async generateBusinessRules(context: {
    useCaseName: string;
    objective: string;
    processDescription: string;
  }): Promise<LLMResponse> {
    if (this.isDemoMode()) {
      await new Promise(resolve => setTimeout(resolve, 800));
      return {
        success: true,
        data: DEMO_RESPONSES.businessRuleGeneration,
        latency: 800
      };
    }

    const prompt = `Use Case: ${context.useCaseName}
Objective: ${context.objective}
Process: ${context.processDescription}

Suggest relevant business rules for this use case.`;

    const response = await this.callLLM(prompt, INSTRUCTIONS.businessRuleGeneration);
    
    if (response.success && response.data?.content) {
      try {
        const parsed = JSON.parse(response.data.content);
        return { ...response, data: parsed };
      } catch {
        return { ...response, error: 'Failed to parse response' };
      }
    }
    
    return response;
  }

  async enhanceROI(context: {
    metrics: any;
    useCaseDescription: string;
  }): Promise<LLMResponse> {
    if (this.isDemoMode()) {
      await new Promise(resolve => setTimeout(resolve, 800));
      return {
        success: true,
        data: DEMO_RESPONSES.roiEnhancement,
        latency: 800
      };
    }

    const prompt = `Use Case: ${context.useCaseDescription}

Current Metrics:
${JSON.stringify(context.metrics, null, 2)}

Review and suggest improvements to the ROI calculation.`;

    const response = await this.callLLM(prompt, INSTRUCTIONS.roiEnhancement);
    
    if (response.success && response.data?.content) {
      try {
        const parsed = JSON.parse(response.data.content);
        return { ...response, data: parsed };
      } catch {
        return { ...response, error: 'Failed to parse response' };
      }
    }
    
    return response;
  }

  async checkUseCaseCompleteness(useCase: any): Promise<LLMResponse> {
    if (this.isDemoMode()) {
      await new Promise(resolve => setTimeout(resolve, 800));
      return {
        success: true,
        data: DEMO_RESPONSES.useCaseCompleteness,
        latency: 800
      };
    }

    const prompt = `Analyze this use case for completeness:

${JSON.stringify(useCase, null, 2)}

Provide quality assessment and recommendations.`;

    const response = await this.callLLM(prompt, INSTRUCTIONS.useCaseCompleteness);
    
    if (response.success && response.data?.content) {
      try {
        const parsed = JSON.parse(response.data.content);
        return { ...response, data: parsed };
      } catch {
        return { ...response, error: 'Failed to parse response' };
      }
    }
    
    return response;
  }

  /**
   * SimLab Processing Points
   */

  async generateAgentPrompt(context: {
    role: string;
    tools: string[];
    upstreamContext: string;
  }): Promise<LLMResponse> {
    if (this.isDemoMode()) {
      await new Promise(resolve => setTimeout(resolve, 800));
      return {
        success: true,
        data: DEMO_RESPONSES.agentPromptGeneration,
        latency: 800
      };
    }

    const prompt = `Agent Role: ${context.role}
Available Tools: ${context.tools.join(', ')}
Context: ${context.upstreamContext}

Generate an effective system prompt for this agent.`;

    const response = await this.callLLM(prompt, INSTRUCTIONS.agentPromptGeneration);
    
    if (response.success && response.data?.content) {
      try {
        const parsed = JSON.parse(response.data.content);
        return { ...response, data: parsed };
      } catch {
        return { ...response, error: 'Failed to parse response' };
      }
    }
    
    return response;
  }

  async optimizeFlow(graph: { nodes: any[]; edges: any[] }): Promise<LLMResponse> {
    if (this.isDemoMode()) {
      await new Promise(resolve => setTimeout(resolve, 800));
      return {
        success: true,
        data: DEMO_RESPONSES.flowOptimization,
        latency: 800
      };
    }

    const prompt = `Analyze this agent workflow graph:

Nodes: ${JSON.stringify(graph.nodes, null, 2)}
Edges: ${JSON.stringify(graph.edges, null, 2)}

Suggest optimizations for performance and cost.`;

    const response = await this.callLLM(prompt, INSTRUCTIONS.flowOptimization);
    
    if (response.success && response.data?.content) {
      try {
        const parsed = JSON.parse(response.data.content);
        return { ...response, data: parsed };
      } catch {
        return { ...response, error: 'Failed to parse response' };
      }
    }
    
    return response;
  }

  async generateTestScenarios(graph: { nodes: any[]; edges: any[] }): Promise<LLMResponse> {
    if (this.isDemoMode()) {
      await new Promise(resolve => setTimeout(resolve, 800));
      return {
        success: true,
        data: DEMO_RESPONSES.testScenarioGeneration,
        latency: 800
      };
    }

    const prompt = `Generate test scenarios for this workflow:

${JSON.stringify(graph, null, 2)}

Include happy path, edge cases, and error scenarios.`;

    const response = await this.callLLM(prompt, INSTRUCTIONS.testScenarioGeneration);
    
    if (response.success && response.data?.content) {
      try {
        const parsed = JSON.parse(response.data.content);
        return { ...response, data: parsed };
      } catch {
        return { ...response, error: 'Failed to parse response' };
      }
    }
    
    return response;
  }
}

// Singleton instance
export const llmService = new LLMService();