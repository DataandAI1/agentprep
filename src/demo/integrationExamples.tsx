/**
 * Demo Integration Examples
 * 
 * This file shows different ways to integrate the demo project into your AgentPrep application.
 */

// Example 1: Basic Integration in a Dashboard or Welcome Screen
// ================================================================
import { DemoLoader } from '../components/DemoLoader';
import { useAuth } from '../firebase/AuthContext'; // Adjust import based on your auth setup

export function WelcomeScreen() {
  const { user } = useAuth();
  
  const handleDemoLoaded = (useCaseId: string) => {
    // Navigate to the newly created demo project
    console.log('Demo loaded with ID:', useCaseId);
    // navigate(`/projects/${useCaseId}`);
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Welcome to AgentPrep!</h1>
      
      <div className="grid gap-6">
        {/* Other welcome content */}
        
        {user && (
          <DemoLoader 
            ownerId={user.uid} 
            onDemoLoaded={handleDemoLoaded}
          />
        )}
      </div>
    </div>
  );
}


// Example 2: Programmatic Loading (e.g., in onboarding flow)
// ================================================================
import { loadDemoProject, ensureDemoProject } from '../demo/loadDemo';

async function completeOnboarding(userId: string) {
  try {
    // Automatically load demo as part of onboarding
    const demoUseCase = await loadDemoProject(userId);
    console.log('Demo project created:', demoUseCase.id);
    
    // Continue with onboarding...
  } catch (error) {
    console.error('Failed to load demo:', error);
  }
}

// Or ensure demo exists without creating duplicates
async function ensureUserHasDemo(userId: string) {
  const demoUseCase = await ensureDemoProject(userId);
  return demoUseCase;
}


// Example 3: Adding to Empty State
// ================================================================
export function EmptyProjectsState({ ownerId }: { ownerId: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <div className="text-center mb-8">
        <h2 className="text-xl font-semibold text-gray-700 mb-2">
          No Projects Yet
        </h2>
        <p className="text-gray-500">
          Get started by creating a new project or trying our demo
        </p>
      </div>
      
      <div className="w-full max-w-2xl">
        <DemoLoader ownerId={ownerId} />
      </div>
      
      <button className="mt-6 px-6 py-3 bg-blue-600 text-white rounded-lg">
        Create New Project
      </button>
    </div>
  );
}


// Example 4: Adding to Settings/Help Section
// ================================================================
export function HelpSection({ userId }: { userId: string }) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold mb-4">Getting Started</h2>
        <p className="text-gray-600 mb-4">
          New to AgentPrep? Try our comprehensive demo project to see all features in action.
        </p>
      </div>
      
      <DemoLoader ownerId={userId} />
      
      <div className="border-t pt-6">
        <h3 className="font-semibold mb-2">Other Resources</h3>
        <ul className="space-y-2 text-sm text-gray-600">
          <li>• Documentation</li>
          <li>• Video Tutorials</li>
          <li>• Best Practices</li>
        </ul>
      </div>
    </div>
  );
}


// Example 5: Direct API Usage (without UI component)
// ================================================================
import { api } from '../components/agentPrepApi';
import { invoiceProcessingDemo } from '../demo/invoiceProcessingDemo';

async function importDemoDirectly(userId: string) {
  // Import the demo data directly
  const useCase = await api.importUseCase(invoiceProcessingDemo, userId);
  
  // The imported project includes:
  console.log('Use Case:', useCase);
  
  // You can then fetch related data:
  const roles = await api.listRoles(useCase.id);
  const steps = await api.listSteps(useCase.id);
  const dataAssets = await api.listDataAssets(useCase.id);
  const applications = await api.listApplications(useCase.id);
  const connectors = await api.listConnectors(useCase.id);
  const rules = await api.listRules(useCase.id);
  const slas = await api.listSLAs(useCase.id);
  const metrics = await api.getMetrics(useCase.id);
  const roi = await api.getROI(useCase.id);
  const readiness = await api.getReadiness(useCase.id);
  
  return {
    useCase,
    roles,
    steps,
    dataAssets,
    applications,
    connectors,
    rules,
    slas,
    metrics,
    roi,
    readiness,
  };
}


