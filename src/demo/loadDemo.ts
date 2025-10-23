import { api } from '../components/agentPrepApi';
import { invoiceProcessingDemo } from './invoiceProcessingDemo';

/**
 * Loads the demo project into the system for a given user
 * by creating it piece by piece using the standard API
 * @param ownerId - The user ID who will own the demo project
 * @returns The created use case with ID
 */
export async function loadDemoProject(ownerId: string) {
  try {
    console.log('Loading demo project: Invoice Processing Automation...');
    
    // Create the use case first
    const useCase = await api.createUseCase({
      ...invoiceProcessingDemo.useCase,
      owner_id: ownerId,
      ownerId: ownerId,
    });
    
    console.log('Use case created:', useCase.id);
    
    // Create roles
    const roleMap = new Map<string, string>(); // old id -> new id
    for (const role of invoiceProcessingDemo.process.roles) {
      const created = await api.createRole(useCase.id, {
        name: role.name,
        type: role.type,
        description: role.description,
      });
      roleMap.set(role.id, created.id);
    }
    console.log('Roles created:', roleMap.size);
    
    // Create steps (handle parent relationships)
    const stepMap = new Map<string, string>(); // old id -> new id
    const stepsToCreate = [...invoiceProcessingDemo.process.steps].sort((a, b) => a.level - b.level);
    
    for (const step of stepsToCreate) {
      const created = await api.createStep(useCase.id, {
        parent_id: step.parent_id ? stepMap.get(step.parent_id) || null : null,
        title: step.title,
        description: step.description,
        type: step.type,
        role: step.role,
        role_id: step.role_id ? roleMap.get(step.role_id) || null : null,
        level: step.level,
        order_index: step.order_index,
        metadata: step.metadata,
      });
      stepMap.set(step.id, created.id);
    }
    console.log('Steps created:', stepMap.size);
    
    // Create data assets
    for (const asset of invoiceProcessingDemo.dataAssets) {
      await api.createDataAsset(useCase.id, {
        name: asset.name,
        system: asset.system,
        object_type: asset.object_type,
        has_pii: asset.has_pii,
        quality_score: asset.quality_score,
        fields: asset.fields,
        metadata: asset.metadata,
      });
    }
    console.log('Data assets created:', invoiceProcessingDemo.dataAssets.length);
    
    // Create applications
    const appMap = new Map<string, string>();
    for (const app of invoiceProcessingDemo.applications) {
      const created = await api.createApplication(useCase.id, {
        name: app.name,
        type: app.type,
        vendor: app.vendor,
        auth_type: app.auth_type,
        config: app.config,
      });
      appMap.set(app.id, created.id);
    }
    console.log('Applications created:', appMap.size);
    
    // Create connectors
    for (const connector of invoiceProcessingDemo.connectors) {
      await api.createConnector(useCase.id, {
        application_id: appMap.get(connector.application_id) || null,
        name: connector.name,
        connector_type: connector.connector_type,
        endpoint: connector.endpoint,
        timeout_ms: connector.timeout_ms,
        config: connector.config,
      });
    }
    console.log('Connectors created:', invoiceProcessingDemo.connectors.length);
    
    // Create rules
    for (const rule of invoiceProcessingDemo.rules) {
      await api.createRule(useCase.id, {
        name: rule.name,
        description: rule.description,
        category: rule.category,
        expression: rule.expression,
      });
    }
    console.log('Rules created:', invoiceProcessingDemo.rules.length);
    
    // Create SLAs
    for (const sla of invoiceProcessingDemo.slas) {
      await api.createSLA(useCase.id, {
        metric: sla.metric,
        threshold: sla.threshold,
        unit: sla.unit,
        window: sla.window,
      });
    }
    console.log('SLAs created:', invoiceProcessingDemo.slas.length);
    
    // Update metrics
    if (invoiceProcessingDemo.metrics) {
      await api.updateMetrics(useCase.id, invoiceProcessingDemo.metrics);
      console.log('Metrics updated');
    }
    
    console.log('Demo project loaded successfully!');
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
