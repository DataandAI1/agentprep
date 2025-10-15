// Reusable Database Queries
// Common query patterns for SimLab and AgentPrep

import { prisma } from '../prisma'
import type { Prisma } from '@prisma/client'

// ============================================================================
// SIMLAB QUERIES
// ============================================================================

export const simlabQueries = {
  /**
   * Get all projects for a user with pagination
   */
  async getProjects(ownerId: string, skip = 0, take = 10) {
    return prisma.simlabProject.findMany({
      where: {
        ownerId,
        deletedAt: null
      },
      orderBy: { createdAt: 'desc' },
      skip,
      take,
      include: {
        _count: {
          select: {
            nodes: true,
            edges: true,
            scenarios: true,
            runs: true
          }
        }
      }
    })
  },

  /**
   * Get a single project with all its nodes and edges
   */
  async getProjectWithGraph(projectId: string) {
    return prisma.simlabProject.findUnique({
      where: { id: projectId },
      include: {
        nodes: {
          orderBy: { createdAt: 'asc' }
        },
        edges: {
          include: {
            sourceNode: true,
            targetNode: true
          }
        },
        scenarios: {
          where: { isDefault: true },
          take: 1
        }
      }
    })
  },

  /**
   * Get recent runs for a project with metrics
   */
  async getProjectRuns(projectId: string, limit = 20) {
    return prisma.simlabRun.findMany({
      where: { projectId },
      orderBy: { startedAt: 'desc' },
      take: limit,
      include: {
        scenario: {
          select: {
            name: true,
            inputs: true
          }
        }
      }
    })
  },

  /**
   * Get aggregated metrics for a project
   */
  async getProjectMetrics(projectId: string) {
    const runs = await prisma.simlabRun.findMany({
      where: {
        projectId,
        status: 'completed'
      },
      select: {
        success: true,
        totalLatencyMs: true,
        totalCostUsd: true,
        totalTokens: true
      }
    })

    const totalRuns = runs.length

    if (totalRuns === 0) {
      return {
        totalRuns: 0,
        successRate: 0,
        avgLatencyMs: 0,
        avgCostUsd: 0,
        totalTokens: 0
      }
    }

    const successfulRuns = runs.filter(r => r.success).length
    const totalLatency = runs.reduce((sum, r) => sum + (r.totalLatencyMs || 0), 0)
    const totalCost = runs.reduce((sum, r) => sum + Number(r.totalCostUsd || 0), 0)
    const totalTokens = runs.reduce((sum, r) => sum + (r.totalTokens || 0), 0)

    return {
      totalRuns,
      successRate: successfulRuns / totalRuns,
      avgLatencyMs: Math.round(totalLatency / totalRuns),
      avgCostUsd: totalCost / totalRuns,
      totalTokens
    }
  },

  /**
   * Create a new project with initial nodes
   */
  async createProject(data: {
    name: string
    description?: string
    ownerId: string
    initialNodes?: Prisma.SimlabNodeCreateWithoutProjectInput[]
  }) {
    return prisma.simlabProject.create({
      data: {
        name: data.name,
        description: data.description,
        ownerId: data.ownerId,
        nodes: data.initialNodes ? {
          create: data.initialNodes
        } : undefined
      },
      include: {
        nodes: true
      }
    })
  }
}

// ============================================================================
// AGENTPREP QUERIES
// ============================================================================

