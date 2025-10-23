import { api } from '../components/agentPrepApi';
import { invoiceProcessingDemo } from './invoiceProcessingDemo';

/**
 * Loads the demo project into the system for a given user
 * @param ownerId - The user ID who will own the demo project
 * @returns The created use case with ID
 */
export async function loadDemoProject(ownerId: string) {
  try {
    console.log('Loading demo project: Invoice Processing Automation...');
    
    const useCase = await api.importUseCase(invoiceProcessingDemo, ownerId);
    
    console.log('Demo project loaded successfully!', useCase);
    console.log('Use Case ID:', useCase.id);
    
    return useCase;
  } catch (error) {
    console.error('Failed to load demo project:', error);
    throw error;
  }
}

/**
 * Check if user already has the demo project
 * @param ownerId - The user ID to check
 * @returns true if demo exists, false otherwise
 */
export async function hasDemoProject(ownerId: string): Promise<boolean> {
  try {
    const useCases = await api.listUseCases(ownerId);
    return useCases.some(
      (uc: any) => uc.name === 'Invoice Processing Automation'
    );
  } catch (error) {
    console.error('Failed to check for demo project:', error);
    return false;
  }
}

/**
 * Helper function to load demo if it doesn't exist
 * @param ownerId - The user ID
 * @returns The use case (existing or newly created)
 */
export async function ensureDemoProject(ownerId: string) {
  const hasDemo = await hasDemoProject(ownerId);
  
  if (hasDemo) {
    console.log('Demo project already exists');
    const useCases = await api.listUseCases(ownerId);
    return useCases.find(
      (uc: any) => uc.name === 'Invoice Processing Automation'
    );
  }
  
  return await loadDemoProject(ownerId);
}
