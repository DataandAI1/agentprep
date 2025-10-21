const API_BASE = import.meta.env.VITE_API_BASE ?? '/api/use-cases';

const LOCAL_STORAGE_KEY = 'agentprep-local-api';

const isBrowser = typeof window !== 'undefined' && !!window.localStorage;

type LocalUseCaseRecord = {
  useCase: any;
  roles: any[];
  steps: any[];
  dataAssets: any[];
  applications: any[];
  connectors: any[];
  rules: any[];
  slas: any[];
  metrics: any | null;
};

type LocalStore = Record<string, LocalUseCaseRecord>;

let inMemoryStore: LocalStore = {};

function clone<T>(value: T): T {
  return value ? JSON.parse(JSON.stringify(value)) : value;
}

function touch(record: LocalUseCaseRecord) {
  if (record.useCase) {
    record.useCase.updated_at = new Date().toISOString();
  }
}

function readStore(): LocalStore {
  if (isBrowser) {
    try {
      const stored = window.localStorage.getItem(LOCAL_STORAGE_KEY);
      if (!stored) {
        return {};
      }
      const parsed = JSON.parse(stored);
      if (parsed && typeof parsed === 'object') {
        return parsed as LocalStore;
      }
    } catch (error) {
      console.warn('Failed to parse AgentPrep local store, resetting', error);
    }
    return {};
  }

  return inMemoryStore;
}

function writeStore(store: LocalStore) {
  if (isBrowser) {
    window.localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(store));
  } else {
    inMemoryStore = store;
  }
}

function generateId() {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID();
  }
  return Math.random().toString(36).slice(2, 10);
}

function ensureRecord(store: LocalStore, useCaseId: string): LocalUseCaseRecord {
  const record = store[useCaseId];
  if (!record) {
    throw new Error(`Use case ${useCaseId} not found in local store`);
  }
  return record;
}

function ensureRecordExists(store: LocalStore, useCaseId: string) {
  if (!store[useCaseId]) {
    store[useCaseId] = {
      useCase: null,
      roles: [],
      steps: [],
      dataAssets: [],
      applications: [],
      connectors: [],
      rules: [],
      slas: [],
      metrics: null,
    };
  }
  return store[useCaseId];
}

function completionRatio(record: LocalUseCaseRecord) {
  if (!record.useCase) return 0;

  let completeSections = 0;
  if (record.useCase.name && record.useCase.objective && record.useCase.scope) completeSections += 1;
  if (record.roles.length > 0) completeSections += 1;
  if (record.steps.length >= 3) completeSections += 1;
  if (record.dataAssets.length > 0) completeSections += 1;
  if (record.applications.length > 0) completeSections += 1;
  if (record.rules.length + record.slas.length > 0) completeSections += 1;
  if (record.metrics && record.metrics.baseline_volume > 0) completeSections += 1;

  return completeSections / 7;
}

function calculateRoi(record: LocalUseCaseRecord) {
  const metrics = record.metrics;
  if (!metrics) return null;

  const baselineVolume = Number(metrics.baseline_volume ?? 0);
  const avgMinutes = Number(metrics.avg_handling_time_minutes ?? 0);
  const fteCost = Number(metrics.fte_cost_per_hour ?? 0);
  const errorRate = Math.min(1, Math.max(0, Number(metrics.error_rate ?? 0)));
  const breachCost = Number(metrics.breach_cost_usd ?? 0);

  if (baselineVolume <= 0 || avgMinutes <= 0 || fteCost <= 0) {
    return null;
  }

  const workingDays = 260;
  const annualHours = (baselineVolume * avgMinutes * workingDays) / 60;
  let currentAnnualCost = annualHours * fteCost;
  currentAnnualCost += currentAnnualCost * errorRate;
  currentAnnualCost += breachCost;

  const efficiencyGain = 0.6 + completionRatio(record) * 0.2;
  const futureAnnualCost = currentAnnualCost * (1 - efficiencyGain);
  const annualSavings = Math.max(0, currentAnnualCost - futureAnnualCost);
  const implementationCost = Math.max(5000, currentAnnualCost * 0.2);
  const paybackMonths = annualSavings > 0 ? Math.min(60, (implementationCost / annualSavings) * 12) : 60;
  const threeYearValue = Math.max(0, annualSavings * 3 - implementationCost);
  const confidenceScore = Math.min(1, Math.max(0.2, completionRatio(record)));

  return {
    use_case_id: record.useCase?.id,
    current_annual_cost_usd: currentAnnualCost,
    future_annual_cost_usd: futureAnnualCost,
    annual_savings_usd: annualSavings,
    payback_months: paybackMonths,
    three_year_value_usd: threeYearValue,
    confidence_score: confidenceScore,
    calculated_at: new Date().toISOString(),
  };
}

