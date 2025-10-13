const API_BASE = '/api/use-cases';

export const api = {
  // Use Cases
  createUseCase: async (data: any) => {
    const res = await fetch(`${API_BASE}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to create use case');
    return res.json();
  },

  getUseCase: async (id: string) => {
    const res = await fetch(`${API_BASE}/${id}`);
    if (!res.ok) throw new Error('Failed to fetch use case');
    return res.json();
  },

  updateUseCase: async (id: string, data: any) => {
    const res = await fetch(`${API_BASE}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to update use case');
    return res.json();
  },

  listUseCases: async (ownerId: string) => {
    const res = await fetch(`${API_BASE}?owner_id=${ownerId}`);
    if (!res.ok) throw new Error('Failed to list use cases');
    return res.json();
  },

  deleteUseCase: async (id: string) => {
    const res = await fetch(`${API_BASE}/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error('Failed to delete use case');
  },

  // Roles
  listRoles: async (useCaseId: string) => {
    const res = await fetch(`${API_BASE}/${useCaseId}/roles`);
    if (!res.ok) throw new Error('Failed to fetch roles');
    return res.json();
  },

  createRole: async (useCaseId: string, data: any) => {
    const res = await fetch(`${API_BASE}/${useCaseId}/roles`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to create role');
    return res.json();
  },

  deleteRole: async (useCaseId: string, roleId: string) => {
    const res = await fetch(`${API_BASE}/${useCaseId}/roles`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ roleId }),
    });
    if (!res.ok) throw new Error('Failed to delete role');
  },

  // Process Steps
  listSteps: async (useCaseId: string) => {
    const res = await fetch(`${API_BASE}/${useCaseId}/steps`);
    if (!res.ok) throw new Error('Failed to fetch steps');
    return res.json();
  },

  createStep: async (useCaseId: string, data: any) => {
    const res = await fetch(`${API_BASE}/${useCaseId}/steps`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to create step');
    return res.json();
  },

  deleteStep: async (useCaseId: string, stepId: string) => {
    const res = await fetch(`${API_BASE}/${useCaseId}/steps`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ stepId }),
    });
    if (!res.ok) throw new Error('Failed to delete step');
  },

  // Data Assets
  listDataAssets: async (useCaseId: string) => {
    const res = await fetch(`${API_BASE}/${useCaseId}/data-assets`);
    if (!res.ok) throw new Error('Failed to fetch data assets');
    return res.json();
  },

  createDataAsset: async (useCaseId: string, data: any) => {
    const res = await fetch(`${API_BASE}/${useCaseId}/data-assets`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to create data asset');
    return res.json();
  },

  deleteDataAsset: async (useCaseId: string, assetId: string) => {
    const res = await fetch(`${API_BASE}/${useCaseId}/data-assets`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ assetId }),
    });
    if (!res.ok) throw new Error('Failed to delete data asset');
  },

  // Applications
  listApplications: async (useCaseId: string) => {
    const res = await fetch(`${API_BASE}/${useCaseId}/applications`);
    if (!res.ok) throw new Error('Failed to fetch applications');
    return res.json();
  },

  createApplication: async (useCaseId: string, data: any) => {
    const res = await fetch(`${API_BASE}/${useCaseId}/applications`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to create application');
    return res.json();
  },

  deleteApplication: async (useCaseId: string, applicationId: string) => {
    const res = await fetch(`${API_BASE}/${useCaseId}/applications`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ applicationId }),
    });
    if (!res.ok) throw new Error('Failed to delete application');
  },

  // Rules
  listRules: async (useCaseId: string) => {
    const res = await fetch(`${API_BASE}/${useCaseId}/rules`);
    if (!res.ok) throw new Error('Failed to fetch rules');
    return res.json();
  },

  createRule: async (useCaseId: string, data: any) => {
    const res = await fetch(`${API_BASE}/${useCaseId}/rules`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to create rule');
    return res.json();
  },

  deleteRule: async (useCaseId: string, ruleId: string) => {
    const res = await fetch(`${API_BASE}/${useCaseId}/rules`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ruleId }),
    });
    if (!res.ok) throw new Error('Failed to delete rule');
  },

  // SLAs
  listSLAs: async (useCaseId: string) => {
    const res = await fetch(`${API_BASE}/${useCaseId}/slas`);
    if (!res.ok) throw new Error('Failed to fetch SLAs');
    return res.json();
  },

  createSLA: async (useCaseId: string, data: any) => {
    const res = await fetch(`${API_BASE}/${useCaseId}/slas`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to create SLA');
    return res.json();
  },

  deleteSLA: async (useCaseId: string, slaId: string) => {
    const res = await fetch(`${API_BASE}/${useCaseId}/slas`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ slaId }),
    });
    if (!res.ok) throw new Error('Failed to delete SLA');
  },

  // Metrics
  getMetrics: async (useCaseId: string) => {
    const res = await fetch(`${API_BASE}/${useCaseId}/metrics`);
    if (!res.ok) return null;
    return res.json();
  },

  updateMetrics: async (useCaseId: string, data: any) => {
    const res = await fetch(`${API_BASE}/${useCaseId}/metrics`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to update metrics');
    return res.json();
  },

  getROI: async (useCaseId: string) => {
    const res = await fetch(`${API_BASE}/${useCaseId}/roi`);
    if (!res.ok) return null;
    return res.json();
  },

  getReadiness: async (useCaseId: string) => {
    const res = await fetch(`${API_BASE}/${useCaseId}/readiness`);
    if (!res.ok) return null;
    return res.json();
  },

  exportUseCase: async (useCaseId: string) => {
    const res = await fetch(`${API_BASE}/${useCaseId}/export`);
    if (!res.ok) throw new Error('Failed to export use case');
    return res.json();
  },

  importUseCase: async (pack: any, ownerId: string) => {
    const res = await fetch(`${API_BASE}/import`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ pack, owner_id: ownerId }),
    });
    if (!res.ok) throw new Error('Failed to import use case');
    return res.json();
  },
};

export type AgentPrepApi = typeof api;

export { API_BASE };
