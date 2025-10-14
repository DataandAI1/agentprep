// Database Type Utilities
// Type helpers and transformers for Prisma models

import type { 
  SimlabProject,
  SimlabNode,
  SimlabEdge,
  SimlabScenario,
  SimlabRun,
  AgentprepUseCase,
  AgentprepRole,
  AgentprepProcessStep,
  AgentprepDataAsset,
  AgentprepApplication,
  AgentprepConnector,
  AgentprepRule,
  AgentprepSLA,
  AgentprepMetrics,
  AgentprepROIResults,
  AgentprepReadiness,
  Prisma
} from '@prisma/client'

// ============================================================================
// SIMLAB TYPES
// ============================================================================

export type SimlabProjectWithCounts = SimlabProject & {
  _count: {
    nodes: number
    edges: number
    scenarios: number
    runs: number
  }
}

export type SimlabProjectWithGraph = SimlabProject & {
  nodes: SimlabNode[]
  edges: (SimlabEdge & {
    sourceNode: SimlabNode
    targetNode: SimlabNode
  })[]
  scenarios: SimlabScenario[]
}

export type SimlabRunWithScenario = SimlabRun & {
  scenario: {
    name: string
    inputs: Prisma.JsonValue
  }
}

export type NodeType = 'agent' | 'tool' | 'router'

export type RunStatus = 'pending' | 'running' | 'completed' | 'failed'

export interface SimlabMetrics {
  totalRuns: number
  successRate: number
  avgLatencyMs: number
  avgCostUsd: number
  totalTokens: number
}

// ============================================================================
// AGENTPREP TYPES
// ============================================================================

export type AgentprepUseCaseWithCounts = AgentprepUseCase & {
  _count: {
    roles: number
    processSteps: number
    dataAssets: number
    applications: number
  }
  metrics: AgentprepMetrics | null
  roiResults: AgentprepROIResults | null
  readiness: AgentprepReadiness | null
}

export type AgentprepUseCaseComplete = AgentprepUseCase & {
  roles: AgentprepRole[]
  processSteps: (AgentprepProcessStep & {
    children: AgentprepProcessStep[]
  })[]
  dataAssets: AgentprepDataAsset[]
  applications: (AgentprepApplication & {
    connectors: AgentprepConnector[]
  })[]
  rules: AgentprepRule[]
  slas: AgentprepSLA[]
  metrics: AgentprepMetrics | null
  roiResults: AgentprepROIResults | null
  readiness: AgentprepReadiness | null
}

export type ProcessStepHierarchy = AgentprepProcessStep & {
  children: (AgentprepProcessStep & {
    children: AgentprepProcessStep[]
  })[]
}

export type UseCasePriority = 'low' | 'medium' | 'high' | 'critical'
export type UseCaseStatus = 'draft' | 'analysis' | 'approved' | 'in_progress' | 'completed' | 'on_hold'
export type RoleType = 'primary' | 'secondary' | 'approver' | 'stakeholder'
export type ProcessStepType = 'task' | 'decision' | 'subprocess' | 'wait'

// ============================================================================
// TYPE GUARDS
// ============================================================================

export function isNodeType(value: string): value is NodeType {
  return ['agent', 'tool', 'router'].includes(value)
}

export function isRunStatus(value: string): value is RunStatus {
  return ['pending', 'running', 'completed', 'failed'].includes(value)
}

export function isUseCasePriority(value: string): value is UseCasePriority {
  return ['low', 'medium', 'high', 'critical'].includes(value)
}

export function isUseCaseStatus(value: string): value is UseCaseStatus {
  return ['draft', 'analysis', 'approved', 'in_progress', 'completed', 'on_hold'].includes(value)
}

// ============================================================================
// DATA TRANSFORMERS
// ============================================================================

/**
 * Convert Decimal fields to numbers for JSON serialization
 */
export function serializeReadiness(readiness: AgentprepReadiness) {
  return {
    ...readiness,
    overallScore: Number(readiness.overallScore),
    apiMaturity: Number(readiness.apiMaturity),
    dataQuality: Number(readiness.dataQuality),
    ruleClarity: Number(readiness.ruleClarity),
    exceptionRate: Number(readiness.exceptionRate),
    volumeStability: Number(readiness.volumeStability),
    securityPosture: Number(readiness.securityPosture)
  }
}

export function serializeROIResults(roi: AgentprepROIResults) {
  return {
    ...roi,
    currentAnnualCostUsd: Number(roi.currentAnnualCostUsd),
    futureAnnualCostUsd: Number(roi.futureAnnualCostUsd),
    annualSavingsUsd: Number(roi.annualSavingsUsd),
    paybackMonths: Number(roi.paybackMonths),
    threeYearValueUsd: Number(roi.threeYearValueUsd),
    confidenceScore: Number(roi.confidenceScore)
  }
}

export function serializeMetrics(metrics: AgentprepMetrics) {
  return {
    ...metrics,
    avgHandlingTimeMinutes: Number(metrics.avgHandlingTimeMinutes),
    fteCostPerHour: Number(metrics.fteCostPerHour),
    errorRate: Number(metrics.errorRate),
    breachCostUsd: Number(metrics.breachCostUsd)
  }
}

export function serializeSimlabRun(run: SimlabRun) {
  return {
    ...run,
    totalCostUsd: run.totalCostUsd ? Number(run.totalCostUsd) : null
  }
}

/**
 * Build process step tree from flat list
 */
export function buildProcessTree(
  steps: AgentprepProcessStep[]
): ProcessStepHierarchy[] {
  const stepMap = new Map<string, ProcessStepHierarchy>()
  const rootSteps: ProcessStepHierarchy[] = []

  // First pass: create map
  steps.forEach(step => {
    stepMap.set(step.id, { ...step, children: [] })
  })

  // Second pass: build tree
  steps.forEach(step => {
    const node = stepMap.get(step.id)!
    if (step.parentId) {
      const parent = stepMap.get(step.parentId)
      if (parent) {
        parent.children.push(node)
      }
    } else {
      rootSteps.push(node)
    }
  })

  return rootSteps
}

/**
 * Calculate total process time from steps
 */
export function calculateTotalProcessTime(
  steps: AgentprepProcessStep[]
): number {
  return steps.reduce((total, step) => {
    const time = step.avgTimeMinutes ? Number(step.avgTimeMinutes) : 0
    return total + time
  }, 0)
}

/**
 * Get readiness color based on score
 */
export function getReadinessColor(score: number): string {
  if (score >= 8) return 'green'
  if (score >= 6) return 'yellow'
  if (score >= 4) return 'orange'
  return 'red'
}

/**
 * Format currency
 */
export function formatCurrency(value: number | string | null): string {
  if (value === null) return 'N/A'
  const num = typeof value === 'string' ? parseFloat(value) : value
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(num)
}

/**
 * Format percentage
 */
export function formatPercentage(value: number | string, decimals = 1): string {
  const num = typeof value === 'string' ? parseFloat(value) : value
  return `${(num * 100).toFixed(decimals)}%`
}

// ============================================================================
// PAGINATION TYPES
// ============================================================================

export interface PaginationParams {
  page?: number
  pageSize?: number
  orderBy?: string
  orderDir?: 'asc' | 'desc'
}

export interface PaginatedResponse<T> {
  items: T[]
  pagination: {
    page: number
    pageSize: number
    total: number
    totalPages: number
    hasNext: boolean
    hasPrev: boolean
  }
}