function calculateReadiness(record: LocalUseCaseRecord) {
  if (!record.useCase) return null;

  const completion = completionRatio(record);
  const richnessFactor = Math.min(1, (record.roles.length + record.steps.length) / 10);

  const readiness = {
    use_case_id: record.useCase.id,
    overall_score: Number((completion * 5).toFixed(1)),
    automation_fit_score: Math.round(40 + completion * 60),
    api_maturity: Number((2 + Math.min(3, record.connectors.length * 0.7)).toFixed(1)),
    data_quality: Number((record.dataAssets.length > 0 ? 3.5 + richnessFactor : 2).toFixed(1)),
    rule_clarity: Number((record.rules.length > 0 ? 3.5 + Math.min(1.5, record.rules.length * 0.3) : 2).toFixed(1)),
    exception_rate: Number((Math.max(1, 5 - (record.rules.length + record.slas.length) * 0.4)).toFixed(1)),
    volume_stability: Number((record.metrics && record.metrics.baseline_volume > 0 ? 3.5 + Math.min(1.5, completion * 2) : 2).toFixed(1)),
    security_posture: Number((record.applications.length > 0 ? 3.5 + Math.min(1.5, record.connectors.length * 0.5) : 2.5).toFixed(1)),
    calculated_at: new Date().toISOString(),
  };

  readiness.overall_score = Math.min(5, Math.max(0, readiness.overall_score));
  readiness.api_maturity = Math.min(5, readiness.api_maturity);
  readiness.data_quality = Math.min(5, readiness.data_quality);
  readiness.rule_clarity = Math.min(5, readiness.rule_clarity);
  readiness.exception_rate = Math.min(5, readiness.exception_rate);
  readiness.volume_stability = Math.min(5, readiness.volume_stability);
  readiness.security_posture = Math.min(5, readiness.security_posture);

  return readiness;
}

function removeStepAndDescendants(record: LocalUseCaseRecord, stepId: string) {
  const toRemove = new Set<string>();

  const collect = (id: string) => {
    toRemove.add(id);
    record.steps
      .filter((step) => step.parent_id === id)
      .forEach((child) => collect(child.id));
  };

  collect(stepId);
  record.steps = record.steps.filter((step) => !toRemove.has(step.id));
}

