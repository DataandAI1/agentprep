import React, { useState } from 'react';
import { Sparkles, Loader, CheckCircle, AlertCircle, XCircle } from 'lucide-react';
import { llmService } from '../../services/llm-service';

/**
 * ProcessStepsExample Component
 * 
 * Demonstrates how to integrate AI-powered process step suggestions
 * into your AgentPrep components.
 * 
 * Key Features:
 * - Get AI suggestions for next process steps
 * - Apply suggestions to your process
 * - Dismiss unwanted suggestions
 * - Visual feedback for all actions
 */

interface ProcessStep {
  id: string;
  type: 'trigger' | 'task' | 'decision' | 'approval' | 'wait';
  role: string;
  title: string;
  description?: string;
  execution_mode: 'sequential' | 'parallel';
}

interface UseCase {
  name: string;
  objective: string;
}

const ProcessStepsExample: React.FC<{ useCase: UseCase }> = ({ useCase }) => {
  // Existing process steps state
  const [steps, setSteps] = useState<ProcessStep[]>([
    {
      id: '1',
      type: 'trigger',
      role: 'System',
      title: 'Receive Request',
      description: 'Customer submits a request',
      execution_mode: 'sequential'
    }
  ]);

  // AI-related state
  const [aiSuggestions, setAiSuggestions] = useState<any[]>([]);
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);
  const [aiStatus, setAiStatus] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);

  // Check if LLM is enabled
  const llmEnabled = llmService.isEnabled();

  /**
   * Handler: Get AI Suggestions
   * Calls the LLM service to get process step suggestions
   */
  const handleGetSuggestions = async () => {
    setIsLoadingSuggestions(true);
    setAiStatus(null);

    try {
      const response = await llmService.suggestProcessSteps({
        useCaseName: useCase.name,
        objective: useCase.objective,
        existingSteps: steps
      });

      if (response.success) {
        setAiSuggestions(response.data);
        setAiStatus({
          type: 'success',
          message: `Found ${response.data.length} suggestions (${response.tokens} tokens, ${response.latency}ms)`
        });
      } else {
        setAiStatus({
          type: 'error',
          message: response.error || 'Failed to get suggestions'
        });
      }
    } catch (error) {
      setAiStatus({
        type: 'error',
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    } finally {
      setIsLoadingSuggestions(false);
    }
  };

  /**
   * Handler: Apply Suggestion
   * Adds a suggested step to the process
   */
  const handleApplySuggestion = (suggestion: any) => {
    const newStep: ProcessStep = {
      id: crypto.randomUUID(),
      type: suggestion.type,
      role: suggestion.role,
      title: suggestion.title,
      description: suggestion.description,
      execution_mode: suggestion.execution_mode
    };

    setSteps([...steps, newStep]);
    setAiSuggestions(aiSuggestions.filter(s => s !== suggestion));
    
    setAiStatus({
      type: 'success',
      message: `Added: ${suggestion.title}`
    });

    setTimeout(() => setAiStatus(null), 3000);
  };

  /**
   * Handler: Dismiss Suggestion
   * Removes a suggestion without applying it
   */
  const handleDismissSuggestion = (suggestion: any) => {
    setAiSuggestions(aiSuggestions.filter(s => s !== suggestion));
  };

  return (
    <div className="space-y-6">
      {/* Header with AI Button */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-800">
          Process Steps ({steps.length})
        </h2>

        {/* AI Button - Only visible if LLM is enabled */}
        {llmEnabled && (
          <button
            onClick={handleGetSuggestions}
            disabled={isLoadingSuggestions}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 disabled:from-gray-400 disabled:to-gray-400 disabled:cursor-not-allowed transition-all shadow-md hover:shadow-lg"
          >
            {isLoadingSuggestions ? (
              <>
                <Loader className="w-5 h-5 animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                Get AI Suggestions
              </>
            )}
          </button>
        )}
      </div>

      {/* Status Message */}
      {aiStatus && (
        <div
          className={`p-3 rounded-lg flex items-center gap-2 ${
            aiStatus.type === 'success'
              ? 'bg-green-50 text-green-800 border border-green-200'
              : 'bg-red-50 text-red-800 border border-red-200'
          }`}
        >
          {aiStatus.type === 'success' ? (
            <CheckCircle className="w-5 h-5" />
          ) : (
            <AlertCircle className="w-5 h-5" />
          )}
          <span className="text-sm font-medium">{aiStatus.message}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Existing Steps - Left Side */}
        <div className="lg:col-span-2">
          <div className="space-y-3">
            {steps.map((step, index) => (
              <div
                key={step.id}
                className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 transition-colors bg-white"
              >
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-semibold">
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span
                        className={`px-2 py-1 text-xs font-medium rounded ${
                          step.type === 'trigger'
                            ? 'bg-green-100 text-green-800'
                            : step.type === 'task'
                            ? 'bg-blue-100 text-blue-800'
                            : step.type === 'decision'
                            ? 'bg-yellow-100 text-yellow-800'
                            : step.type === 'approval'
                            ? 'bg-purple-100 text-purple-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {step.type}
                      </span>
                      <h3 className="font-semibold text-gray-800">{step.title}</h3>
                    </div>
                    <p className="text-sm text-gray-600">Role: {step.role}</p>
                    {step.description && (
                      <p className="text-sm text-gray-500 mt-1">{step.description}</p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* AI Suggestions - Right Side */}
        {llmEnabled && aiSuggestions.length > 0 && (
          <div className="lg:col-span-1">
            <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-lg shadow-md p-4 border-2 border-purple-200 sticky top-4">
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="w-5 h-5 text-purple-600" />
                <h3 className="font-semibold text-gray-800">
                  AI Suggestions ({aiSuggestions.length})
                </h3>
              </div>

              <div className="space-y-3 max-h-[600px] overflow-y-auto">
                {aiSuggestions.map((suggestion, index) => (
                  <div
                    key={index}
                    className="bg-white rounded-lg p-3 border border-purple-200 hover:border-purple-300 transition-colors"
                  >
                    <div className="mb-2">
                      <div className="flex items-center gap-2 mb-1">
                        <span
                          className={`px-2 py-1 text-xs font-medium rounded ${
                            suggestion.type === 'trigger'
                              ? 'bg-green-100 text-green-800'
                              : suggestion.type === 'task'
                              ? 'bg-blue-100 text-blue-800'
                              : suggestion.type === 'decision'
                              ? 'bg-yellow-100 text-yellow-800'
                              : suggestion.type === 'approval'
                              ? 'bg-purple-100 text-purple-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}
                        >
                          {suggestion.type}
                        </span>
                      </div>
                      <h4 className="font-semibold text-gray-800 text-sm">
                        {suggestion.title}
                      </h4>
                    </div>

                    <p className="text-xs text-gray-600 mb-2">
                      {suggestion.description}
                    </p>

                    <p className="text-xs text-gray-500 mb-3">
                      Role: {suggestion.role}
                    </p>

                    <div className="flex gap-2">
                      <button
                        onClick={() => handleApplySuggestion(suggestion)}
                        className="flex-1 px-3 py-2 bg-green-600 text-white text-sm rounded hover:bg-green-700 transition-colors font-medium"
                      >
                        Add Step
                      </button>
                      <button
                        onClick={() => handleDismissSuggestion(suggestion)}
                        className="px-3 py-2 bg-gray-200 text-gray-700 text-sm rounded hover:bg-gray-300 transition-colors"
                      >
                        <XCircle className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <button
                onClick={() => setAiSuggestions([])}
                className="w-full mt-4 px-3 py-2 text-sm text-gray-600 hover:text-gray-800 underline"
              >
                Clear All Suggestions
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Info Box for Users */}
      {!llmEnabled && (
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-semibold text-blue-900 mb-1">AI Features Available</h4>
              <p className="text-sm text-blue-800">
                Enable LLM features in Settings to get AI-powered process step suggestions.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProcessStepsExample;