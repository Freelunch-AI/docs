import { useState } from 'react';
import { X, Code2, Play, Download } from 'lucide-react';
import type { MarketplaceBlock, InfrastructureAddon } from '../data/marketplaceBlocks';
import { CodeEditor } from './CodeEditor';
import { SandboxTester } from './SandboxTester';
import { ContainerPreview } from './ContainerPreview';
import { CodeHighlight } from './CodeHighlight';
import { AddonViewer } from './AddonViewer';
import { DAGStructureViewer } from './DAGStructureViewer';
import { ExperimentVisualization } from './ExperimentVisualization';

interface BlockDetailModalProps {
  block: MarketplaceBlock;
  onClose: () => void;
}

export function BlockDetailModal({ block, onClose }: BlockDetailModalProps) {
  const [showCodeEditor, setShowCodeEditor] = useState(false);
  const [showSandbox, setShowSandbox] = useState(false);
  const [editedCode, setEditedCode] = useState(block.sourceCode || '');
  const [selectedAddon, setSelectedAddon] = useState<InfrastructureAddon | null>(null);

  const handleDownload = () => {
    const blockData = {
      id: block.id,
      name: block.name,
      version: block.version,
      type: block.type,
      classification: block.classification,
      category: block.category,
      author: block.author,
      description: block.description,
      tags: block.tags,
      arguments: block.arguments,
      dependencies: block.dependencies,
      sourceCode: block.sourceCode,
      containerStructure: block.containerStructure,
      internalArchitecture: block.internalArchitecture,
      deploymentArchitecture: block.deploymentArchitecture,
    };

    const blob = new Blob([JSON.stringify(blockData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${block.id}-v${block.version}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const getCategoryBadge = (category: string) => {
    const badges = {
      code: { icon: '💻', label: 'Code Block', color: 'bg-blue-500/20 text-blue-400 border-blue-500/30' },
      infra: { icon: '🏗️', label: 'Infrastructure', color: 'bg-purple-500/20 text-purple-400 border-purple-500/30' },
      'workloads-infra': { icon: '⚙️', label: 'Workloads Infra', color: 'bg-orange-500/20 text-orange-400 border-orange-500/30' },
      'supporting-services': { icon: '🔌', label: 'Supporting Services', color: 'bg-teal-500/20 text-teal-400 border-teal-500/30' }
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

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div 
        className="bg-[#252526] border border-[#3e3e42] rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between p-6 border-b border-[#3e3e42]">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-4xl">{block.icon}</span>
              <div>
                <h2 className="text-2xl font-semibold text-[#cccccc]">{block.name}</h2>
                <div className="flex items-center gap-3 text-sm text-[#858585]">
                  <span>v{block.version}</span>
                  <span>•</span>
                  <span>by {block.author}</span>
                  {block.lastUpdated && (
                    <>
                      <span>•</span>
                      <span>Updated {new Date(block.lastUpdated).toLocaleDateString()}</span>
                    </>
                  )}
                </div>
              </div>
            </div>
            <div className="flex gap-2 mt-3">
              <span className={`px-2 py-1 rounded text-xs border ${categoryBadge.color}`}>
                {categoryBadge.icon} {categoryBadge.label}
              </span>
              <span className={`px-2 py-1 rounded text-xs border ${classificationBadge.color}`}>
                {classificationBadge.icon} {classificationBadge.label}
              </span>
              <span className="px-2 py-1 rounded text-xs bg-green-500/20 text-green-400 border border-green-500/30">
                {block.type}
              </span>
              {/* Observability Badges */}
              {block.observability?.includes('metalang') && (
                <span className="px-2 py-1 rounded text-xs bg-purple-500/20 text-purple-400 border border-purple-500/30">
                  🔮 MetaLang
                </span>
              )}
              {block.observability?.includes('opentelemetry') && (
                <span className="px-2 py-1 rounded text-xs bg-blue-500/20 text-blue-400 border border-blue-500/30">
                  📡 OpenTelemetry
                </span>
              )}
              {block.observability?.includes('openlineage') && (
                <span className="px-2 py-1 rounded text-xs bg-orange-500/20 text-orange-400 border border-orange-500/30">
                  🔗 OpenLineage
                </span>
              )}
              {/* Add-ons Badge for Workloads Infra */}
              {block.addons && block.addons.length > 0 && (
                <span className="px-2 py-1 rounded text-xs bg-amber-500/20 text-amber-400 border border-amber-500/30">
                  ⚙️ {block.addons.length} Add-on{block.addons.length > 1 ? 's' : ''}
                </span>
              )}
            </div>
            
            {/* Action Buttons */}
            {(block.containerStructure || block.sourceCode || block.classification === 'custom' || block.category === 'supporting-services' || block.category === 'workloads-infra' || block.category === 'code') && (
              <div className="flex gap-2 mt-4">
                {(block.containerStructure || block.sourceCode) && (
                  <button
                    onClick={() => setShowCodeEditor(true)}
                    className="flex items-center gap-2 px-3 py-2 bg-[#007acc] hover:bg-[#005a9e] text-white rounded text-sm"
                  >
                    <Code2 className="w-4 h-4" />
                    View/Edit Code
                  </button>
                )}
                <button
                  onClick={() => setShowSandbox(true)}
                  className="flex items-center gap-2 px-3 py-2 bg-[#0e7e30] hover:bg-[#0c6b28] text-white rounded text-sm"
                >
                  <Play className="w-4 h-4" />
                  Test in Sandbox
                </button>
              </div>
            )}
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleDownload}
              className="text-[#007acc] hover:text-[#005a9e] p-2 border border-[#007acc] rounded hover:bg-[#007acc]/10 transition-colors"
              title="Download Block Configuration"
            >
              <Download size={18} />
            </button>
            <button
              onClick={onClose}
              className="text-[#858585] hover:text-[#cccccc] p-1"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Description */}
          <section className="mb-6">
            <h3 className="text-lg font-semibold text-[#cccccc] mb-2">Description</h3>
            <p className="text-[#cccccc] leading-relaxed">{block.longDescription}</p>
          </section>

          {/* Dataset Preview (for dataset artifacts with preview data) */}
          {block.aiArtifactCategory === 'dataset' && block.datasetPreview && block.datasetPreview.length > 0 && (
            <section className="mb-6">
              <h3 className="text-lg font-semibold text-[#cccccc] mb-3 flex items-center gap-2">
                <span>📊</span>
                <span>Dataset Preview</span>
                <span className="text-xs text-[#858585] font-normal">(First {block.datasetPreview.length} rows)</span>
              </h3>
              <div className="bg-[#1e1e1e] border border-[#3e3e42] rounded overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-[#252526] border-b border-[#3e3e42]">
                      <tr>
                        {Object.keys(block.datasetPreview[0]).map((key) => (
                          <th key={key} className="text-left px-4 py-2 text-[#cccccc] font-semibold">
                            {key}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {block.datasetPreview.map((row, idx) => (
                        <tr key={idx} className="border-b border-[#3e3e42] hover:bg-[#252526]">
                          {Object.values(row).map((value, cellIdx) => (
                            <td key={cellIdx} className="px-4 py-2 text-[#cccccc]">
                              {typeof value === 'object' ? JSON.stringify(value) : String(value)}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </section>
          )}

          {/* Documentation (for DAG blocks) */}
          {block.type === 'dag' && block.documentation && (
            <section className="mb-6">
              <h3 className="text-lg font-semibold text-[#cccccc] mb-3 flex items-center gap-2">
                <span>📖</span>
                <span>Workflow Documentation</span>
              </h3>
              <div className="bg-[#1e1e1e] border border-[#3e3e42] rounded overflow-hidden">
                <CodeHighlight code={block.documentation} language="markdown" />
              </div>
            </section>
          )}

          {/* SLA (for virtual blocks) */}
          {block.sla && (
            <section className="mb-6">
              <h3 className="text-lg font-semibold text-[#cccccc] mb-3 flex items-center gap-2">
                <span>📊</span>
                <span>Service Level Agreement (SLA)</span>
              </h3>
              <div className="bg-[#1e1e1e] border border-[#3e3e42] rounded p-4">
                <div className="grid grid-cols-2 gap-4">
                  {/* Uptime */}
                  <div className="bg-[#252526] border border-[#3e3e42] rounded p-3">
                    <div className="text-xs text-[#858585] mb-1">Uptime Guarantee</div>
                    <div className="text-lg font-semibold text-green-400">{block.sla.uptime}</div>
                  </div>

                  {/* Latency */}
                  <div className="bg-[#252526] border border-[#3e3e42] rounded p-3">
                    <div className="text-xs text-[#858585] mb-1">Latency</div>
                    <div className="space-y-1">
                      <div className="text-sm text-[#cccccc]">p50: <span className="text-blue-400">{block.sla.latency.p50}</span></div>
                      <div className="text-sm text-[#cccccc]">p95: <span className="text-blue-400">{block.sla.latency.p95}</span></div>
                      <div className="text-sm text-[#cccccc]">p99: <span className="text-blue-400">{block.sla.latency.p99}</span></div>
                    </div>
                  </div>

                  {/* Throughput */}
                  {block.sla.throughput && (
                    <div className="bg-[#252526] border border-[#3e3e42] rounded p-3">
                      <div className="text-xs text-[#858585] mb-1">Throughput</div>
                      <div className="text-lg font-semibold text-purple-400">{block.sla.throughput}</div>
                    </div>
                  )}

                  {/* Data Retention */}
                  {block.sla.dataRetention && (
                    <div className="bg-[#252526] border border-[#3e3e42] rounded p-3">
                      <div className="text-xs text-[#858585] mb-1">Data Retention</div>
                      <div className="text-sm text-[#cccccc]">{block.sla.dataRetention}</div>
                    </div>
                  )}

                  {/* Backup Frequency */}
                  {block.sla.backupFrequency && (
                    <div className="bg-[#252526] border border-[#3e3e42] rounded p-3">
                      <div className="text-xs text-[#858585] mb-1">Backup Frequency</div>
                      <div className="text-sm text-[#cccccc]">{block.sla.backupFrequency}</div>
                    </div>
                  )}

                  {/* RPO */}
                  {block.sla.rpo && (
                    <div className="bg-[#252526] border border-[#3e3e42] rounded p-3">
                      <div className="text-xs text-[#858585] mb-1">Recovery Point Objective (RPO)</div>
                      <div className="text-sm text-orange-400">{block.sla.rpo}</div>
                    </div>
                  )}

                  {/* RTO */}
                  {block.sla.rto && (
                    <div className="bg-[#252526] border border-[#3e3e42] rounded p-3">
                      <div className="text-xs text-[#858585] mb-1">Recovery Time Objective (RTO)</div>
                      <div className="text-sm text-orange-400">{block.sla.rto}</div>
                    </div>
                  )}
                </div>
              </div>
            </section>
          )}

          {/* Tags */}
          <section className="mb-6">
            <h3 className="text-lg font-semibold text-[#cccccc] mb-2">Tags</h3>
            <div className="flex flex-wrap gap-2">
              {block.isAI && (
                <span className="px-2 py-1 bg-pink-500/20 border border-pink-500/30 rounded text-xs text-pink-400 font-semibold">
                  🤖 AI-Powered
                </span>
              )}
              {block.aiArtifactCategory === 'model' && block.modelFormat && (
                <span className="px-2 py-1 bg-[#ff6b6b]/20 border border-[#ff6b6b]/30 rounded text-xs text-[#ff6b6b] font-semibold">
                  📦 {block.modelFormat}
                </span>
              )}
              {block.aiArtifactCategory === 'model' && block.modelType && (
                <span className="px-2 py-1 bg-[#4ecdc4]/20 border border-[#4ecdc4]/30 rounded text-xs text-[#4ecdc4] font-semibold">
                  🧠 {block.modelType}
                </span>
              )}
              {block.aiArtifactCategory === 'model' && block.modelParameters && (
                <span className="px-2 py-1 bg-[#a8e6cf]/20 border border-[#a8e6cf]/30 rounded text-xs text-[#a8e6cf] font-semibold">
                  ⚙️ {block.modelParameters} params
                </span>
              )}
              {block.aiArtifactCategory === 'model' && block.modelSize && (
                <span className="px-2 py-1 bg-[#ffd3b6]/20 border border-[#ffd3b6]/30 rounded text-xs text-[#ffd3b6] font-semibold">
                  💾 {block.modelSize}GB
                </span>
              )}
              {block.aiArtifactCategory === 'dataset' && block.datasetFormat && (
                <span className="px-2 py-1 bg-[#95e1d3]/20 border border-[#95e1d3]/30 rounded text-xs text-[#95e1d3] font-semibold">
                  📊 {block.datasetFormat}
                </span>
              )}
              {block.aiArtifactCategory === 'dataset' && block.datasetEntries && (
                <span className="px-2 py-1 bg-[#b4a7d6]/20 border border-[#b4a7d6]/30 rounded text-xs text-[#b4a7d6] font-semibold">
                  📝 {block.datasetEntries} entries
                </span>
              )}
              {block.aiArtifactCategory === 'dataset' && block.datasetSize && (
                <span className="px-2 py-1 bg-[#ffd3b6]/20 border border-[#ffd3b6]/30 rounded text-xs text-[#ffd3b6] font-semibold">
                  💾 {block.datasetSize}GB
                </span>
              )}
              {block.schemaType && (
                <span className="px-2 py-1 bg-[#ffaaa5]/20 border border-[#ffaaa5]/30 rounded text-xs text-[#ffaaa5] font-semibold">
                  🗄️ {block.schemaType} Schema
                </span>
              )}
              {block.tags.map((tag) => (
                <span key={tag} className="px-2 py-1 bg-[#1e1e1e] border border-[#3e3e42] rounded text-xs text-[#858585]">
                  {tag}
                </span>
              ))}
            </div>
          </section>

          {/* Arguments */}
          {block.arguments && Object.keys(block.arguments).length > 0 && (
            <section className="mb-6">
              <h3 className="text-lg font-semibold text-[#cccccc] mb-2">Arguments</h3>
              <div className="space-y-3">
                {Object.entries(block.arguments).map(([key, arg]) => (
                  <div key={key} className="bg-[#1e1e1e] border border-[#3e3e42] rounded p-3">
                    <div className="flex items-start justify-between mb-1">
                      <code className="text-sm text-[#4ec9b0]">{key}</code>
                      <div className="flex gap-2">
                        <span className="text-xs px-2 py-0.5 bg-[#252526] border border-[#3e3e42] rounded text-[#858585]">
                          {arg.type}
                        </span>
                        {arg.required && (
                          <span className="text-xs px-2 py-0.5 bg-red-500/20 border border-red-500/30 rounded text-red-400">
                            required
                          </span>
                        )}
                      </div>
                    </div>
                    <p className="text-sm text-[#cccccc] mb-1">{arg.description}</p>
                    {arg.default !== undefined && (
                      <p className="text-xs text-[#858585]">
                        Default: <code className="text-[#ce9178]">{JSON.stringify(arg.default)}</code>
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Dependencies */}
          {block.dependencies && block.dependencies.length > 0 && (
            <section className="mb-6">
              <h3 className="text-lg font-semibold text-[#cccccc] mb-2">Dependencies</h3>
              <ul className="space-y-2">
                {block.dependencies.map((dep) => (
                  <li key={dep} className="flex items-center gap-2 text-[#cccccc]">
                    <span className="text-[#007acc]">→</span>
                    <code className="text-sm bg-[#1e1e1e] px-2 py-1 rounded border border-[#3e3e42]">{dep}</code>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* Internal Blocks (for custom/composite blocks) - Show as dependencies */}
          {block.internalBlocks && block.internalBlocks.length > 0 && (
            <section className="mb-6">
              <h3 className="text-lg font-semibold text-[#cccccc] mb-2">Internal Dependencies</h3>
              <p className="text-sm text-[#858585] mb-3">
                This composite block contains {block.internalBlocks.length} internal blocks:
              </p>
              <ul className="grid grid-cols-2 gap-2">
                {block.internalBlocks.map((internalBlock) => (
                  <li key={internalBlock} className="flex items-center gap-2 text-[#cccccc]">
                    <span className="text-[#4ec9b0]">▪</span>
                    <code className="text-sm bg-[#1e1e1e] px-2 py-1 rounded">{internalBlock}</code>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* DAG Structure (for DAG blocks) */}
          {block.type === 'dag' && block.dagStructure && !showCodeEditor && (
            <section className="mb-6">
              <h3 className="text-lg font-semibold text-[#cccccc] mb-2">DAG Structure</h3>
              <DAGStructureViewer structure={block.dagStructure} />
            </section>
          )}

          {/* Experiment Visualization (for experimentation blocks) */}
          {block.type === 'experimentation' && block.experimentConfig && !showCodeEditor && (
            <section className="mb-6">
              <h3 className="text-lg font-semibold text-[#cccccc] mb-3 flex items-center gap-2">
                <span>🔬</span>
                <span>Experiment Design</span>
              </h3>
              <ExperimentVisualization config={block.experimentConfig} />
              
              {/* Experiment Strategy Details */}
              <div className="mt-4 bg-[#1e1e1e] border border-[#3e3e42] rounded-lg p-4">
                <h4 className="text-sm font-semibold text-[#cccccc] mb-3">Strategy Details</h4>
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-[#858585]">Type:</span>
                    <span className="ml-2 text-[#cccccc] font-medium">{block.experimentConfig.strategy.type}</span>
                  </div>
                  {block.experimentConfig.strategy.duration && (
                    <div>
                      <span className="text-[#858585]">Duration:</span>
                      <span className="ml-2 text-[#cccccc] font-medium">{block.experimentConfig.strategy.duration}</span>
                    </div>
                  )}
                  {block.experimentConfig.strategy.successCriteria && (
                    <div className="col-span-2">
                      <span className="text-[#858585]">Success Criteria:</span>
                      <div className="ml-2 text-[#cccccc] mt-1">{block.experimentConfig.strategy.successCriteria}</div>
                    </div>
                  )}
                  {block.experimentConfig.strategy.rollbackThreshold && (
                    <div className="col-span-2">
                      <span className="text-[#858585]">Rollback Threshold:</span>
                      <div className="ml-2 text-red-400 mt-1">{block.experimentConfig.strategy.rollbackThreshold}</div>
                    </div>
                  )}
                  {block.experimentConfig.confidenceLevel && (
                    <div>
                      <span className="text-[#858585]">Confidence Level:</span>
                      <span className="ml-2 text-[#cccccc] font-medium">{block.experimentConfig.confidenceLevel}%</span>
                    </div>
                  )}
                  {block.experimentConfig.strategy.autoPromote !== undefined && (
                    <div>
                      <span className="text-[#858585]">Auto-Promote:</span>
                      <span className={`ml-2 font-medium ${block.experimentConfig.strategy.autoPromote ? 'text-green-400' : 'text-orange-400'}`}>
                        {block.experimentConfig.strategy.autoPromote ? 'Yes' : 'No'}
                      </span>
                    </div>
                  )}
                </div>
                
                {/* Tracked Metrics */}
                {block.experimentConfig.metrics && block.experimentConfig.metrics.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-[#3e3e42]">
                    <span className="text-xs text-[#858585] font-semibold">Tracked Metrics:</span>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {block.experimentConfig.metrics.map((metric) => (
                        <span key={metric} className="px-2 py-1 bg-[#252526] border border-[#3e3e42] rounded text-xs text-[#cccccc]">
                          {metric}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </section>
          )}

          {/* Container Structure (for non-DAG blocks with containerStructure) */}
          {block.type !== 'dag' && block.containerStructure && !showCodeEditor && (
            <section className="mb-6">
              <h3 className="text-lg font-semibold text-[#cccccc] mb-2">Container Structure</h3>
              <ContainerPreview structure={block.containerStructure} />
              <p className="text-xs text-[#858585] mt-2">💡 Click "View/Edit Code" to open files in editor</p>
            </section>
          )}

          {/* Legacy Source Code (for blocks not yet migrated to containerStructure) */}
          {block.sourceCode && !block.containerStructure && !showCodeEditor && (
            <section className="mb-6">
              <h3 className="text-lg font-semibold text-[#cccccc] mb-2">Source Code Preview</h3>
              <div className="bg-[#1e1e1e] border border-[#3e3e42] rounded overflow-hidden max-h-96 overflow-y-auto">
                <CodeHighlight code={block.sourceCode} language="typescript" />
              </div>
              <p className="text-xs text-[#858585] mt-2">💡 Click "View/Edit Code" to open in editor</p>
            </section>
          )}

          {/* Client Code (for service blocks) */}
          {block.clientCode && (
            <section className="mb-6">
              <h3 className="text-lg font-semibold text-[#cccccc] mb-2">Client Usage Example</h3>
              <div className="bg-[#1e1e1e] border border-[#3e3e42] rounded overflow-hidden">
                <CodeHighlight code={block.clientCode} language="typescript" />
              </div>
            </section>
          )}

          {/* OpenAPI Spec (for service blocks) */}
          {block.openApiSpec && (
            <section className="mb-6">
              <h3 className="text-lg font-semibold text-[#cccccc] mb-2">OpenAPI / Service Specification</h3>
              <div className="bg-[#1e1e1e] border border-[#3e3e42] rounded overflow-hidden">
                <CodeHighlight code={block.openApiSpec} language="yaml" />
              </div>
            </section>
          )}

          {/* SDK Reference Documentation */}
          {block.hasSDK && block.sdkDocs && (
            <section className="mb-6">
              <h3 className="text-lg font-semibold text-[#cccccc] mb-2">📦 SDK Reference</h3>
              <p className="text-sm text-[#858585] mb-3">Client libraries and SDK documentation</p>
              <div className="bg-[#1e1e1e] border border-[#3e3e42] rounded overflow-hidden max-h-96 overflow-y-auto">
                <CodeHighlight code={block.sdkDocs} language="typescript" />
              </div>
            </section>
          )}

          {/* Internal Architecture - Placeholder for now */}
          {(block.deploymentArchitecture === 'distributed' || block.classification === 'custom') && !block.internalArchitecture && (
            <section className="mb-6">
              <h3 className="text-lg font-semibold text-[#cccccc] mb-2">🏗️ Internal Architecture</h3>
              <div className="bg-[#1e1e1e] border border-[#3e3e42] border-dashed rounded p-6 text-center">
                <p className="text-sm text-[#858585] italic">
                  [PLACEHOLDER] Internal architecture visualization will be displayed here
                </p>
                <p className="text-xs text-[#858585] mt-2">
                  Shows internal services, container source code, and service graph with connections
                </p>
              </div>
            </section>
          )}

          {/* Internal Architecture - Full Implementation */}
          {block.internalArchitecture && (
            <section className="mb-6">
              <h3 className="text-lg font-semibold text-[#cccccc] mb-2">🏗️ Internal Architecture</h3>
              <p className="text-sm text-[#858585] mb-4">
                {block.deploymentArchitecture === 'distributed'
                  ? 'Internal services and their communication patterns' 
                  : 'Internal blocks and their interactions'}
              </p>

              {/* Entrypoint Information */}
              {block.internalArchitecture.entrypoints && block.internalArchitecture.entrypoints.length > 0 && (
                <div className="mb-6 bg-[#1e1e1e] border border-[#007acc]/30 rounded p-4">
                  <h4 className="text-sm font-semibold text-[#007acc] mb-2 flex items-center gap-2">
                    <span>🚪</span>
                    <span>External Request Entrypoints</span>
                  </h4>
                  <p className="text-xs text-[#858585] mb-3">
                    {block.internalArchitecture.entrypoints.length === 1 
                      ? 'This service/block receives all external requests:'
                      : 'These services/blocks can receive external requests:'}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {block.internalArchitecture.entrypoints.map((entrypoint) => (
                      <span key={entrypoint} className="px-3 py-1.5 bg-[#007acc]/20 text-[#007acc] rounded text-sm font-mono border border-[#007acc]/30">
                        {entrypoint}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Internal Blocks (for custom blocks) */}
              {block.internalBlocks && block.internalBlocks.length > 0 && (
                <div className="mb-6">
                  <h4 className="text-md font-semibold text-[#cccccc] mb-3">Internal Blocks</h4>
                  <div className="grid grid-cols-2 gap-2">
                    {block.internalBlocks.map((internalBlockId) => (
                      <div key={internalBlockId} className="bg-[#1e1e1e] border border-[#3e3e42] rounded p-3">
                        <div className="flex items-center gap-2">
                          <span className="text-[#4ec9b0]">🔷</span>
                          <code className="text-sm text-[#cccccc]">{internalBlockId}</code>
                        </div>
                        <button 
                          className="text-xs text-[#007acc] hover:text-[#005a9e] mt-2"
                          onClick={() => {/* TODO: Navigate to block */}}
                        >
                          View in Marketplace →
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Internal Services (only for distributed blocks, not custom) */}
              {block.classification !== 'custom' && (
                <div className="mb-6">
                  <h4 className="text-md font-semibold text-[#cccccc] mb-3">Services</h4>
                  <div className="space-y-4">
                    {block.internalArchitecture.services.map((service) => (
                    <div key={service.id} className="bg-[#1e1e1e] border border-[#3e3e42] rounded p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h5 className="text-sm font-semibold text-[#cccccc]">{service.name}</h5>
                        {service.port && (
                          <span className="text-xs text-[#858585]">Port: {service.port}</span>
                        )}
                      </div>
                      <p className="text-xs text-[#858585] mb-3">{service.description}</p>
                      
                      {/* Container Structure Viewer */}
                      {service.containerStructure && (
                        <div className="mt-4">
                          <ContainerPreview structure={service.containerStructure} />
                        </div>
                      )}
                    </div>
                  ))}
                  </div>
                </div>
              )}

              {/* Communication Graph */}
              <div>
                <h4 className="text-md font-semibold text-[#cccccc] mb-3">
                  {block.classification === 'custom' ? 'Block/Microservice Communication Graph' : 'Service Communication Graph'}
                </h4>
                <div className="bg-[#1e1e1e] border border-[#3e3e42] rounded p-6">
                  <div className="space-y-3">
                    {block.internalArchitecture.connections.map((conn, idx) => {
                      const fromService = block.internalArchitecture!.services.find(s => s.id === conn.from);
                      const toService = block.internalArchitecture!.services.find(s => s.id === conn.to);
                      
                      const arrowSymbol = conn.arrowType === 'one-way' ? '→' : '↔';
                      const styleIndicator = conn.arrowStyle === 'solid' ? '━' : '╌';
                      const accessColor = 
                        conn.access === 'read-only' ? 'text-blue-400' :
                        conn.access === 'write-only' ? 'text-orange-400' :
                        'text-green-400';
                      
                      return (
                        <div key={idx} className="flex items-center gap-3 text-sm">
                          <span className="text-[#cccccc] font-mono">{fromService?.name || conn.from}</span>
                          <div className="flex items-center gap-1 flex-1">
                            <span className={`font-mono ${accessColor}`}>
                              {styleIndicator}{arrowSymbol}{styleIndicator}
                            </span>
                            <span className="text-xs text-[#858585]">
                              ({conn.access})
                            </span>
                            {conn.label && (
                              <span className="text-xs text-[#858585] italic ml-2">{conn.label}</span>
                            )}
                          </div>
                          <span className="text-[#cccccc] font-mono">{toService?.name || conn.to}</span>
                        </div>
                      );
                    })}
                  </div>
                  
                  <div className="mt-6 pt-4 border-t border-[#3e3e42]">
                    <p className="text-xs text-[#858585] mb-2">Legend:</p>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div><span className="font-mono">━→━</span> Solid = Request/Response</div>
                      <div><span className="font-mono">╌→╌</span> Dashed = Streaming</div>
                      <div className="text-blue-400"><span className="font-mono">→</span> Read-only</div>
                      <div className="text-orange-400"><span className="font-mono">→</span> Write-only</div>
                      <div className="text-green-400"><span className="font-mono">↔</span> Read-write</div>
                      <div><span className="font-mono">↔</span> Two-way communication</div>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* Helm Chart */}
          {block.helmChart && (
            <section className="mb-6">
              <h3 className="text-lg font-semibold text-[#cccccc] mb-2">⎈ Helm Chart</h3>
              <p className="text-sm text-[#858585] mb-3">Deploy this service to Kubernetes using Helm</p>
              <div className="bg-[#1e1e1e] border border-[#3e3e42] rounded overflow-hidden max-h-96 overflow-y-auto">
                <CodeHighlight code={block.helmChart} language="yaml" />
              </div>
            </section>
          )}

          {/* Kubernetes Operator + CRD */}
          {block.k8sOperator && (
            <section className="mb-6">
              <h3 className="text-lg font-semibold text-[#cccccc] mb-2">☸️ Kubernetes Operator</h3>
              <p className="text-sm text-[#858585] mb-3">Manage this service using a Kubernetes operator</p>
              
              <div className="mb-4">
                <h4 className="text-sm font-semibold text-[#cccccc] mb-2">Custom Resource Definition (CRD)</h4>
                <div className="bg-[#1e1e1e] border border-[#3e3e42] rounded overflow-hidden max-h-64 overflow-y-auto">
                  <CodeHighlight code={block.k8sOperator.crd} language="yaml" />
                </div>
              </div>

              <div>
                <h4 className="text-sm font-semibold text-[#cccccc] mb-2">Operator Deployment</h4>
                <div className="bg-[#1e1e1e] border border-[#3e3e42] rounded overflow-hidden max-h-64 overflow-y-auto">
                  <CodeHighlight code={block.k8sOperator.operatorManifest} language="yaml" />
                </div>
              </div>
            </section>
          )}

          {/* Metadata */}
          {block.metadata && (
            <section className="mb-6">
              <h3 className="text-lg font-semibold text-[#cccccc] mb-2">Metadata</h3>
              <div className="bg-[#1e1e1e] border border-[#3e3e42] rounded p-4">
                {block.metadata.resources && (
                  <div className="mb-3">
                    <h4 className="text-sm font-semibold text-[#858585] mb-2">Resources</h4>
                    <div className="grid grid-cols-3 gap-3">
                      {block.metadata.resources.cpu && (
                        <div>
                          <span className="text-xs text-[#858585]">CPU:</span>
                          <p className="text-sm text-[#cccccc]">{block.metadata.resources.cpu}</p>
                        </div>
                      )}
                      {block.metadata.resources.memory && (
                        <div>
                          <span className="text-xs text-[#858585]">Memory:</span>
                          <p className="text-sm text-[#cccccc]">{block.metadata.resources.memory}</p>
                        </div>
                      )}
                      {block.metadata.resources.storage && (
                        <div>
                          <span className="text-xs text-[#858585]">Storage:</span>
                          <p className="text-sm text-[#cccccc]">{block.metadata.resources.storage}</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
                {block.metadata.replicas !== undefined && (
                  <div className="mb-3">
                    <span className="text-xs text-[#858585]">Replicas:</span>
                    <p className="text-sm text-[#cccccc]">{block.metadata.replicas}</p>
                  </div>
                )}
                {block.metadata.healthCheck && (
                  <div>
                    <span className="text-xs text-[#858585]">Health Check:</span>
                    <p className="text-sm text-[#cccccc]">{block.metadata.healthCheck}</p>
                  </div>
                )}
              </div>
            </section>
          )}

          {/* Languages & Framework */}
          <section className="mb-6">
            <h3 className="text-lg font-semibold text-[#cccccc] mb-2">Technical Details</h3>
            <div className="bg-[#1e1e1e] border border-[#3e3e42] rounded p-4">
              {block.languages && block.languages.length > 0 && (
                <div className="mb-3">
                  <span className="text-xs text-[#858585]">Languages:</span>
                  <div className="flex gap-2 mt-1">
                    {block.languages.map((lang) => (
                      <span key={lang} className="px-2 py-1 bg-[#252526] border border-[#3e3e42] rounded text-xs text-[#cccccc]">
                        {lang}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              {block.framework && (
                <div>
                  <span className="text-xs text-[#858585]">Framework:</span>
                  <p className="text-sm text-[#cccccc] mt-1">{block.framework}</p>
                </div>
              )}
            </div>
          </section>

          {/* Infrastructure Add-ons */}
          {block.addons && block.addons.length > 0 && (
            <section className="mb-6">
              <h3 className="text-lg font-semibold text-[#cccccc] mb-2">Infrastructure Add-ons</h3>
              <p className="text-sm text-[#858585] mb-3">Kubernetes operator add-ons that extend cluster functionality</p>
              <div className="space-y-2">
                {block.addons.map((addon) => (
                  <div key={addon.id} className="bg-[#1e1e1e] border border-[#3e3e42] rounded p-4 flex items-center justify-between hover:border-[#007acc]/50 transition-colors">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{addon.icon}</span>
                      <div>
                        <h4 className="text-sm font-semibold text-[#cccccc]">{addon.name}</h4>
                        <p className="text-xs text-[#858585]">{addon.description}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="px-2 py-0.5 bg-[#4ec9b0]/20 text-[#4ec9b0] text-xs rounded">
                            {addon.purpose}
                          </span>
                          <span className="px-2 py-0.5 bg-[#007acc]/20 text-[#4fc3f7] text-xs rounded">
                            K8s Operator
                          </span>
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => setSelectedAddon(addon)}
                      className="px-3 py-1.5 bg-[#0e639c] hover:bg-[#1177bb] text-white text-sm rounded"
                    >
                      View CRD & Operator
                    </button>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Library Dependencies & Block Dependencies */}
          {(block.libraryDependencies || block.blockDependencies) && (
            <section className="mb-6">
              <h3 className="text-lg font-semibold text-[#cccccc] mb-2">Dependencies</h3>
              
              {block.libraryDependencies && block.libraryDependencies.length > 0 && (
                <div className="bg-[#1e1e1e] border border-[#3e3e42] rounded p-4 mb-3">
                  <span className="text-xs text-[#858585]">Library Dependencies:</span>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {block.libraryDependencies.map((lib) => (
                      <span key={lib} className="px-2 py-1 bg-[#0e639c] border border-[#1177bb] rounded text-xs text-white font-mono">
                        {lib}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              
              {block.blockDependencies && block.blockDependencies.length > 0 && (
                <div className="bg-[#1e1e1e] border border-[#3e3e42] rounded p-4">
                  <span className="text-xs text-[#858585]">Block Dependencies:</span>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {block.blockDependencies.map((blockId) => (
                      <span key={blockId} className="px-2 py-1 bg-[#2d6a4f] border border-[#40916c] rounded text-xs text-white font-mono">
                        {blockId}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </section>
          )}

          {/* Stats */}
          <section>
            <h3 className="text-lg font-semibold text-[#cccccc] mb-2">Statistics</h3>
            <div className="flex gap-4">
              <div className="bg-[#1e1e1e] border border-[#3e3e42] rounded px-4 py-2">
                <span className="text-xs text-[#858585]">Stars</span>
                <p className="text-xl font-semibold text-[#cccccc]">{block.stats.stars}</p>
              </div>
              <div className="bg-[#1e1e1e] border border-[#3e3e42] rounded px-4 py-2">
                <span className="text-xs text-[#858585]">Downloads</span>
                <p className="text-xl font-semibold text-[#cccccc]">
                  {block.stats.downloads >= 1000 
                    ? `${(block.stats.downloads / 1000).toFixed(1)}k` 
                    : block.stats.downloads}
                </p>
              </div>
            </div>
          </section>
        </div>
      </div>

      {/* Code Editor Modal */}
      {showCodeEditor && (block.containerStructure || block.sourceCode) && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4" onClick={() => setShowCodeEditor(false)}>
          <div 
            className="bg-[#252526] border border-[#3e3e42] rounded-lg max-w-6xl w-full h-[80vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-4 border-b border-[#3e3e42]">
              <div>
                <h3 className="text-lg font-semibold text-[#cccccc]">{block.name} - Source Code</h3>
                <p className="text-sm text-[#858585]">Edit and explore the implementation</p>
              </div>
              <button
                onClick={() => setShowCodeEditor(false)}
                className="p-2 hover:bg-[#2d2d2d] rounded text-[#858585] hover:text-[#cccccc]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="flex-1 overflow-hidden">
              {block.containerStructure ? (
                <ContainerPreview structure={block.containerStructure} />
              ) : (
                <CodeEditor
                  code={editedCode}
                  language={block.languages?.[0]?.toLowerCase() || 'typescript'}
                  onCodeChange={setEditedCode}
                />
              )}
            </div>
          </div>
        </div>
      )}

      {/* Sandbox Tester Modal */}
      {showSandbox && (
        <SandboxTester block={block} onClose={() => setShowSandbox(false)} />
      )}

      {/* Addon Viewer Modal */}
      {selectedAddon && (
        <AddonViewer addon={selectedAddon} onClose={() => setSelectedAddon(null)} />
      )}
    </div>
  );
}
