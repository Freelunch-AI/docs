import { useState } from 'react';
import { Activity, Clock, CheckCircle, AlertCircle, ChevronDown, ChevronRight } from 'lucide-react';
import type { MarketplaceBlock } from '../data/marketplaceBlocks';

interface TracingViewProps {
  block: MarketplaceBlock;
  requestPath?: string;
  requestMethod?: string;
}

interface TraceSpan {
  id: string;
  name: string;
  service: string;
  duration: number;
  startTime: number;
  status: 'success' | 'error';
  children?: TraceSpan[];
  metadata?: Record<string, string>;
}

export function TracingView({ block, requestPath = '/api/data', requestMethod = 'GET' }: TracingViewProps) {
  const [expandedSpans, setExpandedSpans] = useState<Set<string>>(new Set(['root']));
  
  // Generate mock trace data based on block architecture
  const traceData = generateTraceData(block, requestPath, requestMethod);
  
  const toggleSpan = (spanId: string) => {
    const newExpanded = new Set(expandedSpans);
    if (newExpanded.has(spanId)) {
      newExpanded.delete(spanId);
    } else {
      newExpanded.add(spanId);
    }
    setExpandedSpans(newExpanded);
  };

  const maxDuration = calculateMaxDuration(traceData);

  return (
    <div className="flex-1 flex flex-col bg-[#1e1e1e] overflow-hidden">
      {/* Header */}
      <div className="px-4 py-3 bg-[#252526] border-b border-[#3e3e42]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Activity className="w-5 h-5 text-[#007acc]" />
            <div>
              <h3 className="text-sm font-semibold text-[#cccccc]">Distributed Tracing</h3>
              <p className="text-xs text-[#858585]">
                {requestMethod} {requestPath} → {block.name}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4 text-xs text-[#858585]">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <span>Total: {traceData.duration}ms</span>
            </div>
            <div className="flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full ${
                traceData.status === 'success' ? 'bg-green-500' : 'bg-red-500'
              }`}></span>
              <span>{traceData.status === 'success' ? 'Success' : 'Error'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Timeline */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="space-y-1">
          <TraceSpanRow 
            span={traceData} 
            depth={0} 
            maxDuration={maxDuration}
            isExpanded={expandedSpans.has(traceData.id)}
            onToggle={() => toggleSpan(traceData.id)}
          />
        </div>
      </div>

      {/* Legend */}
      <div className="px-4 py-3 bg-[#252526] border-t border-[#3e3e42]">
        <div className="flex items-center gap-6 text-xs text-[#858585]">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-blue-500/20 border border-blue-500"></div>
            <span>Request Span</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-purple-500/20 border border-purple-500"></div>
            <span>Service Call</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-500/20 border border-green-500"></div>
            <span>Database Query</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-orange-500/20 border border-orange-500"></div>
            <span>Cache Operation</span>
          </div>
        </div>
      </div>
    </div>
  );
}

interface TraceSpanRowProps {
  span: TraceSpan;
  depth: number;
  maxDuration: number;
  isExpanded: boolean;
  onToggle: () => void;
}

function TraceSpanRow({ span, depth, maxDuration, isExpanded, onToggle }: TraceSpanRowProps) {
  const [expandedSpans, setExpandedSpans] = useState<Set<string>>(new Set());
  
  const hasChildren = span.children && span.children.length > 0;
  const widthPercent = (span.duration / maxDuration) * 100;
  const leftPercent = (span.startTime / maxDuration) * 100;

  const getSpanColor = (name: string, service: string) => {
    if (name.includes('request') || name.includes('Request')) return 'blue';
    if (service.includes('Database') || name.includes('query')) return 'green';
    if (service.includes('Cache') || service.includes('Redis')) return 'orange';
    return 'purple';
  };

  const color = getSpanColor(span.name, span.service);
  const colorClasses = {
    blue: 'bg-blue-500/20 border-blue-500 text-blue-400',
    purple: 'bg-purple-500/20 border-purple-500 text-purple-400',
    green: 'bg-green-500/20 border-green-500 text-green-400',
    orange: 'bg-orange-500/20 border-orange-500 text-orange-400',
  };

  const toggleChildSpan = (spanId: string) => {
    const newExpanded = new Set(expandedSpans);
    if (newExpanded.has(spanId)) {
      newExpanded.delete(spanId);
    } else {
      newExpanded.add(spanId);
    }
    setExpandedSpans(newExpanded);
  };

  return (
    <>
      <div 
        className="group hover:bg-[#2a2a2a] rounded cursor-pointer"
        onClick={onToggle}
      >
        <div className="flex items-center gap-2 py-2 px-2">
          {/* Expand/Collapse */}
          <div className="w-4 h-4 flex items-center justify-center" style={{ marginLeft: `${depth * 20}px` }}>
            {hasChildren && (
              isExpanded ? 
                <ChevronDown className="w-4 h-4 text-[#858585]" /> : 
                <ChevronRight className="w-4 h-4 text-[#858585]" />
            )}
          </div>

          {/* Span Info */}
          <div className="flex-1 flex items-center gap-3">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-sm text-[#cccccc] font-medium truncate">
                  {span.name}
                </span>
                <span className="text-xs text-[#858585]">
                  {span.service}
                </span>
              </div>
            </div>

            {/* Timeline Bar */}
            <div className="flex-1 relative h-6 bg-[#252526] rounded">
              <div 
                className={`absolute top-1 bottom-1 rounded border ${colorClasses[color]} flex items-center justify-end px-2`}
                style={{ 
                  left: `${leftPercent}%`, 
                  width: `${widthPercent}%`,
                  minWidth: '40px'
                }}
              >
                <span className="text-xs font-medium">{span.duration}ms</span>
              </div>
            </div>

            {/* Status */}
            <div className="w-20 flex items-center justify-center">
              {span.status === 'success' ? (
                <CheckCircle className="w-4 h-4 text-green-500" />
              ) : (
                <AlertCircle className="w-4 h-4 text-red-500" />
              )}
            </div>
          </div>
        </div>

        {/* Metadata */}
        {span.metadata && isExpanded && (
          <div className="ml-10 px-4 py-2 bg-[#252526] rounded text-xs text-[#858585] space-y-1">
            {Object.entries(span.metadata).map(([key, value]) => (
              <div key={key} className="flex gap-2">
                <span className="text-[#4ec9b0]">{key}:</span>
                <span>{value}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Children */}
      {hasChildren && isExpanded && span.children!.map(child => (
        <TraceSpanRow
          key={child.id}
          span={child}
          depth={depth + 1}
          maxDuration={maxDuration}
          isExpanded={expandedSpans.has(child.id)}
          onToggle={() => toggleChildSpan(child.id)}
        />
      ))}
    </>
  );
}

function calculateMaxDuration(span: TraceSpan): number {
  return span.startTime + span.duration;
}

function generateTraceData(block: MarketplaceBlock, path: string, method: string): TraceSpan {
  const baseTime = 0;
  
  // Generate trace based on block's internal architecture
  if (block.internalArchitecture) {
    return generateArchitectureTrace(block, path, method);
  }
  
  // Generate trace based on block's internal blocks (for custom blocks)
  if (block.classification === 'custom' && block.internalBlocks) {
    return generateCompositeTrace(block, path, method);
  }

  // Default simple trace
  return {
    id: 'root',
    name: `${method} ${path}`,
    service: 'API Gateway',
    duration: 145,
    startTime: baseTime,
    status: 'success',
    metadata: {
      'http.method': method,
      'http.url': path,
      'http.status_code': '200',
    },
    children: [
      {
        id: 'service-1',
        name: 'Process Request',
        service: block.name,
        duration: 120,
        startTime: baseTime + 5,
        status: 'success',
        metadata: {
          'service.version': block.version,
        }
      }
    ]
  };
}

function generateArchitectureTrace(block: MarketplaceBlock, path: string, method: string): TraceSpan {
  const arch = block.internalArchitecture!;
  const baseTime = 0;
  let currentTime = 5;

  const children: TraceSpan[] = [];

  // Create spans for each service in the architecture
  if (block.id === 'redis-cache') {
    children.push({
      id: 'span-1',
      name: 'Cache Lookup',
      service: 'Redis Master',
      duration: 15,
      startTime: currentTime,
      status: 'success',
      metadata: {
        'cache.key': 'user:123',
        'cache.hit': 'false',
      }
    });
    currentTime += 20;

    children.push({
      id: 'span-2',
      name: 'Replication Check',
      service: 'Redis Sentinel',
      duration: 8,
      startTime: currentTime,
      status: 'success',
      metadata: {
        'sentinel.master': 'redis-master',
        'sentinel.replicas': '2',
      }
    });
    currentTime += 12;

    children.push({
      id: 'span-3',
      name: 'Cache Write',
      service: 'Redis Master',
      duration: 12,
      startTime: currentTime,
      status: 'success',
      metadata: {
        'cache.operation': 'SET',
        'cache.ttl': '3600',
      },
      children: [
        {
          id: 'span-3-1',
          name: 'Replicate to Replica 1',
          service: 'Redis Replica 1',
          duration: 5,
          startTime: currentTime + 2,
          status: 'success',
        },
        {
          id: 'span-3-2',
          name: 'Replicate to Replica 2',
          service: 'Redis Replica 2',
          duration: 6,
          startTime: currentTime + 2,
          status: 'success',
        }
      ]
    });
  } else if (block.id === 'kafka-broker') {
    children.push({
      id: 'span-1',
      name: 'Producer Send',
      service: 'Kafka Producer',
      duration: 25,
      startTime: currentTime,
      status: 'success',
      metadata: {
        'kafka.topic': 'orders',
        'kafka.partition': '2',
      },
      children: [
        {
          id: 'span-1-1',
          name: 'Write to Broker 0',
          service: 'Kafka Broker 0',
          duration: 12,
          startTime: currentTime + 5,
          status: 'success',
          metadata: {
            'kafka.offset': '12345',
          }
        },
        {
          id: 'span-1-2',
          name: 'Replicate to Broker 1',
          service: 'Kafka Broker 1',
          duration: 10,
          startTime: currentTime + 8,
          status: 'success',
        },
        {
          id: 'span-1-3',
          name: 'Replicate to Broker 2',
          service: 'Kafka Broker 2',
          duration: 11,
          startTime: currentTime + 8,
          status: 'success',
        }
      ]
    });
    currentTime += 30;

    children.push({
      id: 'span-2',
      name: 'Coordinator Metadata Update',
      service: 'Zookeeper',
      duration: 8,
      startTime: currentTime,
      status: 'success',
      metadata: {
        'zk.path': '/brokers/topics/orders',
      }
    });
  } else if (block.id === 'postgresql-ha') {
    children.push({
      id: 'span-1',
      name: 'Execute Query',
      service: 'PostgreSQL Primary',
      duration: 45,
      startTime: currentTime,
      status: 'success',
      metadata: {
        'db.statement': 'SELECT * FROM users WHERE id = $1',
        'db.rows_affected': '1',
      },
      children: [
        {
          id: 'span-1-1',
          name: 'WAL Streaming to Standby 1',
          service: 'PostgreSQL Standby 1',
          duration: 15,
          startTime: currentTime + 25,
          status: 'success',
        },
        {
          id: 'span-1-2',
          name: 'WAL Streaming to Standby 2',
          service: 'PostgreSQL Standby 2',
          duration: 18,
          startTime: currentTime + 25,
          status: 'success',
        }
      ]
    });
  } else if (block.id === 's3-storage') {
    children.push({
      id: 'span-1',
      name: 'Upload Object',
      service: 'MinIO Node 0',
      duration: 65,
      startTime: currentTime,
      status: 'success',
      metadata: {
        's3.bucket': 'my-bucket',
        's3.key': 'uploads/file.txt',
        's3.size': '2048 bytes',
      },
      children: [
        {
          id: 'span-1-1',
          name: 'Erasure Code to Node 1',
          service: 'MinIO Node 1',
          duration: 35,
          startTime: currentTime + 10,
          status: 'success',
        },
        {
          id: 'span-1-2',
          name: 'Erasure Code to Node 2',
          service: 'MinIO Node 2',
          duration: 38,
          startTime: currentTime + 10,
          status: 'success',
        },
        {
          id: 'span-1-3',
          name: 'Erasure Code to Node 3',
          service: 'MinIO Node 3',
          duration: 40,
          startTime: currentTime + 10,
          status: 'success',
        }
      ]
    });
  } else {
    // Generic architecture trace
    arch.services.slice(0, 3).forEach((service, idx) => {
      children.push({
        id: `span-${idx + 1}`,
        name: `${service.name} Processing`,
        service: service.name,
        duration: 20 + Math.random() * 30,
        startTime: currentTime,
        status: 'success',
        metadata: {
          'service.name': service.name,
          'container.image': service.containerStructure?.entrypoint || 'unknown',
        }
      });
      currentTime += 25;
    });
  }

  const totalDuration = currentTime + 5;

  return {
    id: 'root',
    name: `${method} ${path}`,
    service: 'API Gateway',
    duration: totalDuration,
    startTime: baseTime,
    status: 'success',
    metadata: {
      'http.method': method,
      'http.url': path,
      'http.status_code': '200',
      'trace.id': `trace-${Date.now()}`,
    },
    children
  };
}

function generateCompositeTrace(block: MarketplaceBlock, path: string, method: string): TraceSpan {
  const baseTime = 0;
  let currentTime = 5;
  const children: TraceSpan[] = [];

  // For custom blocks, trace through internal blocks and microservices
  if (block.id === 'ecommerce-platform') {
    children.push({
      id: 'span-1',
      name: 'Product Catalog Service',
      service: 'Product Catalog API',
      duration: 35,
      startTime: currentTime,
      status: 'success',
      metadata: {
        'service.type': 'microservice',
      },
      children: [
        {
          id: 'span-1-1',
          name: 'Query Products',
          service: 'PostgreSQL',
          duration: 15,
          startTime: currentTime + 5,
          status: 'success',
          metadata: {
            'db.query': 'SELECT * FROM products',
          }
        },
        {
          id: 'span-1-2',
          name: 'Cache Check',
          service: 'Redis',
          duration: 8,
          startTime: currentTime + 22,
          status: 'success',
          metadata: {
            'cache.operation': 'GET',
          }
        }
      ]
    });
    currentTime += 40;

    children.push({
      id: 'span-2',
      name: 'Order Service',
      service: 'Order Processing',
      duration: 55,
      startTime: currentTime,
      status: 'success',
      metadata: {
        'service.type': 'microservice',
      },
      children: [
        {
          id: 'span-2-1',
          name: 'Validate Order',
          service: 'Order Processing',
          duration: 12,
          startTime: currentTime + 3,
          status: 'success',
        },
        {
          id: 'span-2-2',
          name: 'Payment Gateway Call',
          service: 'Payment Gateway',
          duration: 35,
          startTime: currentTime + 18,
          status: 'success',
          metadata: {
            'payment.method': 'credit_card',
          }
        }
      ]
    });
    currentTime += 60;

    children.push({
      id: 'span-3',
      name: 'Notification Service',
      service: 'Notification API',
      duration: 25,
      startTime: currentTime,
      status: 'success',
      metadata: {
        'service.type': 'microservice',
      },
      children: [
        {
          id: 'span-3-1',
          name: 'Queue Email',
          service: 'Kafka',
          duration: 15,
          startTime: currentTime + 5,
          status: 'success',
          metadata: {
            'kafka.topic': 'notifications',
          }
        }
      ]
    });
  } else if (block.internalArchitecture) {
    // Has internal microservices
    const services = block.internalArchitecture.services.slice(0, 3);
    services.forEach((service, idx) => {
      children.push({
        id: `span-${idx + 1}`,
        name: `${service.name} Processing`,
        service: service.name,
        duration: 25 + Math.random() * 25,
        startTime: currentTime,
        status: 'success',
        metadata: {
          'service.name': service.name,
        }
      });
      currentTime += 30;
    });
  }

  const totalDuration = currentTime + 5;

  return {
    id: 'root',
    name: `${method} ${path}`,
    service: 'API Gateway',
    duration: totalDuration,
    startTime: baseTime,
    status: 'success',
    metadata: {
      'http.method': method,
      'http.url': path,
      'http.status_code': '200',
      'trace.id': `trace-${Date.now()}`,
      'block.type': 'composite',
    },
    children
  };
}
