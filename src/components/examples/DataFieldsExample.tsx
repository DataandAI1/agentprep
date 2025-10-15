import React, { useState } from 'react';
import { Sparkles, Loader, CheckCircle, Database, Shield } from 'lucide-react';
import { llmService } from '../../services/llm-service';

/**
 * DataFieldsExample Component
 * 
 * Demonstrates how to integrate AI-powered data field inference
 * into your data asset components.
 * 
 * Key Features:
 * - Automatically infer fields for data assets
 * - PII detection
 * - Data type suggestions
 * - Field requirements
 */

interface DataField {
  name: string;
  type: string;
  description: string;
  isPII: boolean;
  isRequired: boolean;
}

interface DataAsset {
  id: string;
  name: string;
  system: string;
  object_type: 'table' | 'api' | 'file' | 'event';
  fields: DataField[];
}

const DataFieldsExample: React.FC = () => {
  const [assets, setAssets] = useState<DataAsset[]>([
    {
      id: '1',
      name: 'customers',
      system: 'PostgreSQL',
      object_type: 'table',
      fields: []
    },
    {
      id: '2',
      name: 'orders',
      system: 'MySQL',
      object_type: 'table',
      fields: []
    }
  ]);

  const [inferringFor, setInferringFor] = useState<string | null>(null);
  const [status, setStatus] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);

  const llmEnabled = llmService.isEnabled();

  /**
   * Handler: Infer Fields for an Asset
   */
  const handleInferFields = async (asset: DataAsset) => {
    setInferringFor(asset.id);
    setStatus(null);

    try {
      const response = await llmService.inferDataFields({
        assetName: asset.name,
        sourceSystem: asset.system,
        objectType: asset.object_type
      });

      if (response.success) {
        // Update the asset with inferred fields
        setAssets(assets.map(a =>
          a.id === asset.id
            ? { ...a, fields: response.data }
            : a
        ));

        setStatus({
          type: 'success',
          message: `Inferred ${response.data.length} fields (${response.tokens} tokens)`
        });

        setTimeout(() => setStatus(null), 3000);
      } else {
        setStatus({
          type: 'error',
          message: response.error || 'Failed to infer fields'
        });
      }
    } catch (error) {
      setStatus({
        type: 'error',
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    } finally {
      setInferringFor(null);
    }
  };

  /**
   * Handler: Remove a Field
   */
  const handleRemoveField = (assetId: string, fieldName: string) => {
    setAssets(assets.map(asset =>
      asset.id === assetId
        ? {
            ...asset,
            fields: asset.fields.filter(f => f.name !== fieldName)
          }
        : asset
    ));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-800">
          Data Assets ({assets.length})
        </h2>
      </div>

      {/* Status Message */}
      {status && (
        <div
          className={`p-3 rounded-lg flex items-center gap-2 ${
            status.type === 'success'
              ? 'bg-green-50 text-green-800 border border-green-200'
              : 'bg-red-50 text-red-800 border border-red-200'
          }`}
        >
          <CheckCircle className="w-5 h-5" />
          <span className="text-sm font-medium">{status.message}</span>
        </div>
      )}

      {/* Assets List */}
      <div className="space-y-4">
        {assets.map(asset => (
          <div
            key={asset.id}
            className="border border-gray-200 rounded-lg p-6 bg-white hover:border-blue-300 transition-colors"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <Database className="w-6 h-6 text-blue-600" />
                <div>
                  <h3 className="font-semibold text-gray-800 text-lg">{asset.name}</h3>
                  <p className="text-sm text-gray-600">
                    {asset.system} • {asset.object_type}
                  </p>
                </div>
              </div>

              {/* Infer Fields Button */}
              {llmEnabled && asset.fields.length === 0 && (
                <button
                  onClick={() => handleInferFields(asset)}
                  disabled={inferringFor === asset.id}
                  className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 disabled:from-gray-400 disabled:to-gray-400 transition-all shadow-md"
                >
                  {inferringFor === asset.id ? (
                    <>
                      <Loader className="w-4 h-4 animate-spin" />
                      Inferring...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      Infer Fields
                    </>
                  )}
                </button>
              )}
            </div>

            {/* Fields Display */}
            {asset.fields.length > 0 ? (
              <div className="space-y-2">
                <h4 className="text-sm font-semibold text-gray-700 mb-3">
                  Fields ({asset.fields.length})
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {asset.fields.map((field, idx) => (
                    <div
                      key={idx}
                      className="p-3 bg-gray-50 rounded border border-gray-200 hover:border-gray-300 transition-colors"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-medium text-gray-800 text-sm">
                              {field.name}
                            </span>
                            <span className="text-xs text-gray-500">({field.type})</span>
                            {field.isPII && (
                              <span className="px-2 py-0.5 text-xs bg-red-100 text-red-800 rounded flex items-center gap-1">
                                <Shield className="w-3 h-3" />
                                PII
                              </span>
                            )}
                            {field.isRequired && (
                              <span className="px-2 py-0.5 text-xs bg-blue-100 text-blue-800 rounded">
                                Required
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-gray-600">{field.description}</p>
                        </div>
                        <button
                          onClick={() => handleRemoveField(asset.id, field.name)}
                          className="ml-2 text-gray-400 hover:text-red-600 transition-colors"
                          title="Remove field"
                        >
                          ×
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Re-infer Button */}
                {llmEnabled && (
                  <button
                    onClick={() => handleInferFields(asset)}
                    disabled={inferringFor === asset.id}
                    className="mt-3 text-sm text-purple-600 hover:text-purple-800 underline"
                  >
                    Re-infer Fields
                  </button>
                )}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-400">
                <Database className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p className="text-sm">No fields defined yet</p>
                {llmEnabled && (
                  <p className="text-xs mt-1">Click "Infer Fields" to get AI suggestions</p>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Info Box */}
      {!llmEnabled && (
        <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
          <div className="flex items-start gap-3">
            <Sparkles className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-semibold text-amber-900 mb-1">AI Field Inference Available</h4>
              <p className="text-sm text-amber-800">
                Enable LLM features to automatically infer data fields with PII detection and type suggestions.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DataFieldsExample;