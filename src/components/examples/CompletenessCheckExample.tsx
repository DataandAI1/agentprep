import React, { useState } from 'react';
import { Sparkles, Loader, CheckCircle, AlertCircle, Award, XCircle } from 'lucide-react';
import { llmService } from '../../services/llm-service';

/**
 * CompletenessCheckExample Component
 * 
 * Demonstrates how to integrate AI-powered use case completeness checking
 * into your review and validation components.
 * 
 * Key Features:
 * - Quality scoring (0-100)
 * - Identify missing items
 * - Get actionable recommendations
 * - Highlight strengths
 * - Visual progress indicators
 */

interface CompletenessResult {
  score: number;
  missingItems: string[];
  recommendations: string[];
  strengths: string[];
}

const CompletenessCheckExample: React.FC = () => {
  const [completenessResult, setCompletenessResult] = useState<CompletenessResult | null>(null);
  const [isChecking, setIsChecking] = useState(false);
  const [status, setStatus] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);

  const llmEnabled = llmService.isEnabled();

  // Sample use case data
  const useCase = {
    name: 'Customer Onboarding Automation',
    objective: 'Automate customer onboarding to reduce manual work and improve experience',
    scope: 'End-to-end onboarding from application submission to account activation',
    processSteps: [
      { title: 'Receive Application', type: 'trigger' },
      { title: 'Validate Information', type: 'task' },
      { title: 'Approve/Reject', type: 'decision' }
    ],
    dataAssets: [
      { name: 'customers', system: 'PostgreSQL' }
    ],
    applications: [
      { name: 'CRM', type: 'saas' }
    ],
    rules: [
      { name: 'Age Verification', category: 'validation' }
    ],
    metrics: {
      dailyVolume: 50,
      avgHandlingTimeMinutes: 45
    }
  };

  /**
   * Handler: Check Completeness
   */
  const handleCheckCompleteness = async () => {
    setIsChecking(true);
    setStatus(null);

    try {
      const response = await llmService.checkUseCaseCompleteness(useCase);

      if (response.success) {
        setCompletenessResult(response.data);
        setStatus({
          type: 'success',
          message: `Quality check complete (${response.tokens} tokens)`
        });

        setTimeout(() => setStatus(null), 3000);
      } else {
        setStatus({
          type: 'error',
          message: response.error || 'Failed to check completeness'
        });
      }
    } catch (error) {
      setStatus({
        type: 'error',
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    } finally {
      setIsChecking(false);
    }
  };

  /**
   * Get score color
   */
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  /**
   * Get score label
   */
  const getScoreLabel = (score: number) => {
    if (score >= 80) return 'Excellent';
    if (score >= 60) return 'Good';
    if (score >= 40) return 'Fair';
    return 'Needs Work';
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-800">
          Use Case Quality Check
        </h2>

        {/* Check Button */}
        {llmEnabled && (
          <button
            onClick={handleCheckCompleteness}
            disabled={isChecking}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-600 to-orange-600 text-white rounded-lg hover:from-amber-700 hover:to-orange-700 disabled:from-gray-400 disabled:to-gray-400 transition-all shadow-md"
          >
            {isChecking ? (
              <>
                <Loader className="w-5 h-5 animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                AI Quality Check
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

      {/* Use Case Summary */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="font-semibold text-gray-800 mb-4">Use Case Overview</h3>
        <div className="space-y-2 text-sm">
          <p><strong>Name:</strong> {useCase.name}</p>
          <p><strong>Objective:</strong> {useCase.objective}</p>
          <p><strong>Process Steps:</strong> {useCase.processSteps.length}</p>
          <p><strong>Data Assets:</strong> {useCase.dataAssets.length}</p>
          <p><strong>Applications:</strong> {useCase.applications.length}</p>
          <p><strong>Rules:</strong> {useCase.rules.length}</p>
        </div>
      </div>

      {/* Completeness Results */}
      {completenessResult && (
        <div className="bg-gradient-to-br from-amber-50 to-orange-50 border-2 border-amber-300 rounded-lg p-6">
          <div className="flex items-center gap-2 mb-6">
            <Sparkles className="w-6 h-6 text-amber-600" />
            <h3 className="font-semibold text-gray-800 text-lg">Quality Assessment</h3>
          </div>

          {/* Score Display */}
          <div className="bg-white rounded-lg p-6 mb-6 text-center border border-amber-200">
            <div className="flex items-center justify-center gap-4 mb-2">
              <Award className={`w-16 h-16 ${getScoreColor(completenessResult.score)}`} />
              <div>
                <div className={`text-5xl font-bold ${getScoreColor(completenessResult.score)}`}>
                  {completenessResult.score}
                </div>
                <div className="text-sm text-gray-600 mt-1">
                  {getScoreLabel(completenessResult.score)}
                </div>
              </div>
            </div>
            
            {/* Progress Bar */}
            <div className="w-full bg-gray-200 rounded-full h-3 mt-4">
              <div
                className={`h-3 rounded-full transition-all ${
                  completenessResult.score >= 80
                    ? 'bg-green-600'
                    : completenessResult.score >= 60
                    ? 'bg-yellow-600'
                    : 'bg-red-600'
                }`}
                style={{ width: `${completenessResult.score}%` }}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Strengths */}
            <div className="bg-white rounded-lg p-4 border border-green-200">
              <div className="flex items-center gap-2 mb-3">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <h4 className="font-semibold text-gray-800">Strengths</h4>
              </div>
              <ul className="space-y-2">
                {completenessResult.strengths.map((strength, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-sm text-gray-700">
                    <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                    <span>{strength}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Missing Items */}
            <div className="bg-white rounded-lg p-4 border border-red-200">
              <div className="flex items-center gap-2 mb-3">
                <XCircle className="w-5 h-5 text-red-600" />
                <h4 className="font-semibold text-gray-800">Missing Items</h4>
              </div>
              <ul className="space-y-2">
                {completenessResult.missingItems.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-sm text-gray-700">
                    <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Recommendations */}
          <div className="bg-white rounded-lg p-4 mt-4 border border-purple-200">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="w-5 h-5 text-purple-600" />
              <h4 className="font-semibold text-gray-800">Recommendations</h4>
            </div>
            <ul className="space-y-2">
              {completenessResult.recommendations.map((rec, idx) => (
                <li key={idx} className="flex items-start gap-2 text-sm text-gray-700">
                  <span className="text-purple-600 font-bold flex-shrink-0">{idx + 1}.</span>
                  <span>{rec}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* Info Box */}
      {!completenessResult && (
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-start gap-3">
            <Award className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-semibold text-blue-900 mb-1">Quality Scoring</h4>
              <p className="text-sm text-blue-800 mb-2">
                Click "AI Quality Check" to analyze your use case completeness and get a quality score.
              </p>
              <ul className="text-sm text-blue-700 space-y-1 ml-4 list-disc">
                <li>Comprehensive quality assessment (0-100)</li>
                <li>Identify gaps and missing information</li>
                <li>Get actionable recommendations</li>
                <li>Highlight your strengths</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Enable AI Prompt */}
      {!llmEnabled && (
        <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
          <div className="flex items-start gap-3">
            <Sparkles className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-semibold text-amber-900 mb-1">AI Quality Assessment Available</h4>
              <p className="text-sm text-amber-800">
                Enable LLM features in Settings to get AI-powered quality assessment and recommendations.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CompletenessCheckExample;