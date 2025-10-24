import { useEffect, useState } from 'react';
import {
  Download,
  Upload,
  ChevronRight,
  ChevronLeft,
  CheckCircle,
  Circle,
  AlertCircle,
  FileText,
  Database,
  Settings,
  Activity,
  DollarSign,
  Shield,
} from 'lucide-react';
import { StepsSection, DataSection, AppsSection, RulesSection, MetricsSection, ReviewSection } from './AgentPrepSections';
import { api } from './agentPrepApi';

type AgentPrepProps = {
  ownerId: string;
  useCaseId: string;
};

// Main Application Component
export default function AgentPrep({ ownerId, useCaseId }: AgentPrepProps) {
  const [activeSection, setActiveSection] = useState('overview');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [unsavedChanges, setUnsavedChanges] = useState(false);
  const [lastSaved, setLastSaved] = useState(new Date());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  // Core use case data
  const [useCase, setUseCase] = useState({
    id: '',
    name: '',
    objective: '',
    scope: '',
    sponsor: '',
    priority: 'medium',
    status: 'draft',
    tags: [],
    ownerId,
    created_at: new Date().toISOString()
  });

  const [processSteps, setProcessSteps] = useState<any[]>([]);
  const [roles, setRoles] = useState<any[]>([]);
  const [dataAssets, setDataAssets] = useState<any[]>([]);
  const [applications, setApplications] = useState<any[]>([]);
  const [connectors, setConnectors] = useState<any[]>([]);
  const [rules, setRules] = useState<any[]>([]);
  const [slas, setSlas] = useState<any[]>([]);
  const [metrics, setMetrics] = useState({
    baselineVolume: 0,
    avgHandlingTime: 0,
    fteCost: 0,
    errorRate: 0,
    breachCost: 0
  });

  const [roiResults, setRoiResults] = useState<any | null>(null);
  const [readinessScore, setReadinessScore] = useState<any | null>(null);

  useEffect(() => {
    setUseCase(prev => ({ ...prev, ownerId }));
  }, [ownerId]);

  useEffect(() => {
    if (!useCaseId) return;

    loadUseCase(useCaseId);
  }, [useCaseId]);

  useEffect(() => {
    if (!useCaseId) return;

    const url = new URL(window.location.href);
    url.searchParams.set('id', useCaseId);
    window.history.replaceState({}, '', url.toString());
  }, [useCaseId]);

  const loadUseCase = async (id: string) => {
    try {
      setLoading(true);
      setError(null);

      setUseCase(prev => ({
        ...prev,
        id,
      }));
      setRoles([]);
      setProcessSteps([]);
      setDataAssets([]);
      setApplications([]);
      setConnectors([]);
      setRules([]);
      setSlas([]);
      setMetrics({
        baselineVolume: 0,
        avgHandlingTime: 0,
        fteCost: 0,
        errorRate: 0,
        breachCost: 0
      });
      setRoiResults(null);
      setReadinessScore(null);

      const [
        useCaseData,
        rolesData,
        stepsData,
        assetsData,
        appsData,
        rulesData,
        slasData,
        metricsData,
        roiData,
        readinessData,
        connectorsData
      ] = await Promise.all([
        api.getUseCase(id),
        api.listRoles(id),
        api.listSteps(id),
        api.listDataAssets(id),
        api.listApplications(id),
        api.listRules(id),
        api.listSLAs(id),
        api.getMetrics(id),
        api.getROI(id),
        api.getReadiness(id),
        api.listConnectors(id)
      ]);
      
      if (useCaseData) {
        const { owner_id, ...rest } = useCaseData as Record<string, any>;
        const normalizedUseCase = {
          ...rest,
          ownerId: useCaseData.ownerId ?? owner_id ?? ownerId
        };

        setUseCase(prev => ({
          ...prev,
          ...normalizedUseCase
        }));
      }
      setRoles(rolesData);
      setProcessSteps(organizeStepsHierarchy(stepsData));
      setDataAssets(assetsData);
      setApplications(appsData);
      setConnectors(connectorsData);
      setRules(rulesData);
      setSlas(slasData);
      
      if (metricsData) {
        setMetrics({
          baselineVolume: metricsData.baseline_volume || 0,
          avgHandlingTime: metricsData.avg_handling_time_minutes || 0,
          fteCost: metricsData.fte_cost_per_hour || 0,
          errorRate: metricsData.error_rate || 0,
          breachCost: metricsData.breach_cost_usd || 0
        });
      }
      
      setRoiResults(roiData);
      setReadinessScore(readinessData);
      setLastSaved(new Date());
    } catch (err) {
      setError('Failed to load use case');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const organizeStepsHierarchy = (flatSteps: any[]) => {
    const stepMap = new Map<string, any>();
    const rootSteps: any[] = [];
    
    flatSteps.forEach(step => {
      stepMap.set(step.id, { ...step, substeps: [] });
    });
    
    flatSteps.forEach(step => {
      const stepWithChildren = stepMap.get(step.id);
      if (step.parent_id) {
        const parent = stepMap.get(step.parent_id);
        if (parent) {
          parent.substeps.push(stepWithChildren);
        }
      } else {
        rootSteps.push(stepWithChildren);
      }
    });
    
    return rootSteps;
  };

  useEffect(() => {
    if (!useCase.id || !unsavedChanges) return;
    
    const timer = setTimeout(() => {
      handleSave();
    }, 3000);
    
    return () => clearTimeout(timer);
  }, [unsavedChanges, useCase]);

  const handleSave = async () => {
    if (!useCase.id) return;
    
    try {
      setSaving(true);
      await api.updateUseCase(useCase.id, {
        name: useCase.name,
        objective: useCase.objective,
        scope: useCase.scope,
        sponsor: useCase.sponsor,
        priority: useCase.priority,
        status: useCase.status,
        tags: useCase.tags
      });
      
      setLastSaved(new Date());
      setUnsavedChanges(false);
    } catch (err) {
      console.error('Auto-save failed:', err);
    } finally {
      setSaving(false);
    }
  };

  const markDirty = () => {
    setUnsavedChanges(true);
  };

  const sections = [
    { id: 'overview', label: 'Overview', icon: FileText, complete: useCase.name && useCase.objective && useCase.scope },
    { id: 'steps', label: 'Process Steps', icon: Activity, complete: processSteps.length >= 3 },
    { id: 'data', label: 'Data Assets', icon: Database, complete: dataAssets.length >= 1 },
    { id: 'apps', label: 'Apps & Connectors', icon: Settings, complete: applications.length >= 1 },
    { id: 'rules', label: 'Rules & SLAs', icon: Shield, complete: rules.length >= 1 || slas.length >= 1 },
    { id: 'metrics', label: 'Metrics & ROI', icon: DollarSign, complete: metrics.baselineVolume > 0 },
    { id: 'review', label: 'Review & Publish', icon: CheckCircle, complete: false }
  ];

  const exportUseCasePack = async () => {
    if (!useCase.id) return;
    
    try {
      const pack = await api.exportUseCase(useCase.id);
      
      const blob = new Blob([JSON.stringify(pack, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `usecase-${useCase.id}.json`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      alert('Failed to export use case');
      console.error(err);
    }
  };

  const importUseCasePack = async (e: any) => {
    const file = e.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const fileContent = event.target?.result;
        if (!fileContent) {
          throw new Error('Unable to read use case file');
        }

        const pack = JSON.parse(fileContent as string);
        const result = await api.importUseCase(pack, ownerId);

        alert('Use case imported successfully!');
        window.location.href = `?id=${result.id}`;
      } catch (err) {
        alert('Invalid use case file or import failed');
        console.error(err);
      }
    };
    reader.readAsText(file);
  };

  const getCompletionPercentage = () => {
    const completed = sections.filter(s => s.complete).length;
    return Math.round((completed / sections.length) * 100);
  };

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <div className="text-gray-600">Loading use case...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-md">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <div className="text-xl font-semibold text-gray-900 mb-2">Error Loading Use Case</div>
          <div className="text-gray-600 mb-4">{error}</div>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      <div className="h-14 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white flex items-center justify-between px-4 shadow-lg">
        <div className="flex items-center gap-3">
          <div className="text-xl font-bold">AgentPrep</div>
          <div className="text-sm opacity-80">Use Case Collector</div>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="text-sm">
            {useCase.name || 'Untitled Use Case'} • {useCase.status === 'draft' ? 'Draft' : 'Ready'}
          </div>
          <div className="text-xs opacity-75">
            {saving ? 'Saving...' : unsavedChanges ? 'Unsaved changes' : `Saved ${lastSaved.toLocaleTimeString()}`}
          </div>
          <div className="flex gap-2">
            <label className="px-3 py-1.5 bg-indigo-500 hover:bg-indigo-400 rounded flex items-center gap-2 text-sm cursor-pointer transition">
              <Upload className="w-4 h-4" />
              Import
              <input type="file" accept=".json" onChange={importUseCasePack} className="hidden" />
            </label>
            <button 
              onClick={exportUseCasePack}
              disabled={!useCase.name}
              className="px-3 py-1.5 bg-green-500 hover:bg-green-600 disabled:bg-gray-400 rounded flex items-center gap-2 text-sm transition"
            >
              <Download className="w-4 h-4" />
              Export
            </button>
          </div>
        </div>
      </div>

      <div className="h-2 bg-gray-200">
        <div 
          className="h-full bg-gradient-to-r from-green-400 to-green-500 transition-all duration-500"
          style={{ width: `${getCompletionPercentage()}%` }}
        />
      </div>

      <div className="flex-1 flex overflow-hidden">
        <div className={`${sidebarOpen ? 'w-64' : 'w-0'} bg-white border-r border-gray-200 flex flex-col transition-all duration-300 overflow-hidden`}>
          <div className="flex items-center justify-between p-3 border-b border-gray-200">
            <div className="font-semibold text-gray-700">Sections</div>
            <button onClick={() => setSidebarOpen(false)}>
              <ChevronLeft className="w-5 h-5 text-gray-500" />
            </button>
          </div>
          
          <div className="flex-1 overflow-y-auto p-3 space-y-1">
            {sections.map((section) => {
              const Icon = section.icon;
              return (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded transition ${
                    activeSection === section.id
                      ? 'bg-indigo-50 text-indigo-700'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="flex-1 text-left text-sm">{section.label}</span>
                  {section.complete ? (
                    <CheckCircle className="w-4 h-4 text-green-500" />
                  ) : (
                    <Circle className="w-4 h-4 text-gray-300" />
                  )}
                </button>
              );
            })}
          </div>

          <div className="p-3 border-t border-gray-200 bg-gradient-to-br from-indigo-50 to-purple-50">
            <div className="text-xs font-semibold text-gray-700 mb-2">Completion</div>
            <div className="text-2xl font-bold text-indigo-600 mb-1">{getCompletionPercentage()}%</div>
            <div className="text-xs text-gray-600">
              {sections.filter(s => s.complete).length} of {sections.length} sections
            </div>
          </div>
        </div>

        {!sidebarOpen && (
          <button 
            onClick={() => setSidebarOpen(true)}
            className="absolute left-0 top-20 bg-white border border-gray-200 rounded-r p-1 shadow z-10 hover:bg-gray-50"
          >
            <ChevronRight className="w-5 h-5 text-gray-500" />
          </button>
        )}

        <div className="flex-1 overflow-y-auto">
          <div className="w-full px-8 py-6 max-w-[1600px] mx-auto">
            {activeSection === 'overview' && (
              <OverviewSection 
                useCase={useCase} 
                setUseCase={setUseCase} 
                markDirty={markDirty}
              />
            )}
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
            {activeSection === 'data' && (
              <DataSection 
                useCaseId={useCase.id}
                dataAssets={dataAssets}
                setDataAssets={setDataAssets}
                markDirty={markDirty}
              />
            )}
            {activeSection === 'apps' && (
              <AppsSection 
                useCaseId={useCase.id}
                applications={applications}
                setApplications={setApplications}
                connectors={connectors}
                setConnectors={setConnectors}
                markDirty={markDirty}
              />
            )}
            {activeSection === 'rules' && (
              <RulesSection 
                useCaseId={useCase.id}
                rules={rules}
                setRules={setRules}
                slas={slas}
                setSlas={setSlas}
                markDirty={markDirty}
              />
            )}
            {activeSection === 'metrics' && (
              <MetricsSection 
                useCaseId={useCase.id}
                metrics={metrics}
                setMetrics={setMetrics}
                roiResults={roiResults}
                setRoiResults={setRoiResults}
                markDirty={markDirty}
              />
            )}
            {activeSection === 'review' && (
              <ReviewSection 
                useCase={useCase}
                sections={sections}
                readinessScore={readinessScore}
                roiResults={roiResults}
                onExport={exportUseCasePack}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Overview Section Component
function OverviewSection({ useCase, setUseCase, markDirty }: any) {
  const updateField = (field: string, value: any) => {
    setUseCase((prev: any) => ({ ...prev, [field]: value }));
    markDirty();
  };

  const exampleObjectives = [
    "Reduce manual invoice processing time by 70% with automated 3-way matching",
    "Automate customer onboarding KYC checks to improve turnaround from 3 days to 4 hours",
    "Streamline quote approval process with intelligent routing and pre-validation"
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Use Case Overview</h1>
        <p className="text-gray-600">Start by describing what you want to automate and why it matters.</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Use Case Name *
          </label>
          <input
            type="text"
            value={useCase.name}
            onChange={(e) => updateField('name', e.target.value)}
            placeholder="e.g., Invoice Processing Automation"
            className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Objective *
          </label>
          <textarea
            value={useCase.objective}
            onChange={(e) => updateField('objective', e.target.value)}
            placeholder="What business problem are you solving? What value will automation deliver?"
            rows={4}
            className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 resize-none"
          />
          <div className="mt-3 p-3 bg-gray-50 border border-gray-200 rounded-lg">
            <div className="text-xs font-medium text-gray-700 mb-2">Example Objectives:</div>
            <div className="space-y-1.5">
              {exampleObjectives.map((ex, i) => (
                <div key={i} className="text-xs text-gray-600">• {ex}</div>
              ))}
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Scope & Boundaries *
          </label>
          <textarea
            value={useCase.scope}
            onChange={(e) => updateField('scope', e.target.value)}
            placeholder="What's included? What's excluded? Any constraints or limitations?"
            rows={3}
            className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 resize-none"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Business Sponsor
            </label>
            <input
              type="text"
              value={useCase.sponsor}
              onChange={(e) => updateField('sponsor', e.target.value)}
              placeholder="e.g., Director of Finance Ops"
              className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Priority
            </label>
            <select
              value={useCase.priority}
              onChange={(e) => updateField('priority', e.target.value)}
              className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="critical">Critical</option>
            </select>
          </div>
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex gap-3">
          <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-blue-800">
            <div className="font-semibold mb-1">Quick Tip</div>
            <div>Be specific about your objective. Good objectives are measurable and time-bound. For example: "Reduce quote processing time from 2 hours to 15 minutes" is better than "Make quotes faster."</div>
          </div>
        </div>
      </div>
    </div>
  );
}