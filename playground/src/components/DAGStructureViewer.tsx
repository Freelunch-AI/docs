import { useState } from 'react';
import { ChevronDown, ChevronRight, Workflow, Clock, Webhook, Database, Eye, CheckCircle2, AlertCircle } from 'lucide-react';
import type { DAGStructure, DAGNode } from '../data/marketplaceBlocks';
import { marketplaceBlocks } from '../data/marketplaceBlocks';
import { ContainerPreview } from './ContainerPreview';

interface DAGStructureViewerProps {
  structure: DAGStructure;
}

export function DAGStructureViewer({ structure }: DAGStructureViewerProps) {
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set());
  const [expandedTasks, setExpandedTasks] = useState<Set<string>>(new Set());
  const [expandedHandlers, setExpandedHandlers] = useState<Set<string>>(new Set());
  const [expandedCheckers, setExpandedCheckers] = useState<Set<string>>(new Set());
  const [expandedStates, setExpandedStates] = useState<Set<string>>(new Set());

  const toggleNode = (nodeId: string) => {
    setExpandedNodes(prev => {
      const next = new Set(prev);
      if (next.has(nodeId)) {
        next.delete(nodeId);
      } else {
        next.add(nodeId);
      }
      return next;
    });
  };

  const toggleTask = (taskId: string) => {
    setExpandedTasks(prev => {
      const next = new Set(prev);
      if (next.has(taskId)) {
        next.delete(taskId);
      } else {
        next.add(taskId);
      }
      return next;
    });
  };

  const toggleHandler = (handlerId: string) => {
    setExpandedHandlers(prev => {
      const next = new Set(prev);
      if (next.has(handlerId)) {
        next.delete(handlerId);
      } else {
        next.add(handlerId);
      }
      return next;
    });
  };

  const toggleChecker = (checkerId: string) => {
    setExpandedCheckers(prev => {
      const next = new Set(prev);
      if (next.has(checkerId)) {
        next.delete(checkerId);
      } else {
        next.add(checkerId);
      }
      return next;
    });
  };

  const toggleState = (nodeId: string) => {
    setExpandedStates(prev => {
      const next = new Set(prev);
      if (next.has(nodeId)) {
        next.delete(nodeId);
      } else {
        next.add(nodeId);
      }
      return next;
    });
  };

  const getEventHandlerIcon = (handlerId: string) => {
    if (handlerId.includes('webhook')) return <Webhook size={16} className="text-pink-400" />;
    if (handlerId.includes('scheduled')) return <Clock size={16} className="text-orange-400" />;
    if (handlerId.includes('database')) return <Database size={16} className="text-blue-400" />;
    if (handlerId.includes('file-watch')) return <Eye size={16} className="text-green-400" />;
    return <Workflow size={16} className="text-purple-400" />;
  };

  const getBlockById = (blockId: string) => {
    return marketplaceBlocks.find(b => b.id === blockId);
  };

  // Build dependency levels for visualization
  const buildLevels = () => {
    const levels: DAGNode[][] = [];
    const processed = new Set<string>();
    const nodes = [...structure.nodes];

    while (processed.size < nodes.length) {
      const currentLevel = nodes.filter(node => 
        !processed.has(node.id) && 
        node.dependencies.every(dep => processed.has(dep))
      );

      if (currentLevel.length === 0 && processed.size < nodes.length) {
        // Circular dependency or orphaned nodes - add remaining
        const remaining = nodes.filter(n => !processed.has(n.id));
        levels.push(remaining);
        remaining.forEach(n => processed.add(n.id));
        break;
      }

      levels.push(currentLevel);
      currentLevel.forEach(n => processed.add(n.id));
    }

    return levels;
  };

  const levels = buildLevels();

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 text-sm text-[#858585] mb-4">
        <Workflow size={16} />
        <span>DAG Structure: {structure.nodes.length} nodes</span>
        <span>•</span>
        <span>Entry: {structure.nodes.find(n => n.id === structure.entrypoint)?.name || structure.entrypoint}</span>
      </div>

      {/* DAG Visualization */}
      <div className="space-y-6">
        {levels.map((level, levelIdx) => (
          <div key={levelIdx} className="space-y-3">
            {levelIdx > 0 && (
              <div className="flex justify-center">
                <div className="w-px h-6 bg-[#3e3e42]"></div>
              </div>
            )}
            <div className="grid gap-3" style={{ gridTemplateColumns: `repeat(${level.length}, minmax(0, 1fr))` }}>
              {level.map((node) => {
                const taskBlock = getBlockById(node.taskBlockId);
                const handlerBlock = getBlockById(node.eventHandlerBlockId);
                const checkerBlock = node.checkerBlockId ? getBlockById(node.checkerBlockId) : null;
                const isExpanded = expandedNodes.has(node.id);
                const isTaskExpanded = expandedTasks.has(node.taskBlockId);
                const isHandlerExpanded = expandedHandlers.has(node.eventHandlerBlockId);
                const isCheckerExpanded = node.checkerBlockId ? expandedCheckers.has(node.checkerBlockId) : false;
                const isStateExpanded = expandedStates.has(node.id);
                const isEntrypoint = node.id === structure.entrypoint;

                return (
                  <div key={node.id} className="flex flex-col items-center">
                    {/* Node Card */}
                    <div className={`border ${isEntrypoint ? 'border-green-500/50 bg-green-500/5' : 'border-[#3e3e42] bg-[#1e1e1e]'} rounded-lg p-3 w-full`}>
                      <div 
                        className="flex items-start gap-2 cursor-pointer"
                        onClick={() => toggleNode(node.id)}
                      >
                        <div className="mt-1">
                          {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            {isEntrypoint && <span className="text-[10px] bg-green-500/20 text-green-400 px-1.5 py-0.5 rounded">ENTRY</span>}
                            <h4 className="font-medium text-[#cccccc] text-sm truncate">{node.name}</h4>
                          </div>
                          <p className="text-xs text-[#858585] line-clamp-2">{node.description}</p>
                          {node.dependencies.length > 0 && (
                            <div className="text-[10px] text-[#858585] mt-2">
                              Depends on: {node.dependencies.map(dep => structure.nodes.find(n => n.id === dep)?.name || dep).join(', ')}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Expanded Node Details */}
                      {isExpanded && (
                        <div className="mt-3 space-y-3 border-t border-[#3e3e42] pt-3">
                          {/* Event Handler */}
                          <div className="bg-[#252526] rounded-lg p-2">
                            <div 
                              className="flex items-center gap-2 cursor-pointer"
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleHandler(node.eventHandlerBlockId);
                              }}
                            >
                              {isHandlerExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                              {getEventHandlerIcon(node.eventHandlerBlockId)}
                              <div className="flex-1">
                                <div className="text-xs font-medium text-pink-400">Event Handler</div>
                                <div className="text-[11px] text-[#858585]">{handlerBlock?.name || node.eventHandlerBlockId}</div>
                              </div>
                            </div>
                            
                            {isHandlerExpanded && handlerBlock?.containerStructure && (
                              <div className="mt-2 border border-[#3e3e42] rounded overflow-hidden">
                                <ContainerPreview structure={handlerBlock.containerStructure} />
                              </div>
                            )}
                          </div>

                          {/* Task Block */}
                          <div className="bg-[#252526] rounded-lg p-2">
                            <div 
                              className="flex items-center gap-2 cursor-pointer"
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleTask(node.taskBlockId);
                              }}
                            >
                              {isTaskExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                              <span className="text-yellow-400">{taskBlock?.icon || '📦'}</span>
                              <div className="flex-1">
                                <div className="text-xs font-medium text-yellow-400">Task Block</div>
                                <div className="text-[11px] text-[#858585]">{taskBlock?.name || node.taskBlockId}</div>
                              </div>
                            </div>
                            
                            {isTaskExpanded && taskBlock?.containerStructure && (
                              <div className="mt-2 border border-[#3e3e42] rounded overflow-hidden">
                                <ContainerPreview structure={taskBlock.containerStructure} />
                              </div>
                            )}
                          </div>

                          {/* Checker Block */}
                          {node.checkerBlockId && checkerBlock && (
                            <div className="bg-[#252526] rounded-lg p-2">
                              <div 
                                className="flex items-center gap-2 cursor-pointer"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  toggleChecker(node.checkerBlockId!);
                                }}
                              >
                                {isCheckerExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                                <CheckCircle2 size={16} className="text-green-400" />
                                <div className="flex-1">
                                  <div className="text-xs font-medium text-green-400">Pre-condition Checker</div>
                                  <div className="text-[11px] text-[#858585]">{checkerBlock?.name || node.checkerBlockId}</div>
                                </div>
                                <span className="text-[10px] bg-green-500/20 text-green-400 px-1.5 py-0.5 rounded">Returns 0 or 1</span>
                              </div>
                              
                              {isCheckerExpanded && checkerBlock?.containerStructure && (
                                <div className="mt-2 border border-[#3e3e42] rounded overflow-hidden">
                                  <ContainerPreview structure={checkerBlock.containerStructure} />
                                </div>
                              )}
                            </div>
                          )}

                          {/* State Documentation */}
                          {(node.expectedState || node.outputState) && (
                            <div className="bg-[#252526] rounded-lg p-2">
                              <div 
                                className="flex items-center gap-2 cursor-pointer"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  toggleState(node.id);
                                }}
                              >
                                {isStateExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                                <AlertCircle size={16} className="text-blue-400" />
                                <div className="flex-1">
                                  <div className="text-xs font-medium text-blue-400">State Documentation</div>
                                  <div className="text-[11px] text-[#858585]">Expected & Output States</div>
                                </div>
                              </div>
                              
                              {isStateExpanded && (
                                <div className="mt-3 space-y-3 text-xs">
                                  {node.expectedState && (
                                    <div>
                                      <div className="text-[#cccccc] font-medium mb-1 flex items-center gap-1">
                                        <span className="text-orange-400">→</span> Expected State (Before)
                                      </div>
                                      <div className="text-[#858585] bg-[#1e1e1e] p-2 rounded border border-[#3e3e42] leading-relaxed">
                                        {node.expectedState}
                                      </div>
                                    </div>
                                  )}
                                  {node.outputState && (
                                    <div>
                                      <div className="text-[#cccccc] font-medium mb-1 flex items-center gap-1">
                                        <span className="text-green-400">✓</span> Output State (After)
                                      </div>
                                      <div className="text-[#858585] bg-[#1e1e1e] p-2 rounded border border-[#3e3e42] leading-relaxed">
                                        {node.outputState}
                                      </div>
                                    </div>
                                  )}
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Connection Arrow (if not last level) */}
                    {levelIdx < levels.length - 1 && (
                      <div className="flex justify-center my-2">
                        <div className="text-[#3e3e42]">↓</div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <div className="text-xs text-[#858585] mt-4 p-3 bg-[#1e1e1e] border border-[#3e3e42] rounded">
        💡 Click on nodes to expand and view the event handler and task block details. Each node shows the event handler that triggers the task.
      </div>
    </div>
  );
}
