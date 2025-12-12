import { useState } from 'react';
import { X, Settings } from 'lucide-react';
import type { InfrastructureAddon } from '../data/marketplaceBlocks';
import { CodeHighlight } from './CodeHighlight';

interface AddonViewerProps {
  addon: InfrastructureAddon;
  onClose: () => void;
}

export function AddonViewer({ addon, onClose }: AddonViewerProps) {
  const [selectedTab, setSelectedTab] = useState<'crd' | 'operator'>('crd');

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-[#1e1e1e] border border-[#3e3e42] rounded-lg w-full max-w-5xl max-h-[90vh] flex flex-col shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-[#3e3e42]">
          <div className="flex items-center gap-3">
            <Settings className="w-5 h-5 text-[#4ec9b0]" />
            <div>
              <h2 className="text-lg font-semibold text-[#cccccc]">{addon.icon} {addon.name}</h2>
              <p className="text-sm text-[#858585]">{addon.description}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-[#2d2d2d] rounded text-[#858585] hover:text-[#cccccc]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Purpose Badge */}
        <div className="px-4 py-2 bg-[#252526] border-b border-[#3e3e42]">
          <div className="flex items-center gap-2">
            <span className="text-xs text-[#858585]">Purpose:</span>
            <span className="px-2 py-1 bg-[#4ec9b0]/20 text-[#4ec9b0] text-xs rounded">
              {addon.purpose}
            </span>
            <span className="text-xs text-[#858585] ml-4">Type:</span>
            <span className="px-2 py-1 bg-[#007acc]/20 text-[#4fc3f7] text-xs rounded">
              Kubernetes Operator
            </span>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-[#3e3e42] bg-[#252526]">
          <button
            onClick={() => setSelectedTab('crd')}
            className={`px-4 py-2 text-sm font-medium ${
              selectedTab === 'crd'
                ? 'text-[#cccccc] border-b-2 border-[#007acc]'
                : 'text-[#858585] hover:text-[#cccccc]'
            }`}
          >
            Custom Resource Definition
          </button>
          <button
            onClick={() => setSelectedTab('operator')}
            className={`px-4 py-2 text-sm font-medium ${
              selectedTab === 'operator'
                ? 'text-[#cccccc] border-b-2 border-[#007acc]'
                : 'text-[#858585] hover:text-[#cccccc]'
            }`}
          >
            Operator Manifest
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto bg-[#1e1e1e] p-4">
          {selectedTab === 'crd' ? (
            <div>
              <div className="mb-2 text-sm text-[#858585]">
                Custom Resource Definition (CRD) - Defines the {addon.name} resource schema
              </div>
              <CodeHighlight code={addon.operatorCRD} language="yaml" />
            </div>
          ) : (
            <div>
              <div className="mb-2 text-sm text-[#858585]">
                Operator Deployment Manifest - Deploys the {addon.name} controller
              </div>
              <CodeHighlight code={addon.operatorManifest} language="yaml" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
