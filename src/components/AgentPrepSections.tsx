import { useEffect, useState } from 'react';
import {
  Plus,
  Trash2,
  X,
  Activity,
  Database,
  Settings,
  Shield,
  CheckCircle,
  Circle,
  AlertCircle,
  Download,
} from 'lucide-react';
import { api } from './agentPrepApi';

// Steps Section Component
export function StepsSection({ useCaseId, processSteps, setProcessSteps, roles, setRoles, markDirty }: any) {
  const [showAddStep, setShowAddStep] = useState(false);
  const [showAddRole, setShowAddRole] = useState(false);
  const [selectedParent, setSelectedParent] = useState<string | null>(null);

  const addRole = async (roleName: string) => {
    if (!roleName.trim()) return;
    
    try {
      const newRole = await api.createRole(useCaseId, {
        name: roleName,
        type: 'human'
      });
      setRoles((prev: any) => [...prev, newRole]);
      markDirty();
      setShowAddRole(false);
    } catch (err) {
      alert('Failed to create role');
      console.error(err);
    }
  };

  const addStep = async (stepData: any) => {
    try {
      const newStep = await api.createStep(useCaseId, {
        ...stepData,
        parent_id: selectedParent,
        order_index: selectedParent 
          ? processSteps.find((s: any) => s.id === selectedParent)?.substeps?.length || 0
          : processSteps.length
      });
      
      if (selectedParent) {
        setProcessSteps((prev: any) => prev.map((step: any) => {
          if (step.id === selectedParent) {
            return {
              ...step,
              substeps: [...(step.substeps || []), newStep]
            };
          }
          return step;
        }));
      } else {
        setProcessSteps((prev: any) => [...prev, { ...newStep, substeps: [] }]);
      }
      
      markDirty();
      setShowAddStep(false);
      setSelectedParent(null);
    } catch (err) {
      alert('Failed to create step');
      console.error(err);
    }
  };

  const deleteStep = async (stepId: string) => {
    if (!window.confirm('Delete this step?')) return;
    
    try {
      await api.deleteStep(useCaseId, stepId);
      setProcessSteps((prev: any) => prev.filter((s: any) => s.id !== stepId));
      markDirty();
    } catch (err) {
      alert('Failed to delete step');
      console.error(err);
    }
  };

  const deleteSubstep = async (parentId: string, substepId: string) => {
    if (!window.confirm('Delete this substep?')) return;
    
    try {
      await api.deleteStep(useCaseId, substepId);
      setProcessSteps((prev: any) => prev.map((step: any) => {
        if (step.id === parentId) {
          return {
            ...step,
            substeps: step.substeps.filter((s: any) => s.id !== substepId)
          };
        }
        return step;
      }));
      markDirty();
    } catch (err) {
      alert('Failed to delete substep');
      console.error(err);
    }
  };

  const stepTemplates = [
    { type: 'trigger', label: 'Trigger', desc: 'What starts the process?', color: 'bg-purple-100 border-purple-300' },
    { type: 'task', label: 'Task', desc: 'An action or activity', color: 'bg-blue-100 border-blue-300' },
    { type: 'decision', label: 'Decision', desc: 'A branching point', color: 'bg-yellow-100 border-yellow-300' },
    { type: 'approval', label: 'Approval', desc: 'Human review required', color: 'bg-orange-100 border-orange-300' },
    { type: 'wait', label: 'Wait', desc: 'Pause for event/time', color: 'bg-gray-100 border-gray-300' }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Process Steps</h1>
        <p className="text-gray-600">Map out the workflow from trigger to completion.</p>
      </div>

      {/* Roles Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Roles / Lanes</h2>
          <button
            onClick={() => setShowAddRole(true)}
            className="px-3 py-1.5 bg-indigo-500 text-white rounded hover:bg-indigo-600 flex items-center gap-2 text-sm"
          >
            <Plus className="w-4 h-4" />
            Add Role
          </button>
        </div>

        {roles.length === 0 ? (
          <div className="text-center py-8 text-gray-400">
            <Activity className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <div>No roles defined yet. Add roles like "Customer Service", "Agent", "Manager"</div>
          </div>
        ) : (
          <div className="flex flex-wrap gap-2">
            {roles.map((role: any) => (
              <div key={role.id} className="px-3 py-1.5 bg-indigo-50 border border-indigo-200 rounded-full text-sm text-indigo-700 flex items-center gap-2">
                {role.name}
                <button onClick={async () => {
                  try {
                    await api.deleteRole(useCaseId, role.id);
                    setRoles((prev: any) => prev.filter((r: any) => r.id !== role.id));
                    markDirty();
                  } catch (err) {
                    alert('Failed to delete role');
                  }
                }}>
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        )}

        {showAddRole && (
          <div className="mt-3 flex gap-2">
            <input
              type="text"
              placeholder="Role name (e.g., AP Clerk, Agent)"
              className="flex-1 px-3 py-2 border border-gray-300 rounded text-sm"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  addRole(e.currentTarget.value);
                  e.currentTarget.value = '';
                }
              }}
              autoFocus
            />
            <button
              onClick={() => setShowAddRole(false)}
              className="px-3 py-2 border border-gray-300 rounded text-sm"
            >
              Cancel
            </button>
          </div>
        )}
      </div>

      {/* Steps Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Steps</h2>
          <button
            onClick={() => {
              setSelectedParent(null);
              setShowAddStep(true);
            }}
            disabled={roles.length === 0}
            className="px-3 py-1.5 bg-green-500 text-white rounded hover:bg-green-600 disabled:bg-gray-400 flex items-center gap-2 text-sm"
          >
            <Plus className="w-4 h-4" />
            Add Step
          </button>
        </div>

        {roles.length === 0 && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 text-sm text-yellow-800 mb-4">
            Add at least one role before creating steps
          </div>
        )}

        {processSteps.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            <Activity className="w-16 h-16 mx-auto mb-4 opacity-50" />
            <div className="mb-4">No steps defined yet</div>
          </div>
        ) : (
          <div className="space-y-3">
            {processSteps.map((step: any, idx: number) => (
              <StepCard
                key={step.id}
                step={step}
                index={idx}
                onDelete={deleteStep}
                onDeleteSubstep={deleteSubstep}
                onAddSubstep={(parentId: string) => {
                  setSelectedParent(parentId);
                  setShowAddStep(true);
                }}
                stepTemplates={stepTemplates}
              />
            ))}
          </div>
        )}
      </div>

      {showAddStep && (
        <StepFormModal
          roles={roles}
          onSave={addStep}
          onCancel={() => {
            setShowAddStep(false);
            setSelectedParent(null);
          }}
          templates={stepTemplates}
        />
      )}
    </div>
  );
}

// Step Card Component
function StepCard({ step, index, onDelete, onDeleteSubstep, onAddSubstep, stepTemplates }: any) {
  const [expanded, setExpanded] = useState(false);
  const template = stepTemplates.find((t: any) => t.type === step.type);
  const hasSubsteps = step.substeps && step.substeps.length > 0;

  return (
    <div className="border-2 border-gray-200 rounded-lg">
      <div className={`p-4 ${template?.color || 'bg-gray-100'} rounded-t-lg ${!hasSubsteps ? 'rounded-b-lg' : ''}`}>
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-full bg-white border-2 border-gray-300 flex items-center justify-center text-sm font-bold flex-shrink-0">
            {index + 1}
          </div>

          <div className="flex-1">
            <div className="flex items-start justify-between mb-2">
              <div>
                <div className="font-semibold text-gray-900 text-lg">{step.title}</div>
                <div className="text-xs text-gray-600 mt-1">{step.role} • {step.type}</div>
              </div>
              <div className="flex items-center gap-2">
                {hasSubsteps && (
                  <button
                    onClick={() => setExpanded(!expanded)}
                    className="px-2 py-1 bg-white border border-gray-300 rounded text-xs hover:bg-gray-50"
                  >
                    {expanded ? '▼' : '▶'} {step.substeps.length} substep{step.substeps.length !== 1 ? 's' : ''}
                  </button>
                )}
                <button
                  onClick={() => onAddSubstep(step.id)}
                  className="px-2 py-1 bg-white border border-green-500 text-green-600 rounded text-xs hover:bg-green-50"
                >
                  + Substep
                </button>
                <button
                  onClick={() => onDelete(step.id)}
                  className="text-red-600 hover:text-red-800"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
            
            {step.description && (
              <div className="text-sm text-gray-700 mb-2">{step.description}</div>
            )}
          </div>
        </div>
      </div>

      {hasSubsteps && expanded && (
        <div className="bg-gray-50 p-4 rounded-b-lg border-t-2 border-gray-200">
          <div className="space-y-2 ml-8">
            {step.substeps.map((substep: any, subIdx: number) => (
              <div key={substep.id} className="border border-gray-300 rounded-lg p-3 bg-white">
                <div className="flex items-start gap-3">
                  <div className="w-7 h-7 rounded-full bg-gray-200 border border-gray-300 flex items-center justify-center text-xs font-semibold">
                    {index + 1}.{subIdx + 1}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="font-medium text-gray-900">{substep.title}</div>
                        <div className="text-xs text-gray-600">{substep.type}</div>
                      </div>
                      <button
                        onClick={() => onDeleteSubstep(step.id, substep.id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// Step Form Modal
function StepFormModal({ roles, onSave, onCancel, templates }: any) {
  const [formData, setFormData] = useState({
    type: 'task',
    role: roles[0]?.name || '',
    title: '',
    description: '',
    avg_time_minutes: '',
    volume_per_day: '',
    exception_rate: ''
  });

  const handleSubmit = () => {
    if (formData.title && formData.role) {
      onSave({
        ...formData,
        avg_time_minutes: parseFloat(formData.avg_time_minutes) || null,
        volume_per_day: parseInt(formData.volume_per_day) || null,
        exception_rate: parseFloat(formData.exception_rate) || null
      });
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full">
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold">Add Process Step</h3>
          <button onClick={onCancel}>
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Step Type</label>
            <div className="grid grid-cols-5 gap-2">
              {templates.map((template: any) => (
                <button
                  key={template.type}
                  onClick={() => setFormData(prev => ({ ...prev, type: template.type }))}
                  className={`p-3 border-2 rounded-lg text-center transition ${
                    formData.type === template.type
                      ? template.color
                      : 'bg-white border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="text-xs font-semibold mb-1">{template.label}</div>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Assigned Role</label>
            <select
              value={formData.role}
              onChange={(e) => setFormData(prev => ({ ...prev, role: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            >
              {roles.map((role: any) => (
                <option key={role.id} value={role.name}>{role.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Step Title</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              placeholder="e.g., Extract invoice data from PDF"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="What happens in this step?"
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg resize-none"
            />
          </div>
        </div>

        <div className="flex gap-3 p-4 border-t border-gray-200">
          <button
            onClick={onCancel}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={!formData.title || !formData.role}
            className="flex-1 px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 disabled:bg-gray-400"
          >
            Add Step
          </button>
        </div>
      </div>
    </div>
  );
}


// Data Section Component
export function DataSection({ useCaseId, dataAssets, setDataAssets, markDirty }: any) {
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
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Data Assets</h1>
        <p className="text-gray-600">Identify the data objects and fields involved in this process.</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Assets</h2>
          <button
            onClick={() => setShowAddAsset(true)}
            className="px-3 py-1.5 bg-green-500 text-white rounded hover:bg-green-600 flex items-center gap-2 text-sm"
          >
            <Plus className="w-4 h-4" />
            Add Data Asset
          </button>
        </div>

        {dataAssets.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            <Database className="w-16 h-16 mx-auto mb-4 opacity-50" />
            <div className="mb-4">No data assets defined yet</div>
          </div>
        ) : (
          <div className="space-y-3">
            {dataAssets.map((asset: any) => (
              <div key={asset.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <div className="font-semibold text-gray-900 mb-1">{asset.name}</div>
                    <div className="text-sm text-gray-600">{asset.system} • {asset.object_type}</div>
                  </div>
                  <button
                    onClick={() => deleteAsset(asset.id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                
                <div className="flex gap-4 text-xs mt-3">
                  <div className={`px-2 py-1 rounded ${asset.has_pii ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-700'}`}>
                    {asset.has_pii ? '🔒 Contains PII' : '✓ No PII'}
                  </div>
                  {asset.quality_score && (
                    <div className="px-2 py-1 bg-blue-100 text-blue-700 rounded">
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

// Data Asset Modal
function DataAssetModal({ onSave, onCancel }: any) {
  const [formData, setFormData] = useState({
    name: '',
    system: '',
    object_type: 'table',
    has_pii: false,
    quality_score: 3
  });

  const handleSubmit = () => {
    if (formData.name && formData.system) {
      onSave(formData);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-xl w-full">
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold">Add Data Asset</h3>
          <button onClick={onCancel}>
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Asset Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="e.g., Customer, Invoice, Order"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Source System</label>
            <input
              type="text"
              value={formData.system}
              onChange={(e) => setFormData(prev => ({ ...prev, system: e.target.value }))}
              placeholder="e.g., Salesforce, SAP, PostgreSQL"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Object Type</label>
            <select
              value={formData.object_type}
              onChange={(e) => setFormData(prev => ({ ...prev, object_type: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            >
              <option value="table">Database Table</option>
              <option value="api">API Endpoint</option>
              <option value="file">File/Document</option>
              <option value="event">Event Stream</option>
            </select>
          </div>

          <div>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.has_pii}
                onChange={(e) => setFormData(prev => ({ ...prev, has_pii: e.target.checked }))}
                className="w-4 h-4 text-indigo-600 border-gray-300 rounded"
              />
              <span className="text-sm text-gray-700">Contains PII/Sensitive Data</span>
            </label>
          </div>
        </div>

        <div className="flex gap-3 p-4 border-t border-gray-200">
          <button
            onClick={onCancel}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={!formData.name || !formData.system}
            className="flex-1 px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 disabled:bg-gray-400"
          >
            Add Asset
          </button>
        </div>
      </div>
    </div>
  );
}

// Apps Section Component  
export function AppsSection({ useCaseId, applications, setApplications, connectors, setConnectors: _setConnectors, markDirty }: any) {
  const [showAddApp, setShowAddApp] = useState(false);

  const addApplication = async (appData: any) => {
    try {
      const newApp = await api.createApplication(useCaseId, appData);
      setApplications((prev: any) => [...prev, newApp]);
      markDirty();
      setShowAddApp(false);
    } catch (err) {
      alert('Failed to create application');
      console.error(err);
    }
  };

  const deleteApplication = async (appId: string) => {
    if (!window.confirm('Delete this application?')) return;
    
    try {
      await api.deleteApplication(useCaseId, appId);
      setApplications((prev: any) => prev.filter((a: any) => a.id !== appId));
      markDirty();
    } catch (err) {
      alert('Failed to delete application');
      console.error(err);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Applications & Connectors</h1>
        <p className="text-gray-600">Catalog the systems and APIs involved in this process.</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Applications</h2>
          <button
            onClick={() => setShowAddApp(true)}
            className="px-3 py-1.5 bg-green-500 text-white rounded hover:bg-green-600 flex items-center gap-2 text-sm"
          >
            <Plus className="w-4 h-4" />
            Add Application
          </button>
        </div>

        {applications.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            <Settings className="w-16 h-16 mx-auto mb-4 opacity-50" />
            <div className="mb-4">No applications defined yet</div>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4">
            {applications.map((app: any) => (
              <div key={app.id} className="border border-gray-200 rounded-lg p-4 hover:border-indigo-300 transition">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <div className="font-semibold text-gray-900 mb-1">{app.name}</div>
                    <div className="text-xs text-gray-600">{app.type} • {app.vendor || 'Custom'}</div>
                  </div>
                  <button
                    onClick={() => deleteApplication(app.id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="flex gap-2 text-xs mt-3">
                  <div className={`px-2 py-1 rounded ${
                    app.auth_type === 'oauth' ? 'bg-green-100 text-green-700' :
                    app.auth_type === 'apikey' ? 'bg-blue-100 text-blue-700' :
                    'bg-gray-100 text-gray-700'
                  }`}>
                    {app.auth_type || 'No Auth'}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Connectors</h2>
          <span className="text-sm text-gray-500">{connectors?.length || 0} configured</span>
        </div>

        {connectors?.length ? (
          <div className="space-y-3">
            {connectors.map((connector: any) => (
              <div key={connector.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="font-semibold text-gray-900">{connector.name}</div>
                    <div className="text-xs text-gray-600">
                      {connector.connectorType} • {connector.endpoint || 'No endpoint specified'}
                    </div>
                  </div>
                  <div className="text-xs text-gray-500">
                    {connector.timeoutMs ? `${connector.timeoutMs}ms timeout` : 'Default timeout'}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-sm text-gray-500 bg-gray-50 border border-dashed border-gray-300 rounded-lg p-4 text-center">
            No connectors documented yet. Capture API endpoints, auth methods, and rate limits here when available.
          </div>
        )}
      </div>

      {showAddApp && (
        <ApplicationModal
          onSave={addApplication}
          onCancel={() => setShowAddApp(false)}
        />
      )}
    </div>
  );
}

// Application Modal
function ApplicationModal({ onSave, onCancel }: any) {
  const [formData, setFormData] = useState({
    name: '',
    type: 'saas',
    vendor: '',
    auth_type: 'apikey'
  });

  const handleSubmit = () => {
    if (formData.name) {
      onSave(formData);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-xl w-full">
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold">Add Application</h3>
          <button onClick={onCancel}>
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Application Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="e.g., Salesforce, SAP"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
            <select
              value={formData.type}
              onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            >
              <option value="saas">SaaS / Cloud</option>
              <option value="onprem">On-Premise</option>
              <option value="database">Database</option>
              <option value="api">API Service</option>
              <option value="custom">Custom</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Authentication</label>
            <select
              value={formData.auth_type}
              onChange={(e) => setFormData(prev => ({ ...prev, auth_type: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            >
              <option value="none">None</option>
              <option value="apikey">API Key</option>
              <option value="oauth">OAuth 2.0</option>
              <option value="basic">Basic Auth</option>
              <option value="bearer">Bearer Token</option>
            </select>
          </div>
        </div>

        <div className="flex gap-3 p-4 border-t border-gray-200">
          <button
            onClick={onCancel}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={!formData.name}
            className="flex-1 px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 disabled:bg-gray-400"
          >
            Add Application
          </button>
        </div>
      </div>
    </div>
  );
}

// Rules Section Component
export function RulesSection({ useCaseId, rules, setRules, slas, setSlas, markDirty }: any) {
  const [showAddRule, setShowAddRule] = useState(false);
  const [showAddSLA, setShowAddSLA] = useState(false);

  const addRule = async (ruleData: any) => {
    try {
      const newRule = await api.createRule(useCaseId, ruleData);
      setRules((prev: any) => [...prev, newRule]);
      markDirty();
      setShowAddRule(false);
    } catch (err) {
      alert('Failed to create rule');
      console.error(err);
    }
  };

  const addSLA = async (slaData: any) => {
    try {
      const newSLA = await api.createSLA(useCaseId, slaData);
      setSlas((prev: any) => [...prev, newSLA]);
      markDirty();
      setShowAddSLA(false);
    } catch (err) {
      alert('Failed to create SLA');
      console.error(err);
    }
  };

  const deleteRule = async (ruleId: string) => {
    if (!window.confirm('Delete this rule?')) return;
    
    try {
      await api.deleteRule(useCaseId, ruleId);
      setRules((prev: any) => prev.filter((r: any) => r.id !== ruleId));
      markDirty();
    } catch (err) {
      alert('Failed to delete rule');
      console.error(err);
    }
  };

  const deleteSLA = async (slaId: string) => {
    if (!window.confirm('Delete this SLA?')) return;
    
    try {
      await api.deleteSLA(useCaseId, slaId);
      setSlas((prev: any) => prev.filter((s: any) => s.id !== slaId));
      markDirty();
    } catch (err) {
      alert('Failed to delete SLA');
      console.error(err);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Rules & SLAs</h1>
        <p className="text-gray-600">Define business rules, validation logic, and service level agreements.</p>
      </div>

      {/* Rules Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Business Rules</h2>
          <button
            onClick={() => setShowAddRule(true)}
            className="px-3 py-1.5 bg-green-500 text-white rounded hover:bg-green-600 flex items-center gap-2 text-sm"
          >
            <Plus className="w-4 h-4" />
            Add Rule
          </button>
        </div>

        {rules.length === 0 ? (
          <div className="text-center py-8 text-gray-400">
            <Shield className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <div>No rules defined yet</div>
          </div>
        ) : (
          <div className="space-y-3">
            {rules.map((rule: any) => (
              <div key={rule.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="font-semibold text-gray-900 mb-1">{rule.name}</div>
                    <div className="text-sm text-gray-600 mb-2">{rule.description}</div>
                    {rule.expression && (
                      <div className="text-xs font-mono bg-gray-50 p-2 rounded border border-gray-200">
                        {rule.expression}
                      </div>
                    )}
                  </div>
                  <button
                    onClick={() => deleteRule(rule.id)}
                    className="text-red-600 hover:text-red-800 ml-4"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* SLAs Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Service Level Agreements</h2>
          <button
            onClick={() => setShowAddSLA(true)}
            className="px-3 py-1.5 bg-blue-500 text-white rounded hover:bg-blue-600 flex items-center gap-2 text-sm"
          >
            <Plus className="w-4 h-4" />
            Add SLA
          </button>
        </div>

        {slas.length === 0 ? (
          <div className="text-center py-8 text-gray-400">
            <Activity className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <div>No SLAs defined yet</div>
          </div>
        ) : (
          <div className="space-y-3">
            {slas.map((sla: any) => (
              <div key={sla.id} className="border border-blue-200 rounded-lg p-4 bg-blue-50">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="font-semibold text-gray-900 mb-1">{sla.metric}</div>
                    <div className="text-sm text-gray-700">
                      Target: <span className="font-semibold">{sla.threshold}</span> {sla.unit}
                    </div>
                  </div>
                  <button
                    onClick={() => deleteSLA(sla.id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {showAddRule && (
        <RuleModal
          onSave={addRule}
          onCancel={() => setShowAddRule(false)}
        />
      )}

      {showAddSLA && (
        <SLAModal
          onSave={addSLA}
          onCancel={() => setShowAddSLA(false)}
        />
      )}
    </div>
  );
}

// Rule Modal
function RuleModal({ onSave, onCancel }: any) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: 'validation',
    expression: ''
  });

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full">
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold">Add Business Rule</h3>
          <button onClick={onCancel}>
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Rule Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="e.g., 3-Way Match Validation"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
            <select
              value={formData.category}
              onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            >
              <option value="validation">Validation</option>
              <option value="eligibility">Eligibility</option>
              <option value="routing">Routing</option>
              <option value="pricing">Pricing</option>
              <option value="compliance">Compliance</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="What does this rule check or enforce?"
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg resize-none"
            />
          </div>
        </div>

        <div className="flex gap-3 p-4 border-t border-gray-200">
          <button
            onClick={onCancel}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={() => formData.name && onSave(formData)}
            disabled={!formData.name}
            className="flex-1 px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 disabled:bg-gray-400"
          >
            Add Rule
          </button>
        </div>
      </div>
    </div>
  );
}

// SLA Modal
function SLAModal({ onSave, onCancel }: any) {
  const [formData, setFormData] = useState({
    metric: '',
    threshold: '',
    unit: 'minutes',
    measurement_window: '95th percentile'
  });

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-xl w-full">
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold">Add SLA</h3>
          <button onClick={onCancel}>
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Metric Name</label>
            <input
              type="text"
              value={formData.metric}
              onChange={(e) => setFormData(prev => ({ ...prev, metric: e.target.value }))}
              placeholder="e.g., Invoice Processing Time"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Threshold</label>
              <input
                type="text"
                value={formData.threshold}
                onChange={(e) => setFormData(prev => ({ ...prev, threshold: e.target.value }))}
                placeholder="60"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Unit</label>
              <select
                value={formData.unit}
                onChange={(e) => setFormData(prev => ({ ...prev, unit: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              >
                <option value="seconds">Seconds</option>
                <option value="minutes">Minutes</option>
                <option value="hours">Hours</option>
                <option value="percent">Percent</option>
              </select>
            </div>
          </div>
        </div>

        <div className="flex gap-3 p-4 border-t border-gray-200">
          <button
            onClick={onCancel}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={() => formData.metric && formData.threshold && onSave(formData)}
            disabled={!formData.metric || !formData.threshold}
            className="flex-1 px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 disabled:bg-gray-400"
          >
            Add SLA
          </button>
        </div>
      </div>
    </div>
  );
}

// Metrics Section Component
export function MetricsSection({ useCaseId, metrics, setMetrics, roiResults, setRoiResults, markDirty }: any) {
  const [saving, setSaving] = useState(false);

  const updateMetric = (field: string, value: any) => {
    setMetrics((prev: any) => ({ ...prev, [field]: parseFloat(value) || 0 }));
    markDirty();
  };

  const saveMetrics = async () => {
    try {
      setSaving(true);
      await api.updateMetrics(useCaseId, {
        baseline_volume: metrics.baselineVolume,
        avg_handling_time_minutes: metrics.avgHandlingTime,
        fte_cost_per_hour: metrics.fteCost,
        error_rate: metrics.errorRate,
        breach_cost_usd: metrics.breachCost
      });
      
      // Reload ROI results (auto-calculated by trigger)
      const roi = await api.getROI(useCaseId);
      setRoiResults(roi);
    } catch (err) {
      alert('Failed to save metrics');
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  // Auto-save metrics after user stops typing
  useEffect(() => {
    const timer = setTimeout(() => {
      if (metrics.baselineVolume > 0) {
        saveMetrics();
      }
    }, 2000);
    
    return () => clearTimeout(timer);
  }, [metrics]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Metrics & ROI</h1>
        <p className="text-gray-600">Quantify the current state and expected impact of automation.</p>
      </div>

      {/* Baseline Metrics */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Current State Metrics</h2>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Daily Volume
            </label>
            <input
              type="number"
              value={metrics.baselineVolume}
              onChange={(e) => updateMetric('baselineVolume', e.target.value)}
              placeholder="100"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Avg Handling Time (minutes)
            </label>
            <input
              type="number"
              value={metrics.avgHandlingTime}
              onChange={(e) => updateMetric('avgHandlingTime', e.target.value)}
              placeholder="15"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Loaded FTE Cost ($/hour)
            </label>
            <input
              type="number"
              value={metrics.fteCost}
              onChange={(e) => updateMetric('fteCost', e.target.value)}
              placeholder="50"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Error/Rework Rate (0-1)
            </label>
            <input
              type="number"
              step="0.01"
              value={metrics.errorRate}
              onChange={(e) => updateMetric('errorRate', e.target.value)}
              placeholder="0.15"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            />
          </div>

          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Cost Per Error ($)
            </label>
            <input
              type="number"
              value={metrics.breachCost}
              onChange={(e) => updateMetric('breachCost', e.target.value)}
              placeholder="500"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            />
          </div>
        </div>

        {saving && (
          <div className="mt-4 text-sm text-gray-600">
            Calculating ROI...
          </div>
        )}
      </div>

      {/* ROI Results */}
      {roiResults && (
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl shadow-sm border-2 border-green-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">💰 Projected ROI</h2>
          
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-white rounded-lg p-4 border border-green-200">
              <div className="text-sm text-gray-600 mb-1">Current Annual Cost</div>
              <div className="text-2xl font-bold text-gray-900">
                ${Math.round(roiResults.current_annual_cost_usd).toLocaleString()}
              </div>
            </div>
            
            <div className="bg-white rounded-lg p-4 border border-green-200">
              <div className="text-sm text-gray-600 mb-1">Future Annual Cost</div>
              <div className="text-2xl font-bold text-green-600">
                ${Math.round(roiResults.future_annual_cost_usd).toLocaleString()}
              </div>
            </div>
            
            <div className="bg-white rounded-lg p-4 border border-green-200">
              <div className="text-sm text-gray-600 mb-1">Annual Savings</div>
              <div className="text-2xl font-bold text-emerald-600">
                ${Math.round(roiResults.annual_savings_usd).toLocaleString()}
              </div>
            </div>
            
            <div className="bg-white rounded-lg p-4 border border-green-200">
              <div className="text-sm text-gray-600 mb-1">Payback Period</div>
              <div className="text-2xl font-bold text-blue-600">
                {roiResults.payback_months.toFixed(1)} months
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-4 border-2 border-emerald-300">
            <div className="text-sm text-gray-600 mb-1">3-Year Net Value</div>
            <div className="text-3xl font-bold text-emerald-700">
              ${Math.round(roiResults.three_year_value_usd).toLocaleString()}
            </div>
            <div className="text-xs text-gray-600 mt-2">
              Confidence: {(roiResults.confidence_score * 100).toFixed(0)}%
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Review Section Component
export function ReviewSection({ useCase, sections, readinessScore, roiResults, onExport }: any) {
  const completedSections = sections.filter((s: any) => s.complete).length;
  const totalSections = sections.length - 1;
  const isReady = completedSections >= 5;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Review & Publish</h1>
        <p className="text-gray-600">Check completeness and export your use case pack.</p>
      </div>

      {/* Completion Status */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Completion Checklist</h2>
        
        <div className="space-y-3">
          {sections.slice(0, -1).map((section: any) => {
            const Icon = section.icon;
            return (
              <div key={section.id} className="flex items-center gap-3 p-3 rounded-lg border border-gray-200">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  section.complete ? 'bg-green-100' : 'bg-gray-100'
                }`}>
                  {section.complete ? (
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  ) : (
                    <Circle className="w-5 h-5 text-gray-400" />
                  )}
                </div>
                <Icon className="w-5 h-5 text-gray-600" />
                <div className="flex-1">
                  <div className="font-medium text-gray-900">{section.label}</div>
                </div>
                {section.complete && (
                  <div className="text-xs text-green-600 font-semibold">Complete</div>
                )}
              </div>
            );
          })}
        </div>

        <div className="mt-6 pt-6 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-gray-600">Overall Progress</div>
              <div className="text-2xl font-bold text-gray-900">{completedSections} / {totalSections}</div>
            </div>
            <div className={`text-4xl font-bold ${isReady ? 'text-green-600' : 'text-gray-400'}`}>
              {Math.round((completedSections / totalSections) * 100)}%
            </div>
          </div>
        </div>
      </div>

      {/* Readiness Score */}
      {readinessScore && (
        <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl shadow-sm border-2 border-indigo-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">🎯 Readiness Assessment</h2>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white rounded-lg p-4 border border-indigo-200">
              <div className="text-sm text-gray-600 mb-1">Overall Readiness</div>
              <div className="text-3xl font-bold text-indigo-600">
                {readinessScore.overall_score}/5
              </div>
            </div>
            
            <div className="bg-white rounded-lg p-4 border border-indigo-200">
              <div className="text-sm text-gray-600 mb-1">Automation Fit</div>
              <div className="text-3xl font-bold text-purple-600">
                {readinessScore.automation_fit_score}/100
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ROI Summary */}
      {roiResults && (
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl shadow-sm border-2 border-green-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">💰 ROI Summary</h2>
          <div className="bg-white rounded-lg p-4 border border-green-200">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-sm text-gray-600 mb-1">Annual Savings</div>
                <div className="text-xl font-bold text-green-600">
                  ${Math.round(roiResults.annual_savings_usd).toLocaleString()}
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-600 mb-1">Payback</div>
                <div className="text-xl font-bold text-blue-600">
                  {roiResults.payback_months.toFixed(1)}mo
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-600 mb-1">3-Year Value</div>
                <div className="text-xl font-bold text-emerald-600">
                  ${Math.round(roiResults.three_year_value_usd).toLocaleString()}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Export Section */}
      <div className="bg-white rounded-xl shadow-sm border-2 border-gray-300 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Export Use Case Pack</h2>
        
        {isReady ? (
          <div>
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
              <div className="flex gap-3">
                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-green-900">
                  <div className="font-semibold mb-1">Ready to Export!</div>
                  <div>Your use case pack is complete and ready to be used for agent design and implementation.</div>
                </div>
              </div>
            </div>

            <button
              onClick={onExport}
              className="w-full px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg hover:from-green-600 hover:to-emerald-600 flex items-center justify-center gap-3 font-semibold text-lg shadow-lg"
            >
              <Download className="w-5 h-5" />
              Export Use Case Pack (JSON)
            </button>

            <div className="mt-4 text-center">
              <div className="text-xs text-gray-500">
                Use case ID: {useCase.id}
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex gap-3">
              <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-yellow-900">
                <div className="font-semibold mb-1">Not Ready Yet</div>
                <div>Complete at least 5 sections before exporting. You're {completedSections} / {totalSections} done!</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
