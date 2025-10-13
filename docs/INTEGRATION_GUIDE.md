# AgentPrep Component Integration Guide

## ✅ Current Status

### Completed Files
1. **`src/components/AgentPrep.tsx`** - Main component with:
   - Core structure and state management ✅
   - API integration ✅
   - Navigation and layout ✅
   - OverviewSection (fully implemented) ✅
   - Section rendering logic ✅

2. **`src/components/AgentPrepSections.tsx`** - Additional components:
   - StepsSection ✅
   - StepCard ✅
   - StepFormModal ✅

### Remaining Components to Add

The following components from the original `AgentPrep-tsx.txt` document still need to be added to complete the implementation:

## 📋 Components to Add

### 1. DataSection Component (~200 lines)
Location: After StepsSection
```tsx
function DataSection({ useCaseId, dataAssets, setDataAssets, markDirty }: any) {
  // Asset management with PII tracking
  // Quality scoring
  // Add/delete functionality
}
```

### 2. DataAssetModal Component (~100 lines)
```tsx
function DataAssetModal({ onSave, onCancel }: any) {
  // Form for adding data assets
  // PII checkbox
  // Quality score selector
}
```

### 3. AppsSection Component (~200 lines)
```tsx
function AppsSection({ useCaseId, applications, setApplications, connectors, setConnectors, markDirty }: any) {
  // Application inventory
  // Connector management
  // Authentication types
}
```

### 4. ApplicationModal Component (~100 lines)
```tsx
function ApplicationModal({ onSave, onCancel }: any) {
  // Application configuration form
  // Auth type selection
  // Vendor information
}
```

### 5. RulesSection Component (~300 lines)
```tsx
function RulesSection({ useCaseId, rules, setRules, slas, setSlas, markDirty }: any) {
  // Business rules list
  // SLAs list
  // Add/edit/delete for both
}
```

### 6. RuleModal Component (~80 lines)
```tsx
function RuleModal({ onSave, onCancel }: any) {
  // Rule definition form
  // Category selection
  // Expression builder
}
```

### 7. SLAModal Component (~80 lines)
```tsx
function SLAModal({ onSave, onCancel }: any) {
  // SLA target form
  // Threshold and unit inputs
}
```

### 8. MetricsSection Component (~300 lines)
```tsx
function MetricsSection({ useCaseId, metrics, setMetrics, roiResults, setRoiResults, markDirty }: any) {
  // Baseline metrics input
  // ROI calculation display
  // Auto-save with debounce
}
```

### 9. ReviewSection Component (~250 lines)
```tsx
function ReviewSection({ useCase, sections, readinessScore, roiResults, onExport }: any) {
  // Completion checklist
  // Readiness score display
  // Export functionality
}
```

## 🔧 Integration Steps

### Step 1: Import Components
In `AgentPrep.tsx`, import the section components:

```tsx
import { 
  StepsSection, 
  StepCard, 
  StepFormModal 
} from './AgentPrepSections';
```

### Step 2: Update Section Rendering
The main AgentPrep component already has the section rendering logic:

```tsx
{activeSection === 'steps' && (
  <StepsSection 
    useCaseId={useCase.id}
    processSteps={processSteps}
    setProcessSteps={setProcessSteps}
    roles={roles}
    setRoles={setRoles}
    markDirty={markDirty}
  />
)}
```

### Step 3: Add Remaining Components
Copy the remaining component code from `AgentPrep-tsx.txt`:

1. **DataSection & DataAssetModal** (lines ~XXX-XXX)
2. **AppsSection & ApplicationModal** (lines ~XXX-XXX)
3. **RulesSection, RuleModal & SLAModal** (lines ~XXX-XXX)
4. **MetricsSection** (lines ~XXX-XXX)
5. **ReviewSection** (lines ~XXX-XXX)

### Step 4: Verify API Integration
Ensure all API calls reference the correct endpoints:

```tsx
// Example for data assets
const addAsset = async (assetData: any) => {
  const newAsset = await api.createDataAsset(useCaseId, assetData);
  setDataAssets((prev: any) => [...prev, newAsset]);
  markDirty();
};
```

## 📝 Component Templates

