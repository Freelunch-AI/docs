export type BlockType = 'service' | 'serviceBlock' | 'workloadsInfra' | 'infrastructure' | 'pipeline' | 'dag' | 'task' | 'function' | 'experimentation';
export type BlockClassification = 'concrete' | 'custom' | 'virtual';
export type DependencyType = 'read' | 'write' | 'readWrite';
export type CommunicationPattern = 'requestResponse' | 'streaming';

export type ExperimentationType = 'ab-test' | 'multi-armed-bandit' | 'canary' | 'blue-green' | 'shadow';

export interface ExperimentVariant {
  id: string;
  name: string;
  blockId: string;
  weight?: number; // For A/B testing and bandits (0-100)
  trafficPercentage?: number; // For canary (0-100)
  description?: string;
}

export interface ExperimentMetrics {
  successRate?: number;
  latencyP50?: number;
  latencyP95?: number;
  latencyP99?: number;
  errorRate?: number;
  throughput?: number;
  conversionRate?: number;
  rewardScore?: number; // For bandits
}

export interface ExperimentStrategy {
  type: ExperimentationType;
  duration?: string; // e.g., "7 days", "until manually stopped"
  successCriteria?: string;
  rollbackThreshold?: string; // e.g., "error_rate > 5%"
  autoPromote?: boolean; // Auto-promote winning variant
}

export interface ExperimentConfiguration {
  strategy: ExperimentStrategy;
  variants: ExperimentVariant[];
  baselineVariantId?: string; // The control/baseline variant
  metrics: string[]; // List of metrics to track
  requiredSampleSize?: number;
  confidenceLevel?: number; // e.g., 95, 99
}

export interface Dependency {
  targetId: string;
  type: DependencyType;
  pattern: CommunicationPattern;
  endpoint?: string;
  topic?: string;
  description?: string;
}

export interface BlockMetadata {
  cpu?: string;
  memory?: string;
  monthlyCost: number;
  health?: 'healthy' | 'degraded' | 'down';
  uptime?: string;
  created?: string;
  author?: string;
}

export interface Block {
  id: string;
  name: string;
  type: BlockType;
  classification: BlockClassification;
  version: string;
  description: string;
  language?: string;
  framework?: string;
  arguments: Record<string, any>;
  dependencies: Dependency[];
  metadata: BlockMetadata;
  code?: Record<string, string>; // filename -> code content
  endpoints?: string[];
  rpcCalls?: string[];
  tags?: string[];
}

export interface SystemState {
  branch: 'main' | 'feature/add-recommendations';
  blocks: Block[];
}

export interface LogEntry {
  timestamp: string;
  service: string;
  level: 'INFO' | 'WARN' | 'ERROR';
  message: string;
  requestId?: string;
  stackTrace?: string;
}

export interface TraceSpan {
  service: string;
  operation: string;
  startTime: number;
  duration: number;
  metadata?: Record<string, any>;
}

export interface Trace {
  id: string;
  timestamp: string;
  endpoint: string;
  totalDuration: number;
  spans: TraceSpan[];
}
