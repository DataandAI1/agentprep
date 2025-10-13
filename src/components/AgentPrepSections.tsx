// AgentPrep Section Components - Part 2
// Copy these components into the main AgentPrep.tsx file after the OverviewSection component

import React, { useState } from 'react';
import { Plus, Trash2, X, Activity, Database, Settings, Shield, DollarSign, CheckCircle, Circle, AlertCircle } from 'lucide-react';

// Steps Section Component
function StepsSection({ useCaseId, processSteps, setProcessSteps, roles, setRoles, markDirty }: any) {
  const [showAddStep, setShowAddStep] = useState(false);
  const [showAddRole, setShowAddRole] = useState(false);
  const [selectedParent, setSelectedParent] = useState(null);

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
    <div className=\"space-y-6\">
      <div>
        <h1 className=\"text-3xl font-bold text-gray-900 mb-2\">Process Steps</h1>
        <p className=\"text-gray-600\">Map out the workflow from trigger to completion.</p>
      </div>

      {/* Roles Section */}
      <div className=\"bg-white rounded-xl shadow-sm border border-gray-200 p-6\">
        <div className=\"flex items-center justify-between mb-4\">
          <h2 className=\"text-lg font-semibold text-gray-900\">Roles / Lanes</h2>
          <button
            onClick={() => setShowAddRole(true)}
            className=\"px-3 py-1.5 bg-indigo-500 text-white rounded hover:bg-indigo-600 flex items-center gap-2 text-sm\"
          >
            <Plus className=\"w-4 h-4\" />
            Add Role
          </button>
        </div>

        {roles.length === 0 ? (
          <div className=\"text-center py-8 text-gray-400\">
            <Activity className=\"w-12 h-12 mx-auto mb-3 opacity-50\" />
            <div>No roles defined yet. Add roles like \"Customer Service\", \"Agent\", \"Manager\"</div>
          </div>
        ) : (
          <div className=\"flex flex-wrap gap-2\">
            {roles.map((role: any) => (
              <div key={role.id} className=\"px-3 py-1.5 bg-indigo-50 border border-indigo-200 rounded-full text-sm text-indigo-700 flex items-center gap-2\">
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
                  <X className=\"w-3 h-3\" />
                </button>
              </div>
            ))}
          </div>
        )}

        {showAddRole && (
          <div className=\"mt-3 flex gap-2\">
            <input
              type=\"text\"
              placeholder=\"Role name (e.g., AP Clerk, Agent)\"
              className=\"flex-1 px-3 py-2 border border-gray-300 rounded text-sm\"
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
              className=\"px-3 py-2 border border-gray-300 rounded text-sm\"
            >
              Cancel
            </button>
          </div>
        )}
      </div>

      {/* Steps Section */}
      <div className=\"bg-white rounded-xl shadow-sm border border-gray-200 p-6\">
        <div className=\"flex items-center justify-between mb-4\">
          <h2 className=\"text-lg font-semibold text-gray-900\">Steps</h2>
          <button
            onClick={() => {
              setSelectedParent(null);
              setShowAddStep(true);
            }}
            disabled={roles.length === 0}
            className=\"px-3 py-1.5 bg-green-500 text-white rounded hover:bg-green-600 disabled:bg-gray-400 flex items-center gap-2 text-sm\"
          >
            <Plus className=\"w-4 h-4\" />
            Add Step
          </button>
        </div>

        {roles.length === 0 && (
          <div className=\"bg-yellow-50 border border-yellow-200 rounded-lg p-3 text-sm text-yellow-800 mb-4\">
            Add at least one role before creating steps
          </div>
        )}

        {processSteps.length === 0 ? (
          <div className=\"text-center py-12 text-gray-400\">
            <Activity className=\"w-16 h-16 mx-auto mb-4 opacity-50\" />
            <div className=\"mb-4\">No steps defined yet</div>
          </div>
        ) : (
          <div className=\"space-y-3\">
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
    <div className=\"border-2 border-gray-200 rounded-lg\">
      <div className={`p-4 ${template?.color || 'bg-gray-100'} rounded-t-lg ${!hasSubsteps ? 'rounded-b-lg' : ''}`}>
        <div className=\"flex items-start gap-3\">
          <div className=\"w-10 h-10 rounded-full bg-white border-2 border-gray-300 flex items-center justify-center text-sm font-bold flex-shrink-0\">
            {index + 1}
          </div>

          <div className=\"flex-1\">
            <div className=\"flex items-start justify-between mb-2\">
              <div>
                <div className=\"font-semibold text-gray-900 text-lg\">{step.title}</div>
                <div className=\"text-xs text-gray-600 mt-1\">{step.role} \u2022 {step.type}</div>
              </div>
              <div className=\"flex items-center gap-2\">
                {hasSubsteps && (
                  <button
                    onClick={() => setExpanded(!expanded)}
                    className=\"px-2 py-1 bg-white border border-gray-300 rounded text-xs hover:bg-gray-50\"
                  >
                    {expanded ? '\u25BC' : '\u25B6'} {step.substeps.length} substep{step.substeps.length !== 1 ? 's' : ''}
                  </button>
                )}
                <button
                  onClick={() => onAddSubstep(step.id)}
                  className=\"px-2 py-1 bg-white border border-green-500 text-green-600 rounded text-xs hover:bg-green-50\"
                >
                  + Substep
                </button>
                <button
                  onClick={() => onDelete(step.id)}
                  className=\"text-red-600 hover:text-red-800\"
                >
                  <Trash2 className=\"w-4 h-4\" />
                </button>
              </div>
            </div>
            
            {step.description && (
              <div className=\"text-sm text-gray-700 mb-2\">{step.description}</div>
            )}
          </div>
        </div>
      </div>

      {hasSubsteps && expanded && (
        <div className=\"bg-gray-50 p-4 rounded-b-lg border-t-2 border-gray-200\">
          <div className=\"space-y-2 ml-8\">
            {step.substeps.map((substep: any, subIdx: number) => (
              <div key={substep.id} className=\"border border-gray-300 rounded-lg p-3 bg-white\">
                <div className=\"flex items-start gap-3\">
                  <div className=\"w-7 h-7 rounded-full bg-gray-200 border border-gray-300 flex items-center justify-center text-xs font-semibold\">
                    {index + 1}.{subIdx + 1}
                  </div>
                  <div className=\"flex-1\">
                    <div className=\"flex items-start justify-between\">
                      <div>
                        <div className=\"font-medium text-gray-900\">{substep.title}</div>
                        <div className=\"text-xs text-gray-600\">{substep.type}</div>
                      </div>
                      <button
                        onClick={() => onDeleteSubstep(step.id, substep.id)}
                        className=\"text-red-600 hover:text-red-800\"
                      >
                        <Trash2 className=\"w-3 h-3\" />
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
    <div className=\"fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4\">
      <div className=\"bg-white rounded-xl shadow-xl max-w-2xl w-full\">
        <div className=\"flex items-center justify-between p-4 border-b border-gray-200\">
          <h3 className=\"text-lg font-semibold\">Add Process Step</h3>
          <button onClick={onCancel}>
            <X className=\"w-5 h-5 text-gray-500\" />
          </button>
        </div>

        <div className=\"p-6 space-y-4\">
          <div>
            <label className=\"block text-sm font-medium text-gray-700 mb-2\">Step Type</label>
            <div className=\"grid grid-cols-5 gap-2\">
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
                  <div className=\"text-xs font-semibold mb-1\">{template.label}</div>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className=\"block text-sm font-medium text-gray-700 mb-2\">Assigned Role</label>
            <select
              value={formData.role}
              onChange={(e) => setFormData(prev => ({ ...prev, role: e.target.value }))}
              className=\"w-full px-3 py-2 border border-gray-300 rounded-lg\"
            >
              {roles.map((role: any) => (
                <option key={role.id} value={role.name}>{role.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className=\"block text-sm font-medium text-gray-700 mb-2\">Step Title</label>
            <input
              type=\"text\"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              placeholder=\"e.g., Extract invoice data from PDF\"
              className=\"w-full px-3 py-2 border border-gray-300 rounded-lg\"
            />
          </div>

          <div>
            <label className=\"block text-sm font-medium text-gray-700 mb-2\">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder=\"What happens in this step?\"
              rows={3}
              className=\"w-full px-3 py-2 border border-gray-300 rounded-lg resize-none\"
            />
          </div>
        </div>

        <div className=\"flex gap-3 p-4 border-t border-gray-200\">
          <button
            onClick={onCancel}
            className=\"flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50\"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={!formData.title || !formData.role}
            className=\"flex-1 px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 disabled:bg-gray-400\"
          >
            Add Step
          </button>
        </div>
      </div>
    </div>
  );
}

// Continue with remaining sections in next file...
export { StepsSection, StepCard, StepFormModal };