const localApi = {
  async createUseCase(data: any) {
    const store = readStore();
    const id = data.id ?? generateId();
    const now = new Date().toISOString();

    const record = ensureRecordExists(store, id);
    const createdAt = record.useCase?.created_at ?? now;

    record.useCase = {
      id,
      name: data.name ?? 'Untitled Project',
      objective: data.objective ?? '',
      scope: data.scope ?? '',
      sponsor: data.sponsor ?? '',
      priority: data.priority ?? 'medium',
      status: data.status ?? 'draft',
      tags: Array.isArray(data.tags) ? data.tags : [],
      owner_id: data.owner_id ?? '',
      created_at: createdAt,
      updated_at: now,
    };

    writeStore(store);
    return clone(record.useCase);
  },

  async getUseCase(id: string) {
    const store = readStore();
    const record = ensureRecord(store, id);
    return clone(record.useCase);
  },

  async updateUseCase(id: string, data: any) {
    const store = readStore();
    const record = ensureRecord(store, id);
    record.useCase = {
      ...record.useCase,
      ...data,
      updated_at: new Date().toISOString(),
    };
    writeStore(store);
    return clone(record.useCase);
  },

  async listUseCases(ownerId: string) {
    const store = readStore();
    const useCases = Object.values(store)
      .map((record) => record.useCase)
      .filter((useCase) => useCase?.owner_id === ownerId)
      .sort((a, b) => {
        const aTime = new Date(a?.updated_at ?? a?.created_at ?? '').getTime();
        const bTime = new Date(b?.updated_at ?? b?.created_at ?? '').getTime();
        return bTime - aTime;
      });

    return clone(useCases);
  },

  async deleteUseCase(id: string) {
    const store = readStore();
    if (store[id]) {
      delete store[id];
      writeStore(store);
    }
  },

  async listRoles(useCaseId: string) {
    const store = readStore();
    const record = ensureRecord(store, useCaseId);
    return clone(record.roles);
  },

  async createRole(useCaseId: string, data: any) {
    const store = readStore();
    const record = ensureRecord(store, useCaseId);
    const role = {
      id: generateId(),
      use_case_id: useCaseId,
      name: data.name ?? 'New Role',
      type: data.type ?? 'human',
      description: data.description ?? '',
      created_at: new Date().toISOString(),
    };
    record.roles = [...record.roles, role];
    touch(record);
    writeStore(store);
    return clone(role);
  },

  async deleteRole(useCaseId: string, roleId: string) {
    const store = readStore();
    const record = ensureRecord(store, useCaseId);
    record.roles = record.roles.filter((role) => role.id !== roleId);
    touch(record);
    writeStore(store);
  },

  async listSteps(useCaseId: string) {
    const store = readStore();
    const record = ensureRecord(store, useCaseId);
    return clone(record.steps);
  },

  async createStep(useCaseId: string, data: any) {
    const store = readStore();
    const record = ensureRecord(store, useCaseId);
    const step = {
      id: generateId(),
      use_case_id: useCaseId,
      parent_id: data.parent_id ?? null,
      title: data.title ?? 'New Step',
      description: data.description ?? '',
      type: data.type ?? 'task',
      role: data.role ?? '',
      role_id: data.role_id ?? null,
      level: data.level ?? 0,
      order_index: data.order_index ?? record.steps.length,
      created_at: new Date().toISOString(),
      metadata: data.metadata ?? {},
    };
    record.steps = [...record.steps, step];
    touch(record);
    writeStore(store);
    return clone(step);
  },

  async deleteStep(useCaseId: string, stepId: string) {
    const store = readStore();
    const record = ensureRecord(store, useCaseId);
    removeStepAndDescendants(record, stepId);
    touch(record);
    writeStore(store);
  },

  async listDataAssets(useCaseId: string) {
    const store = readStore();
    const record = ensureRecord(store, useCaseId);
    return clone(record.dataAssets);
  },

  async createDataAsset(useCaseId: string, data: any) {
    const store = readStore();
    const record = ensureRecord(store, useCaseId);
    const asset = {
      id: generateId(),
      use_case_id: useCaseId,
      name: data.name ?? 'New Data Asset',
      system: data.system ?? '',
      object_type: data.object_type ?? data.objectType ?? 'table',
      has_pii: data.has_pii ?? data.hasPII ?? false,
      quality_score: data.quality_score ?? data.qualityScore ?? 3,
      fields: data.fields ?? [],
      created_at: new Date().toISOString(),
      metadata: data.metadata ?? {},
    };
    record.dataAssets = [...record.dataAssets, asset];
    touch(record);
    writeStore(store);
    return clone(asset);
  },

  async deleteDataAsset(useCaseId: string, assetId: string) {
    const store = readStore();
    const record = ensureRecord(store, useCaseId);
    record.dataAssets = record.dataAssets.filter((asset) => asset.id !== assetId);
    touch(record);
    writeStore(store);
  },

  async listApplications(useCaseId: string) {
    const store = readStore();
    const record = ensureRecord(store, useCaseId);
    return clone(record.applications);
  },

  async createApplication(useCaseId: string, data: any) {
    const store = readStore();
    const record = ensureRecord(store, useCaseId);
    const application = {
      id: generateId(),
      use_case_id: useCaseId,
      name: data.name ?? 'New Application',
      type: data.type ?? 'saas',
      vendor: data.vendor ?? '',
      auth_type: data.auth_type ?? data.authType ?? 'none',
      connectors: data.connectors ?? [],
      created_at: new Date().toISOString(),
      config: data.config ?? {},
    };
    record.applications = [...record.applications, application];
    touch(record);
    writeStore(store);
    return clone(application);
  },

  async deleteApplication(useCaseId: string, applicationId: string) {
    const store = readStore();
    const record = ensureRecord(store, useCaseId);
    record.applications = record.applications.filter((app) => app.id !== applicationId);
    record.connectors = record.connectors.filter((connector) => connector.application_id !== applicationId);
    touch(record);
    writeStore(store);
  },

  async listConnectors(useCaseId: string) {
    const store = readStore();
    const record = ensureRecord(store, useCaseId);
    return clone(record.connectors);
  },

  async createConnector(useCaseId: string, data: any) {
    const store = readStore();
    const record = ensureRecord(store, useCaseId);
    const connector = {
      id: generateId(),
      use_case_id: useCaseId,
      application_id: data.application_id ?? data.applicationId ?? null,
      name: data.name ?? 'New Connector',
      connector_type: data.connector_type ?? data.connectorType ?? 'HTTP',
      endpoint: data.endpoint ?? '',
      timeout_ms: data.timeout_ms ?? data.timeoutMs ?? 30000,
      created_at: new Date().toISOString(),
      config: data.config ?? {},
    };
    record.connectors = [...record.connectors, connector];
    touch(record);
    writeStore(store);
    return clone(connector);
  },

  async deleteConnector(useCaseId: string, connectorId: string) {
    const store = readStore();
    const record = ensureRecord(store, useCaseId);
    record.connectors = record.connectors.filter((connector) => connector.id !== connectorId);
    touch(record);
    writeStore(store);
  },

  async listRules(useCaseId: string) {
    const store = readStore();
    const record = ensureRecord(store, useCaseId);
    return clone(record.rules);
  },

  async createRule(useCaseId: string, data: any) {
    const store = readStore();
    const record = ensureRecord(store, useCaseId);
    const rule = {
      id: generateId(),
      use_case_id: useCaseId,
      name: data.name ?? 'New Rule',
      description: data.description ?? '',
      category: data.category ?? 'validation',
      expression: data.expression ?? '',
      created_at: new Date().toISOString(),
    };
    record.rules = [...record.rules, rule];
    touch(record);
    writeStore(store);
    return clone(rule);
  },

  async deleteRule(useCaseId: string, ruleId: string) {
    const store = readStore();
    const record = ensureRecord(store, useCaseId);
    record.rules = record.rules.filter((rule) => rule.id !== ruleId);
    touch(record);
    writeStore(store);
  },

  async listSLAs(useCaseId: string) {
    const store = readStore();
    const record = ensureRecord(store, useCaseId);
    return clone(record.slas);
  },

  async createSLA(useCaseId: string, data: any) {
    const store = readStore();
    const record = ensureRecord(store, useCaseId);
    const sla = {
      id: generateId(),
      use_case_id: useCaseId,
      metric: data.metric ?? 'Response Time',
      threshold: data.threshold ?? '',
      unit: data.unit ?? 'minutes',
      window: data.window ?? '',
      created_at: new Date().toISOString(),
    };
    record.slas = [...record.slas, sla];
    touch(record);
    writeStore(store);
    return clone(sla);
  },

  async deleteSLA(useCaseId: string, slaId: string) {
    const store = readStore();
    const record = ensureRecord(store, useCaseId);
    record.slas = record.slas.filter((sla) => sla.id !== slaId);
    touch(record);
    writeStore(store);
  },

  async getMetrics(useCaseId: string) {
    const store = readStore();
    const record = ensureRecord(store, useCaseId);
    return record.metrics ? clone(record.metrics) : null;
  },

  async updateMetrics(useCaseId: string, data: any) {
    const store = readStore();
    const record = ensureRecord(store, useCaseId);
    record.metrics = {
      ...record.metrics,
      ...data,
      updated_at: new Date().toISOString(),
    };
    touch(record);
    writeStore(store);
    return clone(record.metrics);
  },

  async getROI(useCaseId: string) {
    const store = readStore();
    const record = ensureRecord(store, useCaseId);
    return clone(calculateRoi(record));
  },

  async getReadiness(useCaseId: string) {
    const store = readStore();
    const record = ensureRecord(store, useCaseId);
    return clone(calculateReadiness(record));
  },

  async exportUseCase(useCaseId: string) {
    const store = readStore();
    const record = ensureRecord(store, useCaseId);
    return clone({
      useCase: record.useCase,
      process: {
        roles: record.roles,
        steps: record.steps,
      },
      dataAssets: record.dataAssets,
      applications: record.applications,
      connectors: record.connectors,
      rules: record.rules,
      slas: record.slas,
      metrics: record.metrics,
      readiness: calculateReadiness(record),
      roi: calculateRoi(record),
      exportedAt: new Date().toISOString(),
      version: '1.0',
    });
  },

  async importUseCase(pack: any, ownerId: string) {
    const store = readStore();
    const id = generateId();
    const now = new Date().toISOString();

    const record = ensureRecordExists(store, id);
    record.useCase = {
      ...clone(pack.useCase ?? {}),
      id,
      owner_id: ownerId,
      created_at: now,
      updated_at: now,
    };
    record.roles = clone(pack.process?.roles ?? []);
    record.steps = clone(pack.process?.steps ?? []);
    record.dataAssets = clone(pack.dataAssets ?? []);
    record.applications = clone(pack.applications ?? []);
    record.connectors = clone(pack.connectors ?? []);
    record.rules = clone(pack.rules ?? []);
    record.slas = clone(pack.slas ?? []);
    record.metrics = clone(pack.metrics ?? null);

    writeStore(store);
    return clone(record.useCase);
  },
};

