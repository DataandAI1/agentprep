/**
 * AgentPrep Demo Module
 * 
 * Export all demo-related functionality for easy importing
 */

export { invoiceProcessingDemo } from './invoiceProcessingDemo';
export { 
  loadDemoProject, 
  hasDemoProject, 
  ensureDemoProject 
} from './loadDemo';

// Note: DemoLoader component is in src/components/DemoLoader.tsx
// Import it separately: import { DemoLoader } from '../components/DemoLoader';
