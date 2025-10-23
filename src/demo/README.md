# AgentPrep Demo Project

## Invoice Processing Automation

This directory contains a comprehensive demo project that showcases all features of the AgentPrep platform.

### What's Included

The demo project demonstrates:

- **Use Case Definition**: Complete invoice processing automation workflow
- **Roles**: 3 roles (AP Clerk, Accountant, Automation System)
- **Process Steps**: 12 steps including hierarchical sub-steps
- **Data Assets**: 4 key data tables from SAP ERP
- **Applications**: 4 integrated systems (SAP, DocuSign, SharePoint, Email)
- **API Connectors**: 6 configured API endpoints
- **Business Rules**: 7 validation and approval rules
- **SLAs**: 4 service level agreements
- **Metrics**: Complete baseline metrics for ROI calculation

### Business Context

The demo represents a realistic accounts payable invoice processing automation that:
- Processes 500 invoices daily
- Reduces manual handling time from 25 to ~5 minutes per invoice
- Achieves 85% straight-through processing
- Demonstrates potential annual savings of $180,000+
- Shows 6-8 month payback period

### How to Use

#### Option 1: Programmatic Loading

```typescript
import { loadDemoProject } from './demo/loadDemo';

// Load demo for a specific user
const demoUseCase = await loadDemoProject('user-123');
console.log('Demo loaded with ID:', demoUseCase.id);
```

#### Option 2: Check and Load if Needed

```typescript
import { ensureDemoProject } from './demo/loadDemo';

// Ensures demo exists, creates if not
const demoUseCase = await ensureDemoProject('user-123');
```

#### Option 3: Manual Import via UI

1. Export the demo data:
```typescript
import { invoiceProcessingDemo } from './demo/invoiceProcessingDemo';
console.log(JSON.stringify(invoiceProcessingDemo, null, 2));
```

2. Use the AgentPrep import feature to load the JSON

### Customizing the Demo

You can modify `invoiceProcessingDemo.ts` to:
- Change metrics to show different ROI scenarios
- Add/remove process steps
- Adjust business rules
- Modify data assets and connectors

### Demo Data Details

**Current State (Manual)**
- Volume: 500 invoices/day
- Time per invoice: 25 minutes
- FTE cost: $35/hour
- Error rate: 8%
- Annual labor cost: ~$182,000

**Future State (Automated)**
- Automation rate: 85%
- Time per invoice: ~5 minutes
- Error rate: 2%
- Annual labor cost: ~$36,000
- **Annual Savings: ~$146,000**
- **Payback Period: 6-8 months**

### Technical Notes

- The demo uses the same data structure as the production import/export format
- All IDs are pre-generated for consistency
- The demo is self-contained and doesn't require external data
- Compatible with both API and local storage modes

### Support

For questions or issues with the demo project, please check:
- The main AgentPrep documentation
- The `agentPrepApi.ts` implementation
- The import/export format specification