function shouldFallback(error: unknown) {
  if (!error) return true;
  if (error instanceof SyntaxError) return true;
  if (error instanceof TypeError) return true; // fetch failures in browsers
  if (error instanceof Error) {
    const message = error.message.toLowerCase();
    if (message.includes('invalid json')) return true;
    if (message.includes('failed to fetch')) return true;
    if (message.includes('network')) return true;
    if (message.includes('not found')) return true;
  }
  return false;
}

async function fetchWithHandling<T = any>(url: string, init?: RequestInit, expectJson = true): Promise<T> {
  const response = await fetch(url, init);

  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`);
  }

  if (!expectJson) {
    return undefined as T;
  }

  const contentType = response.headers.get('content-type') ?? '';
  if (!contentType.includes('application/json')) {
    if (response.status === 204 || response.status === 205) {
      return undefined as T;
    }
    await response.text();
    throw new Error('Invalid JSON response from API');
  }

  try {
    return (await response.json()) as T;
  } catch (error) {
    throw new Error('Invalid JSON response from API');
  }
}

async function callWithFallback<T = any>(remoteCall: () => Promise<T>, fallbackCall: () => T | Promise<T>): Promise<T> {
  try {
    return await remoteCall();
  } catch (error) {
    if (!shouldFallback(error)) {
      throw error;
    }
    console.warn('AgentPrep API falling back to local storage', error);
    return await fallbackCall();
  }
}

export const api = {
  // Use Cases
  createUseCase: async (data: any) =>
    callWithFallback(
      () =>
        fetchWithHandling(`${API_BASE}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        }),
      () => localApi.createUseCase(data)
    ),

  getUseCase: async (id: string) =>
    callWithFallback(
      () => fetchWithHandling(`${API_BASE}/${id}`),
      () => localApi.getUseCase(id)
    ),

  updateUseCase: async (id: string, data: any) =>
    callWithFallback(
      () =>
        fetchWithHandling(`${API_BASE}/${id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        }),
      () => localApi.updateUseCase(id, data)
    ),

  listUseCases: async (ownerId: string) =>
    callWithFallback(
      () => fetchWithHandling(`${API_BASE}?owner_id=${encodeURIComponent(ownerId)}`),
      () => localApi.listUseCases(ownerId)
    ),

  deleteUseCase: async (id: string) =>
    callWithFallback(
      () =>
        fetchWithHandling(`${API_BASE}/${id}`, {
          method: 'DELETE',
        }, false),
      () => localApi.deleteUseCase(id)
    ),

  // Roles
  listRoles: async (useCaseId: string) =>
    callWithFallback(
      () => fetchWithHandling(`${API_BASE}/${useCaseId}/roles`),
      () => localApi.listRoles(useCaseId)
    ),

  createRole: async (useCaseId: string, data: any) =>
    callWithFallback(
      () =>
        fetchWithHandling(`${API_BASE}/${useCaseId}/roles`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        }),
      () => localApi.createRole(useCaseId, data)
    ),

  deleteRole: async (useCaseId: string, roleId: string) =>
    callWithFallback(
      () =>
        fetchWithHandling(`${API_BASE}/${useCaseId}/roles`, {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ roleId }),
        }, false),
      () => localApi.deleteRole(useCaseId, roleId)
    ),

  // Process Steps
  listSteps: async (useCaseId: string) =>
    callWithFallback(
      () => fetchWithHandling(`${API_BASE}/${useCaseId}/steps`),
      () => localApi.listSteps(useCaseId)
    ),

  createStep: async (useCaseId: string, data: any) =>
    callWithFallback(
      () =>
        fetchWithHandling(`${API_BASE}/${useCaseId}/steps`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        }),
      () => localApi.createStep(useCaseId, data)
    ),

  deleteStep: async (useCaseId: string, stepId: string) =>
    callWithFallback(
      () =>
        fetchWithHandling(`${API_BASE}/${useCaseId}/steps`, {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ stepId }),
        }, false),
      () => localApi.deleteStep(useCaseId, stepId)
    ),

  // Data Assets
  listDataAssets: async (useCaseId: string) =>
    callWithFallback(
      () => fetchWithHandling(`${API_BASE}/${useCaseId}/data-assets`),
      () => localApi.listDataAssets(useCaseId)
    ),

  createDataAsset: async (useCaseId: string, data: any) =>
    callWithFallback(
      () =>
        fetchWithHandling(`${API_BASE}/${useCaseId}/data-assets`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        }),
      () => localApi.createDataAsset(useCaseId, data)
    ),

  deleteDataAsset: async (useCaseId: string, assetId: string) =>
    callWithFallback(
      () =>
        fetchWithHandling(`${API_BASE}/${useCaseId}/data-assets`, {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ assetId }),
        }, false),
      () => localApi.deleteDataAsset(useCaseId, assetId)
    ),

  // Applications
  listApplications: async (useCaseId: string) =>
    callWithFallback(
      () => fetchWithHandling(`${API_BASE}/${useCaseId}/applications`),
      () => localApi.listApplications(useCaseId)
    ),

  createApplication: async (useCaseId: string, data: any) =>
    callWithFallback(
      () =>
        fetchWithHandling(`${API_BASE}/${useCaseId}/applications`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        }),
      () => localApi.createApplication(useCaseId, data)
    ),

  deleteApplication: async (useCaseId: string, applicationId: string) =>
    callWithFallback(
      () =>
        fetchWithHandling(`${API_BASE}/${useCaseId}/applications`, {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ applicationId }),
        }, false),
      () => localApi.deleteApplication(useCaseId, applicationId)
    ),

  // Connectors
  listConnectors: async (useCaseId: string) =>
    callWithFallback(
      () => fetchWithHandling(`${API_BASE}/${useCaseId}/connectors`),
      () => localApi.listConnectors(useCaseId)
    ),

  createConnector: async (useCaseId: string, data: any) =>
    callWithFallback(
      () =>
        fetchWithHandling(`${API_BASE}/${useCaseId}/connectors`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        }),
      () => localApi.createConnector(useCaseId, data)
    ),

  deleteConnector: async (useCaseId: string, connectorId: string) =>
    callWithFallback(
      () =>
        fetchWithHandling(`${API_BASE}/${useCaseId}/connectors`, {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ connectorId }),
        }, false),
      () => localApi.deleteConnector(useCaseId, connectorId)
    ),

  // Rules
  listRules: async (useCaseId: string) =>
    callWithFallback(
      () => fetchWithHandling(`${API_BASE}/${useCaseId}/rules`),
      () => localApi.listRules(useCaseId)
    ),

  createRule: async (useCaseId: string, data: any) =>
    callWithFallback(
      () =>
        fetchWithHandling(`${API_BASE}/${useCaseId}/rules`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        }),
      () => localApi.createRule(useCaseId, data)
    ),

  deleteRule: async (useCaseId: string, ruleId: string) =>
    callWithFallback(
      () =>
        fetchWithHandling(`${API_BASE}/${useCaseId}/rules`, {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ruleId }),
        }, false),
      () => localApi.deleteRule(useCaseId, ruleId)
    ),

  // SLAs
  listSLAs: async (useCaseId: string) =>
    callWithFallback(
      () => fetchWithHandling(`${API_BASE}/${useCaseId}/slas`),
      () => localApi.listSLAs(useCaseId)
    ),

  createSLA: async (useCaseId: string, data: any) =>
    callWithFallback(
      () =>
        fetchWithHandling(`${API_BASE}/${useCaseId}/slas`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        }),
      () => localApi.createSLA(useCaseId, data)
    ),

  deleteSLA: async (useCaseId: string, slaId: string) =>
    callWithFallback(
      () =>
        fetchWithHandling(`${API_BASE}/${useCaseId}/slas`, {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ slaId }),
        }, false),
      () => localApi.deleteSLA(useCaseId, slaId)
    ),

  // Metrics & Analysis
  getMetrics: async (useCaseId: string) =>
    callWithFallback(
      () => fetchWithHandling(`${API_BASE}/${useCaseId}/metrics`),
      () => localApi.getMetrics(useCaseId)
    ),

  updateMetrics: async (useCaseId: string, data: any) =>
    callWithFallback(
      () =>
        fetchWithHandling(`${API_BASE}/${useCaseId}/metrics`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        }),
      () => localApi.updateMetrics(useCaseId, data)
    ),

  getROI: async (useCaseId: string) =>
    callWithFallback(
      () => fetchWithHandling(`${API_BASE}/${useCaseId}/roi`),
      () => localApi.getROI(useCaseId)
    ),

  getReadiness: async (useCaseId: string) =>
    callWithFallback(
      () => fetchWithHandling(`${API_BASE}/${useCaseId}/readiness`),
      () => localApi.getReadiness(useCaseId)
    ),

  // Import / Export
  exportUseCase: async (useCaseId: string) =>
    callWithFallback(
      () => fetchWithHandling(`${API_BASE}/${useCaseId}/export`),
      () => localApi.exportUseCase(useCaseId)
    ),

  importUseCase: async (pack: any, ownerId: string) =>
    callWithFallback(
      () =>
        fetchWithHandling(`${API_BASE}/import`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ pack, owner_id: ownerId }),
        }),
      () => localApi.importUseCase(pack, ownerId)
    ),
};

export type AgentPrepApi = typeof api;

export { API_BASE };