### Data Section Template
```tsx
function DataSection({ useCaseId, dataAssets, setDataAssets, markDirty }: any) {
  const [showAddAsset, setShowAddAsset] = useState(false);

  const addAsset = async (assetData: any) => {
    try {
      const newAsset = await api.createDataAsset(useCaseId, assetData);
      setDataAssets((prev: any) => [...prev, newAsset]);
      markDirty();
      setShowAddAsset(false);
    } catch (err) {
      alert('Failed to create data asset');
      console.error(err);
    }
  };

  const deleteAsset = async (assetId: string) => {
    if (!window.confirm('Delete this data asset?')) return;
    
    try {
      await api.deleteDataAsset(useCaseId, assetId);
      setDataAssets((prev: any) => prev.filter((a: any) => a.id !== assetId));
      markDirty();
    } catch (err) {
      alert('Failed to delete data asset');
      console.error(err);
    }
  };

  return (
    <div className=\"space-y-6\">
      <div>
        <h1 className=\"text-3xl font-bold text-gray-900 mb-2\">Data Assets</h1>
        <p className=\"text-gray-600\">Identify the data objects and fields involved in this process.</p>
      </div>

      <div className=\"bg-white rounded-xl shadow-sm border border-gray-200 p-6\">
        <div className=\"flex items-center justify-between mb-4\">
          <h2 className=\"text-lg font-semibold text-gray-900\">Assets</h2>
          <button
            onClick={() => setShowAddAsset(true)}
            className=\"px-3 py-1.5 bg-green-500 text-white rounded hover:bg-green-600 flex items-center gap-2 text-sm\"
          >
            <Plus className=\"w-4 h-4\" />
            Add Data Asset
          </button>
        </div>

        {dataAssets.length === 0 ? (
          <div className=\"text-center py-12 text-gray-400\">
            <Database className=\"w-16 h-16 mx-auto mb-4 opacity-50\" />
            <div className=\"mb-4\">No data assets defined yet</div>
          </div>
        ) : (
          <div className=\"space-y-3\">
            {dataAssets.map((asset: any) => (
              <div key={asset.id} className=\"border border-gray-200 rounded-lg p-4\">
                <div className=\"flex items-start justify-between mb-2\">
                  <div>
                    <div className=\"font-semibold text-gray-900 mb-1\">{asset.name}</div>
                    <div className=\"text-sm text-gray-600\">{asset.system} • {asset.object_type}</div>
                  </div>
                  <button
                    onClick={() => deleteAsset(asset.id)}
                    className=\"text-red-600 hover:text-red-800\"
                  >
                    <Trash2 className=\"w-4 h-4\" />
                  </button>
                </div>
                
                <div className=\"flex gap-4 text-xs mt-3\">
                  <div className={`px-2 py-1 rounded ${asset.has_pii ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-700'}`}>
                    {asset.has_pii ? '🔒 Contains PII' : '✓ No PII'}
                  </div>
                  {asset.quality_score && (
                    <div className=\"px-2 py-1 bg-blue-100 text-blue-700 rounded\">
                      Quality: {asset.quality_score}/5
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {showAddAsset && (
        <DataAssetModal
          onSave={addAsset}
          onCancel={() => setShowAddAsset(false)}
        />
      )}
    </div>
  );
}
```

## 🎯 Quick Reference

### File Structure
```
src/components/
├── AgentPrep.tsx          (Main component - 28KB currently)
├── AgentPrepSections.tsx  (Section components - 16KB)
└── [Additional section files as needed]
```

### Component Hierarchy
```
AgentPrep (Main)
├── OverviewSection ✅
├── StepsSection ✅
│   ├── StepCard ✅
│   └── StepFormModal ✅
├── DataSection ⏳
│   └── DataAssetModal ⏳
├── AppsSection ⏳
│   └── ApplicationModal ⏳
├── RulesSection ⏳
│   ├── RuleModal ⏳
│   └── SLAModal ⏳
├── MetricsSection ⏳
└── ReviewSection ⏳
```

## ✨ Testing Checklist

After integration, test each section:

- [ ] Overview: Form validation, auto-save
- [ ] Steps: Add roles, create steps, substeps, delete
- [ ] Data: Add assets, PII toggle, quality score
- [ ] Apps: Add applications, connectors, auth types
- [ ] Rules: Create rules and SLAs, categories
- [ ] Metrics: Input values, view ROI calculations
- [ ] Review: View completion status, export JSON

## 📚 Source Reference

All component code is available in the original document:
- **File**: `AgentPrep-tsx.txt`
- **Total Size**: ~3000 lines / ~100KB
- **Sections**: Lines 1-800 (Core), 800-2800 (Sections), 2800-3000 (Modals)

## 🚀 Next Steps

1. Copy remaining section components from `AgentPrep-tsx.txt`
2. Add to `AgentPrepSections.tsx` or create new section files
3. Import into `AgentPrep.tsx`
4. Test each section individually
5. Verify API integration
6. Test export/import functionality

---

**Need Help?** Reference the full implementation in `AgentPrep-tsx.txt` or the database schema in `usecase-db.sql`.