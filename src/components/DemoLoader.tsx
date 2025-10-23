import { useState } from 'react';
import { loadDemoProject, hasDemoProject } from '../demo/loadDemo';

interface DemoLoaderProps {
  ownerId: string;
  onDemoLoaded?: (useCaseId: string) => void;
}

/**
 * Component to load the demo project
 * Shows a button that loads the invoice processing demo
 */
export function DemoLoader({ ownerId, onDemoLoaded }: DemoLoaderProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [alreadyExists, setAlreadyExists] = useState(false);

  const handleLoadDemo = async () => {
    setLoading(true);
    setError(null);
    setSuccess(false);
    setAlreadyExists(false);

    try {
      // Check if demo already exists
      const exists = await hasDemoProject(ownerId);
      
      if (exists) {
        setAlreadyExists(true);
        setLoading(false);
        return;
      }

      // Load the demo
      const useCase = await loadDemoProject(ownerId);
      setSuccess(true);
      
      // Notify parent component
      if (onDemoLoaded && useCase.id) {
        onDemoLoaded(useCase.id);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load demo');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="demo-loader p-6 border border-gray-200 rounded-lg bg-white shadow-sm">
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0">
          <svg
            className="w-12 h-12 text-blue-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
        </div>
        
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Try the Demo Project
          </h3>
          <p className="text-sm text-gray-600 mb-4">
            Load a comprehensive example: <strong>Invoice Processing Automation</strong>
            <br />
            Includes complete workflow with roles, steps, data assets, rules, and metrics.
          </p>
          
          <div className="mb-4">
            <h4 className="text-sm font-medium text-gray-700 mb-2">What's included:</h4>
            <ul className="text-xs text-gray-600 space-y-1 ml-4">
              <li>• 3 Roles (AP Clerk, Accountant, AI Agent)</li>
              <li>• 12 Process Steps with automation indicators</li>
              <li>• 4 Data Assets from SAP ERP</li>
              <li>• 4 Applications (SAP, DocuSign, SharePoint, Email)</li>
              <li>• 6 API Connectors</li>
              <li>• 7 Business Rules</li>
              <li>• 4 SLAs</li>
              <li>• Complete metrics showing $146K annual savings potential</li>
            </ul>
          </div>

          <button
            onClick={handleLoadDemo}
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors text-sm font-medium"
          >
            {loading ? 'Loading Demo...' : 'Load Demo Project'}
          </button>

          {success && (
            <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-sm text-green-800">
                ✓ Demo project loaded successfully! Check your projects list.
              </p>
            </div>
          )}

          {alreadyExists && (
            <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-sm text-yellow-800">
                ℹ Demo project already exists in your account. Check your projects list.
              </p>
            </div>
          )}

          {error && (
            <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-800">
                ✗ Error: {error}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
