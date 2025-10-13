// Core use case types
export interface UseCase {
  id: string;
  name: string;
  objective: string;
  scope: string;
  sponsor: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  status: 'draft' | 'ready' | 'approved' | 'implemented' | 'archived';
  tags: string[];
  ownerId: string;
  createdAt: string;
  updatedAt: string;
}

export interface Role {
  id: string;
  useCaseId: string;
  name: string;
  type: 'human' | 'agent' | 'system';
  createdAt: string;
}

export interface ProcessStep {
  id: string;
  useCaseId: string;
  parentId: string | null;
  type: 'trigger' | 'task' | 'decision' | 'approval' | 'parallel' | 'wait';
  role: string;
  title: string;
  description: string;
  level: number;
  orderIndex: number;
  path: string;
  executionMode: 'sequential' | 'parallel';
  avgTimeMinutes?: number;
  volumePerDay?: number;
  exceptionRate?: number;
  substeps?: ProcessStep[];
  createdAt: string;
  metadata?: Record<string, any>;
}

export interface DataAsset {
  id: string;
  useCaseId: string;
  name: string;
  system: string;
  objectType: 'table' | 'api' | 'file' | 'event';
  hasPII: boolean;
  qualityScore: number; // 1-5
  fields?: Array<{
    name: string;
    type: string;
    required: boolean;
  }>;
  createdAt: string;
  metadata?: Record<string, any>;
}

export interface Application {
  id: string;
  useCaseId: string;
  name: string;
  type: 'saas' | 'onprem' | 'database' | 'api' | 'custom';
  vendor?: string;
  authType?: 'none' | 'apikey' | 'oauth' | 'basic' | 'bearer' | 'saml';
  connectors?: Connector[];
  createdAt: string;
  config?: Record<string, any>;
}

export interface Connector {
  id: string;
  applicationId: string;
  name: string;
  connectorType: 'HTTP' | 'SQL' | 'GraphQL' | 'Search' | 'File';
  endpoint?: string;
  timeoutMs?: number;
  maxRetries?: number;
  rateLimit?: string;
  cacheStrategy?: string;
  createdAt: string;
  config?: Record<string, any>;
}

export interface BusinessRule {
  id: string;
  useCaseId: string;
  name: string;
  description: string;
  category: 'validation' | 'eligibility' | 'routing' | 'pricing' | 'compliance';
  expression?: string;
  createdAt: string;
  metadata?: Record<string, any>;
}

export interface SLA {
  id: string;
  useCaseId: string;
  metric: string;
  threshold: string;
  unit: 'seconds' | 'minutes' | 'hours' | 'percent' | 'count';
  window?: string;
  createdAt: string;
}

export interface Metrics {
  useCaseId: string;
  baselineVolume: number;
  avgHandlingTimeMinutes: number;
  fteCostPerHour: number;
  errorRate: number;
  breachCostUsd: number;
  updatedAt: string;
}

export interface ROIResults {
  useCaseId: string;
  currentAnnualCostUsd: number;
  futureAnnualCostUsd: number;
  annualSavingsUsd: number;
  paybackMonths: number;
  threeYearValueUsd: number;
  confidenceScore: number;
  calculatedAt: string;
}

export interface ReadinessScore {
  useCaseId: string;
  overallScore: number; // 0-5
  automationFitScore: number; // 0-100
  apiMaturity: number;
  dataQuality: number;
  ruleClarity: number;
  exceptionRate: number;
  volumeStability: number;
  securityPosture: number;
  calculatedAt: string;
}

// Export pack structure
export interface UseCasePack {
  useCase: UseCase;
  process: {
    roles: Role[];
    steps: ProcessStep[];
  };
  dataAssets: DataAsset[];
  applications: Application[];
  connectors: Connector[];
  rules: BusinessRule[];
  slas: SLA[];
  metrics?: Metrics;
  readiness?: ReadinessScore;
  roi?: ROIResults;
  exportedAt: string;
  version: string;
}
