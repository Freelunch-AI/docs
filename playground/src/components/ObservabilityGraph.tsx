import { useEffect, useRef, useState } from 'react';
import type { MarketplaceBlock } from '../data/marketplaceBlocks';
import { ContainerPreview } from './ContainerPreview';

interface ObservabilityGraphProps {
  block: MarketplaceBlock;
}

interface ServiceNode {
  id: string;
  name: string;
  x: number;
  y: number;
  width: number;
  height: number;
  observedValues: Record<string, any>;
  activeConnections: string[];
  terminalOutput: string[];
  isDistributed?: boolean;
  internalServiceIds?: string[];
  selectedInternalService?: number;
}

interface ConnectionInfo {
  from: string;
  to: string;
  arrowType: 'one-way' | 'two-way';
  arrowStyle: 'solid' | 'dashed';
  access: 'read-only' | 'write-only' | 'read-write';
  label?: string;
  isActive: boolean;
}

export function ObservabilityGraph({ block }: ObservabilityGraphProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [nodes, setNodes] = useState<ServiceNode[]>([]);
  const [connections, setConnections] = useState<ConnectionInfo[]>([]);
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const [draggedNode, setDraggedNode] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [resizingNode, setResizingNode] = useState<string | null>(null);
  const [resizeStart, setResizeStart] = useState<{ width: number; height: number; mouseX: number; mouseY: number }>({ width: 0, height: 0, mouseX: 0, mouseY: 0 });

  // Handle microservice toggle
  const handleMicroserviceToggle = (nodeId: string, index: number) => {
    setNodes(prevNodes => 
      prevNodes.map(node => 
        node.id === nodeId 
          ? { ...node, selectedInternalService: index }
          : node
      )
    );
  };

  // Initialize nodes from block architecture
  useEffect(() => {
    if (block.internalArchitecture) {
      const initialNodes: ServiceNode[] = block.internalArchitecture.services.map((service, idx) => {
        const totalServices = block.internalArchitecture!.services.length;
        const cols = Math.ceil(Math.sqrt(totalServices));
        const row = Math.floor(idx / cols);
        const col = idx % cols;
        
        // A service is distributed if it has a microservices array
        const isDistributed = !!service.microservices && service.microservices.length > 1;
        const internalServiceIds = isDistributed ? service.microservices!.map(ms => ms.name) : undefined;
        
        return {
          id: service.id,
          name: service.name,
          x: 150 + col * 380,
          y: 100 + row * 300,
          width: 420,
          height: 400,
          observedValues: generateMockObservedValues(service.name),
          activeConnections: [],
          terminalOutput: [`$ `],
          isDistributed,
          internalServiceIds,
          selectedInternalService: 0
        };
      });
      setNodes(initialNodes);

      // Initialize connections with metadata
      const initialConnections: ConnectionInfo[] = block.internalArchitecture.connections.map(conn => ({
        from: conn.from,
        to: conn.to,
        arrowType: conn.arrowType,
        arrowStyle: conn.arrowStyle,
        access: conn.access,
        label: conn.label,
        isActive: false
      }));
      setConnections(initialConnections);
    }
  }, [block]);

  // Generate mock observed values based on service type
  const generateMockObservedValues = (serviceName: string) => {
    const values: Record<string, any> = {};
    
    // Common metrics for all services
    values['cpu_usage'] = `${(Math.random() * 40 + 10).toFixed(1)}%`;
    values['memory_mb'] = `${Math.floor(Math.random() * 500 + 100)}MB`;
    values['requests_per_sec'] = Math.floor(Math.random() * 100 + 10);
    
    // Service-specific observed values
    if (serviceName.toLowerCase().includes('cache') || serviceName.toLowerCase().includes('redis')) {
      values['hit_rate'] = `${(Math.random() * 30 + 65).toFixed(1)}%`;
      values['evictions_per_sec'] = Math.floor(Math.random() * 5);
    } else if (serviceName.toLowerCase().includes('db') || serviceName.toLowerCase().includes('database')) {
      values['active_connections'] = Math.floor(Math.random() * 20 + 5);
      values['query_latency_ms'] = `${(Math.random() * 15 + 5).toFixed(1)}ms`;
    } else if (serviceName.toLowerCase().includes('kafka') || serviceName.toLowerCase().includes('broker')) {
      values['messages_per_sec'] = Math.floor(Math.random() * 1000 + 100);
      values['lag'] = Math.floor(Math.random() * 50);
    } else {
      // Application service
      values['response_time_ms'] = `${(Math.random() * 100 + 20).toFixed(1)}ms`;
      values['error_rate'] = `${(Math.random() * 2).toFixed(2)}%`;
    }
    
    return values;
  };

  // Simulate live updates
  useEffect(() => {
    const interval = setInterval(() => {
      setNodes(prev => prev.map(node => {
        return {
          ...node,
          observedValues: generateMockObservedValues(node.name),
          activeConnections: Math.random() > 0.7 
            ? [prev[Math.floor(Math.random() * prev.length)]?.id].filter(Boolean)
            : []
        };
      }));

      // Randomly activate connections
      setConnections(prev => prev.map(conn => ({
        ...conn,
        isActive: Math.random() > 0.6
      })));
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  // Handle document-level mouse events for dragging and resizing
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (draggedNode || resizingNode) {
        const container = containerRef.current;
        if (!container) return;

        const scrollableDiv = container.querySelector('.overflow-auto') as HTMLElement;
        if (!scrollableDiv) return;

        const rect = scrollableDiv.getBoundingClientRect();
        const scrollLeft = scrollableDiv.scrollLeft;
        const scrollTop = scrollableDiv.scrollTop;

        if (draggedNode) {
          const x = e.clientX - rect.left + scrollLeft - dragOffset.x;
          const y = e.clientY - rect.top + scrollTop - dragOffset.y;
          
          setNodes(prev => prev.map(node => 
            node.id === draggedNode 
              ? { ...node, x: Math.max(0, x), y: Math.max(0, y) }
              : node
          ));
        } else if (resizingNode) {
          const deltaX = e.clientX - resizeStart.mouseX;
          const deltaY = e.clientY - resizeStart.mouseY;
          
          setNodes(prev => prev.map(node => 
            node.id === resizingNode 
              ? { 
                  ...node, 
                  width: Math.max(200, resizeStart.width + deltaX),
                  height: Math.max(150, resizeStart.height + deltaY)
                }
              : node
          ));
        }
      }
    };

    const handleMouseUp = () => {
      setDraggedNode(null);
      setResizingNode(null);
    };

    if (draggedNode || resizingNode) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [draggedNode, resizingNode, dragOffset, resizeStart]);

  // Draw the graph
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw connections with enhanced styling
    connections.forEach(conn => {
      const fromNode = nodes.find(n => n.id === conn.from);
      const toNode = nodes.find(n => n.id === conn.to);
      
      if (fromNode && toNode) {
        const isActive = conn.isActive;
        
        // Calculate connection path - connect from center of widgets
        const fromCenterX = fromNode.x + fromNode.width / 2;
        const fromCenterY = fromNode.y + fromNode.height / 2;
        const toCenterX = toNode.x + toNode.width / 2;
        const toCenterY = toNode.y + toNode.height / 2;
        
        const dx = toCenterX - fromCenterX;
        const dy = toCenterY - fromCenterY;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        // Start and end points (offset to edge of widget)
        const offset = Math.min(fromNode.width, fromNode.height, toNode.width, toNode.height) / 2;
        const startX = fromCenterX + (dx / distance) * offset;
        const startY = fromCenterY + (dy / distance) * offset;
        const endX = toCenterX - (dx / distance) * offset;
        const endY = toCenterY - (dy / distance) * offset;
        
        // Line styling based on connection type
        ctx.beginPath();
        ctx.moveTo(startX, startY);
        ctx.lineTo(endX, endY);
        
        // Color based on activity and access type
        let lineColor = '#3e3e42';
        if (isActive) {
          if (conn.access === 'read-only') lineColor = '#4fc3f7';
          else if (conn.access === 'write-only') lineColor = '#f48fb1';
          else lineColor = '#4ec9b0';
        }
        
        ctx.strokeStyle = lineColor;
        ctx.lineWidth = isActive ? 3 : 1.5;
        ctx.setLineDash(conn.arrowStyle === 'dashed' ? [8, 4] : []);
        ctx.stroke();
        ctx.setLineDash([]);

        // Draw arrow head for one-way or both ends for two-way
        const angle = Math.atan2(dy, dx);
        const arrowSize = 12;
        
        // Main arrow (to direction)
        ctx.beginPath();
        ctx.moveTo(endX, endY);
        ctx.lineTo(
          endX - arrowSize * Math.cos(angle - Math.PI / 6),
          endY - arrowSize * Math.sin(angle - Math.PI / 6)
        );
        ctx.lineTo(
          endX - arrowSize * Math.cos(angle + Math.PI / 6),
          endY - arrowSize * Math.sin(angle + Math.PI / 6)
        );
        ctx.closePath();
        ctx.fillStyle = lineColor;
        ctx.fill();
        
        // Second arrow for two-way connections
        if (conn.arrowType === 'two-way') {
          ctx.beginPath();
          ctx.moveTo(startX, startY);
          ctx.lineTo(
            startX + arrowSize * Math.cos(angle - Math.PI / 6),
            startY + arrowSize * Math.sin(angle - Math.PI / 6)
          );
          ctx.lineTo(
            startX + arrowSize * Math.cos(angle + Math.PI / 6),
            startY + arrowSize * Math.sin(angle + Math.PI / 6)
          );
          ctx.closePath();
          ctx.fillStyle = lineColor;
          ctx.fill();
        }
        
        // Draw connection label
        if (conn.label || isActive) {
          const midX = (startX + endX) / 2;
          const midY = (startY + endY) / 2;
          
          ctx.fillStyle = '#1e1e1e';
          ctx.fillRect(midX - 30, midY - 10, 60, 20);
          
          ctx.fillStyle = lineColor;
          ctx.font = '10px monospace';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          
          const labelText = conn.label || conn.arrowStyle.substring(0, 3);
          ctx.fillText(labelText, midX, midY);
        }
      }
    });
  }, [nodes, connections]);

  // Handle mouse down to start dragging
  const handleMouseDown = (nodeId: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const node = nodes.find(n => n.id === nodeId);
    if (!node) return;
    
    setDraggedNode(nodeId);
    // Calculate offset from mouse to node's top-left corner
    const rect = (e.target as HTMLElement).closest('.absolute')?.getBoundingClientRect();
    if (rect) {
      setDragOffset({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      });
    }
  };

  // Handle resize start
  const handleResizeStart = (nodeId: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const node = nodes.find(n => n.id === nodeId);
    if (!node) return;
    
    setResizingNode(nodeId);
    setResizeStart({
      width: node.width,
      height: node.height,
      mouseX: e.clientX,
      mouseY: e.clientY
    });
  };

  const hoveredNodeData = nodes.find(n => n.id === hoveredNode);

  return (
    <div 
      ref={containerRef}
      className="h-full flex flex-col overflow-auto"
    >
      {/* Legend */}
      <div className="bg-[#252526] border-b border-[#3e3e42] px-4 py-2">
        <div className="flex items-center gap-6 text-xs">
          <span className="text-[#858585] font-semibold">Connection Types:</span>
          <div className="flex items-center gap-2">
            <div className="w-8 h-0.5 bg-[#4fc3f7]"></div>
            <span className="text-[#cccccc]">Read-Only</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-0.5 bg-[#f48fb1]"></div>
            <span className="text-[#cccccc]">Write-Only</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-0.5 bg-[#4ec9b0]"></div>
            <span className="text-[#cccccc]">Read-Write</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-0.5 border-t-2 border-dashed border-[#cccccc]"></div>
            <span className="text-[#cccccc]">Streaming</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-0.5 bg-[#cccccc]"></div>
            <span className="text-[#cccccc]">Req/Res</span>
          </div>
        </div>
      </div>
      
      <div className="flex-1 flex overflow-hidden min-h-0">
        {/* Main Canvas with Service Widgets - Scrollable */}
        <div className="flex-1 bg-[#1e1e1e] overflow-auto relative min-h-0">
          <div className="relative" style={{ minWidth: '2000px', minHeight: '1400px' }}>
            {/* Background Canvas for Connections */}
            <canvas
              ref={canvasRef}
              width={2000}
              height={1400}
              className="absolute inset-0 pointer-events-none"
            />
            
            {/* Draggable Service Widgets */}
            {nodes.map(node => {
              const service = block.internalArchitecture?.services.find(s => s.id === node.id);
              
              // For distributed services, get the selected microservice's container structure
              let containerStructure = null;
              
              if (service) {
                if (node.isDistributed && service.microservices) {
                  const selectedMicroservice = service.microservices[node.selectedInternalService || 0];
                  containerStructure = selectedMicroservice?.containerStructure;
                } else {
                  containerStructure = service.containerStructure;
                }
              }
              
              return (
              <div
                key={node.id}
                className="absolute bg-[#252526] border-2 border-[#3e3e42] rounded-lg shadow-lg overflow-hidden flex flex-col"
                style={{
                  left: `${node.x}px`,
                  top: `${node.y}px`,
                  width: `${node.width}px`,
                  height: `${node.height}px`,
                  zIndex: draggedNode === node.id || resizingNode === node.id ? 1000 : hoveredNode === node.id ? 100 : 10,
                  borderColor: hoveredNode === node.id ? '#4fc3f7' : '#3e3e42'
                }}
                onMouseEnter={() => setHoveredNode(node.id)}
                onMouseLeave={() => setHoveredNode(null)}
              >
                {/* Header - Draggable Area */}
                <div 
                  className="bg-[#1e1e1e] border-b border-[#3e3e42] px-3 py-2 cursor-grab active:cursor-grabbing select-none flex-shrink-0"
                  onMouseDown={(e) => handleMouseDown(node.id, e)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                      <span className="text-sm font-semibold text-[#cccccc]">{node.name}</span>
                    </div>
                    <span className="text-xs text-[#858585]">{node.id}</span>
                  </div>
                </div>

                {/* Internal Microservice Toggle - Only for distributed services */}
                {node.isDistributed && node.internalServiceIds && node.internalServiceIds.length > 1 && (
                  <div className="bg-[#252526] border-b border-[#3e3e42] px-2 py-1.5 flex gap-1 overflow-x-auto flex-shrink-0">
                    {node.internalServiceIds.map((serviceName, idx) => {
                      return (
                        <button
                          key={idx}
                          onClick={() => handleMicroserviceToggle(node.id, idx)}
                          className={`px-2 py-1 text-[10px] rounded transition-colors whitespace-nowrap ${
                            node.selectedInternalService === idx
                              ? 'bg-[#007acc] text-white font-semibold'
                              : 'bg-[#3e3e42] text-[#cccccc] hover:bg-[#4e4e52]'
                          }`}
                        >
                          {serviceName}
                        </button>
                      );
                    })}
                  </div>
                )}

                {/* Container Structure - 70% */}
                <div className="bg-[#1e1e1e] overflow-hidden flex-grow" style={{ height: '70%' }}>
                  {containerStructure ? (
                    <div className="h-full overflow-auto" style={{ fontSize: '11px' }}>
                      <ContainerPreview structure={containerStructure} />
                    </div>
                  ) : (
                    <div className="p-3 text-[#858585] text-xs">No container structure available</div>
                  )}
                </div>

                {/* Terminal - 30% */}
                <div className="bg-black overflow-y-auto font-mono text-xs border-t border-[#3e3e42] flex-shrink-0" style={{ height: '30%' }}>
                  <div className="p-2 space-y-0.5">
                    {node.terminalOutput.map((line, idx) => (
                      <div key={idx} className="text-green-400">
                        {line}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Resize Handle */}
                <div
                  className="absolute bottom-0 right-0 w-6 h-6 cursor-nwse-resize bg-[#007acc]/40 hover:bg-[#007acc]/70 border-l-2 border-t-2 border-[#007acc] transition-colors"
                  style={{ clipPath: 'polygon(100% 0, 100% 100%, 0 100%)' }}
                  onMouseDown={(e) => handleResizeStart(node.id, e)}
                  title="Drag to resize"
                />
              </div>
              );
            })}
          </div>
        </div>

        {/* Observed Values Panel */}
        <div className="w-80 bg-[#252526] border-l border-[#3e3e42] overflow-y-auto">
        <div className="p-4 border-b border-[#3e3e42]">
          <h3 className="text-sm font-semibold text-[#cccccc] mb-1">Observed Values</h3>
          <p className="text-xs text-[#858585]">
            Real-time metrics from {block.observability?.includes('metalang') ? 'MetaLang' : 'OpenTelemetry'}
          </p>
        </div>

        {hoveredNodeData ? (
          <div className="p-4">
            <div className="mb-4">
              <h4 className="text-sm font-semibold text-[#4fc3f7] mb-2">{hoveredNodeData.name}</h4>
              <div className="text-xs text-[#858585]">Service ID: {hoveredNodeData.id}</div>
            </div>

            <div className="space-y-3">
              {Object.entries(hoveredNodeData.observedValues).map(([key, value]) => (
                <div key={key} className="bg-[#1e1e1e] border border-[#3e3e42] rounded p-2">
                  <div className="text-xs text-[#858585] mb-1">{key.replace(/_/g, ' ').toUpperCase()}</div>
                  <div className="text-sm text-[#4ec9b0] font-mono">{String(value)}</div>
                </div>
              ))}
            </div>

            {hoveredNodeData.activeConnections.length > 0 && (
              <div className="mt-4 pt-4 border-t border-[#3e3e42]">
                <div className="text-xs text-[#858585] mb-2">ACTIVE CONNECTIONS</div>
                {hoveredNodeData.activeConnections.map(connId => {
                  const connNode = nodes.find(n => n.id === connId);
                  return connNode ? (
                    <div key={connId} className="text-sm text-[#4ec9b0] mb-1">
                      → {connNode.name}
                    </div>
                  ) : null;
                })}
              </div>
            )}
          </div>
        ) : (
          <div className="p-4">
            <div className="text-center text-[#858585] py-8">
              <p className="text-sm mb-2">Hover over a service widget</p>
              <p className="text-xs">to see detailed metrics</p>
            </div>

            {/* All nodes summary */}
            <div className="space-y-2">
              <div className="text-xs text-[#858585] uppercase font-semibold mb-2">All Services</div>
              {nodes.map(node => (
                <div key={node.id} className="bg-[#1e1e1e] border border-[#3e3e42] rounded p-2">
                  <div className="text-xs text-[#cccccc] font-semibold mb-1">{node.name}</div>
                  <div className="text-xs text-[#858585]">
                    {Object.keys(node.observedValues).length} metrics tracked
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        </div>
      </div>
    </div>
  );
}