export const agentprepQueries = {
  /**
   * Get all use cases for a user
   */
  async getUseCases(ownerId: string, filters?: {
    status?: string
    priority?: string
    tags?: string[]
  }) {
    return prisma.agentprepUseCase.findMany({
      where: {
        ownerId,
        deletedAt: null,
        ...(filters?.status && { status: filters.status }),
        ...(filters?.priority && { priority: filters.priority }),
        ...(filters?.tags && { tags: { hasSome: filters.tags } })
      },
      orderBy: [
        { priority: 'desc' },
        { updatedAt: 'desc' }
      ],
      include: {
        _count: {
          select: {
            roles: true,
            processSteps: true,
            dataAssets: true,
            applications: true
          }
        },
        metrics: true,
        roiResults: true,
        readiness: true
      }
    })
  },

  /**
   * Get a complete use case with all related data
   */
  async getUseCaseComplete(useCaseId: string) {
    return prisma.agentprepUseCase.findUnique({
      where: { id: useCaseId },
      include: {
        roles: true,
        processSteps: {
          orderBy: [
            { level: 'asc' },
            { orderIndex: 'asc' }
          ],
          include: {
            children: true
          }
        },
        dataAssets: {
          orderBy: { name: 'asc' }
        },
        applications: {
          include: {
            connectors: true
          }
        },
        rules: {
          orderBy: { category: 'asc' }
        },
        slas: true,
        metrics: true,
        roiResults: true,
        readiness: true
      }
    })
  },

  /**
   * Get process hierarchy for a use case
   */
  async getProcessHierarchy(useCaseId: string) {
    const rootSteps = await prisma.agentprepProcessStep.findMany({
      where: {
        useCaseId,
        parentId: null
      },
      orderBy: { orderIndex: 'asc' },
      include: {
        children: {
          orderBy: { orderIndex: 'asc' },
          include: {
            children: true
          }
        }
      }
    })

    return rootSteps
  },

  /**
   * Calculate and update readiness score
   */
  async updateReadinessScore(useCaseId: string) {
    // Get all necessary data
    const useCase = await prisma.agentprepUseCase.findUnique({
      where: { id: useCaseId },
      include: {
        dataAssets: true,
        applications: {
          include: { connectors: true }
        },
        rules: true,
        processSteps: true
      }
    })

    if (!useCase) throw new Error('Use case not found')

    // Calculate scores (simplified logic)
    const automationFitScore = Math.min(100, useCase.processSteps.length * 10)
    const apiMaturity = useCase.applications.some(app => 
      app.connectors.length > 0
    ) ? 8.5 : 5.0
    const dataQuality = useCase.dataAssets.length > 0 
      ? useCase.dataAssets.reduce((sum, asset) => sum + (asset.qualityScore || 50), 0) / useCase.dataAssets.length / 10
      : 5.0
    const ruleClarity = useCase.rules.length > 0 ? 8.0 : 4.0
    const exceptionRate = 7.5 // Would calculate from metrics
    const volumeStability = 8.0 // Would calculate from metrics
    const securityPosture = useCase.dataAssets.some(asset => asset.hasPii) ? 6.0 : 8.0
    
    const overallScore = (
      (automationFitScore / 10) * 0.2 +
      apiMaturity * 0.2 +
      dataQuality * 0.15 +
      ruleClarity * 0.15 +
      exceptionRate * 0.1 +
      volumeStability * 0.1 +
      securityPosture * 0.1
    )

    // Upsert readiness score
    return prisma.agentprepReadiness.upsert({
      where: { useCaseId },
      update: {
        overallScore,
        automationFitScore,
        apiMaturity,
        dataQuality,
        ruleClarity,
        exceptionRate,
        volumeStability,
        securityPosture,
        calculatedAt: new Date()
      },
      create: {
        useCaseId,
        overallScore,
        automationFitScore,
        apiMaturity,
        dataQuality,
        ruleClarity,
        exceptionRate,
        volumeStability,
        securityPosture
      }
    })
  },

  /**
   * Get use cases ranked by readiness
   */
  async getUseCasesByReadiness(ownerId: string, minScore = 7.0) {
    return prisma.agentprepUseCase.findMany({
      where: {
        ownerId,
        deletedAt: null,
        readiness: {
          overallScore: {
            gte: minScore
          }
        }
      },
      include: {
        readiness: true,
        roiResults: true,
        _count: {
          select: {
            processSteps: true,
            dataAssets: true
          }
        }
      },
      orderBy: {
        readiness: {
          overallScore: 'desc'
        }
      }
    })
  },

  /**
   * Create a new use case with initial data
   */
  async createUseCase(data: {
    id: string
    name: string
    objective: string
    scope: string
    ownerId: string
    priority?: string
    status?: string
    tags?: string[]
    sponsor?: string
  }) {
    return prisma.agentprepUseCase.create({
      data: {
        id: data.id,
        name: data.name,
        objective: data.objective,
        scope: data.scope,
        ownerId: data.ownerId,
        priority: data.priority || 'medium',
        status: data.status || 'draft',
        tags: data.tags || [],
        sponsor: data.sponsor
      }
    })
  }
}

// ============================================================================
// SHARED UTILITIES
// ============================================================================

export const dbUtils = {
  /**
   * Soft delete a record
   */
  async softDelete(
    model: any,
    id: string
  ) {
    return model.update({
      where: { id },
      data: { deletedAt: new Date() }
    })
  },

  /**
   * Check if a record exists
   */
  async exists(model: any, id: string): Promise<boolean> {
    const count = await model.count({
      where: { id }
    })
    return count > 0
  },

  /**
   * Get paginated results
   */
  async paginate({
    model,
    where = {},
    orderBy = {},
    page = 1,
    pageSize = 10
  }: {
    model: any
    where?: any
    orderBy?: any
    page?: number
    pageSize?: number
  }) {
    const skip = (page - 1) * pageSize
    
    const [items, total] = await Promise.all([
      model.findMany({
        where,
        orderBy,
        skip,
        take: pageSize
      }),
      model.count({ where })
    ])

    return {
      items,
      pagination: {
        page,
        pageSize,
        total,
        totalPages: Math.ceil(total / pageSize),
        hasNext: page * pageSize < total,
        hasPrev: page > 1
      }
    }
  }
}
