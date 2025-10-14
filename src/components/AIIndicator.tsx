import React, { useState, useEffect } from 'react';

const AIIndicator = () => {
  const [config, setConfig] = useState<any>(null);

  useEffect(() => {
    const loadConfig = () => {
      const saved = localStorage.getItem('llm_config');
      if (saved) {
        setConfig(JSON.parse(saved));
      }
    };
    
    loadConfig();
    
    // Listen for config changes
    window.addEventListener('storage', loadConfig);
    return () => window.removeEventListener('storage', loadConfig);
  }, []);

  if (!config?.enabled) return null;

  return (
    <div className="fixed top-4 right-4 px-3 py-2 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-full shadow-lg text-sm font-medium flex items-center gap-2 z-50">
      <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
      {config.mode === 'demo' ? 'AI Demo Mode' : 'AI Enabled'}
    </div>
  );
};

export default AIIndicator;