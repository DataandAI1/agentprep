import { FormEvent, useCallback, useEffect, useState } from 'react';
import AgentPrep from './components/AgentPrep';
import { api } from './components/agentPrepApi';

type UseCaseSummary = {
  id: string;
  name: string;
  status?: string;
  updated_at?: string;
  created_at?: string;
};

const OWNER_STORAGE_KEY = 'agentprep-owner-id';

function App() {
  const [ownerId, setOwnerId] = useState<string | null>(null);
  const [loadingOwner, setLoadingOwner] = useState(true);
  const [projects, setProjects] = useState<UseCaseSummary[]>([]);
  const [projectsLoading, setProjectsLoading] = useState(false);
  const [projectsError, setProjectsError] = useState<string | null>(null);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [newProjectName, setNewProjectName] = useState('');
  const [creatingProject, setCreatingProject] = useState(false);
  const [lookupProjectId, setLookupProjectId] = useState('');
  const [lookingUpProject, setLookingUpProject] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    let storedOwner = window.localStorage.getItem(OWNER_STORAGE_KEY);
    if (!storedOwner) {
      storedOwner = typeof crypto !== 'undefined' && 'randomUUID' in crypto
        ? crypto.randomUUID()
        : Math.random().toString(36).slice(2);
      window.localStorage.setItem(OWNER_STORAGE_KEY, storedOwner);
    }
    setOwnerId(storedOwner);
    setLoadingOwner(false);
  }, []);

  const fetchProjects = useCallback(async (currentOwnerId: string) => {
    setProjectsLoading(true);
    setProjectsError(null);

    try {
      const result = await api.listUseCases(currentOwnerId);
      setProjects(result || []);
    } catch (error) {
      console.error('Failed to load projects', error);
      setProjectsError('Unable to load your projects. Please try again.');
    } finally {
      setProjectsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!ownerId) return;

    const params = new URLSearchParams(window.location.search);
    const existingId = params.get('id');
    if (existingId) {
      setSelectedProjectId(existingId);
    }

    fetchProjects(ownerId);
  }, [ownerId, fetchProjects]);

  useEffect(() => {
    if (!selectedProjectId) return;

    const url = new URL(window.location.href);
    url.searchParams.set('id', selectedProjectId);
    window.history.replaceState({}, '', url.toString());
  }, [selectedProjectId]);

  const openProject = (projectId: string) => {
    setSelectedProjectId(projectId);
  };

  const handleCreateProject = async (event: FormEvent) => {
    event.preventDefault();
    if (!ownerId) return;

    setCreatingProject(true);
    setProjectsError(null);

    const trimmedName = newProjectName.trim();

    try {
      const project = await api.createUseCase({
        name: trimmedName || 'Untitled Project',
        objective: '',
        scope: '',
        ownerId,
        priority: 'medium',
        tags: [],
      });

      setProjects((prev) => [project, ...prev]);
      setNewProjectName('');
      openProject(project.id);
    } catch (error) {
      console.error('Failed to create project', error);
      setProjectsError('Could not create project. Please try again.');
    } finally {
      setCreatingProject(false);
    }
  };

  const handleLookupProject = async (event: FormEvent) => {
    event.preventDefault();
    const trimmedId = lookupProjectId.trim();
    if (!trimmedId) return;

    setLookingUpProject(true);
    setProjectsError(null);

    try {
      const project = await api.getUseCase(trimmedId);
      setProjects((prev) => {
        const existing = prev.find((item) => item.id === project.id);
        if (existing) {
          return prev.map((item) => (item.id === project.id ? { ...item, ...project } : item));
        }
        return [project, ...prev];
      });
      setLookupProjectId('');
      openProject(project.id);
    } catch (error) {
      console.error('Failed to open project', error);
      setProjectsError('Project not found. Please check the ID and try again.');
    } finally {
      setLookingUpProject(false);
    }
  };

  const handleBackToProjects = () => {
    setSelectedProjectId(null);
    const url = new URL(window.location.href);
    url.searchParams.delete('id');
    window.history.replaceState({}, '', url.toString());
    if (ownerId) {
      fetchProjects(ownerId);
    }
  };

  if (loadingOwner || !ownerId) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <div className="text-gray-600">Loading AgentPrep...</div>
        </div>
      </div>
    );
  }

  if (!selectedProjectId) {
    return (
      <div className="min-h-screen bg-gray-50 py-10 px-4">
        <div className="mx-auto max-w-5xl">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">AgentPrep Demo Projects</h1>
            <p className="mt-2 text-gray-600">
              Create a new project to capture automation requirements or open an existing one from your device or by project ID.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-[2fr,1fr]">
            <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-900">Your Projects</h2>
                <button
                  type="button"
                  onClick={() => ownerId && fetchProjects(ownerId)}
                  className="text-sm text-indigo-600 hover:text-indigo-700"
                  disabled={projectsLoading}
                >
                  Refresh
                </button>
              </div>

              {projectsError && (
                <div className="mb-4 rounded-lg bg-red-50 text-red-700 px-4 py-2 text-sm">
                  {projectsError}
                </div>
              )}

              {projectsLoading ? (
                <div className="py-10 text-center text-gray-500">Loading projects...</div>
              ) : projects.length === 0 ? (
                <div className="py-10 text-center text-gray-500">
                  No projects yet. Create your first project to get started.
                </div>
              ) : (
                <ul className="space-y-3">
                  {projects.map((project) => (
                    <li key={project.id}>
                      <button
                        type="button"
                        onClick={() => openProject(project.id)}
                        className="w-full text-left border border-gray-200 rounded-lg px-4 py-3 hover:border-indigo-400 hover:shadow-sm transition"
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="text-base font-medium text-gray-900">
                              {project.name || 'Untitled Project'}
                            </div>
                            <div className="text-sm text-gray-500">
                              ID: {project.id}
                            </div>
                          </div>
                          <div className="text-sm text-gray-500 text-right">
                            {project.status ? project.status.charAt(0).toUpperCase() + project.status.slice(1) : 'Draft'}
                            {project.updated_at && (
                              <div className="text-xs text-gray-400">
                                Updated {new Date(project.updated_at).toLocaleString()}
                              </div>
                            )}
                          </div>
                        </div>
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className="space-y-6">
              <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-3">Create a new project</h2>
                <form onSubmit={handleCreateProject} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="projectName">
                      Project name
                    </label>
                    <input
                      id="projectName"
                      type="text"
                      value={newProjectName}
                      onChange={(event) => setNewProjectName(event.target.value)}
                      placeholder="e.g., Invoice Automation"
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full rounded-lg bg-indigo-600 text-white py-2 font-medium hover:bg-indigo-700 transition disabled:opacity-70"
                    disabled={creatingProject}
                  >
                    {creatingProject ? 'Creating...' : 'Create project'}
                  </button>
                </form>
              </div>

              <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-3">Open by project ID</h2>
                <form onSubmit={handleLookupProject} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="projectId">
                      Project ID
                    </label>
                    <input
                      id="projectId"
                      type="text"
                      value={lookupProjectId}
                      onChange={(event) => setLookupProjectId(event.target.value)}
                      placeholder="Paste a shared project ID"
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full rounded-lg border border-indigo-200 text-indigo-600 py-2 font-medium hover:bg-indigo-50 transition disabled:opacity-70"
                    disabled={lookingUpProject}
                  >
                    {lookingUpProject ? 'Opening...' : 'Open project'}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-white border-b border-gray-200">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div>
            <div className="text-sm text-gray-500">AgentPrep Demo</div>
            <div className="text-base font-semibold text-gray-900">Project workspace</div>
          </div>
          <button
            onClick={handleBackToProjects}
            className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
            type="button"
          >
            Back to projects
          </button>
        </div>
      </header>
      <main className="flex-1">
        <AgentPrep ownerId={ownerId} useCaseId={selectedProjectId} />
      </main>
    </div>
  );
}

export default App;
