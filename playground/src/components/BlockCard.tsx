import { Star, Download, Plus } from 'lucide-react';
import type { MarketplaceBlock } from '../data/marketplaceBlocks';

interface BlockCardProps {
  block: MarketplaceBlock;
  onClick: () => void;
  onImport?: (blockId: string) => void;
}

export function BlockCard({ block, onClick, onImport }: BlockCardProps) {
  const getCategoryBadge = (category: string) => {
    const badges = {
      code: { icon: '💻', label: 'Code', color: 'bg-blue-500/20 text-blue-400 border-blue-500/30' },
      infra: { icon: '🏗️', label: 'Infra', color: 'bg-purple-500/20 text-purple-400 border-purple-500/30' },
      'workloads-infra': { icon: '⚙️', label: 'Workloads', color: 'bg-orange-500/20 text-orange-400 border-orange-500/30' },
      'supporting-services': { icon: '🔌', label: 'Supporting', color: 'bg-teal-500/20 text-teal-400 border-teal-500/30' }
    };
    return badges[category as keyof typeof badges] || badges.code;
  };

  const getClassificationBadge = (classification: string) => {
    const badges = {
      concrete: { icon: '🔷', label: 'Concrete', color: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30' },
      custom: { icon: '🔶', label: 'Custom', color: 'bg-amber-500/20 text-amber-400 border-amber-500/30' },
      virtual: { icon: '⬜', label: 'Virtual', color: 'bg-gray-500/20 text-gray-400 border-gray-500/30' }
    };
    return badges[classification as keyof typeof badges] || badges.concrete;
  };

  const categoryBadge = getCategoryBadge(block.category);
  const classificationBadge = getClassificationBadge(block.classification);

  const getTypeColor = () => {
    switch (block.type) {
      case 'service':
        return 'from-green-500/20 to-green-600/20 border-green-500/30';
      case 'service-block':
        return 'from-cyan-500/20 to-cyan-600/20 border-cyan-500/30';
      case 'workloads-infra':
        return 'from-purple-500/20 to-purple-600/20 border-purple-500/30';
      case 'infrastructure':
        return 'from-blue-900/20 to-blue-950/20 border-blue-900/30';
      case 'dag':
        return 'from-orange-500/20 to-orange-600/20 border-orange-500/30';
      case 'task':
        return 'from-yellow-500/20 to-yellow-600/20 border-yellow-500/30';
      case 'function':
        return 'from-pink-500/20 to-pink-600/20 border-pink-500/30';
    }
  };

  return (
    <div
      onClick={onClick}
      className={`bg-gradient-to-br ${getTypeColor()} border rounded-lg p-4 cursor-pointer hover:scale-[1.02] transition-transform duration-200 ${
        block.isMaintained === false ? 'opacity-60' : ''
      }`}
    >
      {/* Header */}
      <div className="flex items-start gap-3 mb-3">
        <span className="text-3xl">{block.icon}</span>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-semibold text-[#cccccc] truncate">{block.name}</h3>
            <span className="text-xs text-[#858585] whitespace-nowrap">v{block.version}</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-[#858585]">
            <span>{block.author}</span>
            {block.lastUpdated && (
              <>
                <span>•</span>
                <span>{new Date(block.lastUpdated).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Badges */}
      <div className="flex gap-2 mb-3 flex-wrap">
        <span className={`px-2 py-1 rounded text-xs border ${categoryBadge.color}`}>
          {categoryBadge.icon} {categoryBadge.label}
        </span>
        <span className={`px-2 py-1 rounded text-xs border ${classificationBadge.color}`}>
          {classificationBadge.icon} {classificationBadge.label}
        </span>
        {/* Provider Badge (for virtual blocks) */}
        {block.classification === 'virtual' && block.provider && (
          <span className="px-2 py-1 rounded text-xs border bg-indigo-500/20 text-indigo-400 border-indigo-500/30">
            ☁️ {block.provider}
          </span>
        )}
        {/* Secret Badge (for blocks requiring secrets) */}
        {block.requiresSecret && (
          <span className="px-2 py-1 rounded text-xs border bg-yellow-500/20 text-yellow-400 border-yellow-500/30">
            🔐 Secret
          </span>
        )}
        {/* AI Badge */}
        {block.isAI && (
          <span className="px-2 py-1 rounded text-xs border bg-pink-500/20 text-pink-400 border-pink-500/30 font-semibold">
            🤖 AI
          </span>
        )}
        {/* Maintained Badge */}
        {block.isMaintained === false && (
          <span className="px-2 py-1 rounded text-xs border bg-gray-500/20 text-gray-400 border-gray-500/30">
            ⚠️ Not Maintained
          </span>
        )}
        {/* Stateful Badge */}
        {block.isStateful !== undefined && (
          <span className={`px-2 py-1 rounded text-xs border ${
            block.isStateful
              ? 'bg-orange-500/20 text-orange-400 border-orange-500/30'
              : 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
          }`}>
            {block.isStateful ? '💾 Stateful' : '⚡ Stateless'}
          </span>
        )}
        {/* SDK Badge */}
        {block.hasSDK && (
          <span className="px-2 py-1 rounded text-xs border bg-green-500/20 text-green-400 border-green-500/30">
            📦 SDK
          </span>
        )}
        {/* Deployment Architecture Badge (for service blocks only) */}
        {block.type === 'service' && block.deploymentArchitecture && (
          <span className={`px-2 py-1 rounded text-xs border ${
            block.deploymentArchitecture === 'distributed' 
              ? 'bg-purple-500/20 text-purple-400 border-purple-500/30' 
              : 'bg-blue-500/20 text-blue-400 border-blue-500/30'
          }`}>
            {block.deploymentArchitecture === 'distributed' ? '🔀 Distributed' : '📍 Single'}
          </span>
        )}
      </div>

      {/* Description */}
      <p className="text-[13px] text-[#cccccc] mb-3 line-clamp-2">{block.description}</p>

      {/* Languages */}
      {block.languages && block.languages.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-2">
          {block.languages.slice(0, 3).map((lang) => (
            <span
              key={lang}
              className="bg-[#007acc]/20 text-[#4fc3f7] text-[10px] px-2 py-0.5 rounded border border-[#007acc]/30 font-mono"
            >
              {lang}
            </span>
          ))}
          {block.languages.length > 3 && (
            <span className="text-[#858585] text-[10px] px-2 py-0.5">
              +{block.languages.length - 3}
            </span>
          )}
        </div>
      )}

      {/* Model Format & Type (for AI model artifacts) */}
      {block.aiArtifactCategory === 'model' && (block.modelFormat || block.modelType || block.modelParameters || block.modelSize) && (
        <div className="flex flex-wrap gap-1 mb-2">
          {block.modelFormat && (
            <span className="bg-[#ff6b6b]/20 text-[#ff6b6b] text-[10px] px-2 py-0.5 rounded border border-[#ff6b6b]/30 font-mono">
              📦 {block.modelFormat}
            </span>
          )}
          {block.modelType && (
            <span className="bg-[#4ecdc4]/20 text-[#4ecdc4] text-[10px] px-2 py-0.5 rounded border border-[#4ecdc4]/30 font-mono">
              🧠 {block.modelType}
            </span>
          )}
          {block.modelParameters && (
            <span className="bg-[#a8e6cf]/20 text-[#a8e6cf] text-[10px] px-2 py-0.5 rounded border border-[#a8e6cf]/30 font-mono">
              ⚙️ {block.modelParameters}
            </span>
          )}
          {block.modelSize && (
            <span className="bg-[#ffd3b6]/20 text-[#ffd3b6] text-[10px] px-2 py-0.5 rounded border border-[#ffd3b6]/30 font-mono">
              💾 {block.modelSize}GB
            </span>
          )}
        </div>
      )}

      {/* Dataset Format, Entries, Size (for dataset artifacts) */}
      {block.aiArtifactCategory === 'dataset' && (block.datasetFormat || block.datasetEntries || block.datasetSize) && (
        <div className="flex flex-wrap gap-1 mb-2">
          {block.datasetFormat && (
            <span className="bg-[#95e1d3]/20 text-[#95e1d3] text-[10px] px-2 py-0.5 rounded border border-[#95e1d3]/30 font-mono">
              📊 {block.datasetFormat}
            </span>
          )}
          {block.datasetEntries && (
            <span className="bg-[#b4a7d6]/20 text-[#b4a7d6] text-[10px] px-2 py-0.5 rounded border border-[#b4a7d6]/30 font-mono">
              📝 {block.datasetEntries} entries
            </span>
          )}
          {block.datasetSize && (
            <span className="bg-[#ffd3b6]/20 text-[#ffd3b6] text-[10px] px-2 py-0.5 rounded border border-[#ffd3b6]/30 font-mono">
              💾 {block.datasetSize}GB
            </span>
          )}
        </div>
      )}

      {/* Schema Type (for database schema artifacts) */}
      {block.schemaType && (
        <div className="flex flex-wrap gap-1 mb-2">
          <span className="bg-[#ffaaa5]/20 text-[#ffaaa5] text-[10px] px-2 py-0.5 rounded border border-[#ffaaa5]/30 font-mono">
            🗄️ {block.schemaType}
          </span>
        </div>
      )}

      {/* Dataset Format (for dataset artifacts) */}
      {block.aiArtifactCategory === 'dataset' && block.datasetFormat && (
        <div className="flex flex-wrap gap-1 mb-2">
          <span className="bg-[#95e1d3]/20 text-[#95e1d3] text-[10px] px-2 py-0.5 rounded border border-[#95e1d3]/30 font-mono">
            📊 {block.datasetFormat}
          </span>
        </div>
      )}

      {/* Tags */}
      <div className="flex flex-wrap gap-1 mb-3">
        {block.tags.slice(0, 3).map((tag) => (
          <span
            key={tag}
            className="bg-[#3e3e3e] text-[#cccccc] text-[10px] px-2 py-0.5 rounded"
          >
            {tag}
          </span>
        ))}
        {block.tags.length > 3 && (
          <span className="text-[#858585] text-[10px] px-2 py-0.5">
            +{block.tags.length - 3}
          </span>
        )}
      </div>

      {/* Stats & Cost */}
      <div className="flex items-center justify-between text-[12px] text-[#cccccc] border-t border-[#3e3e3e] pt-3">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1">
            <Star size={14} className="fill-yellow-500 text-yellow-500" />
            <span>{block.stats.stars}</span>
          </div>
          <div className="flex items-center gap-1">
            <Download size={14} />
            <span>{(block.stats.downloads / 1000).toFixed(1)}k</span>
          </div>
        </div>
        {onImport && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onImport(block.id);
            }}
            className="flex items-center gap-1 px-3 py-1.5 bg-[#007acc] hover:bg-[#006bb3] text-white text-[11px] font-medium rounded transition-colors"
            title="Import into Lunch-Cycle"
          >
            <Plus size={12} />
            Import
          </button>
        )}
      </div>
    </div>
  );
}
