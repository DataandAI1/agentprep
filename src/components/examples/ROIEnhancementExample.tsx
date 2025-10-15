import React, { useState } from 'react';
import { Sparkles, Loader, CheckCircle, TrendingUp, DollarSign, AlertTriangle } from 'lucide-react';
import { llmService } from '../../services/llm-service';

/**
 * ROIEnhancementExample Component
 * 
 * Demonstrates how to integrate AI-powered ROI analysis enhancement
 * into your metrics and ROI components.
 * 
 * Key Features:
 * - Analyze and enhance ROI calculations
 * - Identify hidden costs
 * - Surface additional benefits
 * - Assess risk factors
 * - Get actionable recommendations
 */

interface Metrics {
  dailyVolume: number;
  avgHandlingTimeMinutes: number;
  fteCostPerHour: number;
  errorRate: number;
  costPerError: number;
}

interface ROIEnhancement {
  adjustedAutomationPercent: number;
  additionalCosts: string[];
  additionalBenefits: string[];
  riskFactors: string[];
  recommendations: string[];
}

const ROIEnhancementExample: React.FC = () => {
  const [metrics, setMetrics] = useState<Metrics>({
    dailyVolume: 100,
    avgHandlingTimeMinutes: 30,
    fteCostPerHour: 50,
    errorRate: 0.05,
    costPerError: 100
  });

  const [enhancement, setEnhancement] = useState<ROIEnhancement | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [status, setStatus] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);

  const llmEnabled = llmService.isEnabled();

  // Calculate basic ROI
  const calculateBasicROI = () => {
    const annualVolume = metrics.dailyVolume * 250; // 250 working days
    const currentAnnualCost = (annualVolume * (metrics.avgHandlingTimeMinutes / 60) * metrics.fteCostPerHour) +
                              (annualVolume * metrics.errorRate * metrics.costPerError);
    const automationPercent = 0.70; // 70% default
    const futureAnnualCost = currentAnnualCost * (1 - automationPercent);
    const annualSavings = currentAnnualCost - futureAnnualCost;

    return {
      currentAnnualCost: Math.round(currentAnnualCost),
      futureAnnualCost: Math.round(futureAnnualCost),
      annualSavings: Math.round(annualSavings),
      automationPercent: automationPercent * 100
    };
  };

  const basicROI = calculateBasicROI();

  /**
   * Handler: Enhance ROI Analysis
   */
  const handleEnhanceROI = async () => {
    setIsAnalyzing(true);
    setStatus(null);

    try {
      const response = await llmService.enhanceROI({
        metrics,
        useCaseDescription: 'Customer service automation process'
      });

      if (response.success) {
        setEnhancement(response.data);
        setStatus({
          type: 'success',
          message: `Analysis complete (${response.tokens} tokens, ${response.latency}ms)`
        });

        setTimeout(() => setStatus(null), 3000);
      } else {
        setStatus({
          type: 'error',
          message: response.error || 'Failed to enhance ROI'
        });
      }
    } catch (error) {
      setStatus({
        type: 'error',
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-800">
          ROI Analysis
        </h2>

        {/* Enhance Button */}
        {llmEnabled && (
          <button
            onClick={handleEnhanceROI}
            disabled={isAnalyzing}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:from-green-700 hover:to-emerald-700 disabled:from-gray-400 disabled:to-gray-400 transition-all shadow-md"
          >
            {isAnalyzing ? (
              <>
                <Loader className="w-5 h-5 animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                Enhance ROI Analysis
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

      {/* Basic Metrics Input */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="font-semibold text-gray-800 mb-4">Baseline Metrics</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Daily Volume
            </label>
            <input
              type="number"
              value={metrics.dailyVolume}
              onChange={(e) => setMetrics({ ...metrics, dailyVolume: parseInt(e.target.value) })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Avg Handling Time (min)
            </label>
            <input
              type="number"
              value={metrics.avgHandlingTimeMinutes}
              onChange={(e) => setMetrics({ ...metrics, avgHandlingTimeMinutes: parseInt(e.target.value) })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              FTE Cost per Hour ($)
            </label>
            <input
              type="number"
              value={metrics.fteCostPerHour}
              onChange={(e) => setMetrics({ ...metrics, fteCostPerHour: parseInt(e.target.value) })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Error Rate (%)
            </label>
            <input
              type="number"
              step="0.01"
              value={metrics.errorRate * 100}
              onChange={(e) => setMetrics({ ...metrics, errorRate: parseFloat(e.target.value) / 100 })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            />
          </div>
        </div>
      </div>

      {/* Basic ROI Calculation */}
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-6">
        <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-blue-600" />
          Basic ROI Calculation
        </h3>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <p className="text-sm text-gray-600 mb-1">Current Annual Cost</p>
            <p className="text-2xl font-bold text-gray-800">
              ${basicROI.currentAnnualCost.toLocaleString()}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600 mb-1">Future Annual Cost</p>
            <p className="text-2xl font-bold text-gray-800">
              ${basicROI.futureAnnualCost.toLocaleString()}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600 mb-1">Annual Savings</p>
            <p className="text-2xl font-bold text-green-600">
              ${basicROI.annualSavings.toLocaleString()}
            </p>
          </div>
        </div>
        <p className="text-xs text-gray-500 mt-3">
          Assumes {basicROI.automationPercent}% automation rate
        </p>
      </div>

      {/* AI Enhancement Results */}
      {enhancement && (
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-300 rounded-lg p-6">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="w-6 h-6 text-green-600" />
            <h3 className="font-semibold text-gray-800 text-lg">AI-Enhanced Analysis</h3>
          </div>

          <div className="space-y-4">
            {/* Adjusted Automation % */}
            <div className="bg-white rounded-lg p-4 border border-green-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-700">Adjusted Automation Rate</p>
                  <p className="text-xs text-gray-500 mt-1">
                    AI recommends {enhancement.adjustedAutomationPercent}% vs standard 70%
                  </p>
                </div>
                <div className="text-3xl font-bold text-green-600">
                  {enhancement.adjustedAutomationPercent}%
                </div>
              </div>
            </div>

            {/* Additional Costs */}
            <div className="bg-white rounded-lg p-4 border border-orange-200">
              <div className="flex items-center gap-2 mb-2">
                <DollarSign className="w-5 h-5 text-orange-600" />
                <h4 className="font-semibold text-gray-800">Additional Costs to Consider</h4>
              </div>
              <ul className="space-y-1 ml-6 list-disc">
                {enhancement.additionalCosts.map((cost, idx) => (
                  <li key={idx} className="text-sm text-gray-700">{cost}</li>
                ))}
              </ul>
            </div>

            {/* Additional Benefits */}
            <div className="bg-white rounded-lg p-4 border border-blue-200">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-5 h-5 text-blue-600" />
                <h4 className="font-semibold text-gray-800">Additional Benefits</h4>
              </div>
              <ul className="space-y-1 ml-6 list-disc">
                {enhancement.additionalBenefits.map((benefit, idx) => (
                  <li key={idx} className="text-sm text-gray-700">{benefit}</li>
                ))}
              </ul>
            </div>

            {/* Risk Factors */}
            <div className="bg-white rounded-lg p-4 border border-red-200">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="w-5 h-5 text-red-600" />
                <h4 className="font-semibold text-gray-800">Risk Factors</h4>
              </div>
              <ul className="space-y-1 ml-6 list-disc">
                {enhancement.riskFactors.map((risk, idx) => (
                  <li key={idx} className="text-sm text-gray-700">{risk}</li>
                ))}
              </ul>
            </div>

            {/* Recommendations */}
            <div className="bg-white rounded-lg p-4 border border-purple-200">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle className="w-5 h-5 text-purple-600" />
                <h4 className="font-semibold text-gray-800">Recommendations</h4>
              </div>
              <ul className="space-y-1 ml-6 list-disc">
                {enhancement.recommendations.map((rec, idx) => (
                  <li key={idx} className="text-sm text-gray-700">{rec}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Info Box */}
      {!llmEnabled && (
        <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-start gap-3">
            <Sparkles className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-semibold text-green-900 mb-1">AI ROI Enhancement Available</h4>
              <p className="text-sm text-green-800">
                Enable LLM features to get AI-powered insights on hidden costs, additional benefits, and risk factors.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ROIEnhancementExample;