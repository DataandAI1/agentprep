import { useState } from 'react';
import { Sparkles, Loader, CheckCircle, FileText } from 'lucide-react';
import { llmService } from '../../services/llm-service';

/**
 * BusinessRulesExample Component
 * 
 * Demonstrates how to integrate AI-powered business rule generation
 * into your rules management components.
 * 
 * Key Features:
 * - Generate business rules from use case context
 * - Categorize rules automatically
 * - Suggest rule expressions
 * - Apply or customize generated rules
 */

interface BusinessRule {
  id: string;
  name: string;
  category: 'validation' | 'eligibility' | 'routing' | 'pricing' | 'compliance';
  description: string;
  expression: string;
  aiGenerated?: boolean;
}

interface UseCase {
  name: string;
  objective: string;
  processDescription: string;
}

const BusinessRulesExample: React.FC<{ useCase: UseCase }> = ({ useCase }) => {
  const [rules, setRules] = useState<BusinessRule[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [status, setStatus] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);

  const llmEnabled = llmService.isEnabled();

  /**
   * Handler: Generate Rules
   */
  const handleGenerateRules = async () => {
    setIsGenerating(true);
    setStatus(null);

    try {
      const response = await llmService.generateBusinessRules({
        useCaseName: useCase.name,
        objective: useCase.objective,
        processDescription: useCase.processDescription
      });

      if (response.success) {
        const generatedRules: BusinessRule[] = response.data.map((rule: any) => ({
          id: crypto.randomUUID(),
          name: rule.name,
          category: rule.category,
          description: rule.description,
          expression: rule.expression,
          aiGenerated: true
        }));

        setRules([...rules, ...generatedRules]);

        setStatus({
          type: 'success',
          message: `Generated ${generatedRules.length} rules (${response.tokens} tokens)`
        });

        setTimeout(() => setStatus(null), 3000);
      } else {
        setStatus({
          type: 'error',
          message: response.error || 'Failed to generate rules'
        });
      }
    } catch (error) {
      setStatus({
        type: 'error',
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    } finally {
      setIsGenerating(false);
    }
  };

  /**
   * Handler: Remove Rule
   */
  const handleRemoveRule = (ruleId: string) => {
    setRules(rules.filter(r => r.id !== ruleId));
  };

  /**
   * Get category color
   */
  const getCategoryColor = (category: string) => {
    const colors = {
      validation: 'bg-blue-100 text-blue-800',
      eligibility: 'bg-green-100 text-green-800',
      routing: 'bg-purple-100 text-purple-800',
      pricing: 'bg-yellow-100 text-yellow-800',
      compliance: 'bg-red-100 text-red-800'
    };
    return colors[category as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-800">
          Business Rules ({rules.length})
        </h2>

        {/* Generate Button */}
        {llmEnabled && (
          <button
            onClick={handleGenerateRules}
            disabled={isGenerating}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-400 transition-all shadow-md"
          >
            {isGenerating ? (
              <>
                <Loader className="w-5 h-5 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                Generate Rules
              </>
            )}
          </button>
        )}
      </div>

      {/* Status Message */}
      {status && (
        <div
          className={`p-3 rounded-lg flex items-center gap-2 ${
            status.type === 'success'
              ? 'bg-green-50 text-green-800 border border-green-200'
              : 'bg-red-50 text-red-800 border border-red-200'
          }`}
        >
          <CheckCircle className="w-5 h-5" />
          <span className="text-sm font-medium">{status.message}</span>
        </div>
      )}

      {/* Rules List */}
      {rules.length > 0 ? (
        <div className="space-y-3">
          {rules.map(rule => (
            <div
              key={rule.id}
              className="border border-gray-200 rounded-lg p-4 bg-white hover:border-indigo-300 transition-colors"
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-indigo-600" />
                  <h3 className="font-semibold text-gray-800">{rule.name}</h3>
                  <span className={`px-2 py-1 text-xs font-medium rounded ${getCategoryColor(rule.category)}`}>
                    {rule.category}
                  </span>
                  {rule.aiGenerated && (
                    <span className="px-2 py-1 text-xs bg-purple-100 text-purple-800 rounded flex items-center gap-1">
                      <Sparkles className="w-3 h-3" />
                      AI
                    </span>
                  )}
                </div>
                <button
                  onClick={() => handleRemoveRule(rule.id)}
                  className="text-gray-400 hover:text-red-600 transition-colors"
                  title="Remove rule"
                >
                  ×
                </button>
              </div>

              <p className="text-sm text-gray-600 mb-3">{rule.description}</p>

              <div className="bg-gray-50 rounded p-3 border border-gray-200">
                <p className="text-xs font-semibold text-gray-700 mb-1">Expression:</p>
                <code className="text-xs text-gray-800 font-mono">{rule.expression}</code>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
          <FileText className="w-16 h-16 mx-auto mb-3 text-gray-300" />
          <p className="text-gray-600 mb-2">No business rules defined yet</p>
          {llmEnabled && (
            <p className="text-sm text-gray-500">Click "Generate Rules" to get AI suggestions</p>
          )}
        </div>
      )}

      {/* Info Box */}
      <div className="p-4 bg-indigo-50 border border-indigo-200 rounded-lg">
        <div className="flex items-start gap-3">
          <FileText className="w-5 h-5 text-indigo-600 flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="font-semibold text-indigo-900 mb-1">About Business Rules</h4>
            <p className="text-sm text-indigo-800 mb-2">
              Business rules define the logic and constraints for your automated process. They include:
            </p>
            <ul className="text-sm text-indigo-700 space-y-1 ml-4 list-disc">
              <li><strong>Validation:</strong> Data quality and completeness checks</li>
              <li><strong>Eligibility:</strong> Criteria for processing</li>
              <li><strong>Routing:</strong> Decision logic for workflow paths</li>
              <li><strong>Pricing:</strong> Calculation rules</li>
              <li><strong>Compliance:</strong> Regulatory requirements</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Enable AI Prompt */}
      {!llmEnabled && (
        <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
          <div className="flex items-start gap-3">
            <Sparkles className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-semibold text-purple-900 mb-1">AI Rule Generation Available</h4>
              <p className="text-sm text-purple-800">
                Enable LLM features in Settings to automatically generate business rules based on your use case.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BusinessRulesExample;