// Example 6: Customizing Demo Data Before Loading
// ================================================================
import { invoiceProcessingDemo } from '../demo/invoiceProcessingDemo';

async function loadCustomizedDemo(userId: string) {
  // Clone and modify the demo data
  const customDemo = {
    ...invoiceProcessingDemo,
    useCase: {
      ...invoiceProcessingDemo.useCase,
      name: 'Invoice Processing - Custom',
      sponsor: 'Jane Smith, CFO', // Customize sponsor
      tags: [...invoiceProcessingDemo.useCase.tags, 'custom'], // Add custom tag
    },
    metrics: {
      ...invoiceProcessingDemo.metrics,
      baseline_volume: 1000, // Adjust volume
      fte_cost_per_hour: 40, // Adjust cost
    },
  };
  
  // Import the customized version
  const useCase = await api.importUseCase(customDemo, userId);
  return useCase;
}


// Example 7: Batch Demo Loading for Multiple Users (Admin function)
// ================================================================
async function loadDemoForMultipleUsers(userIds: string[]) {
  const results = await Promise.allSettled(
    userIds.map(userId => loadDemoProject(userId))
  );
  
  const succeeded = results.filter(r => r.status === 'fulfilled').length;
  const failed = results.filter(r => r.status === 'rejected').length;
  
  console.log(`Demo loading complete: ${succeeded} succeeded, ${failed} failed`);
  return results;
}


// Example 8: Creating Multiple Demo Projects
// ================================================================
// If you create more demo projects in the future, you can manage them like this:

import { invoiceProcessingDemo } from '../demo/invoiceProcessingDemo';
// import { customerOnboardingDemo } from '../demo/customerOnboardingDemo'; // Future demo
// import { helpDeskAutomationDemo } from '../demo/helpDeskAutomationDemo'; // Future demo

const availableDemos = [
  {
    id: 'invoice-processing',
    name: 'Invoice Processing Automation',
    data: invoiceProcessingDemo,
  },
  // { id: 'customer-onboarding', name: 'Customer Onboarding', data: customerOnboardingDemo },
  // { id: 'helpdesk', name: 'Help Desk Automation', data: helpDeskAutomationDemo },
];

export function DemoSelector({ ownerId }: { ownerId: string }) {
  const handleLoadDemo = async (demoData: any) => {
    await api.importUseCase(demoData, ownerId);
  };
  
  return (
    <div className="grid gap-4">
      {availableDemos.map(demo => (
        <div key={demo.id} className="border rounded-lg p-4">
          <h3 className="font-semibold">{demo.name}</h3>
          <button
            onClick={() => handleLoadDemo(demo.data)}
            className="mt-2 px-4 py-2 bg-blue-600 text-white rounded"
          >
            Load Demo
          </button>
        </div>
      ))}
    </div>
  );
}


// Example 9: Analytics/Tracking Demo Usage
// ================================================================
async function loadDemoWithAnalytics(userId: string) {
  try {
    // Track demo load start
    // analytics.track('demo_load_started', { userId });
    
    const useCase = await loadDemoProject(userId);
    
    // Track demo load success
    // analytics.track('demo_load_completed', { 
    //   userId, 
    //   useCaseId: useCase.id,
    //   demoType: 'invoice-processing'
    // });
    
    return useCase;
  } catch (error) {
    // Track demo load failure
    // analytics.track('demo_load_failed', { userId, error: error.message });
    throw error;
  }
}


// Example 10: Export Demo Data for Documentation
// ================================================================
import { invoiceProcessingDemo } from '../demo/invoiceProcessingDemo';

// Export as JSON for documentation or sharing
export function exportDemoAsJSON() {
  const jsonString = JSON.stringify(invoiceProcessingDemo, null, 2);
  
  // Create downloadable file
  const blob = new Blob([jsonString], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.href = url;
  link.download = 'invoice-processing-demo.json';
  link.click();
  
  URL.revokeObjectURL(url);
}
