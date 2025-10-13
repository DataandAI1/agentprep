// Database Seeding Script
// Run with: npm run db:seed

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting database seeding...')

  // Clean existing data (optional - comment out if you want to preserve data)
  console.log('🧹 Cleaning existing data...')
  await prisma.agentprepROIResults.deleteMany()
  await prisma.agentprepReadiness.deleteMany()
  await prisma.agentprepMetrics.deleteMany()
  await prisma.agentprepSLA.deleteMany()
  await prisma.agentprepRule.deleteMany()
  await prisma.agentprepConnector.deleteMany()
  await prisma.agentprepApplication.deleteMany()
  await prisma.agentprepDataAsset.deleteMany()
  await prisma.agentprepProcessStep.deleteMany()
  await prisma.agentprepRole.deleteMany()
  await prisma.agentprepUseCase.deleteMany()
  
  await prisma.simlabRun.deleteMany()
  await prisma.simlabScenario.deleteMany()
  await prisma.simlabEdge.deleteMany()
  await prisma.simlabNode.deleteMany()
  await prisma.simlabProject.deleteMany()

  // Seed SimLab data
  console.log('🔬 Seeding SimLab data...')
  
  const simlabProject = await prisma.simlabProject.create({
    data: {
      id: '550e8400-e29b-41d4-a716-446655440000',
      name: 'Customer Support Agent System',
      description: 'Multi-agent system for handling customer support tickets',
      ownerId: '123e4567-e89b-12d3-a456-426614174000',
      metadata: {
        version: '1.0',
        environment: 'development'
      }
    }
  })

  const routerNode = await prisma.simlabNode.create({
    data: {
      projectId: simlabProject.id,
      nodeType: 'router',
      label: 'Ticket Router',
      positionX: 100,
      positionY: 100,
      routingStrategy: 'semantic',
      threshold: 0.75,
      fallbackBehavior: 'manual_review',
      contextTags: ['customer_support', 'routing']
    }
  })

  const agentNode = await prisma.simlabNode.create({
    data: {
      projectId: simlabProject.id,
      nodeType: 'agent',
      label: 'Support Agent',
      positionX: 300,
      positionY: 100,
      model: 'claude-sonnet-4-5-20250929',
      systemPrompt: 'You are a helpful customer support agent. Be concise and professional.',
      temperature: 0.7,
      maxTokens: 2000,
      timeoutMs: 30000,
      maxRetries: 3,
      memoryType: 'conversation_buffer',
      contextTags: ['customer_support', 'chat'],
      toolsCount: 2,
      policiesCount: 3
    }
  })

  await prisma.simlabEdge.create({
    data: {
      projectId: simlabProject.id,
      sourceNodeId: routerNode.id,
      targetNodeId: agentNode.id,
      label: 'Route to Agent'
    }
  })

  const scenario = await prisma.simlabScenario.create({
    data: {
      projectId: simlabProject.id,
      name: 'Standard Support Flow',
      inputs: {
        ticketType: 'billing',
        priority: 'medium',
        customerId: 'CUST-001'
      },
      seed: 42,
      maxLatencyMs: 5000,
      maxCostUsd: 0.50,
      policies: [
        { type: 'pii_detection', enabled: true },
        { type: 'tone_analysis', threshold: 0.8 }
      ],
      costModel: {
        inputTokenCost: 0.000003,
        outputTokenCost: 0.000015
      },
      isDefault: true
    }
  })

  await prisma.simlabRun.create({
    data: {
      projectId: simlabProject.id,
      scenarioId: scenario.id,
      status: 'completed',
      success: true,
      successReason: 'Ticket resolved successfully',
      totalLatencyMs: 3200,
      p50LatencyMs: 2800,
      p95LatencyMs: 3500,
      totalTokens: 1500,
      promptTokens: 800,
      completionTokens: 700,
      totalCostUsd: 0.0129,
      policyViolations: [],
      reliabilityMetrics: {
        uptime: 0.999,
        errorRate: 0.001
      },
      traces: [
        { step: 'router', latencyMs: 400, tokens: 200 },
        { step: 'agent', latencyMs: 2800, tokens: 1300 }
      ],
      completedAt: new Date()
    }
  })

  // Seed AgentPrep data
  console.log('📊 Seeding AgentPrep data...')
  
  const useCase = await prisma.agentprepUseCase.create({
    data: {
      id: 'UC-001',
      name: 'Automated Invoice Processing',
      objective: 'Automate the processing and validation of supplier invoices',
      scope: 'Process 500+ daily invoices from 200+ suppliers, validate against PO data, flag exceptions',
      sponsor: 'CFO',
      priority: 'high',
      status: 'analysis',
      tags: ['finance', 'accounts_payable', 'automation'],
      ownerId: '123e4567-e89b-12d3-a456-426614174000'
    }
  })

  await prisma.agentprepRole.createMany({
    data: [
      { useCaseId: useCase.id, name: 'AP Clerk', type: 'primary' },
      { useCaseId: useCase.id, name: 'AP Manager', type: 'approver' },
      { useCaseId: useCase.id, name: 'Procurement', type: 'stakeholder' }
    ]
  })

  const step1 = await prisma.agentprepProcessStep.create({
    data: {
      useCaseId: useCase.id,
      type: 'task',
      role: 'AP Clerk',
      title: 'Receive Invoice',
      description: 'Receive invoice via email or portal',
      level: 1,
      orderIndex: 1,
      path: '1',
      avgTimeMinutes: 2,
      volumePerDay: 500,
      exceptionRate: 0.02
    }
  })

  await prisma.agentprepProcessStep.create({
    data: {
      useCaseId: useCase.id,
      parentId: step1.id,
      type: 'task',
      role: 'AP Clerk',
      title: 'Extract Invoice Data',
      description: 'Extract vendor, amount, PO number, and line items',
      level: 2,
      orderIndex: 1,
      path: '1.1',
      avgTimeMinutes: 5,
      volumePerDay: 500,
      exceptionRate: 0.08
    }
  })

  await prisma.agentprepDataAsset.createMany({
    data: [
      {
        useCaseId: useCase.id,
        name: 'Purchase Orders',
        system: 'SAP ERP',
        objectType: 'table',
        hasPii: false,
        qualityScore: 90,
        fields: [
          { name: 'po_number', type: 'string', required: true },
          { name: 'vendor_id', type: 'string', required: true },
          { name: 'amount', type: 'decimal', required: true },
          { name: 'status', type: 'string', required: true }
        ]
      },
      {
        useCaseId: useCase.id,
        name: 'Vendor Master',
        system: 'SAP ERP',
        objectType: 'table',
        hasPii: true,
        qualityScore: 85,
        fields: [
          { name: 'vendor_id', type: 'string', required: true },
          { name: 'vendor_name', type: 'string', required: true },
          { name: 'payment_terms', type: 'string', required: true }
        ]
      }
    ]
  })

  const sapApp = await prisma.agentprepApplication.create({
    data: {
      useCaseId: useCase.id,
      name: 'SAP ERP',
      type: 'erp',
      vendor: 'SAP',
      authType: 'oauth2',
      config: {
        environment: 'production',
        apiVersion: 'v2'
      }
    }
  })

  await prisma.agentprepConnector.create({
    data: {
      applicationId: sapApp.id,
      name: 'SAP Purchase Order API',
      connectorType: 'rest_api',
      endpoint: 'https://api.sap.com/po',
      timeoutMs: 10000,
      maxRetries: 3,
      rateLimit: '100/minute',
      cacheStrategy: 'ttl',
      config: {
        cacheTTL: 300,
        compression: true
      }
    }
  })

  await prisma.agentprepRule.createMany({
    data: [
      {
        useCaseId: useCase.id,
        name: 'Three-Way Match',
        description: 'Invoice must match PO and receipt',
        category: 'validation',
        expression: 'invoice.amount == po.amount && receipt.quantity == po.quantity'
      },
      {
        useCaseId: useCase.id,
        name: 'Approval Threshold',
        description: 'Invoices over $10,000 require manager approval',
        category: 'approval',
        expression: 'invoice.amount > 10000 ? require_approval : auto_approve'
      }
    ]
  })

  await prisma.agentprepSLA.createMany({
    data: [
      {
        useCaseId: useCase.id,
        metric: 'Processing Time',
        threshold: '< 2 hours',
        unit: 'hours',
        measurementWindow: 'per_invoice'
      },
      {
        useCaseId: useCase.id,
        metric: 'Accuracy Rate',
        threshold: '> 98%',
        unit: 'percentage',
        measurementWindow: 'monthly'
      }
    ]
  })

  await prisma.agentprepMetrics.create({
    data: {
      useCaseId: useCase.id,
      baselineVolume: 500,
      avgHandlingTimeMinutes: 15,
      fteCostPerHour: 45.00,
      errorRate: 0.05,
      breachCostUsd: 250.00
    }
  })

  await prisma.agentprepROIResults.create({
    data: {
      useCaseId: useCase.id,
      currentAnnualCostUsd: 468750.00,
      futureAnnualCostUsd: 93750.00,
      annualSavingsUsd: 375000.00,
      paybackMonths: 4.8,
      threeYearValueUsd: 1050000.00,
      confidenceScore: 0.85
    }
  })

  await prisma.agentprepReadiness.create({
    data: {
      useCaseId: useCase.id,
      overallScore: 8.2,
      automationFitScore: 85,
      apiMaturity: 9.0,
      dataQuality: 8.5,
      ruleClarity: 9.0,
      exceptionRate: 7.5,
      volumeStability: 8.0,
      securityPosture: 7.5
    }
  })

  console.log('✅ Seeding completed successfully!')
  console.log('\n📈 Summary:')
  console.log(`  - SimLab Projects: 1`)
  console.log(`  - SimLab Nodes: 2`)
  console.log(`  - SimLab Edges: 1`)
  console.log(`  - SimLab Scenarios: 1`)
  console.log(`  - SimLab Runs: 1`)
  console.log(`  - AgentPrep Use Cases: 1`)
  console.log(`  - AgentPrep Roles: 3`)
  console.log(`  - AgentPrep Process Steps: 2`)
  console.log(`  - AgentPrep Data Assets: 2`)
  console.log(`  - AgentPrep Applications: 1`)
  console.log(`  - AgentPrep Connectors: 1`)
  console.log(`  - AgentPrep Rules: 2`)
  console.log(`  - AgentPrep SLAs: 2`)
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:')
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
