import React, { useState, useEffect } from 'react';
import { Settings, Save, TestTube, AlertCircle, CheckCircle, XCircle } from 'lucide-react';

const LLMSettings = () => {
  const [config, setConfig] = useState({
    enabled: false,
    mode: 'demo', // 'demo', 'api'
    provider: 'anthropic', // 'anthropic', 'openai', 'custom'
    apiKey: '',
    model: 'claude-sonnet-4-20250514',
    temperature: 0.7,
    maxTokens: 4000,
    endpoint: '', // For custom providers
  });

  const [testStatus, setTestStatus] = useState<any>(null);
  const [isTesting, setIsTesting] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    // Load saved configuration
    const savedConfig = localStorage.getItem('llm_config');
    if (savedConfig) {
      setConfig(JSON.parse(savedConfig));
    }
  }, []);

  const handleSave = () => {
    localStorage.setItem('llm_config', JSON.stringify(config));
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleTest = async () => {
    setIsTesting(true);
    setTestStatus(null);

    if (config.mode === 'demo') {
      setTimeout(() => {
        setTestStatus({ success: true, message: 'Demo mode enabled - using mock responses' });
        setIsTesting(false);
      }, 1000);
      return;
    }

    try {
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': config.apiKey,
          'anthropic-version': '2023-06-01'
        },
        body: JSON.stringify({
          model: config.model,
          max_tokens: 100,
          messages: [{ role: 'user', content: 'Test connection' }]
        })
      });

      if (response.ok) {
        setTestStatus({ success: true, message: 'Connection successful!' });
      } else {
        const error = await response.json();
        setTestStatus({ success: false, message: error.error?.message || 'Connection failed' });
      }
    } catch (error: any) {
      setTestStatus({ success: false, message: error.message });
    } finally {
      setIsTesting(false);
    }
  };

  const models = {
    anthropic: [
      'claude-sonnet-4-20250514',
      'claude-opus-4-20250514',
      'claude-3-5-sonnet-20241022',
      'claude-3-opus-20240229'
    ],
    openai: [
      'gpt-4-turbo-preview',
      'gpt-4',
      'gpt-3.5-turbo'
    ]
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="flex items-center gap-3 mb-6">
            <Settings className="w-8 h-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-800">LLM Configuration</h1>
          </div>

          <div className="space-y-6">
            {/* Enable/Disable Toggle */}
            <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
              <div>
                <h3 className="font-semibold text-gray-800">Enable LLM Features</h3>
                <p className="text-sm text-gray-600">
                  Enable AI-powered suggestions and analysis throughout the application
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={config.enabled}
                  onChange={(e) => setConfig({ ...config, enabled: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-14 h-7 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>

            {config.enabled && (
              <>
                {/* Mode Selection */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">Operation Mode</label>
                  <div className="grid grid-cols-2 gap-4">
                    <button
                      onClick={() => setConfig({ ...config, mode: 'demo' })}
                      className={`p-4 rounded-lg border-2 transition-all ${
                        config.mode === 'demo'
                          ? 'border-blue-600 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <h4 className="font-semibold text-gray-800">Demo Mode</h4>
                      <p className="text-sm text-gray-600 mt-1">
                        Use mock responses for testing (no API required)
                      </p>
                    </button>
                    <button
                      onClick={() => setConfig({ ...config, mode: 'api' })}
                      className={`p-4 rounded-lg border-2 transition-all ${
                        config.mode === 'api'
                          ? 'border-blue-600 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <h4 className="font-semibold text-gray-800">API Mode</h4>
                      <p className="text-sm text-gray-600 mt-1">
                        Connect to real LLM API for production use
                      </p>
                    </button>
                  </div>
                </div>

                {config.mode === 'api' && (
                  <>
                    {/* Provider Selection */}
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-gray-700">Provider</label>
                      <select
                        value={config.provider}
                        onChange={(e) => setConfig({ 
                          ...config, 
                          provider: e.target.value as any,
                          model: (models as any)[e.target.value]?.[0] || ''
                        })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="anthropic">Anthropic (Claude)</option>
                        <option value="openai">OpenAI (GPT)</option>
                        <option value="custom">Custom Endpoint</option>
                      </select>
                    </div>

                    {/* API Key */}
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-gray-700">API Key</label>
                      <input
                        type="password"
                        value={config.apiKey}
                        onChange={(e) => setConfig({ ...config, apiKey: e.target.value })}
                        placeholder="sk-ant-..."
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                      <p className="text-xs text-gray-500">
                        Your API key is stored locally and never sent to our servers
                      </p>
                    </div>

                    {/* Custom Endpoint */}
                    {config.provider === 'custom' && (
                      <div className="space-y-2">
                        <label className="block text-sm font-semibold text-gray-700">API Endpoint</label>
                        <input
                          type="url"
                          value={config.endpoint}
                          onChange={(e) => setConfig({ ...config, endpoint: e.target.value })}
                          placeholder="https://api.example.com/v1/chat"
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                    )}

                    {/* Model Selection */}
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-gray-700">Model</label>
                      <select
                        value={config.model}
                        onChange={(e) => setConfig({ ...config, model: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        {((models as any)[config.provider] || []).map((model: string) => (
                          <option key={model} value={model}>{model}</option>
                        ))}
                      </select>
                    </div>

                    {/* Advanced Settings */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="block text-sm font-semibold text-gray-700">
                          Temperature ({config.temperature})
                        </label>
                        <input
                          type="range"
                          min="0"
                          max="1"
                          step="0.1"
                          value={config.temperature}
                          onChange={(e) => setConfig({ ...config, temperature: parseFloat(e.target.value) })}
                          className="w-full"
                        />
                        <p className="text-xs text-gray-500">Controls randomness in responses</p>
                      </div>

                      <div className="space-y-2">
                        <label className="block text-sm font-semibold text-gray-700">Max Tokens</label>
                        <input
                          type="number"
                          value={config.maxTokens}
                          onChange={(e) => setConfig({ ...config, maxTokens: parseInt(e.target.value) })}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                        <p className="text-xs text-gray-500">Maximum response length</p>
                      </div>
                    </div>

                    {/* Test Connection */}
                    <div className="space-y-2">
                      <button
                        onClick={handleTest}
                        disabled={!config.apiKey || isTesting}
                        className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                      >
                        <TestTube className="w-5 h-5" />
                        {isTesting ? 'Testing...' : 'Test Connection'}
                      </button>

                      {testStatus && (
                        <div className={`flex items-center gap-2 p-3 rounded-lg ${
                          testStatus.success ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
                        }`}>
                          {testStatus.success ? (
                            <CheckCircle className="w-5 h-5" />
                          ) : (
                            <XCircle className="w-5 h-5" />
                          )}
                          <span className="text-sm">{testStatus.message}</span>
                        </div>
                      )}
                    </div>
                  </>
                )}
              </>
            )}

            {/* Save Button */}
            <div className="flex items-center gap-4 pt-4 border-t">
              <button
                onClick={handleSave}
                className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Save className="w-5 h-5" />
                Save Configuration
              </button>

              {saved && (
                <div className="flex items-center gap-2 text-green-600">
                  <CheckCircle className="w-5 h-5" />
                  <span className="text-sm font-medium">Settings saved!</span>
                </div>
              )}
            </div>

            {/* Feature Usage Info */}
            {config.enabled && (
              <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-amber-800 mb-1">
                      LLM Features Enabled
                    </h4>
                    <p className="text-sm text-amber-700 mt-1">
                      AI assistance will be available in:
                    </p>
                    <ul className="text-sm text-amber-700 mt-2 space-y-1 ml-4 list-disc">
                      <li>Process step suggestions and optimization</li>
                      <li>Data asset field inference</li>
                      <li>Business rule generation</li>
                      <li>ROI analysis enhancement</li>
                      <li>SimLab agent behavior simulation</li>
                      <li>Use case completeness checking</li>
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LLMSettings;