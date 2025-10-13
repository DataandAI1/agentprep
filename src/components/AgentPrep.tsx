import React from 'react';

/**
 * AgentPrep - Use Case Collector Component
 * 
 * TODO: Copy the full AgentPrep component from the provided document
 * "AgentPrep: Use Case Collector.tsx"
 * 
 * The component should be copied in its entirety and placed here.
 * It includes all the functionality for:
 * - Use case management
 * - Process step mapping
 * - Data asset cataloging
 * - Application management
 * - Business rules and SLAs
 * - Metrics and ROI calculation
 * - Readiness assessment
 * - Export functionality
 * 
 * For now, this is a placeholder that shows setup instructions.
 */

export default function AgentPrep() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center p-8">
      <div className="max-w-4xl w-full bg-white rounded-2xl shadow-2xl p-12">
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 mb-4">
            AgentPrep
          </h1>
          <p className="text-xl text-gray-600">Use Case Collector for Agentic AI</p>
        </div>

        <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-6 mb-8">
          <h2 className="text-2xl font-bold text-blue-900 mb-4">📋 Setup Required</h2>
          <p className="text-blue-800 mb-4">
            The full AgentPrep component needs to be added to complete this application.
          </p>
        </div>

        <div className="space-y-6">
          <div className="border-l-4 border-indigo-500 pl-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Step 1: Get the Component</h3>
            <p className="text-gray-700">
              Copy the full component code from <code className="bg-gray-100 px-2 py-1 rounded">AgentPrep: Use Case Collector.tsx</code>
            </p>
          </div>

          <div className="border-l-4 border-purple-500 pl-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Step 2: Replace This File</h3>
            <p className="text-gray-700 mb-2">
              Replace the contents of <code className="bg-gray-100 px-2 py-1 rounded">src/components/AgentPrep.tsx</code>
            </p>
            <p className="text-sm text-gray-600">
              The component is approximately 3000+ lines and includes all UI and logic.
            </p>
          </div>

          <div className="border-l-4 border-green-500 pl-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Step 3: Optional Firebase Integration</h3>
            <p className="text-gray-700 mb-2">
              The component works standalone with localStorage, or can be integrated with Firebase:
            </p>
            <ul className="list-disc list-inside text-sm text-gray-600 space-y-1 ml-4">
              <li>Import Firebase hooks from <code>../firebase/hooks</code></li>
              <li>Import Firebase services from <code>../firebase/services</code></li>
              <li>Connect save/load operations to Firestore</li>
            </ul>
          </div>

          <div className="border-l-4 border-orange-500 pl-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Step 4: Test</h3>
            <p className="text-gray-700">
              Run <code className="bg-gray-100 px-2 py-1 rounded">npm run dev</code> to start the development server
            </p>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">📚 Documentation</h3>
          <div className="grid grid-cols-2 gap-4">
            <a
              href="https://github.com/DataandAI1/agentprep/blob/main/README.md"
              target="_blank"
              rel="noopener noreferrer"
              className="block p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition"
            >
              <div className="font-semibold text-indigo-600">README.md</div>
              <div className="text-sm text-gray-600">Project overview</div>
            </a>
            <a
              href="https://github.com/DataandAI1/agentprep/blob/main/SETUP_INSTRUCTIONS.md"
              target="_blank"
              rel="noopener noreferrer"
              className="block p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition"
            >
              <div className="font-semibold text-purple-600">SETUP_INSTRUCTIONS.md</div>
              <div className="text-sm text-gray-600">Detailed setup guide</div>
            </a>
            <a
              href="https://github.com/DataandAI1/agentprep/blob/main/DEPLOYMENT.md"
              target="_blank"
              rel="noopener noreferrer"
              className="block p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition"
            >
              <div className="font-semibold text-green-600">DEPLOYMENT.md</div>
              <div className="text-sm text-gray-600">Deployment guide</div>
            </a>
            <a
              href="https://firebase.google.com/docs"
              target="_blank"
              rel="noopener noreferrer"
              className="block p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition"
            >
              <div className="font-semibold text-orange-600">Firebase Docs</div>
              <div className="text-sm text-gray-600">Firebase documentation</div>
            </a>
          </div>
        </div>

        <div className="mt-8 text-center">
          <a
            href="https://github.com/DataandAI1/agentprep"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-lg hover:from-indigo-700 hover:to-purple-700 transition shadow-lg"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
            </svg>
            View on GitHub
          </a>
        </div>
      </div>
    </div>
  );
}
