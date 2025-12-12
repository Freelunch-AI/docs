import type { ExperimentConfiguration } from '../types';

export type BlockType = 'service' | 'service-block' | 'workloads-infra' | 'infrastructure' | 'dag' | 'task' | 'function' | 'experimentation';
export type BlockClassification = 'concrete' | 'custom' | 'virtual';
export type BlockCategory = 'code' | 'infra' | 'workloads-infra' | 'code-workloads-infra' | 'supporting-services' | 'ci';
export type BlockLabel = 'app-service' | 'supporting-service' | 'workloads-infra' | 'ir-infra' | 'code-workloads-infra';
export type DeploymentArchitecture = 'single-service' | 'distributed';
export type AIArtifactCategory = 'model' | 'prompt' | 'agent' | 'dataset';
export type ModelFormat = 'GGUF' | 'ONNX' | 'PyTorch' | 'TensorFlow' | 'SafeTensors' | 'Pickle' | 'CKPT' | 'HuggingFace';
export type ModelType = 'ML' | 'DL' | 'SLM' | 'LLM' | 'Diffusion' | 'Vision' | 'Audio' | 'Multimodal';
export type DatasetFormat = 'CSV' | 'Parquet' | 'JSON' | 'JSONL' | 'Arrow' | 'HDF5' | 'TFRecord' | 'Images' | 'Audio' | 'Video';
export type SchemaType = 'Table' | 'Document' | 'Graph' | 'Key-Value' | 'Time-Series' | 'Column-Family';

export type ArrowType = 'one-way' | 'two-way';
export type ArrowStyle = 'solid' | 'dashed'; // solid = req/res, dashed = streaming
export type ArrowAccess = 'read-only' | 'write-only' | 'read-write';

export interface InternalService {
  id: string;
  name: string;
  description: string;
  containerStructure?: ContainerStructure; // Full container visualization (for single services)
  microservices?: InternalMicroservice[]; // For distributed services with multiple internal microservices
  port?: number;
}

export interface InternalMicroservice {
  id: string;
  name: string;
  containerStructure: ContainerStructure;
  port?: number;
}

export interface ServiceConnection {
  from: string; // Service ID
  to: string; // Service ID
  arrowType: ArrowType;
  arrowStyle: ArrowStyle;
  access: ArrowAccess;
  label?: string; // Optional label for the connection
}

export interface InternalArchitecture {
  services: InternalService[];
  connections: ServiceConnection[];
  entrypoints?: string[]; // IDs of services/blocks that can receive external requests
}

export interface ContainerFile {
  path: string;
  content: string;
  isEntrypoint?: boolean;
}

export interface SidecarContainer {
  id: string;
  name: string;
  description: string;
  icon?: string;
  files: ContainerFile[];
  dockerfile: string;
  purpose: string; // e.g., "Observability", "Security", "Logging"
}

export interface ContainerStructure {
  files: ContainerFile[];
  dockerfile: string;
  entrypoint: string; // Path to the entrypoint file
  sidecars?: SidecarContainer[]; // Sidecar containers attached to this container
}

export interface InfrastructureAddon {
  id: string;
  name: string;
  description: string;
  icon?: string;
  purpose: string; // e.g., "Autoscaling", "Security", "Monitoring"
  operatorCRD: string; // Kubernetes Custom Resource Definition
  operatorManifest: string; // K8s operator deployment YAML
}

export interface BlockInteraction {
  from: string;
  to: string;
  type: 'http' | 'grpc' | 'event' | 'data-flow';
  description: string;
}

export type ObservabilityType = 'metalang' | 'opentelemetry' | 'openlineage';

export interface SLA {
  uptime: string; // e.g., "99.9%", "99.95%"
  latency: {
    p50: string; // e.g., "< 10ms"
    p95: string; // e.g., "< 50ms"
    p99: string; // e.g., "< 100ms"
  };
  throughput?: string; // e.g., "10k req/s"
  dataRetention?: string; // e.g., "30 days", "1 year"
  backupFrequency?: string; // e.g., "hourly", "daily"
  rpo?: string; // Recovery Point Objective, e.g., "< 1 hour"
  rto?: string; // Recovery Time Objective, e.g., "< 15 minutes"
}

// DAG Structure Interfaces
export interface DAGNode {
  id: string;
  taskBlockId: string; // ID of the task block
  eventHandlerBlockId: string; // ID of the event handler function block
  checkerBlockId?: string; // ID of the checker function block that verifies pre-conditions (returns 0 or 1)
  name: string;
  description: string;
  dependencies: string[]; // IDs of other nodes this node depends on
  taskArguments?: Record<string, any>; // Arguments passed to the task
  eventHandlerArguments?: Record<string, any>; // Arguments passed to the event handler
  checkerArguments?: Record<string, any>; // Arguments passed to the checker function
  expectedState?: string; // Documentation of expected state before task execution
  outputState?: string; // Documentation of expected state after task execution
}

export interface DAGStructure {
  nodes: DAGNode[];
  entrypoint: string; // ID of the first node to execute
}

export interface MarketplaceBlock {
  id: string;
  name: string;
  type: BlockType;
  classification: BlockClassification;
  category: BlockCategory; // NEW: code, infra, or workloads-infra
  blockLabel: BlockLabel; // NEW: app-service, supporting-service, workloads-infra, ir-infra
  author: string;
  lastUpdated?: string; // ISO date string
  version: string;
  description: string;
  longDescription: string;
  tags: string[];
  stats: {
    stars: number;
    downloads: number;
  };
  icon: string; // Emoji for now
  sla?: SLA; // For virtual blocks: defined service level agreements
  provider?: string; // For virtual blocks in marketplace: AWS, GCP, Azure, etc.
  requiresSecret?: boolean; // For virtual blocks in marketplace: whether API keys/secrets needed
  observability?: ObservabilityType[]; // Observability approach: metalang decorators, opentelemetry, or openlineage
  exampleUsageBlock?: string; // For infra blocks: ID of a concrete block using this infra
  arguments?: Record<string, {
    type: string;
    required: boolean;
    default?: any;
    description: string;
  }>;
  dependencies?: string[];
  internalBlocks?: string[]; // For custom/composite blocks
  workloadsInfraBlock?: string; // ID of the workloads infrastructure block (e.g., 'eks-cluster', 'ec2-cluster')
  addons?: InfrastructureAddon[]; // For workloads-infra blocks: k8s operator add-ons (autoscaling, monitoring, etc.)
  blockInteractions?: BlockInteraction[]; // For custom blocks - how internal blocks interact
  languages?: string[];
  framework?: string;
  hasSDK?: boolean; // Whether the block has an SDK available
  sdkDocs?: string; // SDK reference documentation for blocks with hasSDK=true
  isMaintained?: boolean; // Whether the block is actively maintained (default true)
  isStateful?: boolean; // Whether the block maintains state
  deploymentArchitecture?: DeploymentArchitecture; // For concrete blocks: single-service or distributed
  internalArchitecture?: InternalArchitecture; // For distributed/custom blocks: internal services and their connections
  helmChart?: string; // Helm chart YAML for deploying the service
  k8sOperator?: {
    operatorManifest: string; // K8s operator deployment YAML
    crd: string; // Custom Resource Definition YAML
  };
  metadata?: {
    resources?: {
      cpu?: string;
      memory?: string;
      storage?: string;
    };
    replicas?: number;
    healthCheck?: string;
  };
  containerStructure?: ContainerStructure; // For concrete service blocks - container files and Dockerfile
  sourceCode?: string; // DEPRECATED - use containerStructure instead
  clientCode?: string; // For service blocks - how to use the service
  openApiSpec?: string; // OpenAPI/Swagger spec - should be present for concrete/custom blocks (NOT for DAG blocks)
  documentation?: string; // For DAG blocks - comprehensive documentation about the workflow, tasks, and usage
  libraryDependencies?: string[]; // For concrete blocks - npm packages, pip packages, etc.
  blockDependencies?: string[]; // For concrete blocks - other lunch blocks this depends on
  dagStructure?: DAGStructure; // For DAG blocks - graph of nodes with tasks and event handlers
  experimentConfig?: ExperimentConfiguration; // For experimentation blocks - A/B testing, bandits, canary, etc.
  isAI?: boolean; // For AI-powered blocks - shows AI badge
  aiArtifactCategory?: AIArtifactCategory; // For AI artifacts: model, prompt, agent, or dataset
  modelFormat?: ModelFormat; // For model artifacts: GGUF, ONNX, PyTorch, etc.
  modelType?: ModelType; // For model artifacts: ML, DL, SLM, LLM, Diffusion, etc.
  modelParameters?: string; // For model artifacts: parameter count (e.g., "7B", "13B", "70B", "175M")
  modelSize?: number; // For model artifacts: size in GB
  datasetFormat?: DatasetFormat; // For dataset artifacts: CSV, Parquet, JSON, etc.
  datasetPreview?: any[]; // For dataset artifacts: sample rows to display
  datasetEntries?: string; // For dataset artifacts: number of entries (e.g., "3.6M", "14.2M", "10M")
  datasetSize?: number; // For dataset artifacts: size in GB
  schemaType?: SchemaType; // For database schema artifacts: Table, Document, Graph, etc.
  isLocked?: boolean; // For blocks that cannot be imported (e.g., CI/CD blocks)
  lockReason?: string; // Explanation for why the block is locked
}

export const marketplaceBlocks: MarketplaceBlock[] = [
  // CUSTOM BLOCKS (Composite) - 2 blocks
  {
    id: 'ecommerce-platform',
    name: 'E-commerce Platform',
    type: 'service',
    classification: 'custom',
    category: 'code',
    blockLabel: 'app-service',
    author: '@lunch-official',
    lastUpdated: '2025-11-10T14:30:00Z',
    version: '2.1.0',
    description: 'Complete e-commerce system in a box',
    longDescription: 'Deploy a complete e-commerce platform with one block. Internally composed of microservices, databases, and infrastructure, but exposed as a single configurable unit. Includes product catalog, order management, payment processing, and notifications.',
    tags: ['e-commerce', 'platform', 'composite', 'custom', 'microservices'],
    stats: { stars: 456, downloads: 1200 },
    icon: '🛒',
    workloadsInfraBlock: 'eks-cluster',
    internalBlocks: [
      'product-catalog',
      'order-service',
      'payment-gateway',
      'notification-service',
      'postgresql',
      'redis',
      'kafka',
      'eks-cluster'
    ],
    blockInteractions: [
      { from: 'API Gateway', to: 'Product Catalog', type: 'http', description: 'Routes product requests' },
      { from: 'API Gateway', to: 'Order Service', type: 'http', description: 'Routes order requests' },
      { from: 'API Gateway', to: 'Payment Gateway', type: 'http', description: 'Routes payment requests' },
      { from: 'Order Service', to: 'Product Catalog', type: 'grpc', description: 'Checks product availability' },
      { from: 'Order Service', to: 'Payment Gateway', type: 'http', description: 'Processes payments' },
      { from: 'Order Service', to: 'Notification Service', type: 'event', description: 'Sends order confirmation' },
      { from: 'Payment Gateway', to: 'PostgreSQL', type: 'data-flow', description: 'Stores transaction data' },
      { from: 'Product Catalog', to: 'Redis', type: 'data-flow', description: 'Caches product data' },
      { from: 'Order Service', to: 'Kafka', type: 'event', description: 'Publishes order events' },
    ],
    arguments: {
      enable_recommendations: {
        type: 'boolean',
        required: false,
        default: false,
        description: 'Enable ML-powered product recommendations'
      },
      payment_provider: {
        type: 'enum',
        required: true,
        default: 'stripe',
        description: 'Payment provider (stripe, paypal, square)'
      },
      notification_channels: {
        type: 'array',
        required: false,
        default: ['email', 'sms'],
        description: 'Notification channels to enable'
      }
    },
    dependencies: [],
    languages: ['Python', 'TypeScript'],
    observability: ['metalang', 'opentelemetry'],
    internalArchitecture: {
      entrypoints: ['product-catalog', 'order-service', 'payment-gateway'], // Multiple entrypoints
      services: [
        {
          id: 'product-catalog',
          name: 'Product Catalog Service',
          description: 'Manages product inventory and search',
          port: 8001,
          containerStructure: {
            files: [
              {
                path: 'src/index.ts',
                isEntrypoint: true,
                content: `import express from 'express';
import { Pool } from 'pg';
import Redis from 'ioredis';
import { configureObservability } from './observability';

const app = express();
const db = new Pool({ connectionString: process.env.DATABASE_URL });
const cache = new Redis(process.env.REDIS_URL);

// Configure OpenTelemetry tracing
configureObservability(app);

app.get('/api/products', async (req, res) => {
  const cacheKey = 'products:all';
  const cached = await cache.get(cacheKey);
  
  if (cached) return res.json(JSON.parse(cached));
  
  const { rows } = await db.query('SELECT * FROM products WHERE active = true');
  await cache.setex(cacheKey, 300, JSON.stringify(rows));
  res.json(rows);
});

app.get('/api/products/:id', async (req, res) => {
  const { rows } = await db.query('SELECT * FROM products WHERE id = $1', [req.params.id]);
  res.json(rows[0]);
});

app.listen(8001, () => {
  console.log('Product Catalog Service running on port 8001');
});`
              },
              {
                path: 'src/observability.ts',
                content: `import { trace, context } from '@opentelemetry/api';
import { NodeSDK } from '@opentelemetry/sdk-node';
import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http';

export function configureObservability(app: any) {
  const sdk = new NodeSDK({
    traceExporter: new OTLPTraceExporter({
      url: process.env.OTEL_EXPORTER_OTLP_ENDPOINT || 'http://localhost:4318/v1/traces',
    }),
    instrumentations: [getNodeAutoInstrumentations()],
  });

  sdk.start();

  // Add tracing middleware
  app.use((req: any, res: any, next: any) => {
    const tracer = trace.getTracer('product-catalog-service');
    const span = tracer.startSpan(\`\${req.method} \${req.path}\`);
    
    context.with(trace.setSpan(context.active(), span), () => {
      res.on('finish', () => {
        span.setAttribute('http.status_code', res.statusCode);
        span.end();
      });
      next();
    });
  });

  return sdk;
}`
              },
              {
                path: 'package.json',
                content: `{
  "name": "product-catalog-service",
  "version": "1.0.0",
  "main": "dist/index.js",
  "scripts": {
    "build": "tsc",
    "start": "node dist/index.js",
    "dev": "ts-node src/index.ts"
  },
  "dependencies": {
    "express": "^4.18.2",
    "pg": "^8.11.3",
    "ioredis": "^5.3.2",
    "@opentelemetry/api": "^1.7.0",
    "@opentelemetry/sdk-node": "^0.45.1",
    "@opentelemetry/auto-instrumentations-node": "^0.40.3",
    "@opentelemetry/exporter-trace-otlp-http": "^0.45.1"
  },
  "devDependencies": {
    "@types/express": "^4.17.21",
    "@types/node": "^20.10.6",
    "typescript": "^5.3.3",
    "ts-node": "^10.9.2"
  }
}`
              }
            ],
            dockerfile: `FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy source code
COPY dist ./dist

# Expose port
EXPOSE 8001

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \\
  CMD node -e "require('http').get('http://localhost:8001/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

# Set environment variables
ENV NODE_ENV=production
ENV DATABASE_URL=postgresql://user:pass@postgres:5432/products
ENV REDIS_URL=redis://redis:6379

# Run the application
CMD ["node", "dist/index.js"]`,
            entrypoint: 'src/index.ts',
            sidecars: [
              {
                id: 'otel-collector-sidecar',
                name: 'OpenTelemetry Collector',
                description: 'Collects traces, metrics, and logs from the main service',
                icon: '📡',
                purpose: 'Observability',
                files: [
                  {
                    path: 'otel-collector-config.yaml',
                    isEntrypoint: false,
                    content: `receivers:
  otlp:
    protocols:
      grpc:
        endpoint: 0.0.0.0:4317
      http:
        endpoint: 0.0.0.0:4318

processors:
  batch:
    timeout: 10s
    send_batch_size: 1024

exporters:
  jaeger:
    endpoint: jaeger:14250
    tls:
      insecure: true
  prometheus:
    endpoint: 0.0.0.0:8889
  logging:
    loglevel: debug

service:
  pipelines:
    traces:
      receivers: [otlp]
      processors: [batch]
      exporters: [jaeger, logging]
    metrics:
      receivers: [otlp]
      processors: [batch]
      exporters: [prometheus, logging]`
                  }
                ],
                dockerfile: `FROM otel/opentelemetry-collector:latest

COPY otel-collector-config.yaml /etc/otel-collector-config.yaml

EXPOSE 4317 4318 8889

CMD ["--config=/etc/otel-collector-config.yaml"]`
              }
            ]
          }
        },
        {
          id: 'order-service',
          name: 'Order Service',
          description: 'Handles order creation and management',
          port: 8002,
          containerStructure: {
            files: [
              {
                path: 'src/server.ts',
                isEntrypoint: true,
                content: `import express from 'express';
import { Kafka } from 'kafkajs';
import axios from 'axios';

const app = express();
app.use(express.json());

const kafka = new Kafka({ brokers: [process.env.KAFKA_BROKER!.split(',')] });
const producer = kafka.producer();

async function startServer() {
  await producer.connect();
  
  app.post('/api/orders', async (req, res) => {
    const { productId, quantity, userId } = req.body;
    
    try {
      // Check product availability
      const product = await axios.get(\`http://product-catalog:8001/api/products/\${productId}\`);
      
      if (product.data.stock < quantity) {
        return res.status(400).json({ error: 'Insufficient stock' });
      }
      
      // Process payment
      const payment = await axios.post('http://payment-gateway:8003/api/payments', {
        amount: product.data.price * quantity,
        userId
      });
      
      // Create order
      const order = { 
        id: Date.now(), 
        productId, 
        quantity, 
        userId, 
        status: 'confirmed',
        paymentId: payment.data.id
      };
      
      // Publish event
      await producer.send({
        topic: 'orders',
        messages: [{ value: JSON.stringify(order) }]
      });
      
      res.json(order);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });
  
  app.listen(8002, () => {
    console.log('Order Service running on port 8002');
  });
}

startServer();`
              },
              {
                path: 'package.json',
                content: `{
  "name": "order-service",
  "version": "1.0.0",
  "main": "dist/server.js",
  "scripts": {
    "build": "tsc",
    "start": "node dist/server.js",
    "dev": "ts-node src/server.ts"
  },
  "dependencies": {
    "express": "^4.18.2",
    "kafkajs": "^2.2.4",
    "axios": "^1.6.2"
  },
  "devDependencies": {
    "@types/express": "^4.17.21",
    "@types/node": "^20.10.6",
    "typescript": "^5.3.3",
    "ts-node": "^10.9.2"
  }
}`
              }
            ],
            dockerfile: `FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY dist ./dist

EXPOSE 8002

ENV NODE_ENV=production
ENV KAFKA_BROKER=kafka:9092

CMD ["node", "dist/server.js"]`,
            entrypoint: 'src/server.ts',
            sidecars: [
              {
                id: 'envoy-proxy',
                name: 'Envoy Proxy',
                description: 'Service mesh proxy for traffic management and load balancing',
                icon: '🔀',
                purpose: 'Service Mesh',
                files: [
                  {
                    path: 'envoy.yaml',
                    content: `static_resources:
  listeners:
  - name: listener_0
    address:
      socket_address:
        address: 0.0.0.0
        port_value: 15001
    filter_chains:
    - filters:
      - name: envoy.filters.network.http_connection_manager
        typed_config:
          "@type": type.googleapis.com/envoy.extensions.filters.network.http_connection_manager.v3.HttpConnectionManager
          stat_prefix: ingress_http
          route_config:
            name: local_route
            virtual_hosts:
            - name: backend
              domains: ["*"]
              routes:
              - match:
                  prefix: "/"
                route:
                  cluster: order_service
          http_filters:
          - name: envoy.filters.http.router
  clusters:
  - name: order_service
    connect_timeout: 0.25s
    type: STRICT_DNS
    lb_policy: ROUND_ROBIN
    load_assignment:
      cluster_name: order_service
      endpoints:
      - lb_endpoints:
        - endpoint:
            address:
              socket_address:
                address: localhost
                port_value: 8002

admin:
  access_log_path: /dev/null
  address:
    socket_address:
      address: 0.0.0.0
      port_value: 9901`
                  }
                ],
                dockerfile: `FROM envoyproxy/envoy:v1.28-latest

COPY envoy.yaml /etc/envoy/envoy.yaml

EXPOSE 15001 9901

CMD ["/usr/local/bin/envoy", "-c", "/etc/envoy/envoy.yaml"]`
              }
            ]
          }
        },
        {
          id: 'payment-gateway',
          name: 'Payment Gateway',
          description: 'Processes payments via Stripe',
          port: 8003,
          containerStructure: {
            files: [
              {
                path: 'src/app.ts',
                isEntrypoint: true,
                content: `import express from 'express';
import Stripe from 'stripe';
import { Pool } from 'pg';

const app = express();
app.use(express.json());

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2023-10-16' });
const db = new Pool({ connectionString: process.env.DATABASE_URL });

app.post('/api/payments', async (req, res) => {
  const { amount, userId } = req.body;
  
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100),
      currency: 'usd',
      metadata: { userId: String(userId) }
    });
    
    // Store transaction
    await db.query(
      'INSERT INTO transactions (user_id, amount, stripe_id, status) VALUES ($1, $2, $3, $4)',
      [userId, amount, paymentIntent.id, 'pending']
    );
    
    res.json({ 
      success: true, 
      id: paymentIntent.id,
      clientSecret: paymentIntent.client_secret 
    });
  } catch (error: any) {
    console.error('Payment error:', error);
    res.status(500).json({ error: error.message });
  }
});

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.listen(8003, () => {
  console.log('Payment Gateway running on port 8003');
});`
              },
              {
                path: 'package.json',
                content: `{
  "name": "payment-gateway",
  "version": "1.0.0",
  "main": "dist/app.js",
  "scripts": {
    "build": "tsc",
    "start": "node dist/app.js",
    "dev": "ts-node src/app.ts"
  },
  "dependencies": {
    "express": "^4.18.2",
    "stripe": "^14.9.0",
    "pg": "^8.11.3"
  },
  "devDependencies": {
    "@types/express": "^4.17.21",
    "@types/node": "^20.10.6",
    "@types/pg": "^8.10.9",
    "typescript": "^5.3.3",
    "ts-node": "^10.9.2"
  }
}`
              }
            ],
            dockerfile: `FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY dist ./dist

EXPOSE 8003

ENV NODE_ENV=production

CMD ["node", "dist/app.js"]`,
            entrypoint: 'src/app.ts',
            sidecars: [
              {
                id: 'vault-agent',
                name: 'Vault Agent',
                description: 'Securely manages and injects secrets from HashiCorp Vault',
                icon: '🔐',
                purpose: 'Security',
                files: [
                  {
                    path: 'vault-agent.hcl',
                    content: `pid_file = "./pidfile"

vault {
  address = "http://vault:8200"
}

auto_auth {
  method "kubernetes" {
    mount_path = "auth/kubernetes"
    config = {
      role = "payment-gateway"
    }
  }

  sink "file" {
    config = {
      path = "/vault/token"
    }
  }
}

template {
  source      = "/vault/templates/stripe-secret.tpl"
  destination = "/vault/secrets/stripe-secret"
}

template {
  source      = "/vault/templates/database.tpl"
  destination = "/vault/secrets/database"
}`
                  },
                  {
                    path: 'templates/stripe-secret.tpl',
                    content: `{{ with secret "secret/data/payment-gateway/stripe" }}
export STRIPE_SECRET_KEY="{{ .Data.data.secret_key }}"
{{ end }}`
                  },
                  {
                    path: 'templates/database.tpl',
                    content: `{{ with secret "secret/data/payment-gateway/database" }}
export DATABASE_URL="postgresql://{{ .Data.data.username }}:{{ .Data.data.password }}@{{ .Data.data.host }}:5432/{{ .Data.data.database }}"
{{ end }}`
                  }
                ],
                dockerfile: `FROM vault:1.15.4

COPY vault-agent.hcl /vault/config/vault-agent.hcl
COPY templates/ /vault/templates/

ENTRYPOINT ["vault", "agent", "-config=/vault/config/vault-agent.hcl"]`
              }
            ]
          }
        },
        {
          id: 'notification-service',
          name: 'Notification Service',
          description: 'Sends order notifications via email/SMS',
          port: 8004,
          containerStructure: {
            files: [
              {
                path: 'src/consumer.ts',
                isEntrypoint: true,
                content: `import { Kafka } from 'kafkajs';
import sgMail from '@sendgrid/mail';

const kafka = new Kafka({ 
  clientId: 'notification-service',
  brokers: process.env.KAFKA_BROKER!.split(',')
});
const consumer = kafka.consumer({ groupId: 'notifications' });

sgMail.setApiKey(process.env.SENDGRID_API_KEY!);

async function startConsumer() {
  await consumer.connect();
  await consumer.subscribe({ topic: 'orders', fromBeginning: false });

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      try {
        const order = JSON.parse(message.value!.toString());
        
        // Send confirmation email
        await sgMail.send({
          to: order.userEmail,
          from: 'orders@ecommerce.com',
          subject: \`Order Confirmation #\${order.id}\`,
          text: \`Your order #\${order.id} has been confirmed! Total: $\${order.total}\`,
          html: \`<p>Your order <strong>#\${order.id}</strong> has been confirmed!</p>\`
        });
        
        console.log(\`Notification sent for order: \${order.id}\`);
      } catch (error) {
        console.error('Error processing message:', error);
      }
    }
  });
  
  console.log('Notification Service listening for order events');
}

startConsumer().catch(console.error);`
              },
              {
                path: 'package.json',
                content: `{
  "name": "notification-service",
  "version": "1.0.0",
  "main": "dist/consumer.js",
  "scripts": {
    "build": "tsc",
    "start": "node dist/consumer.js",
    "dev": "ts-node src/consumer.ts"
  },
  "dependencies": {
    "kafkajs": "^2.2.4",
    "@sendgrid/mail": "^8.1.0"
  },
  "devDependencies": {
    "@types/node": "^20.10.6",
    "typescript": "^5.3.3",
    "ts-node": "^10.9.2"
  }
}`
              }
            ],
            dockerfile: `FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY dist ./dist

ENV NODE_ENV=production
ENV KAFKA_BROKER=kafka:9092

CMD ["node", "dist/consumer.js"]`,
            entrypoint: 'src/consumer.ts'
          }
        },
        {
          id: 'postgresql',
          name: 'PostgreSQL',
          description: 'Primary relational database',
          port: 5432,
          containerStructure: {
            files: [
              {
                path: 'init.sql',
                content: `-- PostgreSQL initialization
-- Database: ecommerce

CREATE TABLE products (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  stock_quantity INTEGER DEFAULT 0,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE orders (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL,
  total_amount DECIMAL(10, 2) NOT NULL,
  status VARCHAR(50) DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE transactions (
  id SERIAL PRIMARY KEY,
  order_id INTEGER REFERENCES orders(id),
  amount DECIMAL(10, 2) NOT NULL,
  payment_method VARCHAR(50),
  status VARCHAR(50),
  processed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);`
              }
            ],
            dockerfile: `FROM postgres:16-alpine

ENV POSTGRES_DB=ecommerce
ENV POSTGRES_USER=ecommerce_user
ENV POSTGRES_PASSWORD=secure_password

COPY init.sql /docker-entrypoint-initdb.d/

EXPOSE 5432`,
            entrypoint: 'init.sql'
          }
        },
        {
          id: 'redis',
          name: 'Redis Cache',
          description: 'In-memory cache for product data',
          port: 6379,
          containerStructure: {
            files: [
              {
                path: 'redis.conf',
                content: `# Redis configuration for product caching
bind 0.0.0.0
port 6379
protected-mode yes

maxmemory 256mb
maxmemory-policy allkeys-lru

save 900 1
save 300 10
save 60 10000

tcp-backlog 511
timeout 0
tcp-keepalive 300

loglevel notice
logfile ""

notify-keyspace-events Ex`
              }
            ],
            dockerfile: `FROM redis:7.2-alpine

COPY redis.conf /usr/local/etc/redis/redis.conf

EXPOSE 6379

CMD ["redis-server", "/usr/local/etc/redis/redis.conf"]`,
            entrypoint: 'redis.conf'
          }
        },
        {
          id: 'kafka',
          name: 'Apache Kafka',
          description: 'Event streaming for order events',
          port: 9092,
          microservices: [
            {
              id: 'kafka-broker',
              name: 'Kafka Broker',
              port: 9092,
              containerStructure: {
                files: [
                  {
                    path: 'server.properties',
                    content: `# Kafka Broker Configuration
broker.id=1
listeners=PLAINTEXT://0.0.0.0:9092
advertised.listeners=PLAINTEXT://kafka:9092

num.partitions=3
default.replication.factor=1
auto.create.topics.enable=true

log.dirs=/var/lib/kafka/data
log.retention.hours=168
log.segment.bytes=1073741824

zookeeper.connect=zookeeper:2181
zookeeper.connection.timeout.ms=18000

num.network.threads=3
num.io.threads=8
socket.send.buffer.bytes=102400
socket.receive.buffer.bytes=102400`
                  }
                ],
                dockerfile: `FROM confluentinc/cp-kafka:7.5.0

COPY server.properties /etc/kafka/server.properties

EXPOSE 9092

CMD ["kafka-server-start", "/etc/kafka/server.properties"]`,
                entrypoint: 'server.properties'
              }
            },
            {
              id: 'zookeeper',
              name: 'Zookeeper',
              port: 2181,
              containerStructure: {
                files: [
                  {
                    path: 'zoo.cfg',
                    content: `# Zookeeper Configuration
dataDir=/var/lib/zookeeper
clientPort=2181
maxClientCnxns=60

tickTime=2000
initLimit=10
syncLimit=5

# Cluster configuration
server.1=zookeeper:2888:3888

# Security
authProvider.1=org.apache.zookeeper.server.auth.SASLAuthenticationProvider
requireClientAuthScheme=sasl`
                  }
                ],
                dockerfile: `FROM confluentinc/cp-zookeeper:7.5.0

COPY zoo.cfg /etc/zookeeper/zoo.cfg

EXPOSE 2181 2888 3888

CMD ["zookeeper-server-start", "/etc/zookeeper/zoo.cfg"]`,
                entrypoint: 'zoo.cfg'
              }
            },
            {
              id: 'schema-registry',
              name: 'Schema Registry',
              port: 8081,
              containerStructure: {
                files: [
                  {
                    path: 'schema-registry.properties',
                    content: `# Confluent Schema Registry Configuration
listeners=http://0.0.0.0:8081
kafkastore.connection.url=zookeeper:2181

kafkastore.topic=_schemas
kafkastore.topic.replication.factor=1

schema.registry.group.id=schema-registry
schema.compatibility.level=backward

# Registered Schemas:
# - OrderCreated (v1, v2)
# - PaymentProcessed (v1)
# - NotificationSent (v1)`
                  }
                ],
                dockerfile: `FROM confluentinc/cp-schema-registry:7.5.0

COPY schema-registry.properties /etc/schema-registry/schema-registry.properties

EXPOSE 8081

CMD ["schema-registry-start", "/etc/schema-registry/schema-registry.properties"]`,
                entrypoint: 'schema-registry.properties'
              }
            }
          ]
        }
      ],
      connections: [
        {
          from: 'order-service',
          to: 'product-catalog',
          arrowType: 'one-way',
          arrowStyle: 'solid',
          access: 'read-only',
          label: 'Check product availability (HTTP)'
        },
        {
          from: 'order-service',
          to: 'payment-gateway',
          arrowType: 'one-way',
          arrowStyle: 'solid',
          access: 'write-only',
          label: 'Process payment (HTTP)'
        },
        {
          from: 'order-service',
          to: 'kafka',
          arrowType: 'one-way',
          arrowStyle: 'dashed',
          access: 'write-only',
          label: 'Publish order events (streaming)'
        },
        {
          from: 'notification-service',
          to: 'kafka',
          arrowType: 'one-way',
          arrowStyle: 'dashed',
          access: 'read-only',
          label: 'Consume order events (streaming)'
        },
        {
          from: 'product-catalog',
          to: 'redis',
          arrowType: 'two-way',
          arrowStyle: 'solid',
          access: 'read-write',
          label: 'Cache product data'
        },
        {
          from: 'payment-gateway',
          to: 'postgresql',
          arrowType: 'one-way',
          arrowStyle: 'solid',
          access: 'write-only',
          label: 'Store transactions'
        },
        {
          from: 'product-catalog',
          to: 'postgresql',
          arrowType: 'two-way',
          arrowStyle: 'solid',
          access: 'read-write',
          label: 'Product database'
        }
      ]
    },
    openApiSpec: `openapi: 3.0.0
info:
  title: E-commerce Platform API
  version: 2.1.0
paths:
  /api/products:
    get:
      summary: List products
  /api/orders:
    post:
      summary: Create order
  /api/payments:
    post:
      summary: Process payment`
  },
  
  // E-COMMERCE PLATFORM INTERNAL SERVICES (with lunch-metalang) - 4 blocks
  {
    id: 'product-catalog',
    name: 'Product Catalog Service',
    type: 'service',
    classification: 'concrete',
    category: 'code',
    blockLabel: 'app-service',
    author: '@lunch-official',
    version: '1.0.0',
    description: 'Product catalog with caching and search',
    longDescription: 'Microservice for managing product inventory with Redis caching and PostgreSQL storage. Built with lunch-metalang decorators for automatic communication and observability.',
    tags: ['microservice', 'products', 'catalog', 'metalang'],
    stats: { stars: 145, downloads: 320 },
    icon: '📦',
    observability: ['metalang', 'opentelemetry'],
    deploymentArchitecture: 'single-service',
    containerStructure: {
      files: [
        {
          path: 'src/index.ts',
          isEntrypoint: true,
          content: `import { Service, GET, POST, Observe, Cache } from '@lunch/metalang';
import { Pool } from 'pg';
import Redis from 'ioredis';

@Service({
  name: 'product-catalog',
  port: 8001,
  healthCheck: '/health'
})
export class ProductCatalogService {
  private db: Pool;
  private cache: Redis;

  constructor() {
    this.db = new Pool({ connectionString: process.env.DATABASE_URL });
    this.cache = new Redis(process.env.REDIS_URL);
  }

  @GET('/api/products')
  @Observe({ span: 'list-products', metrics: ['count', 'duration'] })
  @Cache({ ttl: 300, key: 'products:all' })
  async listProducts() {
    const { rows } = await this.db.query(
      'SELECT * FROM products WHERE active = true ORDER BY created_at DESC'
    );
    return rows;
  }

  @GET('/api/products/:id')
  @Observe({ span: 'get-product', metrics: ['count', 'duration'] })
  @Cache({ ttl: 600, key: (params) => \`product:\${params.id}\` })
  async getProduct(id: string) {
    const { rows } = await this.db.query(
      'SELECT * FROM products WHERE id = $1',
      [id]
    );
    return rows[0];
  }

  @POST('/api/products')
  @Observe({ span: 'create-product', metrics: ['count', 'duration'] })
  async createProduct(data: { name: string; price: number; stock: number }) {
    const { rows } = await this.db.query(
      'INSERT INTO products (name, price, stock) VALUES ($1, $2, $3) RETURNING *',
      [data.name, data.price, data.stock]
    );
    
    // Invalidate cache
    await this.cache.del('products:all');
    
    return rows[0];
  }
}`
        },
        {
          path: 'package.json',
          content: `{
  "name": "product-catalog-service",
  "version": "1.0.0",
  "main": "dist/index.js",
  "dependencies": {
    "@lunch/metalang": "^2.0.0",
    "pg": "^8.11.3",
    "ioredis": "^5.3.2"
  }
}`
        }
      ],
      dockerfile: `FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY dist ./dist
EXPOSE 8001
ENV NODE_ENV=production
CMD ["node", "dist/index.js"]`,
      entrypoint: 'src/index.ts',
      sidecars: [
        {
          id: 'otel-collector-sidecar',
          name: 'OpenTelemetry Collector',
          description: 'Collects traces, metrics, and logs from the main service',
          icon: '📡',
          purpose: 'Observability',
          files: [
            {
              path: 'otel-collector-config.yaml',
              content: `receivers:
  otlp:
    protocols:
      grpc:
        endpoint: 0.0.0.0:4317
      http:
        endpoint: 0.0.0.0:4318

processors:
  batch:
    timeout: 10s
    send_batch_size: 1024

exporters:
  jaeger:
    endpoint: jaeger:14250
    tls:
      insecure: true
  prometheus:
    endpoint: 0.0.0.0:8889
  logging:
    loglevel: debug

service:
  pipelines:
    traces:
      receivers: [otlp]
      processors: [batch]
      exporters: [jaeger, logging]
    metrics:
      receivers: [otlp]
      processors: [batch]
      exporters: [prometheus, logging]`
            }
          ],
          dockerfile: `FROM otel/opentelemetry-collector:latest

COPY otel-collector-config.yaml /etc/otel-collector-config.yaml

EXPOSE 4317 4318 8889

CMD ["--config=/etc/otel-collector-config.yaml"]`
        }
      ]
    },
    clientCode: `import { ProductCatalogClient } from '@lunch/product-catalog';

const catalog = new ProductCatalogClient({
  host: 'product-catalog.default.svc.cluster.local',
  port: 8001
});

// List products
const products = await catalog.listProducts();

// Get specific product
const product = await catalog.getProduct('prod-123');`,
    openApiSpec: `openapi: 3.0.0
info:
  title: Product Catalog API
  version: 1.0.0
paths:
  /api/products:
    get:
      summary: List all products
    post:
      summary: Create new product`,
    dependencies: ['postgresql', 'redis'],
    languages: ['TypeScript'],
    libraryDependencies: ['@lunch/metalang', 'express', 'pg', 'ioredis'],
    blockDependencies: ['postgresql', 'redis']
  },
  {
    id: 'order-service',
    name: 'Order Service',
    type: 'service',
    classification: 'concrete',
    category: 'code',
    blockLabel: 'app-service',
    author: '@lunch-official',
    version: '1.0.0',
    description: 'Order management with event publishing',
    longDescription: 'Order processing service with Kafka event publishing and external service integration. Uses lunch-metalang for declarative communication patterns.',
    tags: ['microservice', 'orders', 'events', 'metalang'],
    stats: { stars: 132, downloads: 285 },
    icon: '📋',
    observability: ['metalang', 'opentelemetry'],
    deploymentArchitecture: 'single-service',
    containerStructure: {
      files: [
        {
          path: 'src/server.ts',
          isEntrypoint: true,
          content: `import { Service, POST, Observe, PublishEvent, CallService } from '@lunch/metalang';
import { Kafka } from 'kafkajs';

@Service({
  name: 'order-service',
  port: 8002,
  healthCheck: '/health'
})
export class OrderService {
  private kafka: Kafka;

  constructor() {
    this.kafka = new Kafka({ brokers: process.env.KAFKA_BROKER!.split(',') });
  }

  @POST('/api/orders')
  @Observe({ span: 'create-order', metrics: ['count', 'duration', 'errors'] })
  @PublishEvent({ topic: 'orders', eventType: 'order.created' })
  async createOrder(data: {
    productId: string;
    quantity: number;
    userId: string;
  }) {
    // Check product availability
    const product = await this.checkProductAvailability(data.productId, data.quantity);
    
    if (!product.available) {
      throw new Error('Insufficient stock');
    }

    // Process payment
    const payment = await this.processPayment({
      amount: product.price * data.quantity,
      userId: data.userId
    });

    // Create order
    const order = {
      id: Date.now(),
      productId: data.productId,
      quantity: data.quantity,
      userId: data.userId,
      status: 'confirmed',
      paymentId: payment.id,
      total: product.price * data.quantity
    };

    return order;
  }

  @CallService({
    service: 'product-catalog',
    method: 'GET',
    path: '/api/products/:id'
  })
  @Observe({ span: 'check-product' })
  private async checkProductAvailability(productId: string, quantity: number) {
    // MetaLang handles the actual HTTP call
    return { available: true, price: 99.99 };
  }

  @CallService({
    service: 'payment-gateway',
    method: 'POST',
    path: '/api/payments'
  })
  @Observe({ span: 'process-payment' })
  private async processPayment(data: { amount: number; userId: string }) {
    // MetaLang handles the actual HTTP call
    return { id: 'pay_123', status: 'completed' };
  }
}`
        },
        {
          path: 'package.json',
          content: `{
  "name": "order-service",
  "version": "1.0.0",
  "main": "dist/server.js",
  "dependencies": {
    "@lunch/metalang": "^2.0.0",
    "kafkajs": "^2.2.4"
  }
}`
        }
      ],
      dockerfile: `FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY dist ./dist
EXPOSE 8002
ENV NODE_ENV=production
ENV KAFKA_BROKER=kafka:9092
CMD ["node", "dist/server.js"]`,
      entrypoint: 'src/server.ts'
    },
    clientCode: `import { OrderServiceClient } from '@lunch/order-service';

const orders = new OrderServiceClient({
  host: 'order-service.default.svc.cluster.local',
  port: 8002
});

const order = await orders.createOrder({
  productId: 'prod-123',
  quantity: 2,
  userId: 'user-456'
});`,
    openApiSpec: `openapi: 3.0.0
info:
  title: Order Service API
  version: 1.0.0
paths:
  /api/orders:
    post:
      summary: Create new order`,
    dependencies: ['kafka'],
    languages: ['TypeScript'],
    libraryDependencies: ['@lunch/metalang', 'express', 'kafkajs'],
    blockDependencies: ['kafka']
  },
  {
    id: 'payment-gateway',
    name: 'Payment Gateway',
    type: 'service',
    classification: 'concrete',
    category: 'code',
    blockLabel: 'supporting-service',
    author: '@lunch-official',
    version: '1.0.0',
    description: 'Stripe payment processing service',
    longDescription: 'Payment processing gateway with Stripe integration and transaction storage. Built with lunch-metalang for consistent error handling and observability.',
    tags: ['microservice', 'payments', 'stripe', 'metalang'],
    stats: { stars: 178, downloads: 410 },
    icon: '💳',
    observability: ['metalang', 'opentelemetry'],
    deploymentArchitecture: 'single-service',
    containerStructure: {
      files: [
        {
          path: 'src/app.ts',
          isEntrypoint: true,
          content: `import { Service, POST, Observe, Transaction } from '@lunch/metalang';
import Stripe from 'stripe';
import { Pool } from 'pg';

@Service({
  name: 'payment-gateway',
  port: 8003,
  healthCheck: '/health'
})
export class PaymentGatewayService {
  private stripe: Stripe;
  private db: Pool;

  constructor() {
    this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { 
      apiVersion: '2023-10-16' 
    });
    this.db = new Pool({ connectionString: process.env.DATABASE_URL });
  }

  @POST('/api/payments')
  @Observe({ 
    span: 'process-payment', 
    metrics: ['count', 'duration', 'amount', 'errors'],
    alerts: { errorRate: 0.01 }
  })
  @Transaction({ isolation: 'READ_COMMITTED' })
  async processPayment(data: { amount: number; userId: string }) {
    try {
      const paymentIntent = await this.stripe.paymentIntents.create({
        amount: Math.round(data.amount * 100),
        currency: 'usd',
        metadata: { userId: String(data.userId) }
      });

      // Store transaction
      await this.db.query(
        'INSERT INTO transactions (user_id, amount, stripe_id, status) VALUES ($1, $2, $3, $4)',
        [data.userId, data.amount, paymentIntent.id, 'pending']
      );

      return {
        id: paymentIntent.id,
        clientSecret: paymentIntent.client_secret,
        status: 'success'
      };
    } catch (error: any) {
      await this.db.query(
        'INSERT INTO transactions (user_id, amount, status, error) VALUES ($1, $2, $3, $4)',
        [data.userId, data.amount, 'failed', error.message]
      );
      throw error;
    }
  }
}`
        },
        {
          path: 'package.json',
          content: `{
  "name": "payment-gateway",
  "version": "1.0.0",
  "main": "dist/app.js",
  "dependencies": {
    "@lunch/metalang": "^2.0.0",
    "stripe": "^14.9.0",
    "pg": "^8.11.3"
  }
}`
        }
      ],
      dockerfile: `FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY dist ./dist
EXPOSE 8003
ENV NODE_ENV=production
CMD ["node", "dist/app.js"]`,
      entrypoint: 'src/app.ts'
    },
    clientCode: `import { PaymentGatewayClient } from '@lunch/payment-gateway';

const payments = new PaymentGatewayClient({
  host: 'payment-gateway.default.svc.cluster.local',
  port: 8003
});

const payment = await payments.processPayment({
  amount: 199.98,
  userId: 'user-456'
});`,
    openApiSpec: `openapi: 3.0.0
info:
  title: Payment Gateway API
  version: 1.0.0
paths:
  /api/payments:
    post:
      summary: Process payment`,
    dependencies: ['postgresql'],
    languages: ['TypeScript'],
    libraryDependencies: ['@lunch/metalang', 'express', 'stripe', 'pg'],
    blockDependencies: ['postgresql']
  },
  {
    id: 'notification-service-ecommerce',
    name: 'Notification Service (E-commerce)',
    type: 'service',
    classification: 'concrete',
    category: 'code',
    blockLabel: 'supporting-service',
    author: '@lunch-official',
    version: '1.0.0',
    description: 'Event-driven notification service',
    longDescription: 'Kafka consumer for sending order notifications. Uses lunch-metalang event decorators for declarative event handling.',
    tags: ['microservice', 'notifications', 'events', 'metalang'],
    stats: { stars: 98, downloads: 245 },
    icon: '📧',
    observability: ['metalang', 'opentelemetry'],
    deploymentArchitecture: 'single-service',
    containerStructure: {
      files: [
        {
          path: 'src/consumer.ts',
          isEntrypoint: true,
          content: `import { Service, ConsumeEvent, Observe } from '@lunch/metalang';
import sgMail from '@sendgrid/mail';

@Service({
  name: 'notification-service',
  type: 'consumer'
})
export class NotificationService {
  constructor() {
    sgMail.setApiKey(process.env.SENDGRID_API_KEY!);
  }

  @ConsumeEvent({
    topic: 'orders',
    eventType: 'order.created',
    consumerGroup: 'notifications'
  })
  @Observe({ 
    span: 'send-order-notification',
    metrics: ['count', 'duration', 'errors']
  })
  async handleOrderCreated(event: {
    id: number;
    userId: string;
    productId: string;
    total: number;
  }) {
    try {
      await sgMail.send({
        to: \`user-\${event.userId}@example.com\`,
        from: 'orders@ecommerce.com',
        subject: \`Order Confirmation #\${event.id}\`,
        text: \`Your order has been confirmed! Total: $\${event.total}\`,
        html: \`<p>Your order <strong>#\${event.id}</strong> has been confirmed!</p>
               <p>Total: <strong>$\${event.total}</strong></p>\`
      });

      console.log(\`Notification sent for order: \${event.id}\`);
    } catch (error) {
      console.error('Failed to send notification:', error);
      throw error; // MetaLang will handle retry logic
    }
  }
}`
        },
        {
          path: 'package.json',
          content: `{
  "name": "notification-service",
  "version": "1.0.0",
  "main": "dist/consumer.js",
  "dependencies": {
    "@lunch/metalang": "^2.0.0",
    "@sendgrid/mail": "^8.1.0"
  }
}`
        }
      ],
      dockerfile: `FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY dist ./dist
ENV NODE_ENV=production
ENV KAFKA_BROKER=kafka:9092
CMD ["node", "dist/consumer.js"]`,
      entrypoint: 'src/consumer.ts'
    },
    clientCode: `// Event-driven service - no direct client
// Listens to Kafka events automatically via MetaLang`,
    openApiSpec: `# Event Consumer - No REST API
# Consumes events from Kafka topic: orders`,
    dependencies: ['kafka'],
    languages: ['TypeScript'],
    libraryDependencies: ['@lunch/metalang', 'kafkajs', '@sendgrid/mail'],
    blockDependencies: ['kafka']
  },
  
  {
    id: 'observability-stack',
    name: 'Observability Stack',
    type: 'service',
    classification: 'custom',
    category: 'code-workloads-infra',
    blockLabel: 'code-workloads-infra',
    author: '@lunch-official',
    version: '3.0.1',
    description: 'Complete monitoring and logging solution',
    longDescription: 'Full observability stack as a single block. Configure and deploy, internally manages all the complexity of Prometheus, Grafana, Loki, Jaeger, and AlertManager. This is code running on top of workloads infrastructure.',
    tags: ['observability', 'monitoring', 'logging', 'composite', 'custom', 'metrics'],
    stats: { stars: 389, downloads: 980 },
    icon: '📊',
    internalBlocks: [
      'prometheus',
      'grafana',
      'loki',
      'jaeger',
      'alertmanager',
      'postgresql',
      'eks-cluster'
    ],
    blockInteractions: [
      { from: 'All Services', to: 'Prometheus', type: 'http', description: 'Metrics scraping' },
      { from: 'All Services', to: 'Loki', type: 'http', description: 'Log aggregation' },
      { from: 'All Services', to: 'Jaeger', type: 'grpc', description: 'Distributed tracing' },
      { from: 'Prometheus', to: 'Grafana', type: 'data-flow', description: 'Metrics visualization' },
      { from: 'Loki', to: 'Grafana', type: 'data-flow', description: 'Logs visualization' },
      { from: 'Jaeger', to: 'Grafana', type: 'data-flow', description: 'Traces visualization' },
      { from: 'Alertmanager', to: 'External Services', type: 'http', description: 'Alert notifications' },
      { from: 'Prometheus', to: 'PostgreSQL', type: 'data-flow', description: 'Stores metrics metadata' },
    ],
    arguments: {
      retention_days: {
        type: 'number',
        required: false,
        default: 30,
        description: 'Data retention period (7-365 days)'
      },
      alert_channels: {
        type: 'array',
        required: false,
        default: ['slack', 'email'],
        description: 'Alert notification channels'
      },
      scrape_interval: {
        type: 'duration',
        required: false,
        default: '30s',
        description: 'Metrics scrape interval'
      }
    },
    dependencies: [],
    languages: ['Configuration'],
    internalArchitecture: {
      services: [
        {
          id: 'prometheus',
          name: 'Prometheus',
          description: 'Metrics collection and storage',
          port: 9090,
          containerStructure: {
            files: [
              {
                path: 'prometheus.yml',
                content: `global:
  scrape_interval: 30s
  evaluation_interval: 30s

scrape_configs:
  - job_name: 'services'
    static_configs:
      - targets:
        - 'product-catalog:8001'
        - 'order-service:8002'
        - 'payment-gateway:8003'
        - 'notification-service:8004'

alerting:
  alertmanagers:
    - static_configs:
      - targets:
        - 'alertmanager:9093'

rule_files:
  - 'alerts.yml'`
              }
            ],
            dockerfile: `FROM prom/prometheus:latest

COPY prometheus.yml /etc/prometheus/prometheus.yml

EXPOSE 9090

CMD ["--config.file=/etc/prometheus/prometheus.yml"]`,
            entrypoint: 'prometheus.yml'
          }
        },
        {
          id: 'grafana',
          name: 'Grafana',
          description: 'Visualization and dashboards',
          port: 3000,
          containerStructure: {
            files: [
              {
                path: 'datasources.yml',
                content: `apiVersion: 1

datasources:
  - name: Prometheus
    type: prometheus
    url: http://prometheus:9090
    isDefault: true
  
  - name: Loki
    type: loki
    url: http://loki:3100
  
  - name: Jaeger
    type: jaeger
    url: http://jaeger:16686`
              }
            ],
            dockerfile: `FROM grafana/grafana:latest

COPY datasources.yml /etc/grafana/provisioning/datasources/

EXPOSE 3000`,
            entrypoint: 'datasources.yml'
          }
        },
        {
          id: 'loki',
          name: 'Loki',
          description: 'Log aggregation',
          port: 3100,
          containerStructure: {
            files: [
              {
                path: 'loki-config.yml',
                content: `auth_enabled: false

server:
  http_listen_port: 3100

ingester:
  lifecycler:
    ring:
      kvstore:
        store: inmemory
      replication_factor: 1
  chunk_idle_period: 5m
  chunk_retain_period: 30s

schema_config:
  configs:
    - from: 2024-01-01
      store: boltdb
      object_store: filesystem
      schema: v11
      index:
        prefix: index_
        period: 24h

storage_config:
  boltdb:
    directory: /tmp/loki/index
  filesystem:
    directory: /tmp/loki/chunks`
              }
            ],
            dockerfile: `FROM grafana/loki:latest

COPY loki-config.yml /etc/loki/local-config.yaml

EXPOSE 3100

CMD ["-config.file=/etc/loki/local-config.yaml"]`,
            entrypoint: 'loki-config.yml'
          }
        },
        {
          id: 'jaeger',
          name: 'Jaeger',
          description: 'Distributed tracing',
          port: 16686,
          containerStructure: {
            files: [
              {
                path: 'jaeger-config.yml',
                content: `collector:
  zipkin:
    host-port: :9411

storage:
  type: memory
  memory:
    max-traces: 10000

query:
  base-path: /
  ui-config: ui-config.json`
              }
            ],
            dockerfile: `FROM jaegertracing/all-in-one:latest

EXPOSE 16686 14268 14250 9411

CMD ["--memory.max-traces=10000"]`,
            entrypoint: 'jaeger-config.yml'
          }
        },
        {
          id: 'alertmanager',
          name: 'AlertManager',
          description: 'Alert routing and notifications',
          port: 9093,
          containerStructure: {
            files: [
              {
                path: 'alertmanager.yml',
                content: `global:
  resolve_timeout: 5m

route:
  group_by: ['alertname', 'cluster']
  group_wait: 10s
  group_interval: 10s
  repeat_interval: 12h
  receiver: 'slack'

receivers:
  - name: 'slack'
    slack_configs:
      - api_url: 'https://hooks.slack.com/services/XXX'
        channel: '#alerts'
        text: 'Alert: {{ .CommonAnnotations.summary }}'
  
  - name: 'email'
    email_configs:
      - to: 'ops@company.com'
        from: 'alertmanager@company.com'
        smarthost: 'smtp.gmail.com:587'`
              }
            ],
            dockerfile: `FROM prom/alertmanager:latest

COPY alertmanager.yml /etc/alertmanager/alertmanager.yml

EXPOSE 9093

CMD ["--config.file=/etc/alertmanager/alertmanager.yml"]`,
            entrypoint: 'alertmanager.yml'
          }
        }
      ],
      connections: [
        {
          from: 'prometheus',
          to: 'grafana',
          arrowType: 'one-way',
          arrowStyle: 'solid',
          access: 'read-only',
          label: 'Metrics data source (HTTP)'
        },
        {
          from: 'loki',
          to: 'grafana',
          arrowType: 'one-way',
          arrowStyle: 'solid',
          access: 'read-only',
          label: 'Logs data source (HTTP)'
        },
        {
          from: 'jaeger',
          to: 'grafana',
          arrowType: 'one-way',
          arrowStyle: 'solid',
          access: 'read-only',
          label: 'Traces data source (HTTP)'
        },
        {
          from: 'prometheus',
          to: 'alertmanager',
          arrowType: 'one-way',
          arrowStyle: 'solid',
          access: 'write-only',
          label: 'Alert notifications (HTTP)'
        },
        {
          from: 'loki',
          to: 'postgresql',
          arrowType: 'two-way',
          arrowStyle: 'solid',
          access: 'read-write',
          label: 'Store logs'
        },
        {
          from: 'prometheus',
          to: 'postgresql',
          arrowType: 'one-way',
          arrowStyle: 'solid',
          access: 'write-only',
          label: 'Store metrics metadata'
        }
      ]
    },
    openApiSpec: `openapi: 3.0.0
info:
  title: Observability Stack API
  version: 3.0.1
paths:
  /metrics:
    get:
      summary: Prometheus metrics
  /loki/api/v1/query:
    get:
      summary: Query logs`
  },

  // SERVICE BLOCKS (Application-level, concrete) - 6 blocks
  {
    id: 'api-gateway',
    name: 'API Gateway',
    type: 'service',
    classification: 'concrete',
    category: 'code',
    blockLabel: 'supporting-service',
    author: '@lunch-official',
    version: '1.5.2',
    description: 'Kong-based reverse proxy with rate limiting',
    longDescription: 'Production-ready API gateway with built-in rate limiting, authentication, and routing. Based on Kong but configured via simple YAML.',
    tags: ['networking', 'gateway', 'rate-limiting', 'concrete', 'security'],
    stats: { stars: 234, downloads: 3400 },
    icon: '🚪',
    containerStructure: {
      entrypoint: 'src/server.ts',
      files: [
        {
          path: 'src/server.ts',
          isEntrypoint: true,
          content: `// Kong Gateway Service - Main Entrypoint
import express from 'express';
import { setupKong } from './kong-config';
import { healthCheck } from './health';

const app = express();
const PORT = process.env.PORT || 8000;

app.use(express.json());

// Health check endpoint
app.get('/health', healthCheck);

// Initialize Kong
async function start() {
  await setupKong();
  
  app.listen(PORT, () => {
    console.log(\`Kong Gateway running on port \${PORT}\`);
  });
}

start().catch(console.error);

export { app };`
        },
        {
          path: 'src/kong-config.ts',
          content: `// Kong Gateway Configuration
import { KongClient } from '@kong/admin-client';

const kong = new KongClient({
  baseURL: process.env.KONG_ADMIN_URL!
});

export async function setupKong() {
  // Define service
  const service = await kong.services.create({
    name: 'backend-service',
    url: 'http://backend:8080'
  });

  // Define route
  await kong.routes.create({
    service: { id: service.id },
    name: 'api-route',
    paths: ['/api/*'],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    strip_path: false
  });

  // Add rate limiting plugin
  await kong.plugins.create({
    service: { id: service.id },
    name: 'rate-limiting',
    config: {
      minute: 100,
      policy: 'local'
    }
  });

  // Add CORS plugin
  await kong.plugins.create({
    service: { id: service.id },
    name: 'cors',
    config: {
      origins: ['*'],
      methods: ['GET', 'POST', 'PUT', 'DELETE'],
      headers: ['Authorization', 'Content-Type']
    }
  });

  // Add JWT authentication
  await kong.plugins.create({
    service: { id: service.id },
    name: 'jwt',
    config: {
      secret_is_base64: false
    }
  });
  
  console.log('Kong configured successfully');
}

export { kong };`
        },
        {
          path: 'src/health.ts',
          content: `// Health Check Handler
import { Request, Response } from 'express';

export function healthCheck(req: Request, res: Response) {
  res.json({
    status: 'healthy',
    service: 'api-gateway',
    timestamp: new Date().toISOString()
  });
}`
        },
        {
          path: 'package.json',
          content: `{
  "name": "api-gateway",
  "version": "1.5.2",
  "main": "dist/server.js",
  "scripts": {
    "start": "node dist/server.js",
    "build": "tsc",
    "dev": "ts-node src/server.ts"
  },
  "dependencies": {
    "express": "^4.18.2",
    "@kong/admin-client": "^1.0.0"
  },
  "devDependencies": {
    "typescript": "^5.0.0",
    "@types/express": "^4.17.17",
    "@types/node": "^20.0.0",
    "ts-node": "^10.9.1"
  }
}`
        },
        {
          path: 'tsconfig.json',
          content: `{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules"]
}`
        }
      ],
      dockerfile: `FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy source code
COPY . .

# Build TypeScript
RUN npm run build

# Expose port
EXPOSE 8000

# Health check
HEALTHCHECK --interval=30s --timeout=3s \\
  CMD node -e "require('http').get('http://localhost:8000/health')"

# Run the application
CMD ["npm", "start"]`
    },
    clientCode: `// Using the API Gateway
import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'https://api.example.com',
  headers: { 'Authorization': 'Bearer YOUR_TOKEN' }
});

// Make requests through the gateway
const products = await apiClient.get('/api/products');
const order = await apiClient.post('/api/orders', { items: [...] });`,
    openApiSpec: `openapi: 3.0.0
info:
  title: API Gateway
  version: 1.5.2
paths:
  /api/{service}/{path}:
    get:
      summary: Route GET requests
      parameters:
        - name: service
          in: path
          required: true
          schema:
            type: string
      responses:
        '200':
          description: Success
        '429':
          description: Rate limit exceeded`,
    metadata: {
      resources: {
        cpu: '500m',
        memory: '1Gi'
      },
      replicas: 2,
      healthCheck: '/health'
    },
    arguments: {
      rate_limit: {
        type: 'number',
        required: false,
        default: 1000,
        description: 'Requests per minute per IP'
      },
      enable_cors: {
        type: 'boolean',
        required: false,
        default: true,
        description: 'Enable CORS support'
      }
    },
    dependencies: [],
    languages: ['Configuration'],
    framework: 'Kong'
  },
  {
    id: 'auth-service',
    name: 'Authentication Service',
    type: 'service',
    classification: 'concrete',
    category: 'code',
    blockLabel: 'supporting-service',
    author: '@lunch-official',
    version: '2.0.0',
    description: 'Keycloak integration with OAuth2/OIDC',
    longDescription: 'Enterprise-grade authentication service supporting OAuth2, OIDC, SAML, and social logins. Built on Keycloak with simplified configuration.',
    tags: ['auth', 'security', 'oauth2', 'oidc', 'concrete', 'identity'],
    stats: { stars: 567, downloads: 2100 },
    icon: '🔐',
    containerStructure: {
      files: [
        {
          path: 'src/index.ts',
          isEntrypoint: true,
          content: `import Keycloak from 'keycloak-connect';
import session from 'express-session';
import express from 'express';

const app = express();

// Session configuration
const memoryStore = new session.MemoryStore();
app.use(session({
  secret: process.env.SESSION_SECRET!,
  resave: false,
  saveUninitialized: true,
  store: memoryStore
}));

// Keycloak configuration
const keycloak = new Keycloak({ store: memoryStore }, {
  realm: process.env.KEYCLOAK_REALM!,
  'auth-server-url': process.env.KEYCLOAK_URL!,
  'ssl-required': 'external',
  resource: process.env.KEYCLOAK_CLIENT_ID!,
  'confidential-port': 0
});

app.use(keycloak.middleware());

// Protected routes
app.get('/api/profile', keycloak.protect(), (req, res) => {
  res.json({ user: req.kauth?.grant?.access_token?.content });
});

// Login endpoint
app.post('/auth/login', async (req, res) => {
  const { username, password } = req.body;
  res.json({ message: 'Use Keycloak auth flow' });
});

app.listen(8080, () => {
  console.log('Auth Service running on port 8080');
});

export { app, keycloak };`
        },
        {
          path: 'package.json',
          content: `{
  "name": "auth-service",
  "version": "2.0.0",
  "main": "dist/index.js",
  "scripts": {
    "build": "tsc",
    "start": "node dist/index.js",
    "dev": "ts-node src/index.ts"
  },
  "dependencies": {
    "express": "^4.18.2",
    "express-session": "^1.17.3",
    "keycloak-connect": "^23.0.1"
  },
  "devDependencies": {
    "@types/express": "^4.17.21",
    "@types/express-session": "^1.17.10",
    "@types/node": "^20.10.6",
    "typescript": "^5.3.3",
    "ts-node": "^10.9.2"
  }
}`
        }
      ],
      dockerfile: `FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY dist ./dist

EXPOSE 8080

ENV NODE_ENV=production

CMD ["node", "dist/index.js"]`,
      entrypoint: 'src/index.ts'
    },
    clientCode: `// Using the Auth Service
import { AuthClient } from '@lunch/auth-client';

const auth = new AuthClient({
  issuer: 'https://auth.example.com',
  clientId: 'YOUR_CLIENT_ID'
});

// Login
const tokens = await auth.login(username, password);

// Validate token
const user = await auth.validateToken(tokens.accessToken);

// Refresh token
const newTokens = await auth.refreshToken(tokens.refreshToken);`,
    openApiSpec: `openapi: 3.0.0
info:
  title: Authentication Service
  version: 2.0.0
paths:
  /auth/login:
    post:
      summary: User login
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              properties:
                username: { type: string }
                password: { type: string }
      responses:
        '200':
          description: Login successful
          content:
            application/json:
              schema:
                type: object
                properties:
                  accessToken: { type: string }
                  refreshToken: { type: string }`,
    arguments: {
      session_timeout: {
        type: 'duration',
        required: false,
        default: '30m',
        description: 'User session timeout'
      },
      mfa_enabled: {
        type: 'boolean',
        required: false,
        default: false,
        description: 'Enable multi-factor authentication'
      }
    },
    dependencies: ['postgresql'],
    languages: ['Java'],
    framework: 'Keycloak',
    hasSDK: true,
    sdkDocs: `# Keycloak Authentication SDK Reference

## Installation

\`\`\`bash
# Node.js
npm install keycloak-connect keycloak-js

# Python
pip install python-keycloak

# Java
<dependency>
  <groupId>org.keycloak</groupId>
  <artifactId>keycloak-spring-boot-starter</artifactId>
  <version>23.0.0</version>
</dependency>
\`\`\`

## Quick Start

### Node.js (keycloak-connect)
\`\`\`javascript
const Keycloak = require('keycloak-connect');
const session = require('express-session');

const keycloak = new Keycloak({}, {
  realm: 'my-realm',
  'auth-server-url': 'https://auth.example.com',
  'ssl-required': 'external',
  resource: 'my-app',
  'confidential-port': 0,
  credentials: {
    secret: 'client-secret'
  }
});

// Protect routes
app.use(keycloak.middleware());
app.get('/api/protected', keycloak.protect(), (req, res) => {
  res.json({ message: 'Protected resource' });
});

// Role-based protection
app.get('/admin', keycloak.protect('realm:admin'), (req, res) => {
  res.json({ message: 'Admin only' });
});
\`\`\`

### Browser (keycloak-js)
\`\`\`javascript
const keycloak = new Keycloak({
  url: 'https://auth.example.com',
  realm: 'my-realm',
  clientId: 'my-app'
});

// Initialize
await keycloak.init({
  onLoad: 'check-sso',
  silentCheckSsoRedirectUri: window.location.origin + '/silent-check-sso.html'
});

if (keycloak.authenticated) {
  // Get token
  const token = keycloak.token;
  
  // Make authenticated request
  fetch('/api/protected', {
    headers: {
      'Authorization': 'Bearer ' + token
    }
  });
  
  // Refresh token
  await keycloak.updateToken(30);
}

// Login
keycloak.login();

// Logout
keycloak.logout();
\`\`\`

### Python (python-keycloak)
\`\`\`python
from keycloak import KeycloakOpenID

keycloak_openid = KeycloakOpenID(
    server_url="https://auth.example.com",
    client_id="my-app",
    realm_name="my-realm",
    client_secret_key="client-secret"
)

# Get access token
token = keycloak_openid.token(username, password)
access_token = token['access_token']

# Validate token
token_info = keycloak_openid.introspect(access_token)
if token_info['active']:
    print("Token is valid")

# User info
user_info = keycloak_openid.userinfo(access_token)

# Logout
keycloak_openid.logout(token['refresh_token'])
\`\`\`

## Key Features

- **OAuth 2.0 / OpenID Connect**: Standard authentication protocols
- **Single Sign-On (SSO)**: Login once, access multiple apps
- **Social Login**: Google, Facebook, GitHub, etc.
- **Multi-Factor Authentication**: TOTP, SMS, email
- **User Federation**: LDAP, Active Directory integration
- **Fine-grained Authorization**: Roles, groups, policies

## Common Operations

- \`init()\` - Initialize client
- \`login()\` / \`logout()\` - User authentication
- \`token()\` - Get access token
- \`updateToken()\` - Refresh token
- \`userinfo()\` - Get user profile
- \`hasRole(role)\` - Check user role`,
    deploymentArchitecture: 'distributed',
    internalArchitecture: {
      services: [
        {
          id: 'keycloak-1',
          name: 'Keycloak Instance 1',
          description: 'Primary authentication server',
          port: 8080,
          containerStructure: {
            files: [
              {
                path: 'src/server.js',
                isEntrypoint: true,
                content: `const Keycloak = require('keycloak-connect');
const express = require('express');
const session = require('express-session');
const { Pool } = require('pg');

const app = express();
app.use(express.json());
const db = new Pool({ connectionString: process.env.DATABASE_URL });

// Session store
const store = new session.MemoryStore();
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
  store
}));

// Keycloak configuration
const keycloak = new Keycloak({ store }, {
  realm: process.env.KEYCLOAK_REALM,
  'auth-server-url': 'http://localhost:8080',
  'ssl-required': 'external',
  resource: 'keycloak-admin',
  'confidential-port': 0
});

app.use(keycloak.middleware());

// Authentication endpoints
app.post('/auth/realms/:realm/protocol/openid-connect/token', async (req, res) => {
  const { username, password, grant_type } = req.body;
  const token = await generateToken(username);
  res.json({ access_token: token, token_type: 'Bearer' });
});

function generateToken(username) {
  // JWT generation logic
  return 'token_' + username + '_' + Date.now();
}

app.listen(8080, () => {
  console.log('Keycloak instance 1 ready on port 8080');
});`
              },
              {
                path: 'package.json',
                content: `{
  "name": "keycloak-server",
  "version": "1.0.0",
  "main": "src/server.js",
  "dependencies": {
    "keycloak-connect": "^23.0.0",
    "express": "^4.18.2",
    "express-session": "^1.17.3",
    "pg": "^8.11.3"
  }
}`
              }
            ],
            dockerfile: `FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY src ./src
EXPOSE 8080
ENV NODE_ENV=production
CMD ["node", "src/server.js"]`,
            entrypoint: 'src/server.js'
          }
        },
        {
          id: 'keycloak-2',
          name: 'Keycloak Instance 2',
          description: 'Backup authentication server',
          port: 8080,
          containerStructure: {
            files: [
              {
                path: 'src/server.js',
                isEntrypoint: true,
                content: `const Keycloak = require('keycloak-connect');
const express = require('express');
const session = require('express-session');
const { Pool } = require('pg');

const app = express();
app.use(express.json());
const db = new Pool({ connectionString: process.env.DATABASE_URL });

const store = new session.MemoryStore();
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
  store
}));

const keycloak = new Keycloak({ store }, {
  realm: process.env.KEYCLOAK_REALM,
  'auth-server-url': 'http://localhost:8080',
  'ssl-required': 'external',
  resource: 'keycloak-admin',
  'confidential-port': 0
});

app.use(keycloak.middleware());

app.post('/auth/realms/:realm/protocol/openid-connect/token', async (req, res) => {
  const { username, password, grant_type } = req.body;
  const token = await generateToken(username);
  res.json({ access_token: token, token_type: 'Bearer' });
});

function generateToken(username) {
  return 'token_' + username + '_' + Date.now();
}

app.listen(8080, () => {
  console.log('Keycloak instance 2 ready on port 8080');
});`
              },
              {
                path: 'package.json',
                content: `{
  "name": "keycloak-server",
  "version": "1.0.0",
  "main": "src/server.js",
  "dependencies": {
    "keycloak-connect": "^23.0.0",
    "express": "^4.18.2",
    "express-session": "^1.17.3",
    "pg": "^8.11.3"
  }
}`
              }
            ],
            dockerfile: `FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY src ./src
EXPOSE 8080
ENV NODE_ENV=production
CMD ["node", "src/server.js"]`,
            entrypoint: 'src/server.js'
          }
        }
      ],
      connections: [
        {
          from: 'keycloak-1',
          to: 'postgresql',
          arrowType: 'two-way',
          arrowStyle: 'solid',
          access: 'read-write',
          label: 'User data & sessions'
        },
        {
          from: 'keycloak-2',
          to: 'postgresql',
          arrowType: 'two-way',
          arrowStyle: 'solid',
          access: 'read-write',
          label: 'User data & sessions'
        },
        {
          from: 'keycloak-1',
          to: 'keycloak-2',
          arrowType: 'two-way',
          arrowStyle: 'dashed',
          access: 'read-write',
          label: 'Session replication'
        }
      ]
    }
  },
  {
    id: 'payment-processor',
    name: 'Payment Processor',
    type: 'service',
    classification: 'concrete',
    category: 'code',
    blockLabel: 'supporting-service',
    author: '@lunch-official',
    version: '1.3.0',
    description: 'Stripe/PayPal integration facade',
    longDescription: 'Unified payment processing service supporting multiple providers. Switch between Stripe, PayPal, or Square without code changes.',
    tags: ['payments', 'stripe', 'paypal', 'fintech', 'concrete'],
    stats: { stars: 423, downloads: 1800 },
    icon: '💳',
    deploymentArchitecture: 'single-service',
    containerStructure: {
      files: [
        {
          path: 'src/index.ts',
          isEntrypoint: true,
          content: `import Stripe from 'stripe';
import express from 'express';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16'
});

const app = express();
app.use(express.json());

// Create payment intent
app.post('/api/payments/intent', async (req, res) => {
  try {
    const { amount, currency = 'usd', customerId } = req.body;
    
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount * 100, // Convert to cents
      currency,
      customer: customerId,
      automatic_payment_methods: { enabled: true }
    });
    
    res.json({
      clientSecret: paymentIntent.client_secret,
      intentId: paymentIntent.id
    });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

// Confirm payment
app.post('/api/payments/confirm', async (req, res) => {
  try {
    const { intentId, paymentMethodId } = req.body;
    
    const payment = await stripe.paymentIntents.confirm(intentId, {
      payment_method: paymentMethodId
    });
    
    res.json({ status: payment.status, payment });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

app.listen(8003, () => {
  console.log('Payment Processor running on port 8003');
});

export { app };`
        },
        {
          path: 'package.json',
          content: `{
  "name": "payment-processor",
  "version": "1.3.0",
  "main": "dist/index.js",
  "scripts": {
    "build": "tsc",
    "start": "node dist/index.js",
    "dev": "ts-node src/index.ts"
  },
  "dependencies": {
    "express": "^4.18.2",
    "stripe": "^14.9.0"
  },
  "devDependencies": {
    "@types/express": "^4.17.21",
    "@types/node": "^20.10.6",
    "typescript": "^5.3.3",
    "ts-node": "^10.9.2"
  }
}`
        }
      ],
      dockerfile: `FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY dist ./dist

EXPOSE 8003

ENV NODE_ENV=production

CMD ["node", "dist/index.js"]`,
      entrypoint: 'src/index.ts'
    },
    clientCode: `// Using Payment Processor
import { PaymentClient } from '@lunch/payment-client';

const payment = new PaymentClient({
  apiKey: process.env.PAYMENT_API_KEY,
  environment: 'production'
});

// Create payment intent
const intent = await payment.createIntent({
  amount: 9999, // in cents
  currency: 'usd',
  paymentMethod: 'card',
  metadata: { orderId: 'order-123' }
});

// Confirm payment
const result = await payment.confirmPayment(intent.id, {
  cardNumber: '4242424242424242',
  expMonth: 12,
  expYear: 2025,
  cvc: '123'
});`,
    openApiSpec: `openapi: 3.0.0
info:
  title: Payment Processor
  version: 1.3.0
paths:
  /payments/intent:
    post:
      summary: Create payment intent
      requestBody:
        content:
          application/json:
            schema:
              type: object
              properties:
                amount: { type: integer }
                currency: { type: string }
      responses:
        '200':
          description: Payment intent created`,
    arguments: {
      provider: {
        type: 'enum',
        required: true,
        default: 'stripe',
        description: 'Payment provider'
      },
      currency: {
        type: 'string',
        required: false,
        default: 'USD',
        description: 'Default currency'
      }
    },
    dependencies: ['redis', 'secrets-vault'],
    languages: ['Python', 'Go']
  },
  {
    id: 'notification-service',
    name: 'Notification Service',
    type: 'service',
    classification: 'concrete',
    category: 'code',
    blockLabel: 'supporting-service',
    author: '@lunch-official',
    version: '1.2.1',
    description: 'Multi-channel notifications (email, SMS, push)',
    longDescription: 'Send notifications via email (SendGrid), SMS (Twilio), and push notifications (FCM) from a unified API. Template support included.',
    tags: ['notifications', 'email', 'sms', 'sendgrid', 'twilio', 'concrete'],
    stats: { stars: 312, downloads: 2500 },
    icon: '📧',
    containerStructure: {
      files: [
        {
          path: 'src/index.ts',
          isEntrypoint: true,
          content: `import sgMail from '@sendgrid/mail';
import twilio from 'twilio';
import admin from 'firebase-admin';
import express from 'express';

const app = express();
app.use(express.json());

// Initialize services
sgMail.setApiKey(process.env.SENDGRID_API_KEY!);
const twilioClient = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

admin.initializeApp({
  credential: admin.credential.cert(JSON.parse(process.env.FIREBASE_CREDENTIALS!))
});

// Send email
app.post('/api/notifications/email', async (req, res) => {
  const { to, subject, html, templateId, dynamicData } = req.body;
  
  try {
    await sgMail.send({
      to,
      from: process.env.FROM_EMAIL!,
      subject,
      html,
      ...(templateId && { templateId, dynamicTemplateData: dynamicData })
    });
    res.json({ success: true, channel: 'email' });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Send SMS
app.post('/api/notifications/sms', async (req, res) => {
  const { to, message } = req.body;
  
  try {
    await twilioClient.messages.create({
      body: message,
      to,
      from: process.env.TWILIO_PHONE_NUMBER!
    });
    res.json({ success: true, channel: 'sms' });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Send push notification
app.post('/api/notifications/push', async (req, res) => {
  const { tokens, title, body, data } = req.body;
  
  try {
    const response = await admin.messaging().sendEachForMulticast({
      tokens,
      notification: { title, body },
      data
    });
    res.json({ success: true, channel: 'push', results: response });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(8004, () => {
  console.log('Notification Service running on port 8004');
});

export { app };`
        },
        {
          path: 'package.json',
          content: `{
  "name": "notification-service",
  "version": "1.2.0",
  "main": "dist/index.js",
  "scripts": {
    "build": "tsc",
    "start": "node dist/index.js",
    "dev": "ts-node src/index.ts"
  },
  "dependencies": {
    "express": "^4.18.2",
    "@sendgrid/mail": "^7.7.0",
    "twilio": "^4.19.3",
    "firebase-admin": "^12.0.0"
  },
  "devDependencies": {
    "@types/express": "^4.17.21",
    "@types/node": "^20.10.6",
    "typescript": "^5.3.3",
    "ts-node": "^10.9.2"
  }
}`
        }
      ],
      dockerfile: `FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY dist ./dist

EXPOSE 8004

ENV NODE_ENV=production

CMD ["node", "dist/index.js"]`,
      entrypoint: 'src/index.ts'
    },
    clientCode: `// Using Notification Service
import { NotificationClient } from '@lunch/notification-client';

const notify = new NotificationClient({
  apiUrl: 'https://notifications.example.com'
});

// Send email
await notify.sendEmail({
  to: 'user@example.com',
  template: 'order-confirmation',
  data: { orderNumber: '12345', total: '$99.99' }
});

// Send SMS
await notify.sendSMS({
  to: '+1234567890',
  message: 'Your order #12345 has been confirmed!'
});

// Send push notification
await notify.sendPush({
  userId: 'user-123',
  title: 'Order Shipped',
  body: 'Your order is on its way!'
});`,
    openApiSpec: `openapi: 3.0.0
info:
  title: Notification Service
  version: 1.2.1
paths:
  /notifications/email:
    post:
      summary: Send email notification
      requestBody:
        content:
          application/json:
            schema:
              type: object
              properties:
                to: { type: string }
                template: { type: string }
                data: { type: object }
      responses:
        '200':
          description: Email sent`,
    arguments: {
      channels: {
        type: 'array',
        required: true,
        default: ['email'],
        description: 'Enabled notification channels'
      },
      template_engine: {
        type: 'enum',
        required: false,
        default: 'jinja2',
        description: 'Template engine (jinja2, handlebars)'
      }
    },
    dependencies: ['kafka', 'secrets-vault'],
    languages: ['Python'],
    hasSDK: false,
    deploymentArchitecture: 'distributed',
    internalArchitecture: {
      services: [
        {
          id: 'email-worker',
          name: 'Email Worker',
          description: 'Processes email notifications via SendGrid',
          port: 8080,
          containerStructure: {
            files: [
              {
                path: 'src/worker.ts',
                isEntrypoint: true,
                content: `import { Kafka } from 'kafkajs';
import sgMail from '@sendgrid/mail';

const kafka = new Kafka({ brokers: process.env.KAFKA_BROKER!.split(',') });
const consumer = kafka.consumer({ groupId: 'email-notifications' });

sgMail.setApiKey(process.env.SENDGRID_API_KEY!);

async function start() {
  await consumer.connect();
  await consumer.subscribe({ topic: 'notifications.email' });

  await consumer.run({
    eachMessage: async ({ message }) => {
      const { to, subject, html, template } = JSON.parse(message.value!.toString());
      
      try {
        await sgMail.send({
          to,
          from: process.env.FROM_EMAIL!,
          subject,
          html,
          templateId: template
        });
        console.log(\`Email sent to \${to}\`);
      } catch (error) {
        console.error('Email send failed:', error);
      }
    }
  });
}

start();`
              },
              {
                path: 'package.json',
                content: `{
  "name": "email-worker",
  "version": "1.0.0",
  "main": "dist/worker.js",
  "dependencies": {
    "kafkajs": "^2.2.4",
    "@sendgrid/mail": "^8.1.0"
  }
}`
              }
            ],
            dockerfile: `FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY dist ./dist
ENV NODE_ENV=production
CMD ["node", "dist/worker.js"]`,
            entrypoint: 'src/worker.ts'
          }
        },
        {
          id: 'sms-worker',
          name: 'SMS Worker',
          description: 'Processes SMS notifications via Twilio',
          port: 8081,
          containerStructure: {
            files: [
              {
                path: 'src/worker.ts',
                isEntrypoint: true,
                content: `import { Kafka } from 'kafkajs';
import twilio from 'twilio';

const kafka = new Kafka({ brokers: process.env.KAFKA_BROKER!.split(',') });
const consumer = kafka.consumer({ groupId: 'sms-notifications' });

const twilioClient = twilio(
  process.env.TWILIO_ACCOUNT_SID!,
  process.env.TWILIO_AUTH_TOKEN!
);

async function start() {
  await consumer.connect();
  await consumer.subscribe({ topic: 'notifications.sms' });

  await consumer.run({
    eachMessage: async ({ message }) => {
      const { to, body } = JSON.parse(message.value!.toString());
      
      try {
        await twilioClient.messages.create({
          to,
          from: process.env.TWILIO_PHONE!,
          body
        });
        console.log(\`SMS sent to \${to}\`);
      } catch (error) {
        console.error('SMS send failed:', error);
      }
    }
  });
}

start();`
              },
              {
                path: 'package.json',
                content: `{
  "name": "sms-worker",
  "version": "1.0.0",
  "main": "dist/worker.js",
  "dependencies": {
    "kafkajs": "^2.2.4",
    "twilio": "^4.19.0"
  }
}`
              }
            ],
            dockerfile: `FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY dist ./dist
ENV NODE_ENV=production
CMD ["node", "dist/worker.js"]`,
            entrypoint: 'src/worker.ts'
          }
        },
        {
          id: 'push-worker',
          name: 'Push Notification Worker',
          description: 'Processes push notifications via FCM',
          port: 8082,
          containerStructure: {
            files: [
              {
                path: 'src/worker.ts',
                isEntrypoint: true,
                content: `import { Kafka } from 'kafkajs';
import admin from 'firebase-admin';

const kafka = new Kafka({ brokers: process.env.KAFKA_BROKER!.split(',') });
const consumer = kafka.consumer({ groupId: 'push-notifications' });

admin.initializeApp({
  credential: admin.credential.cert(JSON.parse(process.env.FIREBASE_CREDENTIALS!))
});

async function start() {
  await consumer.connect();
  await consumer.subscribe({ topic: 'notifications.push' });

  await consumer.run({
    eachMessage: async ({ message }) => {
      const { token, title, body, data } = JSON.parse(message.value!.toString());
      
      try {
        await admin.messaging().send({
          token,
          notification: { title, body },
          data
        });
        console.log(\`Push notification sent to \${token}\`);
      } catch (error) {
        console.error('Push send failed:', error);
      }
    }
  });
}

start();`
              },
              {
                path: 'package.json',
                content: `{
  "name": "push-worker",
  "version": "1.0.0",
  "main": "dist/worker.js",
  "dependencies": {
    "kafkajs": "^2.2.4",
    "firebase-admin": "^12.0.0"
  }
}`
              }
            ],
            dockerfile: `FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY dist ./dist
ENV NODE_ENV=production
CMD ["node", "dist/worker.js"]`,
            entrypoint: 'src/worker.ts'
          }
        },
        {
          id: 'notification-api',
          name: 'Notification API',
          description: 'REST API for sending notifications',
          port: 8000,
          containerStructure: {
            files: [
              {
                path: 'src/api.ts',
                isEntrypoint: true,
                content: `import express from 'express';
import { Kafka } from 'kafkajs';

const app = express();
app.use(express.json());

const kafka = new Kafka({ brokers: process.env.KAFKA_BROKER!.split(',') });
const producer = kafka.producer();

async function start() {
  await producer.connect();

  app.post('/api/notifications/email', async (req, res) => {
    await producer.send({
      topic: 'notifications.email',
      messages: [{ value: JSON.stringify(req.body) }]
    });
    res.json({ status: 'queued', channel: 'email' });
  });

  app.post('/api/notifications/sms', async (req, res) => {
    await producer.send({
      topic: 'notifications.sms',
      messages: [{ value: JSON.stringify(req.body) }]
    });
    res.json({ status: 'queued', channel: 'sms' });
  });

  app.post('/api/notifications/push', async (req, res) => {
    await producer.send({
      topic: 'notifications.push',
      messages: [{ value: JSON.stringify(req.body) }]
    });
    res.json({ status: 'queued', channel: 'push' });
  });

  app.listen(8000, () => {
    console.log('Notification API running on port 8000');
  });
}

start();`
              },
              {
                path: 'package.json',
                content: `{
  "name": "notification-api",
  "version": "1.0.0",
  "main": "dist/api.js",
  "dependencies": {
    "express": "^4.18.2",
    "kafkajs": "^2.2.4"
  }
}`
              }
            ],
            dockerfile: `FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY dist ./dist
EXPOSE 8000
ENV NODE_ENV=production
CMD ["node", "dist/api.js"]`,
            entrypoint: 'src/api.ts'
          }
        }
      ],
      connections: [
        {
          from: 'notification-api',
          to: 'kafka',
          arrowType: 'one-way',
          arrowStyle: 'dashed',
          access: 'write-only',
          label: 'Publish notification events'
        },
        {
          from: 'email-worker',
          to: 'kafka',
          arrowType: 'one-way',
          arrowStyle: 'dashed',
          access: 'read-only',
          label: 'Consume email events'
        },
        {
          from: 'sms-worker',
          to: 'kafka',
          arrowType: 'one-way',
          arrowStyle: 'dashed',
          access: 'read-only',
          label: 'Consume SMS events'
        },
        {
          from: 'push-worker',
          to: 'kafka',
          arrowType: 'one-way',
          arrowStyle: 'dashed',
          access: 'read-only',
          label: 'Consume push events'
        }
      ]
    }
  },
  {
    id: 'recommendation-engine',
    name: 'Recommendation Engine',
    type: 'service',
    classification: 'concrete',
    category: 'code',
    blockLabel: 'app-service',
    author: '@lunch-official',
    version: '2.5.0',
    description: 'ML-powered product/content recommendations',
    longDescription: 'Production-ready recommendation engine using collaborative filtering and neural networks. Pre-trained models included, customizable with your data.',
    tags: ['ml', 'recommendations', 'ai', 'tensorflow', 'concrete'],
    stats: { stars: 678, downloads: 890 },
    icon: '🤖',
    isAI: true,
    deploymentArchitecture: 'single-service',
    containerStructure: {
      files: [
        {
          path: 'src/index.ts',
          isEntrypoint: true,
          content: `import * as tf from '@tensorflow/tfjs-node';
import express from 'express';
import { Redis } from 'ioredis';

const app = express();
app.use(express.json());

const redis = new Redis(process.env.REDIS_URL!);

// Load pre-trained model
let model: tf.LayersModel;
const loadModel = async () => {
  model = await tf.loadLayersModel(process.env.MODEL_PATH!);
};
loadModel();

// Get recommendations
app.post('/api/recommendations', async (req, res) => {
  const { userId, itemId, context, limit = 10 } = req.body;
  
  try {
    // Check cache
    const cacheKey = \`recs:\${userId}:\${itemId}:\${context}\`;
    const cached = await redis.get(cacheKey);
    if (cached) {
      return res.json(JSON.parse(cached));
    }
    
    // Get user/item embeddings
    const userEmbed = await getUserEmbedding(userId);
    const itemEmbed = await getItemEmbedding(itemId);
    
    // Run inference
    const inputTensor = tf.concat([userEmbed, itemEmbed]);
    const predictions = model.predict(inputTensor) as tf.Tensor;
    const scores = await predictions.array();
    
    // Get top N items
    const recommendations = await getTopItems(scores, limit);
    
    // Cache results (5 min TTL)
    await redis.setex(cacheKey, 300, JSON.stringify(recommendations));
    
    res.json(recommendations);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Track user interaction
app.post('/api/recommendations/track', async (req, res) => {
  const { userId, itemId, interaction } = req.body;
  
  await redis.lpush('interactions', JSON.stringify({
    userId, itemId, interaction, timestamp: Date.now()
  }));
  
  res.json({ success: true });
});

async function getUserEmbedding(userId: string): Promise<tf.Tensor> {
  return tf.randomNormal([128]);
}

async function getItemEmbedding(itemId: string): Promise<tf.Tensor> {
  return tf.randomNormal([128]);
}

async function getTopItems(scores: any, limit: number) {
  return Array.from({ length: limit }, (_, i) => ({
    itemId: \`item-\${i}\`,
    score: Math.random()
  }));
}

app.listen(8005, () => {
  console.log('Recommendation Engine running on port 8005');
});

export { app };`
        },
        {
          path: 'package.json',
          content: `{
  "name": "recommendation-engine",
  "version": "2.5.0",
  "main": "dist/index.js",
  "scripts": {
    "build": "tsc",
    "start": "node dist/index.js",
    "dev": "ts-node src/index.ts"
  },
  "dependencies": {
    "express": "^4.18.2",
    "@tensorflow/tfjs-node": "^4.15.0",
    "ioredis": "^5.3.2"
  },
  "devDependencies": {
    "@types/express": "^4.17.21",
    "@types/node": "^20.10.6",
    "typescript": "^5.3.3",
    "ts-node": "^10.9.2"
  }
}`
        }
      ],
      dockerfile: `FROM node:20-alpine

# Install Python for TensorFlow
RUN apk add --no-cache python3 make g++

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY dist ./dist
COPY models ./models

EXPOSE 8005

ENV NODE_ENV=production
ENV MODEL_PATH=/app/models/recommendation-model.json

CMD ["node", "dist/index.js"]`,
      entrypoint: 'src/index.ts'
    },
    openApiSpec: `openapi: 3.0.0
info:
  title: Recommendation Engine
  version: 2.5.0
paths:
  /recommendations:
    post:
      summary: Get personalized recommendations
      requestBody:
        content:
          application/json:
            schema:
              type: object
              properties:
                userId: { type: string }
                context: { type: string }
                limit: { type: integer }
      responses:
        '200':
          description: Recommendations returned
          content:
            application/json:
              schema:
                type: array
                items:
                  type: object
                  properties:
                    itemId: { type: string }
                    score: { type: number }`,
    arguments: {
      model: {
        type: 'ML Model Artifact',
        required: true,
        description: 'ML model artifact for generating recommendations (e.g., product-recommendation-model)'
      },
      model_type: {
        type: 'enum',
        required: false,
        default: 'collaborative_filtering',
        description: 'Recommendation algorithm'
      },
      batch_size: {
        type: 'number',
        required: false,
        default: 32,
        description: 'Inference batch size'
      }
    },
    dependencies: ['redis', 's3-storage', 'postgresql'],
    languages: ['Python'],
    framework: 'TensorFlow'
  },
  {
    id: 'search-service',
    name: 'Search Service',
    type: 'service',
    classification: 'concrete',
    category: 'code',
    blockLabel: 'app-service',
    author: '@lunch-official',
    version: '1.8.0',
    description: 'ElasticSearch/OpenSearch wrapper',
    longDescription: 'Full-text search service with auto-indexing, synonyms, and fuzzy matching. Simple API over ElasticSearch/OpenSearch complexity.',
    tags: ['search', 'elasticsearch', 'full-text', 'concrete'],
    stats: { stars: 445, downloads: 1600 },
    icon: '🔍',
    deploymentArchitecture: 'single-service',
    containerStructure: {
      files: [
        {
          path: 'src/index.ts',
          isEntrypoint: true,
          content: `import { Client } from '@elastic/elasticsearch';
import express from 'express';

const app = express();
app.use(express.json());

const esClient = new Client({
  node: process.env.ELASTICSEARCH_URL!,
  auth: {
    apiKey: process.env.ELASTICSEARCH_API_KEY!
  }
});

// Search endpoint
app.get('/api/search', async (req, res) => {
  const { q, index = 'products', from = 0, size = 20, filters } = req.query;
  
  try {
    const must: any[] = [];
    
    if (q) {
      must.push({
        multi_match: {
          query: q,
          fields: ['name^3', 'description', 'tags'],
          fuzziness: 'AUTO'
        }
      });
    }
    
    // Apply filters
    const filter: any[] = [];
    if (filters) {
      const parsedFilters = JSON.parse(filters as string);
      Object.entries(parsedFilters).forEach(([field, value]) => {
        if (typeof value === 'object' && ('min' in value || 'max' in value)) {
          filter.push({ range: { [field]: value } });
        } else {
          filter.push({ term: { [field]: value } });
        }
      });
    }
    
    const response = await esClient.search({
      index: index as string,
      body: {
        query: {
          bool: { must, filter }
        },
        from: Number(from),
        size: Number(size),
        highlight: {
          fields: {
            name: {},
            description: {}
          }
        }
      }
    });
    
    res.json({
      total: response.hits.total,
      hits: response.hits.hits.map(hit => ({
        ...hit._source,
        id: hit._id,
        score: hit._score,
        highlight: hit.highlight
      }))
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Index document
app.post('/api/index/:index', async (req, res) => {
  const { index } = req.params;
  const document = req.body;
  
  try {
    const result = await esClient.index({
      index,
      body: document
    });
    res.json({ success: true, id: result._id });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(8006, () => {
  console.log('Search Service running on port 8006');
});

export { app };`
        },
        {
          path: 'package.json',
          content: `{
  "name": "search-service",
  "version": "1.8.0",
  "main": "dist/index.js",
  "scripts": {
    "build": "tsc",
    "start": "node dist/index.js",
    "dev": "ts-node src/index.ts"
  },
  "dependencies": {
    "express": "^4.18.2",
    "@elastic/elasticsearch": "^8.11.0"
  },
  "devDependencies": {
    "@types/express": "^4.17.21",
    "@types/node": "^20.10.6",
    "typescript": "^5.3.3",
    "ts-node": "^10.9.2"
  }
}`
        }
      ],
      dockerfile: `FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY dist ./dist

EXPOSE 8006

ENV NODE_ENV=production

CMD ["node", "dist/index.js"]`,
      entrypoint: 'src/index.ts'
    },
    clientCode: `// Using Search Service
import { SearchClient } from '@lunch/search-client';

const search = new SearchClient({
  endpoint: 'https://search.example.com',
  index: 'products'
});

// Full-text search
const results = await search.query({
  q: 'laptop',
  filters: {
    category: 'electronics',
    price: { min: 500, max: 2000 }
  },
  sort: 'relevance',
  limit: 20
});

// Index new document
await search.index({
  id: 'product-123',
  fields: {
    title: 'MacBook Pro',
    description: 'Powerful laptop...',
    price: 1999
  }
});`,
    openApiSpec: `openapi: 3.0.0
info:
  title: Search Service
  version: 1.8.0
paths:
  /search:
    post:
      summary: Execute search query
      requestBody:
        content:
          application/json:
            schema:
              type: object
              properties:
                q: { type: string }
                filters: { type: object }
                limit: { type: integer }
      responses:
        '200':
          description: Search results
          content:
            application/json:
              schema:
                type: object
                properties:
                  hits: { type: array }
                  total: { type: integer }`,
    arguments: {
      index_replicas: {
        type: 'number',
        required: false,
        default: 1,
        description: 'Number of index replicas'
      },
      fuzzy_matching: {
        type: 'boolean',
        required: false,
        default: true,
        description: 'Enable fuzzy search'
      }
    },
    dependencies: ['elasticsearch'],
    languages: ['Python', 'Java']
  },

  // SUPPORTING SERVICES (Infrastructure/backing services, concrete) - 5 blocks
  {
    id: 'postgresql-ha',
    name: 'PostgreSQL 16 HA Cluster',
    type: 'service-block',
    classification: 'concrete',
    category: 'supporting-services',
    blockLabel: 'supporting-service',
    author: '@lunch-official',
    version: '16.2.0',
    description: 'Production-ready PostgreSQL with replication',
    longDescription: 'High-availability PostgreSQL cluster with streaming replication, automated backups, and point-in-time recovery.',
    tags: ['database', 'sql', 'postgresql', 'ha', 'concrete'],
    stats: { stars: 892, downloads: 5200 },
    icon: '🐘',
    schemaType: 'Table',
    observability: ['opentelemetry', 'openlineage'],
    clientCode: `// Using PostgreSQL
import { Client } from 'pg';

const client = new Client({
  host: 'postgresql-ha.default.svc.cluster.local',
  port: 5432,
  database: 'myapp',
  user: 'app_user',
  password: process.env.DB_PASSWORD
});

await client.connect();

// Query
const result = await client.query(
  'SELECT * FROM users WHERE email = $1',
  ['user@example.com']
);

// Transaction
await client.query('BEGIN');
try {
  await client.query('INSERT INTO orders ...');
  await client.query('UPDATE inventory ...');
  await client.query('COMMIT');
} catch (e) {
  await client.query('ROLLBACK');
  throw e;
}`,
    openApiSpec: `# PostgreSQL Connection Spec
host: postgresql-ha.default.svc.cluster.local
port: 5432
ssl: require
connection_pooling:
  min: 2
  max: 10
replication:
  sync_mode: synchronous
  replicas: 2`,
    arguments: {
      replicas: {
        type: 'number',
        required: false,
        default: 3,
        description: 'Number of replicas (1-5)'
      },
      backup_enabled: {
        type: 'boolean',
        required: false,
        default: true,
        description: 'Enable automated backups'
      },
      storage_size: {
        type: 'string',
        required: false,
        default: '100Gi',
        description: 'Storage size per node'
      }
    },
    dependencies: [],
    languages: ['SQL'],
    hasSDK: true,
    sdkDocs: `# PostgreSQL SDK Reference

## Installation

\`\`\`bash
# Node.js
npm install pg

# Python
pip install psycopg2-binary

# Java
<dependency>
  <groupId>org.postgresql</groupId>
  <artifactId>postgresql</artifactId>
  <version>42.7.0</version>
</dependency>

# Go
go get github.com/lib/pq
\`\`\`

## Quick Start

### Node.js (pg)
\`\`\`javascript
const { Client, Pool } = require('pg');

// Single client
const client = new Client({
  host: 'postgresql-ha.example.com',
  port: 5432,
  database: 'myapp',
  user: 'postgres',
  password: 'password',
  ssl: { rejectUnauthorized: false }
});

await client.connect();
const res = await client.query('SELECT * FROM users WHERE id = $1', [1]);
console.log(res.rows[0]);
await client.end();

// Connection pool (recommended)
const pool = new Pool({
  host: 'postgresql-ha.example.com',
  port: 5432,
  database: 'myapp',
  user: 'postgres',
  password: 'password',
  max: 20,
  idleTimeoutMillis: 30000
});

const { rows } = await pool.query('SELECT * FROM users');
\`\`\`

### Python (psycopg2)
\`\`\`python
import psycopg2
from psycopg2 import pool

# Single connection
conn = psycopg2.connect(
    host="postgresql-ha.example.com",
    port=5432,
    database="myapp",
    user="postgres",
    password="password"
)

cur = conn.cursor()
cur.execute("SELECT * FROM users WHERE id = %s", (1,))
user = cur.fetchone()
conn.close()

# Connection pool
connection_pool = pool.SimpleConnectionPool(
    1, 20,
    host="postgresql-ha.example.com",
    database="myapp",
    user="postgres",
    password="password"
)

conn = connection_pool.getconn()
cur = conn.cursor()
cur.execute("SELECT * FROM users")
users = cur.fetchall()
connection_pool.putconn(conn)
\`\`\`

## Key Features

- **ACID Transactions**: Full transaction support
- **Prepared Statements**: Parameterized queries prevent SQL injection
- **Connection Pooling**: Reuse connections for better performance
- **Streaming Replication**: HA with read replicas
- **JSON/JSONB**: Native JSON data type support

## Common Methods

- \`query(sql, params)\` - Execute query with parameters
- \`begin()\` / \`commit()\` / \`rollback()\` - Transaction control
- \`fetchone()\` / \`fetchall()\` - Retrieve results
- \`execute()\` - Execute statement without results`,
    deploymentArchitecture: 'distributed',
    internalArchitecture: {
      services: [
        {
          id: 'pg-primary',
          name: 'PostgreSQL Primary',
          description: 'Primary database accepting writes',
          port: 5432,
          containerStructure: {
            files: [
              {
                path: 'postgresql.conf',
                content: `# PostgreSQL Primary Configuration
wal_level = replica
max_wal_senders = 10
wal_keep_size = 1GB
hot_standby = on
synchronous_commit = on
synchronous_standby_names = 'standby1,standby2'

max_connections = 100
shared_buffers = 256MB
effective_cache_size = 1GB
maintenance_work_mem = 64MB
checkpoint_completion_target = 0.9
wal_buffers = 16MB
default_statistics_target = 100`
              }
            ],
            dockerfile: `FROM postgres:16-alpine

COPY postgresql.conf /etc/postgresql/postgresql.conf

EXPOSE 5432

CMD ["postgres", "-c", "config_file=/etc/postgresql/postgresql.conf"]`,
            entrypoint: 'postgresql.conf'
          }
        },
        {
          id: 'pg-standby-1',
          name: 'PostgreSQL Standby 1',
          description: 'Streaming replica for read queries',
          port: 5432,
          containerStructure: {
            files: [
              {
                path: 'postgresql.conf',
                content: `# PostgreSQL Standby Configuration
hot_standby = on
wal_receiver_status_interval = 10s
max_connections = 100
shared_buffers = 256MB

# Standby-specific
hot_standby_feedback = on
wal_receiver_timeout = 60s`
              },
              {
                path: 'recovery.conf',
                content: `# Recovery configuration
standby_mode = on
primary_conninfo = 'host=pg-primary port=5432 user=replicator password=repl_password'
trigger_file = '/tmp/failover.trigger'`
              }
            ],
            dockerfile: `FROM postgres:16-alpine

COPY postgresql.conf /etc/postgresql/postgresql.conf
COPY recovery.conf /var/lib/postgresql/recovery.conf

EXPOSE 5432

CMD ["postgres", "-c", "config_file=/etc/postgresql/postgresql.conf"]`,
            entrypoint: 'postgresql.conf'
          }
        },
        {
          id: 'pg-standby-2',
          name: 'PostgreSQL Standby 2',
          description: 'Streaming replica for read queries',
          port: 5432,
          containerStructure: {
            files: [
              {
                path: 'postgresql.conf',
                content: `# PostgreSQL Standby Configuration
hot_standby = on
wal_receiver_status_interval = 10s
max_connections = 100
shared_buffers = 256MB

# Standby-specific
hot_standby_feedback = on
wal_receiver_timeout = 60s`
              },
              {
                path: 'recovery.conf',
                content: `# Recovery configuration
standby_mode = on
primary_conninfo = 'host=pg-primary port=5432 user=replicator password=repl_password'
trigger_file = '/tmp/failover.trigger'`
              }
            ],
            dockerfile: `FROM postgres:16-alpine

COPY postgresql.conf /etc/postgresql/postgresql.conf
COPY recovery.conf /var/lib/postgresql/recovery.conf

EXPOSE 5432

CMD ["postgres", "-c", "config_file=/etc/postgresql/postgresql.conf"]`,
            entrypoint: 'postgresql.conf'
          }
        }
      ],
      connections: [
        {
          from: 'pg-primary',
          to: 'pg-standby-1',
          arrowType: 'one-way',
          arrowStyle: 'dashed',
          access: 'write-only',
          label: 'WAL streaming replication'
        },
        {
          from: 'pg-primary',
          to: 'pg-standby-2',
          arrowType: 'one-way',
          arrowStyle: 'dashed',
          access: 'write-only',
          label: 'WAL streaming replication'
        }
      ]
    },
    helmChart: `apiVersion: v2
name: postgresql-ha
description: PostgreSQL High Availability cluster
version: 1.0.0

---
apiVersion: apps/v1
kind: StatefulSet
metadata:
  name: postgresql-ha
spec:
  serviceName: postgresql-ha
  replicas: 3
  selector:
    matchLabels:
      app: postgresql
  template:
    metadata:
      labels:
        app: postgresql
    spec:
      containers:
      - name: postgresql
        image: postgres:16-alpine
        ports:
        - containerPort: 5432
          name: postgres
        env:
        - name: POSTGRES_USER
          value: "postgres"
        - name: POSTGRES_PASSWORD
          valueFrom:
            secretKeyRef:
              name: postgres-secret
              key: password
        - name: POSTGRES_DB
          value: "application"
        - name: PGDATA
          value: /var/lib/postgresql/data/pgdata
        volumeMounts:
        - name: postgres-data
          mountPath: /var/lib/postgresql/data
        - name: postgres-config
          mountPath: /etc/postgresql
        livenessProbe:
          exec:
            command:
            - pg_isready
            - -U
            - postgres
          initialDelaySeconds: 30
          periodSeconds: 10
        readinessProbe:
          exec:
            command:
            - pg_isready
            - -U
            - postgres
          initialDelaySeconds: 5
          periodSeconds: 5
      volumes:
      - name: postgres-config
        configMap:
          name: postgres-config
  volumeClaimTemplates:
  - metadata:
      name: postgres-data
    spec:
      accessModes: [ "ReadWriteOnce" ]
      resources:
        requests:
          storage: 100Gi`,
    k8sOperator: {
      crd: `apiVersion: apiextensions.k8s.io/v1
kind: CustomResourceDefinition
metadata:
  name: postgresqls.acid.zalan.do
spec:
  group: acid.zalan.do
  names:
    kind: postgresql
    listKind: postgresqlList
    plural: postgresqls
    singular: postgresql
    shortNames:
    - pg
  scope: Namespaced
  versions:
  - name: v1
    served: true
    storage: true
    schema:
      openAPIV3Schema:
        type: object
        properties:
          spec:
            type: object
            required:
            - numberOfInstances
            - teamId
            - postgresql
            properties:
              numberOfInstances:
                type: integer
                minimum: 0
              teamId:
                type: string
              postgresql:
                type: object
                required:
                - version
                properties:
                  version:
                    type: string
                    enum:
                    - "16"
                    - "15"
                    - "14"
              volume:
                type: object
                properties:
                  size:
                    type: string
                    pattern: '^[0-9]+[MGT]i$'
              enableConnectionPooler:
                type: boolean
              enableReplication:
                type: boolean`,
      operatorManifest: `apiVersion: apps/v1
kind: Deployment
metadata:
  name: postgres-operator
  namespace: default
spec:
  replicas: 1
  selector:
    matchLabels:
      app: postgres-operator
  template:
    metadata:
      labels:
        app: postgres-operator
    spec:
      serviceAccountName: postgres-operator
      containers:
      - name: postgres-operator
        image: registry.opensource.zalan.do/acid/postgres-operator:v1.11.0
        imagePullPolicy: IfNotPresent
        env:
        - name: WATCHED_NAMESPACE
          value: "*"
        - name: POD_NAME
          valueFrom:
            fieldRef:
              fieldPath: metadata.name
        - name: POSTGRES_OPERATOR_CONFIGURATION_OBJECT
          value: postgres-operator-config
        ports:
        - containerPort: 8080
          name: http
        resources:
          requests:
            cpu: 100m
            memory: 250Mi
          limits:
            cpu: 500m
            memory: 500Mi`
    }
  },
  {
    id: 'redis-cache',
    name: 'Redis 7 Cache',
    type: 'service-block',
    classification: 'concrete',
    category: 'supporting-services',
    blockLabel: 'supporting-service',
    author: '@lunch-official',
    version: '7.2.0',
    description: 'In-memory cache with persistence',
    longDescription: 'Redis cache with optional persistence (RDB/AOF), clustering support, and automatic failover.',
    tags: ['cache', 'redis', 'in-memory', 'concrete'],
    stats: { stars: 734, downloads: 4100 },
    icon: '⚡',
    observability: ['opentelemetry'],
    clientCode: `// Using Redis Cache
import Redis from 'ioredis';

const redis = new Redis({
  host: 'redis-cache.default.svc.cluster.local',
  port: 6379,
  password: process.env.REDIS_PASSWORD
});

// Set with expiry
await redis.set('user:123', JSON.stringify(userData), 'EX', 3600);

// Get
const cached = await redis.get('user:123');
const user = JSON.parse(cached);

// Pub/Sub
await redis.subscribe('notifications');
redis.on('message', (channel, message) => {
  console.log(\`Received: \${message}\`);
});

// Pipeline for batch operations
const pipeline = redis.pipeline();
pipeline.set('key1', 'value1');
pipeline.set('key2', 'value2');
await pipeline.exec();`,
    openApiSpec: `# Redis Connection Spec
host: redis-cache.default.svc.cluster.local
port: 6379
ssl: true
cluster_mode: false
sentinel:
  enabled: true
  master_name: mymaster
  nodes:
    - host: sentinel-1:26379
    - host: sentinel-2:26379
    - host: sentinel-3:26379`,
    arguments: {
      max_memory: {
        type: 'string',
        required: false,
        default: '2Gi',
        description: 'Maximum memory allocation'
      },
      persistence: {
        type: 'enum',
        required: false,
        default: 'rdb',
        description: 'Persistence mode (none, rdb, aof)'
      },
      eviction_policy: {
        type: 'enum',
        required: false,
        default: 'allkeys-lru',
        description: 'Eviction policy'
      }
    },
    dependencies: [],
    languages: ['Configuration'],
    hasSDK: true,
    sdkDocs: `# Redis SDK Reference

## Installation

\`\`\`bash
# Node.js
npm install redis ioredis

# Python
pip install redis

# Java
<dependency>
  <groupId>redis.clients</groupId>
  <artifactId>jedis</artifactId>
  <version>5.0.0</version>
</dependency>

# Go
go get github.com/redis/go-redis/v9
\`\`\`

## Quick Start

### Node.js (ioredis)
\`\`\`javascript
const Redis = require('ioredis');
const redis = new Redis({
  host: 'redis.example.com',
  port: 6379,
  password: 'your-password'
});

// String operations
await redis.set('key', 'value');
const value = await redis.get('key');

// Hash operations
await redis.hset('user:1', 'name', 'John', 'age', 30);
const user = await redis.hgetall('user:1');

// Lists
await redis.lpush('queue', 'job1', 'job2');
const job = await redis.rpop('queue');

// Pub/Sub
redis.subscribe('channel');
redis.on('message', (channel, message) => {
  console.log(channel, message);
});
\`\`\`

### Python
\`\`\`python
import redis

r = redis.Redis(
    host='redis.example.com',
    port=6379,
    password='your-password',
    decode_responses=True
)

# String operations
r.set('key', 'value')
value = r.get('key')

# Hash operations
r.hset('user:1', mapping={'name': 'John', 'age': 30})
user = r.hgetall('user:1')

# Pub/Sub
pubsub = r.pubsub()
pubsub.subscribe('channel')
for message in pubsub.listen():
    print(message)
\`\`\`

## Key Methods

- \`set(key, value)\` - Set string value
- \`get(key)\` - Get string value
- \`hset(key, field, value)\` - Set hash field
- \`hgetall(key)\` - Get all hash fields
- \`lpush/rpush(key, ...values)\` - Push to list
- \`lpop/rpop(key)\` - Pop from list
- \`publish(channel, message)\` - Publish message
- \`subscribe(channel)\` - Subscribe to channel
- \`expire(key, seconds)\` - Set expiration`,
    deploymentArchitecture: 'distributed',
    internalArchitecture: {
      entrypoints: ['redis-master'], // Single entrypoint: all requests go to master
      services: [
        {
          id: 'redis-master',
          name: 'Redis Master',
          description: 'Primary Redis instance handling all writes',
          port: 6379,
          containerStructure: {
            files: [
              {
                path: 'redis.conf',
                content: `# Redis Master Configuration
bind 0.0.0.0
port 6379
protected-mode no

# Replication settings
min-replicas-to-write 1
min-replicas-max-lag 10

# Persistence
save 900 1
save 300 10
save 60 10000
appendonly yes
appendfsync everysec

# Performance
maxmemory 256mb
maxmemory-policy allkeys-lru`
              }
            ],
            dockerfile: `FROM redis:7-alpine

COPY redis.conf /usr/local/etc/redis/redis.conf

EXPOSE 6379

CMD ["redis-server", "/usr/local/etc/redis/redis.conf"]`,
            entrypoint: 'redis.conf'
          }
        },
        {
          id: 'redis-replica-1',
          name: 'Redis Replica 1',
          description: 'Read replica for load distribution',
          port: 6379,
          containerStructure: {
            files: [
              {
                path: 'redis.conf',
                content: `# Redis Replica Configuration
bind 0.0.0.0
port 6379
protected-mode no

# Replication settings
replicaof redis-master 6379
replica-read-only yes
replica-serve-stale-data yes

# Persistence
appendonly yes
appendfsync everysec

# Performance
maxmemory 256mb
maxmemory-policy allkeys-lru`
              }
            ],
            dockerfile: `FROM redis:7-alpine

COPY redis.conf /usr/local/etc/redis/redis.conf

EXPOSE 6379

CMD ["redis-server", "/usr/local/etc/redis/redis.conf"]`,
            entrypoint: 'redis.conf'
          }
        },
        {
          id: 'redis-replica-2',
          name: 'Redis Replica 2',
          description: 'Read replica for load distribution',
          port: 6379,
          containerStructure: {
            files: [
              {
                path: 'redis.conf',
                content: `# Redis Replica Configuration
bind 0.0.0.0
port 6379
protected-mode no

# Replication settings
replicaof redis-master 6379
replica-read-only yes
replica-serve-stale-data yes

# Persistence
appendonly yes
appendfsync everysec

# Performance
maxmemory 256mb
maxmemory-policy allkeys-lru`
              }
            ],
            dockerfile: `FROM redis:7-alpine

COPY redis.conf /usr/local/etc/redis/redis.conf

EXPOSE 6379

CMD ["redis-server", "/usr/local/etc/redis/redis.conf"]`,
            entrypoint: 'redis.conf'
          }
        },
        {
          id: 'sentinel',
          name: 'Redis Sentinel',
          description: 'Monitoring and automatic failover',
          port: 26379,
          containerStructure: {
            files: [
              {
                path: 'sentinel.conf',
                content: `# Redis Sentinel Configuration
port 26379
bind 0.0.0.0
protected-mode no

# Monitor master
sentinel monitor mymaster redis-master 6379 2
sentinel down-after-milliseconds mymaster 5000
sentinel parallel-syncs mymaster 1
sentinel failover-timeout mymaster 10000

# Notification scripts
sentinel notification-script mymaster /etc/redis/notify.sh
sentinel client-reconfig-script mymaster /etc/redis/reconfig.sh

# Logging
logfile /var/log/redis/sentinel.log
loglevel notice`
              },
              {
                path: 'notify.sh',
                content: `#!/bin/bash
# Notification script for failover events
echo "Sentinel event: $@" >> /var/log/redis/events.log
# Send notification to monitoring system
curl -X POST http://monitoring/alerts -d "sentinel_event=$@"`
              }
            ],
            dockerfile: `FROM redis:7-alpine

RUN apk add --no-cache curl bash

COPY sentinel.conf /etc/redis/sentinel.conf
COPY notify.sh /etc/redis/notify.sh
RUN chmod +x /etc/redis/notify.sh

EXPOSE 26379

CMD ["redis-sentinel", "/etc/redis/sentinel.conf"]`,
            entrypoint: 'sentinel.conf'
          }
        }
      ],
      connections: [
        {
          from: 'redis-master',
          to: 'redis-replica-1',
          arrowType: 'one-way',
          arrowStyle: 'dashed',
          access: 'write-only',
          label: 'Replication stream'
        },
        {
          from: 'redis-master',
          to: 'redis-replica-2',
          arrowType: 'one-way',
          arrowStyle: 'dashed',
          access: 'write-only',
          label: 'Replication stream'
        },
        {
          from: 'sentinel',
          to: 'redis-master',
          arrowType: 'two-way',
          arrowStyle: 'solid',
          access: 'read-write',
          label: 'Health checks & commands'
        },
        {
          from: 'sentinel',
          to: 'redis-replica-1',
          arrowType: 'two-way',
          arrowStyle: 'solid',
          access: 'read-write',
          label: 'Health checks & promotion'
        },
        {
          from: 'sentinel',
          to: 'redis-replica-2',
          arrowType: 'two-way',
          arrowStyle: 'solid',
          access: 'read-write',
          label: 'Health checks & promotion'
        }
      ]
    },
    helmChart: `apiVersion: v2
name: redis
description: Redis in-memory data store
type: application
version: 7.2.0

---
apiVersion: apps/v1
kind: StatefulSet
metadata:
  name: redis
spec:
  serviceName: redis
  replicas: 3
  selector:
    matchLabels:
      app: redis
  template:
    metadata:
      labels:
        app: redis
    spec:
      containers:
      - name: redis
        image: redis:7.2-alpine
        ports:
        - containerPort: 6379
        volumeMounts:
        - name: data
          mountPath: /data`,
    k8sOperator: {
      crd: `apiVersion: apiextensions.k8s.io/v1
kind: CustomResourceDefinition
metadata:
  name: redisclusters.redis.redis.opstreelabs.in
spec:
  group: redis.redis.opstreelabs.in
  names:
    kind: RedisCluster
    plural: redisclusters`,
      operatorManifest: `apiVersion: apps/v1
kind: Deployment
metadata:
  name: redis-operator
spec:
  replicas: 1
  selector:
    matchLabels:
      name: redis-operator`
    }
  },
  {
    id: 'kafka-broker',
    name: 'Kafka Message Broker',
    type: 'service-block',
    classification: 'concrete',
    category: 'supporting-services',
    blockLabel: 'supporting-service',
    author: '@lunch-official',
    version: '3.6.0',
    description: 'Event streaming platform',
    longDescription: 'Apache Kafka cluster for event streaming with schema registry, monitoring, and guaranteed delivery.',
    tags: ['messaging', 'kafka', 'streaming', 'event-driven', 'concrete'],
    stats: { stars: 623, downloads: 2800 },
    icon: '📨',
    clientCode: `// Using Kafka
import { Kafka } from 'kafkajs';

const kafka = new Kafka({
  clientId: 'my-app',
  brokers: ['kafka-broker:9092']
});

// Producer
const producer = kafka.producer();
await producer.connect();
await producer.send({
  topic: 'orders',
  messages: [
    { key: 'order-123', value: JSON.stringify(orderData) }
  ]
});

// Consumer
const consumer = kafka.consumer({ groupId: 'order-processors' });
await consumer.connect();
await consumer.subscribe({ topic: 'orders', fromBeginning: false });

await consumer.run({
  eachMessage: async ({ topic, partition, message }) => {
    const order = JSON.parse(message.value.toString());
    await processOrder(order);
  }
});`,
    openApiSpec: `# Kafka Cluster Spec
bootstrap_servers:
  - kafka-broker-0:9092
  - kafka-broker-1:9092
  - kafka-broker-2:9092
security_protocol: SASL_SSL
sasl_mechanism: SCRAM-SHA-256
topics:
  - name: orders
    partitions: 6
    replication_factor: 3
  - name: events
    partitions: 12
    replication_factor: 3`,
    arguments: {
      partitions: {
        type: 'number',
        required: false,
        default: 3,
        description: 'Default topic partitions'
      },
      replication_factor: {
        type: 'number',
        required: false,
        default: 3,
        description: 'Replication factor'
      },
      retention_hours: {
        type: 'number',
        required: false,
        default: 168,
        description: 'Message retention (hours)'
      }
    },
    dependencies: [],
    languages: ['Configuration'],
    hasSDK: true,
    sdkDocs: `# Kafka SDK Reference

## Installation

\`\`\`bash
# Node.js
npm install kafkajs

# Python
pip install kafka-python confluent-kafka

# Java
<dependency>
  <groupId>org.apache.kafka</groupId>
  <artifactId>kafka-clients</artifactId>
  <version>3.6.0</version>
</dependency>

# Go
go get github.com/segmentio/kafka-go
\`\`\`

## Quick Start

### Node.js (KafkaJS)
\`\`\`javascript
const { Kafka } = require('kafkajs');

const kafka = new Kafka({
  clientId: 'my-app',
  brokers: ['kafka-broker-0:9092', 'kafka-broker-1:9092']
});

// Producer
const producer = kafka.producer();
await producer.connect();
await producer.send({
  topic: 'orders',
  messages: [
    { key: 'order-1', value: JSON.stringify({ id: 1, total: 99.99 }) }
  ]
});

// Consumer
const consumer = kafka.consumer({ groupId: 'my-group' });
await consumer.connect();
await consumer.subscribe({ topic: 'orders', fromBeginning: false });

await consumer.run({
  eachMessage: async ({ topic, partition, message }) => {
    console.log({
      key: message.key.toString(),
      value: message.value.toString(),
      offset: message.offset
    });
  }
});
\`\`\`

### Python (kafka-python)
\`\`\`python
from kafka import KafkaProducer, KafkaConsumer
import json

# Producer
producer = KafkaProducer(
    bootstrap_servers=['kafka-broker-0:9092'],
    value_serializer=lambda v: json.dumps(v).encode('utf-8')
)

producer.send('orders', {'id': 1, 'total': 99.99})
producer.flush()

# Consumer
consumer = KafkaConsumer(
    'orders',
    bootstrap_servers=['kafka-broker-0:9092'],
    auto_offset_reset='earliest',
    group_id='my-group',
    value_deserializer=lambda m: json.loads(m.decode('utf-8'))
)

for message in consumer:
    print(f"Received: {message.value}")
\`\`\`

## Key Concepts

- **Topics**: Named streams of records
- **Partitions**: Parallel processing units
- **Consumer Groups**: Load balancing across consumers
- **Offsets**: Position in partition
- **Replication**: Data redundancy across brokers

## Common Methods

- \`producer.send(topic, messages)\` - Publish messages
- \`consumer.subscribe(topics)\` - Subscribe to topics
- \`consumer.run(handler)\` - Process messages
- \`producer.flush()\` - Wait for all messages to send`,
    deploymentArchitecture: 'distributed',
    internalArchitecture: {
      services: [
        {
          id: 'kafka-broker-0',
          name: 'Kafka Broker 0',
          description: 'Primary broker managing topic partitions',
          port: 9092,
          containerStructure: {
            files: [
              {
                path: 'server.properties',
                content: `# Kafka Broker 0 Configuration
broker.id=0
listeners=PLAINTEXT://0.0.0.0:9092
advertised.listeners=PLAINTEXT://kafka-broker-0:9092

# Zookeeper connection
zookeeper.connect=zookeeper:2181
zookeeper.connection.timeout.ms=18000

# Replication settings
default.replication.factor=3
min.insync.replicas=2
num.partitions=6

# Log settings
log.dirs=/var/lib/kafka/data
log.retention.hours=168
log.segment.bytes=1073741824

# Performance
num.network.threads=8
num.io.threads=8
socket.send.buffer.bytes=102400
socket.receive.buffer.bytes=102400
socket.request.max.bytes=104857600`
              }
            ],
            dockerfile: `FROM confluentinc/cp-kafka:7.5.0

COPY server.properties /etc/kafka/server.properties

EXPOSE 9092

CMD ["kafka-server-start", "/etc/kafka/server.properties"]`,
            entrypoint: 'server.properties'
          }
        },
        {
          id: 'kafka-broker-1',
          name: 'Kafka Broker 1',
          description: 'Secondary broker for partition replication',
          port: 9092,
          containerStructure: {
            files: [
              {
                path: 'server.properties',
                content: `# Kafka Broker 1 Configuration
broker.id=1
listeners=PLAINTEXT://0.0.0.0:9092
advertised.listeners=PLAINTEXT://kafka-broker-1:9092

# Zookeeper connection
zookeeper.connect=zookeeper:2181
zookeeper.connection.timeout.ms=18000

# Replication settings
default.replication.factor=3
min.insync.replicas=2
num.partitions=6

# Log settings
log.dirs=/var/lib/kafka/data
log.retention.hours=168
log.segment.bytes=1073741824

# Performance
num.network.threads=8
num.io.threads=8
socket.send.buffer.bytes=102400
socket.receive.buffer.bytes=102400
socket.request.max.bytes=104857600`
              }
            ],
            dockerfile: `FROM confluentinc/cp-kafka:7.5.0

COPY server.properties /etc/kafka/server.properties

EXPOSE 9092

CMD ["kafka-server-start", "/etc/kafka/server.properties"]`,
            entrypoint: 'server.properties'
          }
        },
        {
          id: 'kafka-broker-2',
          name: 'Kafka Broker 2',
          description: 'Tertiary broker for partition replication',
          port: 9092,
          containerStructure: {
            files: [
              {
                path: 'server.properties',
                content: `# Kafka Broker 2 Configuration
broker.id=2
listeners=PLAINTEXT://0.0.0.0:9092
advertised.listeners=PLAINTEXT://kafka-broker-2:9092

# Zookeeper connection
zookeeper.connect=zookeeper:2181
zookeeper.connection.timeout.ms=18000

# Replication settings
default.replication.factor=3
min.insync.replicas=2
num.partitions=6

# Log settings
log.dirs=/var/lib/kafka/data
log.retention.hours=168
log.segment.bytes=1073741824

# Performance
num.network.threads=8
num.io.threads=8
socket.send.buffer.bytes=102400
socket.receive.buffer.bytes=102400
socket.request.max.bytes=104857600`
              }
            ],
            dockerfile: `FROM confluentinc/cp-kafka:7.5.0

COPY server.properties /etc/kafka/server.properties

EXPOSE 9092

CMD ["kafka-server-start", "/etc/kafka/server.properties"]`,
            entrypoint: 'server.properties'
          }
        },
        {
          id: 'zookeeper',
          name: 'Zookeeper',
          description: 'Cluster coordination and metadata management',
          port: 2181,
          containerStructure: {
            files: [
              {
                path: 'zoo.cfg',
                content: `# Zookeeper Configuration
tickTime=2000
dataDir=/var/lib/zookeeper/data
dataLogDir=/var/lib/zookeeper/log
clientPort=2181

# Cluster settings
initLimit=10
syncLimit=5
maxClientCnxns=60

# Leader election
electionAlg=3
autopurge.snapRetainCount=3
autopurge.purgeInterval=24

# Performance
minSessionTimeout=4000
maxSessionTimeout=40000`
              }
            ],
            dockerfile: `FROM zookeeper:3.8

COPY zoo.cfg /conf/zoo.cfg

EXPOSE 2181 2888 3888

CMD ["zkServer.sh", "start-foreground"]`,
            entrypoint: 'zoo.cfg'
          }
        }
      ],
      connections: [
        {
          from: 'kafka-broker-0',
          to: 'kafka-broker-1',
          arrowType: 'two-way',
          arrowStyle: 'dashed',
          access: 'read-write',
          label: 'Partition replication'
        },
        {
          from: 'kafka-broker-0',
          to: 'kafka-broker-2',
          arrowType: 'two-way',
          arrowStyle: 'dashed',
          access: 'read-write',
          label: 'Partition replication'
        },
        {
          from: 'kafka-broker-1',
          to: 'kafka-broker-2',
          arrowType: 'two-way',
          arrowStyle: 'dashed',
          access: 'read-write',
          label: 'Partition replication'
        },
        {
          from: 'zookeeper',
          to: 'kafka-broker-0',
          arrowType: 'two-way',
          arrowStyle: 'solid',
          access: 'read-write',
          label: 'Metadata & coordination'
        },
        {
          from: 'zookeeper',
          to: 'kafka-broker-1',
          arrowType: 'two-way',
          arrowStyle: 'solid',
          access: 'read-write',
          label: 'Metadata & coordination'
        },
        {
          from: 'zookeeper',
          to: 'kafka-broker-2',
          arrowType: 'two-way',
          arrowStyle: 'solid',
          access: 'read-write',
          label: 'Metadata & coordination'
        }
      ]
    },
    helmChart: `apiVersion: v2
name: kafka
description: Apache Kafka event streaming platform
version: 3.6.0

---
apiVersion: apps/v1
kind: StatefulSet
metadata:
  name: kafka
spec:
  serviceName: kafka
  replicas: 3
  selector:
    matchLabels:
      app: kafka
  template:
    metadata:
      labels:
        app: kafka
    spec:
      containers:
      - name: kafka
        image: confluentinc/cp-kafka:7.5.0
        ports:
        - containerPort: 9092
        env:
        - name: KAFKA_BROKER_ID
          value: "1"
        - name: KAFKA_ZOOKEEPER_CONNECT
          value: "zookeeper:2181"`,
    k8sOperator: {
      crd: `apiVersion: apiextensions.k8s.io/v1
kind: CustomResourceDefinition
metadata:
  name: kafkas.kafka.strimzi.io
spec:
  group: kafka.strimzi.io
  names:
    kind: Kafka
    plural: kafkas
    singular: kafka
  scope: Namespaced
  versions:
  - name: v1beta2
    served: true
    storage: true`,
      operatorManifest: `apiVersion: apps/v1
kind: Deployment
metadata:
  name: strimzi-cluster-operator
spec:
  replicas: 1
  selector:
    matchLabels:
      name: strimzi-cluster-operator
  template:
    spec:
      serviceAccountName: strimzi-cluster-operator
      containers:
      - name: strimzi-cluster-operator
        image: quay.io/strimzi/operator:latest`
    }
  },
  {
    id: 's3-storage',
    name: 'S3-Compatible Storage',
    type: 'service-block',
    classification: 'concrete',
    category: 'supporting-services',
    blockLabel: 'supporting-service',
    author: '@lunch-official',
    version: '2.0.0',
    description: 'Object storage (MinIO)',
    longDescription: 'S3-compatible object storage using MinIO. Perfect for file uploads, backups, and artifact storage.',
    tags: ['storage', 's3', 'object-storage', 'minio', 'concrete'],
    stats: { stars: 512, downloads: 3200 },
    icon: '🗄️',
    clientCode: `// Using S3 Storage
import { S3Client, PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';

const s3 = new S3Client({
  endpoint: 'https://s3.example.com',
  region: 'us-east-1',
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY,
    secretAccessKey: process.env.S3_SECRET_KEY
  }
});

// Upload file
await s3.send(new PutObjectCommand({
  Bucket: 'my-bucket',
  Key: 'uploads/file.pdf',
  Body: fileBuffer,
  ContentType: 'application/pdf'
}));

// Download file
const response = await s3.send(new GetObjectCommand({
  Bucket: 'my-bucket',
  Key: 'uploads/file.pdf'
}));

const fileContent = await response.Body.transformToByteArray();`,
    openApiSpec: `# S3 Configuration Spec
endpoint: https://s3.example.com
region: us-east-1
buckets:
  - name: app-uploads
    versioning: enabled
    lifecycle:
      - id: archive-old-files
        prefix: logs/
        days: 90
        storage_class: GLACIER
  - name: app-backups
    versioning: enabled
    replication:
      enabled: true
      destination: s3-backup-region`,
    arguments: {
      storage_size: {
        type: 'string',
        required: false,
        default: '500Gi',
        description: 'Total storage size'
      },
      versioning: {
        type: 'boolean',
        required: false,
        default: false,
        description: 'Enable object versioning'
      }
    },
    dependencies: [],
    languages: ['Configuration'],
    hasSDK: true,
    sdkDocs: `# S3 SDK Reference (AWS SDK compatible)

## Installation

\`\`\`bash
# Node.js
npm install @aws-sdk/client-s3

# Python
pip install boto3

# Java
<dependency>
  <groupId>com.amazonaws</groupId>
  <artifactId>aws-java-sdk-s3</artifactId>
  <version>1.12.500</version>
</dependency>

# Go
go get github.com/aws/aws-sdk-go/service/s3
\`\`\`

## Quick Start

### Node.js (AWS SDK v3)
\`\`\`javascript
const { S3Client, PutObjectCommand, GetObjectCommand, ListObjectsV2Command } = require('@aws-sdk/client-s3');

const s3 = new S3Client({
  endpoint: 'https://s3.example.com',
  region: 'us-east-1',
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY,
    secretAccessKey: process.env.S3_SECRET_KEY
  },
  forcePathStyle: true // Required for MinIO
});

// Upload object
await s3.send(new PutObjectCommand({
  Bucket: 'my-bucket',
  Key: 'uploads/file.pdf',
  Body: fileBuffer,
  ContentType: 'application/pdf',
  Metadata: { 'user-id': '12345' }
}));

// Download object
const response = await s3.send(new GetObjectCommand({
  Bucket: 'my-bucket',
  Key: 'uploads/file.pdf'
}));
const data = await response.Body.transformToByteArray();

// List objects
const list = await s3.send(new ListObjectsV2Command({
  Bucket: 'my-bucket',
  Prefix: 'uploads/',
  MaxKeys: 100
}));
\`\`\`

### Python (boto3)
\`\`\`python
import boto3
from botocore.client import Config

s3 = boto3.client(
    's3',
    endpoint_url='https://s3.example.com',
    aws_access_key_id='ACCESS_KEY',
    aws_secret_access_key='SECRET_KEY',
    config=Config(signature_version='s3v4'),
    region_name='us-east-1'
)

# Upload object
s3.put_object(
    Bucket='my-bucket',
    Key='uploads/file.pdf',
    Body=file_data,
    ContentType='application/pdf',
    Metadata={'user-id': '12345'}
)

# Download object
response = s3.get_object(Bucket='my-bucket', Key='uploads/file.pdf')
data = response['Body'].read()

# List objects
response = s3.list_objects_v2(
    Bucket='my-bucket',
    Prefix='uploads/',
    MaxKeys=100
)
for obj in response.get('Contents', []):
    print(obj['Key'])
\`\`\`

## Key Operations

- \`PutObject\` - Upload file or data
- \`GetObject\` - Download file
- \`ListObjectsV2\` - List bucket contents
- \`DeleteObject\` - Delete file
- \`CopyObject\` - Copy file within/between buckets
- \`CreateMultipartUpload\` - Large file uploads
- \`GetObjectMetadata\` - Retrieve object metadata
- \`SetBucketVersioning\` - Enable versioning

## Features

- S3-compatible API
- Multipart uploads for large files
- Server-side encryption
- Object versioning
- Lifecycle policies
- Pre-signed URLs for temporary access`,
    deploymentArchitecture: 'distributed',
    internalArchitecture: {
      services: [
        {
          id: 'minio-node-0',
          name: 'MinIO Node 0',
          description: 'Distributed storage node',
          port: 9000,
          containerStructure: {
            files: [
              {
                path: '.env',
                content: `# MinIO Node 0 Environment
MINIO_ROOT_USER=minioadmin
MINIO_ROOT_PASSWORD=minioadmin123
MINIO_SERVER_URL=http://minio-node-0:9000
MINIO_VOLUMES=/data{1...4}

# Distributed mode
MINIO_DISTRIBUTED_MODE_ENABLED=on
MINIO_DISTRIBUTED_NODES=4`
              }
            ],
            dockerfile: `FROM minio/minio:latest

COPY .env /etc/minio/.env

EXPOSE 9000 9001

ENTRYPOINT ["/usr/bin/minio"]
CMD ["server", "/data{1...4}", "--console-address", ":9001"]`,
            entrypoint: '.env'
          }
        },
        {
          id: 'minio-node-1',
          name: 'MinIO Node 1',
          description: 'Distributed storage node',
          port: 9000,
          containerStructure: {
            files: [
              {
                path: '.env',
                content: `# MinIO Node 1 Environment
MINIO_ROOT_USER=minioadmin
MINIO_ROOT_PASSWORD=minioadmin123
MINIO_SERVER_URL=http://minio-node-1:9000
MINIO_VOLUMES=/data{1...4}

# Distributed mode
MINIO_DISTRIBUTED_MODE_ENABLED=on
MINIO_DISTRIBUTED_NODES=4`
              }
            ],
            dockerfile: `FROM minio/minio:latest

COPY .env /etc/minio/.env

EXPOSE 9000 9001

ENTRYPOINT ["/usr/bin/minio"]
CMD ["server", "/data{1...4}", "--console-address", ":9001"]`,
            entrypoint: '.env'
          }
        },
        {
          id: 'minio-node-2',
          name: 'MinIO Node 2',
          description: 'Distributed storage node',
          port: 9000,
          containerStructure: {
            files: [
              {
                path: '.env',
                content: `# MinIO Node 2 Environment
MINIO_ROOT_USER=minioadmin
MINIO_ROOT_PASSWORD=minioadmin123
MINIO_SERVER_URL=http://minio-node-2:9000
MINIO_VOLUMES=/data{1...4}

# Distributed mode
MINIO_DISTRIBUTED_MODE_ENABLED=on
MINIO_DISTRIBUTED_NODES=4`
              }
            ],
            dockerfile: `FROM minio/minio:latest

COPY .env /etc/minio/.env

EXPOSE 9000 9001

ENTRYPOINT ["/usr/bin/minio"]
CMD ["server", "/data{1...4}", "--console-address", ":9001"]`,
            entrypoint: '.env'
          }
        },
        {
          id: 'minio-node-3',
          name: 'MinIO Node 3',
          description: 'Distributed storage node',
          port: 9000,
          containerStructure: {
            files: [
              {
                path: '.env',
                content: `# MinIO Node 3 Environment
MINIO_ROOT_USER=minioadmin
MINIO_ROOT_PASSWORD=minioadmin123
MINIO_SERVER_URL=http://minio-node-3:9000
MINIO_VOLUMES=/data{1...4}

# Distributed mode
MINIO_DISTRIBUTED_MODE_ENABLED=on
MINIO_DISTRIBUTED_NODES=4`
              }
            ],
            dockerfile: `FROM minio/minio:latest

COPY .env /etc/minio/.env

EXPOSE 9000 9001

ENTRYPOINT ["/usr/bin/minio"]
CMD ["server", "/data{1...4}", "--console-address", ":9001"]`,
            entrypoint: '.env'
          }
        }
      ],
      connections: [
        {
          from: 'minio-node-0',
          to: 'minio-node-1',
          arrowType: 'two-way',
          arrowStyle: 'solid',
          access: 'read-write',
          label: 'Erasure coding coordination'
        },
        {
          from: 'minio-node-0',
          to: 'minio-node-2',
          arrowType: 'two-way',
          arrowStyle: 'solid',
          access: 'read-write',
          label: 'Erasure coding coordination'
        },
        {
          from: 'minio-node-0',
          to: 'minio-node-3',
          arrowType: 'two-way',
          arrowStyle: 'solid',
          access: 'read-write',
          label: 'Erasure coding coordination'
        },
        {
          from: 'minio-node-1',
          to: 'minio-node-2',
          arrowType: 'two-way',
          arrowStyle: 'solid',
          access: 'read-write',
          label: 'Data distribution'
        },
        {
          from: 'minio-node-1',
          to: 'minio-node-3',
          arrowType: 'two-way',
          arrowStyle: 'solid',
          access: 'read-write',
          label: 'Data distribution'
        },
        {
          from: 'minio-node-2',
          to: 'minio-node-3',
          arrowType: 'two-way',
          arrowStyle: 'solid',
          access: 'read-write',
          label: 'Data distribution'
        }
      ]
    },
    helmChart: `apiVersion: v2
name: minio
description: MinIO High Performance Object Storage
version: 5.0.0

---
apiVersion: apps/v1
kind: StatefulSet
metadata:
  name: minio
spec:
  serviceName: minio
  replicas: 4
  selector:
    matchLabels:
      app: minio
  template:
    metadata:
      labels:
        app: minio
    spec:
      containers:
      - name: minio
        image: minio/minio:latest
        args:
        - server
        - http://minio-{0...3}.minio.default.svc.cluster.local/data
        - --console-address
        - ":9001"
        env:
        - name: MINIO_ROOT_USER
          valueFrom:
            secretKeyRef:
              name: minio-secret
              key: root-user
        - name: MINIO_ROOT_PASSWORD
          valueFrom:
            secretKeyRef:
              name: minio-secret
              key: root-password
        ports:
        - containerPort: 9000
          name: api
        - containerPort: 9001
          name: console
        volumeMounts:
        - name: data
          mountPath: /data
        livenessProbe:
          httpGet:
            path: /minio/health/live
            port: 9000
          initialDelaySeconds: 30
          periodSeconds: 20
        readinessProbe:
          httpGet:
            path: /minio/health/ready
            port: 9000
          initialDelaySeconds: 10
          periodSeconds: 10
  volumeClaimTemplates:
  - metadata:
      name: data
    spec:
      accessModes: [ "ReadWriteOnce" ]
      resources:
        requests:
          storage: 500Gi`,
    k8sOperator: {
      crd: `apiVersion: apiextensions.k8s.io/v1
kind: CustomResourceDefinition
metadata:
  name: tenants.minio.min.io
spec:
  group: minio.min.io
  versions:
  - name: v2
    served: true
    storage: true
    schema:
      openAPIV3Schema:
        type: object
        properties:
          spec:
            type: object
            required:
            - pools
            properties:
              pools:
                type: array
                items:
                  type: object
                  required:
                  - servers
                  - volumesPerServer
                  - volumeClaimTemplate
                  properties:
                    servers:
                      type: integer
                      minimum: 1
                    volumesPerServer:
                      type: integer
                      minimum: 1
                    volumeClaimTemplate:
                      type: object
              version:
                type: string
              credsSecret:
                type: object
  scope: Namespaced
  names:
    kind: Tenant
    singular: tenant
    plural: tenants`,
      operatorManifest: `apiVersion: apps/v1
kind: Deployment
metadata:
  name: minio-operator
  namespace: minio-operator
spec:
  replicas: 1
  selector:
    matchLabels:
      app: minio-operator
  template:
    metadata:
      labels:
        app: minio-operator
    spec:
      serviceAccountName: minio-operator
      containers:
      - name: minio-operator
        image: minio/operator:v5.0.11
        imagePullPolicy: IfNotPresent
        env:
        - name: WATCHED_NAMESPACE
          value: ""
        resources:
          requests:
            cpu: 200m
            memory: 256Mi
          limits:
            cpu: 500m
            memory: 512Mi`
    }
  },
  {
    id: 'secrets-vault',
    name: 'HashiCorp Vault',
    type: 'service-block',
    classification: 'concrete',
    category: 'supporting-services',
    blockLabel: 'supporting-service',
    author: '@lunch-official',
    version: '1.15.0',
    description: 'Secrets management',
    longDescription: 'Centralized secrets management with encryption, access control, and audit logging. Integrates with cloud KMS.',
    tags: ['secrets', 'vault', 'security', 'encryption', 'concrete'],
    stats: { stars: 445, downloads: 2400 },
    icon: '🔒',
    clientCode: `// Using HashiCorp Vault
import vault from 'node-vault';

const client = vault({
  endpoint: 'https://vault.example.com',
  token: process.env.VAULT_TOKEN
});

// Read secret
const secret = await client.read('secret/data/database');
const dbPassword = secret.data.data.password;

// Write secret
await client.write('secret/data/api-keys', {
  data: {
    stripe_key: 'sk_live_...',
    sendgrid_key: 'SG...'
  }
});

// Dynamic credentials (auto-rotated)
const dbCreds = await client.read('database/creds/app-role');
const { username, password } = dbCreds.data;
// Use credentials (they auto-expire)`,
    openApiSpec: `# Vault Configuration Spec
api_addr: https://vault.example.com
cluster_addr: https://vault-cluster.example.com:8201
storage:
  type: raft
  replicas: 3
auth_methods:
  - type: kubernetes
    path: kubernetes
  - type: token
    path: token
secret_engines:
  - type: kv-v2
    path: secret
  - type: database
    path: database
    config:
      postgresql:
        connection_url: postgresql://{{username}}:{{password}}@postgres:5432/`,
    arguments: {
      auto_unseal: {
        type: 'boolean',
        required: false,
        default: false,
        description: 'Enable auto-unseal with cloud KMS'
      },
      kv_version: {
        type: 'enum',
        required: false,
        default: 'v2',
        description: 'Key-value store version'
      }
    },
    dependencies: [],
    languages: ['Configuration'],
    hasSDK: true,
    sdkDocs: `# HashiCorp Vault SDK Reference

## Installation

\`\`\`bash
# Node.js
npm install node-vault

# Python
pip install hvac

# Java
<dependency>
  <groupId>com.bettercloud</groupId>
  <artifactId>vault-java-driver</artifactId>
  <version>5.1.0</version>
</dependency>

# Go
go get github.com/hashicorp/vault/api
\`\`\`

## Quick Start

### Node.js (node-vault)
\`\`\`javascript
const vault = require('node-vault');

const client = vault({
  endpoint: 'https://vault.example.com',
  token: process.env.VAULT_TOKEN
});

// Read secret
const secret = await client.read('secret/data/database');
const dbPassword = secret.data.data.password;

// Write secret
await client.write('secret/data/api-keys', {
  data: {
    stripe_key: 'sk_live_...',
    sendgrid_key: 'SG...'
  }
});

// List secrets
const list = await client.list('secret/metadata');
console.log(list.data.keys);

// Dynamic database credentials
const dbCreds = await client.read('database/creds/my-role');
const { username, password } = dbCreds.data;
// Credentials auto-expire based on TTL
\`\`\`

### Python (hvac)
\`\`\`python
import hvac

client = hvac.Client(
    url='https://vault.example.com',
    token=os.environ['VAULT_TOKEN']
)

# Read secret
secret = client.secrets.kv.v2.read_secret_version(
    path='database',
    mount_point='secret'
)
db_password = secret['data']['data']['password']

# Write secret
client.secrets.kv.v2.create_or_update_secret(
    path='api-keys',
    secret={
        'stripe_key': 'sk_live_...',
        'sendgrid_key': 'SG...'
    },
    mount_point='secret'
)

# Dynamic credentials
db_creds = client.secrets.database.generate_credentials('my-role')
username = db_creds['data']['username']
password = db_creds['data']['password']
\`\`\`

## Key Features

- **KV Secrets Engine**: Store static key-value pairs (v1/v2)
- **Dynamic Secrets**: Generate credentials on-demand (databases, cloud providers)
- **Encryption as a Service**: Encrypt/decrypt data without storing it
- **Leasing & Renewal**: Secrets have TTL and can be renewed
- **Authentication Methods**: Token, Kubernetes, AppRole, LDAP, etc.

## Common Operations

- \`read(path)\` - Read secret
- \`write(path, data)\` - Write secret
- \`list(path)\` - List secret paths
- \`delete(path)\` - Delete secret
- \`renew(leaseId)\` - Renew lease
- \`revoke(leaseId)\` - Revoke lease

## Secret Engines

- \`secret/\` - KV v2 (versioned secrets)
- \`database/\` - Dynamic database credentials
- \`aws/\` - Dynamic AWS credentials
- \`pki/\` - Certificate generation
- \`transit/\` - Encryption as a service`,
    deploymentArchitecture: 'distributed',
    helmChart: `apiVersion: v2
name: vault
description: HashiCorp Vault HA deployment
version: 0.27.0

---
apiVersion: apps/v1
kind: StatefulSet
metadata:
  name: vault
spec:
  serviceName: vault
  replicas: 3
  selector:
    matchLabels:
      app: vault
  template:
    metadata:
      labels:
        app: vault
    spec:
      serviceAccountName: vault
      containers:
      - name: vault
        image: hashicorp/vault:1.15.0
        args:
        - server
        - -config=/vault/config/config.hcl
        env:
        - name: VAULT_ADDR
          value: "http://127.0.0.1:8200"
        - name: VAULT_API_ADDR
          value: "http://$(POD_IP):8200"
        - name: VAULT_CLUSTER_ADDR
          value: "https://$(POD_IP):8201"
        - name: POD_IP
          valueFrom:
            fieldRef:
              fieldPath: status.podIP
        ports:
        - containerPort: 8200
          name: api
        - containerPort: 8201
          name: cluster
        volumeMounts:
        - name: vault-config
          mountPath: /vault/config
        - name: vault-data
          mountPath: /vault/data
        livenessProbe:
          httpGet:
            path: /v1/sys/health?standbyok=true
            port: 8200
          initialDelaySeconds: 60
          periodSeconds: 5
        readinessProbe:
          httpGet:
            path: /v1/sys/health?standbyok=true
            port: 8200
          initialDelaySeconds: 10
          periodSeconds: 5
      volumes:
      - name: vault-config
        configMap:
          name: vault-config
  volumeClaimTemplates:
  - metadata:
      name: vault-data
    spec:
      accessModes: [ "ReadWriteOnce" ]
      resources:
        requests:
          storage: 10Gi`,
    k8sOperator: {
      crd: `apiVersion: apiextensions.k8s.io/v1
kind: CustomResourceDefinition
metadata:
  name: vaults.vault.banzaicloud.com
spec:
  group: vault.banzaicloud.com
  versions:
  - name: v1alpha1
    served: true
    storage: true
    schema:
      openAPIV3Schema:
        type: object
        properties:
          spec:
            type: object
            required:
            - size
            properties:
              size:
                type: integer
                minimum: 1
              image:
                type: string
              bankVaultsImage:
                type: string
              config:
                type: object
              externalConfig:
                type: object
              unsealConfig:
                type: object
                properties:
                  kubernetes:
                    type: object
  scope: Namespaced
  names:
    kind: Vault
    plural: vaults
    singular: vault`,
      operatorManifest: `apiVersion: apps/v1
kind: Deployment
metadata:
  name: vault-operator
  namespace: default
spec:
  replicas: 1
  selector:
    matchLabels:
      app: vault-operator
  template:
    metadata:
      labels:
        app: vault-operator
    spec:
      serviceAccountName: vault-operator
      containers:
      - name: vault-operator
        image: ghcr.io/bank-vaults/vault-operator:1.20.0
        imagePullPolicy: IfNotPresent
        command:
        - vault-operator
        env:
        - name: WATCH_NAMESPACE
          value: ""
        - name: POD_NAME
          valueFrom:
            fieldRef:
              fieldPath: metadata.name
        resources:
          requests:
            cpu: 100m
            memory: 128Mi
          limits:
            cpu: 500m
            memory: 256Mi`
    }
  },

  // VIRTUAL BLOCKS (Abstract interfaces) - 3 blocks
  {
    id: 'cache-interface',
    name: 'Cache Interface',
    type: 'service-block',
    classification: 'virtual',
    category: 'supporting-services',
    blockLabel: 'supporting-service',
    author: '@lunch-official',
    version: '1.0.0',
    description: 'Abstract caching interface (Redis, Memcached, etc.)',
    longDescription: 'Virtual block defining a standard caching interface. Can be implemented by Redis, Memcached, or any other caching solution. Provides a consistent API regardless of underlying technology.',
    tags: ['cache', 'virtual', 'interface', 'abstraction'],
    stats: { stars: 678, downloads: 3100 },
    icon: '💾',
    provider: 'AWS ElastiCache',
    requiresSecret: true,
    sla: {
      uptime: '99.95%',
      latency: {
        p50: '< 2ms',
        p95: '< 5ms',
        p99: '< 10ms'
      },
      throughput: '50k ops/s',
      dataRetention: 'configurable (ephemeral to 7 days)',
      rpo: '< 5 minutes',
      rto: '< 30 seconds'
    },
    arguments: {
      implementation: {
        type: 'enum',
        required: true,
        default: 'redis',
        description: 'Caching implementation to use'
      },
      max_memory: {
        type: 'string',
        required: false,
        default: '2Gi',
        description: 'Maximum memory allocation'
      }
    },
    dependencies: [],
    languages: ['Interface Definition'],
    openApiSpec: `openapi: 3.0.0
info:
  title: Cache Interface
  version: 1.0.0
paths:
  /cache/{key}:
    get:
      summary: Get cached value
    put:
      summary: Set cache value
    delete:
      summary: Delete cached value`
  },
  {
    id: 'database-interface',
    name: 'Database Interface',
    type: 'service-block',
    classification: 'virtual',
    category: 'supporting-services',
    blockLabel: 'supporting-service',
    author: '@lunch-official',
    version: '1.0.0',
    description: 'Abstract database interface (PostgreSQL, MySQL, etc.)',
    longDescription: 'Virtual block defining a standard relational database interface. Can be implemented by PostgreSQL, MySQL, MariaDB, or any SQL database. Enables switching databases without code changes.',
    tags: ['database', 'virtual', 'interface', 'sql', 'abstraction'],
    stats: { stars: 892, downloads: 4200 },
    icon: '🗃️',
    schemaType: 'Table',
    provider: 'GCP Cloud SQL',
    requiresSecret: true,
    sla: {
      uptime: '99.99%',
      latency: {
        p50: '< 10ms',
        p95: '< 50ms',
        p99: '< 100ms'
      },
      throughput: '10k queries/s',
      dataRetention: 'permanent (with backups)',
      backupFrequency: 'hourly',
      rpo: '< 1 hour',
      rto: '< 15 minutes'
    },
    arguments: {
      implementation: {
        type: 'enum',
        required: true,
        default: 'postgresql',
        description: 'Database implementation (postgresql, mysql, mariadb)'
      },
      replicas: {
        type: 'number',
        required: false,
        default: 1,
        description: 'Number of read replicas'
      },
      storage_size: {
        type: 'string',
        required: false,
        default: '100Gi',
        description: 'Storage size'
      }
    },
    dependencies: [],
    languages: ['Interface Definition'],
    openApiSpec: `openapi: 3.0.0
info:
  title: Database Interface
  version: 1.0.0
paths:
  /query:
    post:
      summary: Execute SQL query
  /transaction:
    post:
      summary: Execute transaction
  /migrate:
    post:
      summary: Run database migration`
  },
  {
    id: 'message-broker-interface',
    name: 'Message Broker Interface',
    type: 'service-block',
    classification: 'virtual',
    category: 'supporting-services',
    blockLabel: 'supporting-service',
    author: '@lunch-official',
    version: '1.0.0',
    description: 'Abstract message broker interface (Kafka, RabbitMQ, etc.)',
    longDescription: 'Virtual block defining a standard message broker interface. Can be implemented by Kafka, RabbitMQ, NATS, or any messaging system. Provides event streaming and pub/sub patterns.',
    tags: ['messaging', 'virtual', 'interface', 'pubsub', 'abstraction'],
    stats: { stars: 534, downloads: 2300 },
    icon: '📬',
    provider: 'Azure Event Hubs',
    requiresSecret: true,
    sla: {
      uptime: '99.9%',
      latency: {
        p50: '< 5ms',
        p95: '< 20ms',
        p99: '< 50ms'
      },
      throughput: '100k msgs/s',
      dataRetention: '7 days (configurable)',
      rpo: '< 1 minute',
      rto: '< 5 minutes'
    },
    arguments: {
      implementation: {
        type: 'enum',
        required: true,
        default: 'kafka',
        description: 'Message broker implementation (kafka, rabbitmq, nats)'
      },
      partitions: {
        type: 'number',
        required: false,
        default: 3,
        description: 'Default topic partitions'
      },
      retention_hours: {
        type: 'number',
        required: false,
        default: 168,
        description: 'Message retention (hours)'
      }
    },
    dependencies: [],
    languages: ['Interface Definition'],
    openApiSpec: `openapi: 3.0.0
info:
  title: Message Broker Interface
  version: 1.0.0
paths:
  /topics:
    post:
      summary: Create topic
    get:
      summary: List topics
  /publish:
    post:
      summary: Publish message
  /subscribe:
    post:
      summary: Subscribe to topic`
  },

  // WORKLOADS INFRA BLOCKS - 2 blocks
  {
    id: 'eks-cluster',
    name: 'AWS EKS Cluster',
    type: 'workloads-infra',
    classification: 'concrete',
    category: 'workloads-infra',
    blockLabel: 'workloads-infra',
    author: '@lunch-official',
    version: '1.28.0',
    description: 'Managed Kubernetes cluster on AWS',
    longDescription: 'Production-ready AWS EKS (Elastic Kubernetes Service) cluster with auto-scaling, monitoring, and security best practices. Provides the foundation for running containerized workloads.',
    tags: ['kubernetes', 'eks', 'aws', 'workloads', 'concrete'],
    stats: { stars: 1200, downloads: 3400 },
    icon: '☸️',
    exampleUsageBlock: 'ecommerce-platform', // Show e-commerce platform as example
    arguments: {
      node_count: {
        type: 'number',
        required: false,
        default: 3,
        description: 'Initial number of worker nodes'
      },
      node_type: {
        type: 'string',
        required: false,
        default: 't3.large',
        description: 'EC2 instance type for nodes'
      },
      kubernetes_version: {
        type: 'string',
        required: false,
        default: '1.28',
        description: 'Kubernetes version'
      },
      enable_autoscaling: {
        type: 'boolean',
        required: false,
        default: true,
        description: 'Enable cluster autoscaling'
      }
    },
    metadata: {
      resources: {
        cpu: '6 vCPU',
        memory: '24 GiB',
      },
      replicas: 3
    },
    dependencies: [],
    languages: ['Terraform', 'YAML'],
    addons: [
      {
        id: 'cluster-autoscaler',
        name: 'Cluster Autoscaler',
        description: 'Automatically adjusts the number of nodes in the cluster based on resource demands',
        icon: '📈',
        purpose: 'Autoscaling',
        operatorCRD: `apiVersion: apiextensions.k8s.io/v1
kind: CustomResourceDefinition
metadata:
  name: clusterautoscalers.autoscaling.k8s.io
spec:
  group: autoscaling.k8s.io
  names:
    kind: ClusterAutoscaler
    plural: clusterautoscalers
    singular: clusterautoscaler
  scope: Namespaced
  versions:
    - name: v1
      served: true
      storage: true
      schema:
        openAPIV3Schema:
          type: object
          properties:
            spec:
              type: object
              properties:
                minNodes:
                  type: integer
                  minimum: 1
                maxNodes:
                  type: integer
                  minimum: 1
                scaleDownDelay:
                  type: string
                  default: "10m"
                scaleDownUtilizationThreshold:
                  type: number
                  default: 0.5`,
        operatorManifest: `apiVersion: apps/v1
kind: Deployment
metadata:
  name: cluster-autoscaler
  namespace: kube-system
spec:
  replicas: 1
  selector:
    matchLabels:
      app: cluster-autoscaler
  template:
    metadata:
      labels:
        app: cluster-autoscaler
    spec:
      serviceAccountName: cluster-autoscaler
      containers:
      - name: cluster-autoscaler
        image: k8s.gcr.io/autoscaling/cluster-autoscaler:v1.28.0
        command:
          - ./cluster-autoscaler
          - --v=4
          - --cloud-provider=aws
          - --skip-nodes-with-local-storage=false
          - --expander=least-waste
          - --node-group-auto-discovery=asg:tag=k8s.io/cluster-autoscaler/enabled
        resources:
          limits:
            cpu: 100m
            memory: 300Mi
          requests:
            cpu: 100m
            memory: 300Mi`
      },
      {
        id: 'hpa-operator',
        name: 'Horizontal Pod Autoscaler',
        description: 'Automatically scales pods based on CPU/memory utilization or custom metrics',
        icon: '⚖️',
        purpose: 'Autoscaling',
        operatorCRD: `apiVersion: apiextensions.k8s.io/v1
kind: CustomResourceDefinition
metadata:
  name: horizontalpodautoscalers.autoscaling.k8s.io
spec:
  group: autoscaling.k8s.io
  names:
    kind: HorizontalPodAutoscaler
    plural: horizontalpodautoscalers
    singular: horizontalpodautoscaler
    shortNames:
      - hpa
  scope: Namespaced
  versions:
    - name: v2
      served: true
      storage: true
      schema:
        openAPIV3Schema:
          type: object
          properties:
            spec:
              type: object
              properties:
                scaleTargetRef:
                  type: object
                  properties:
                    apiVersion:
                      type: string
                    kind:
                      type: string
                    name:
                      type: string
                minReplicas:
                  type: integer
                  minimum: 1
                maxReplicas:
                  type: integer
                  minimum: 1
                metrics:
                  type: array
                  items:
                    type: object`,
        operatorManifest: `apiVersion: apps/v1
kind: Deployment
metadata:
  name: hpa-controller
  namespace: kube-system
spec:
  replicas: 1
  selector:
    matchLabels:
      app: hpa-controller
  template:
    metadata:
      labels:
        app: hpa-controller
    spec:
      serviceAccountName: hpa-controller
      containers:
      - name: hpa-controller
        image: k8s.gcr.io/hpa-controller:v0.14.0
        command:
          - /hpa-controller
          - --v=4
          - --sync-period=30s
        resources:
          limits:
            cpu: 100m
            memory: 200Mi
          requests:
            cpu: 100m
            memory: 200Mi`
      }
    ],
    openApiSpec: `openapi: 3.0.0
info:
  title: EKS Cluster Management API
  version: 1.28.0
paths:
  /api/v1/pods:
    get:
      summary: List pods
  /api/v1/deployments:
    post:
      summary: Create deployment
  /api/v1/services:
    get:
      summary: List services`
  },
  {
    id: 'compute-platform-interface',
    name: 'Compute Platform Interface',
    type: 'workloads-infra',
    classification: 'virtual',
    category: 'workloads-infra',
    blockLabel: 'workloads-infra',
    author: '@lunch-official',
    version: '1.0.0',
    description: 'Abstract compute platform interface (K8s, ECS, etc.)',
    longDescription: 'Virtual block defining a standard compute platform interface for running containerized workloads. Can be implemented by Kubernetes (EKS/GKE/AKS), ECS, or other container orchestration platforms.',
    tags: ['compute', 'virtual', 'interface', 'kubernetes', 'workloads'],
    stats: { stars: 445, downloads: 1800 },
    icon: '⚙️',
    sla: {
      uptime: '99.95%',
      latency: {
        p50: '< 100ms',
        p95: '< 500ms',
        p99: '< 1s'
      },
      throughput: '1k deployments/hour',
      rpo: '< 5 minutes',
      rto: '< 10 minutes'
    },
    arguments: {
      implementation: {
        type: 'enum',
        required: true,
        default: 'eks',
        description: 'Platform implementation (eks, gke, aks, ecs)'
      },
      node_count: {
        type: 'number',
        required: false,
        default: 3,
        description: 'Number of compute nodes'
      },
      auto_scaling: {
        type: 'boolean',
        required: false,
        default: true,
        description: 'Enable auto-scaling'
      }
    },
    dependencies: [],
    languages: ['Interface Definition'],
    openApiSpec: `openapi: 3.0.0
info:
  title: Compute Platform Interface
  version: 1.0.0
paths:
  /deploy:
    post:
      summary: Deploy service
  /scale:
    post:
      summary: Scale service
  /status:
    get:
      summary: Get service status
  /logs:
    get:
      summary: Get service logs`
  },

  // INFRASTRUCTURE BLOCKS - 4 blocks
  {
    id: 'single-az-ec2',
    name: 'Single-AZ EC2 Cluster',
    type: 'infrastructure',
    classification: 'concrete',
    category: 'infra',
    blockLabel: 'ir-infra',
    author: '@lunch-official',
    version: '1.0.0',
    description: 'EC2 cluster in a single availability zone',
    longDescription: 'Basic EC2 compute cluster deployed in a single availability zone. Cost-effective for development and non-critical workloads. Includes auto-scaling groups, load balancing, and basic monitoring.',
    tags: ['ec2', 'aws', 'compute', 'single-az', 'infrastructure'],
    stats: { stars: 234, downloads: 8900 },
    icon: '🖥️',
    deploymentArchitecture: 'single-service',
    arguments: {
      instance_type: {
        type: 'enum',
        required: true,
        default: 't3.medium',
        description: 'EC2 instance type (t3.micro, t3.small, t3.medium, m5.large, etc.)'
      },
      instance_count: {
        type: 'number',
        required: true,
        default: 2,
        description: 'Number of EC2 instances'
      },
      availability_zone: {
        type: 'string',
        required: true,
        default: 'us-east-1a',
        description: 'AWS availability zone'
      },
      auto_scaling: {
        type: 'boolean',
        required: false,
        default: true,
        description: 'Enable auto-scaling'
      }
    },
    metadata: {
      resources: {
        cpu: '2-8 vCPUs per instance',
        memory: '4-32 GB per instance'
      }
    }
  },
  {
    id: 'multi-az-ec2',
    name: 'Multi-AZ EC2 Cluster',
    type: 'infrastructure',
    classification: 'concrete',
    category: 'infra',
    blockLabel: 'ir-infra',
    author: '@lunch-official',
    version: '1.0.0',
    description: 'Highly available EC2 cluster across multiple AZs',
    longDescription: 'Production-grade EC2 compute cluster distributed across multiple availability zones for high availability. Includes cross-AZ load balancing, automated failover, and zone-aware auto-scaling.',
    tags: ['ec2', 'aws', 'compute', 'multi-az', 'ha', 'infrastructure'],
    stats: { stars: 567, downloads: 15200 },
    icon: '🌐',
    deploymentArchitecture: 'distributed',
    arguments: {
      instance_type: {
        type: 'enum',
        required: true,
        default: 't3.medium',
        description: 'EC2 instance type'
      },
      min_instances_per_az: {
        type: 'number',
        required: true,
        default: 2,
        description: 'Minimum instances per availability zone'
      },
      availability_zones: {
        type: 'array',
        required: true,
        default: ['us-east-1a', 'us-east-1b', 'us-east-1c'],
        description: 'List of availability zones'
      },
      cross_zone_lb: {
        type: 'boolean',
        required: false,
        default: true,
        description: 'Enable cross-zone load balancing'
      }
    },
    metadata: {
      resources: {
        cpu: '2-8 vCPUs per instance',
        memory: '4-32 GB per instance'
      },
      replicas: 6
    }
  },
  {
    id: 'multi-region-ec2',
    name: 'Multi-Region EC2 Cluster',
    type: 'infrastructure',
    classification: 'concrete',
    category: 'infra',
    blockLabel: 'ir-infra',
    author: '@lunch-official',
    version: '1.0.0',
    description: 'Global EC2 cluster distributed across multiple regions',
    longDescription: 'Enterprise-grade globally distributed EC2 compute cluster spanning multiple AWS regions. Includes global load balancing, regional failover, data replication, and geo-routing for ultra-low latency worldwide.',
    tags: ['ec2', 'aws', 'compute', 'multi-region', 'global', 'infrastructure'],
    stats: { stars: 892, downloads: 6700 },
    icon: '🌍',
    deploymentArchitecture: 'distributed',
    arguments: {
      instance_type: {
        type: 'enum',
        required: true,
        default: 'm5.large',
        description: 'EC2 instance type'
      },
      regions: {
        type: 'array',
        required: true,
        default: ['us-east-1', 'eu-west-1', 'ap-southeast-1'],
        description: 'AWS regions to deploy'
      },
      instances_per_region: {
        type: 'number',
        required: true,
        default: 3,
        description: 'Number of instances per region'
      },
      global_accelerator: {
        type: 'boolean',
        required: false,
        default: true,
        description: 'Enable AWS Global Accelerator'
      },
      data_replication: {
        type: 'enum',
        required: false,
        default: 'async',
        description: 'Data replication strategy (sync, async, none)'
      }
    },
    metadata: {
      resources: {
        cpu: '2-16 vCPUs per instance',
        memory: '8-64 GB per instance'
      },
      replicas: 9
    }
  },
  {
    id: 'openstack-cluster',
    name: 'OpenStack Cluster',
    type: 'infrastructure',
    classification: 'concrete',
    category: 'infra',
    blockLabel: 'ir-infra',
    author: '@lunch-official',
    version: '1.0.0',
    description: 'On-premise OpenStack compute cluster',
    longDescription: 'Self-hosted OpenStack cloud infrastructure for on-premise deployments. Provides AWS-like compute, networking, and storage services on your own hardware. Ideal for organizations requiring data sovereignty or air-gapped environments.',
    tags: ['openstack', 'on-premise', 'compute', 'private-cloud', 'infrastructure'],
    stats: { stars: 445, downloads: 3200 },
    icon: '☁️',
    deploymentArchitecture: 'distributed',
    arguments: {
      flavor: {
        type: 'enum',
        required: true,
        default: 'm1.medium',
        description: 'OpenStack flavor (m1.small, m1.medium, m1.large, etc.)'
      },
      compute_nodes: {
        type: 'number',
        required: true,
        default: 3,
        description: 'Number of compute nodes'
      },
      network_type: {
        type: 'enum',
        required: false,
        default: 'vxlan',
        description: 'Network overlay type (vlan, vxlan, gre)'
      },
      storage_backend: {
        type: 'enum',
        required: false,
        default: 'ceph',
        description: 'Storage backend (ceph, lvm, nfs)'
      },
      high_availability: {
        type: 'boolean',
        required: false,
        default: true,
        description: 'Enable HA for control plane'
      }
    },
    metadata: {
      resources: {
        cpu: 'Configurable per flavor',
        memory: 'Configurable per flavor',
        storage: 'Distributed via Ceph/GlusterFS'
      },
      replicas: 3
    }
  },

  // FUNCTION BLOCKS - Event handlers that monitor conditions and deploy tasks
  {
    id: 'scheduled-event-handler',
    name: 'Scheduled Event Handler',
    type: 'function',
    classification: 'concrete',
    category: 'code',
    blockLabel: 'supporting-service',
    author: '@lunch-official',
    version: '1.0.0',
    description: 'Cron-based event handler that triggers tasks on schedule',
    longDescription: 'Event handler function that runs continuously, checking cron schedules and deploying tasks when the scheduled time arrives. Uses @deploy_task decorator to trigger task execution.',
    tags: ['function', 'event-handler', 'cron', 'scheduler', 'trigger'],
    stats: { stars: 387, downloads: 1250 },
    icon: '⏰',
    deploymentArchitecture: 'single-service',
    arguments: {
      cron_expression: {
        type: 'string',
        required: true,
        description: 'Cron expression for scheduling (e.g., "0 2 * * *" for daily at 2am)',
        default: '0 2 * * *'
      },
      task_name: {
        type: 'string',
        required: true,
        description: 'Name of the task block to deploy when schedule triggers'
      }
    },
    containerStructure: {
      files: [
        {
          path: 'event_handler.py',
          isEntrypoint: true,
          content: `import time
from datetime import datetime
from croniter import croniter
from lunch_runtime import deploy_task

def scheduled_event_handler(cron_expression: str, task_name: str):
    """
    Event handler that monitors a cron schedule and deploys task when condition is met.
    
    Args:
        cron_expression: Cron expression (e.g., '0 2 * * *' for daily at 2am)
        task_name: Name of the task block to deploy
    """
    cron = croniter(cron_expression, datetime.now())
    next_run = cron.get_next(datetime)
    
    print(f"Scheduled event handler initialized for task: {task_name}")
    print(f"Cron expression: {cron_expression}")
    print(f"Next scheduled run: {next_run}")
    
    while True:
        current_time = datetime.now()
        
        # Check if it's time to run
        if current_time >= next_run:
            print(f"Schedule triggered at {current_time}")
            
            # Deploy the task using the @deploy_task decorator
            @deploy_task(task_name=task_name)
            def trigger():
                return {
                    'triggered_at': current_time.isoformat(),
                    'cron_expression': cron_expression,
                    'task': task_name
                }
            
            trigger()
            
            # Calculate next run time
            next_run = cron.get_next(datetime)
            print(f"Task deployed. Next run: {next_run}")
        
        # Sleep for 10 seconds before next check
        time.sleep(10)
`
        }
      ],
      dockerfile: `FROM python:3.11-slim

RUN pip install croniter

COPY event_handler.py /usr/local/bin/
RUN chmod +x /usr/local/bin/event_handler.py

ENTRYPOINT ["python", "/usr/local/bin/event_handler.py"]`,
      entrypoint: 'event_handler.py'
    },
    clientCode: `# Deploy event handler for scheduled task execution
docker run -d \\
  -e CRON_SCHEDULE="0 2 * * *" \\
  -e TASK_NAME="extract-data-task" \\
  scheduled-event-handler:latest`,
    dependencies: [],
    languages: ['Python'],
    framework: 'Croniter',
    libraryDependencies: ['croniter'],
    blockDependencies: []
  },
  {
    id: 'file-watch-event-handler',
    name: 'File Watch Event Handler',
    type: 'function',
    classification: 'concrete',
    category: 'code',
    blockLabel: 'supporting-service',
    author: '@lunch-official',
    version: '1.0.0',
    description: 'Watch for file changes and trigger tasks',
    longDescription: 'Event handler that monitors file system for changes (create, modify, delete) and deploys tasks when files matching the pattern are detected. Perfect for data ingestion pipelines.',
    tags: ['function', 'event-handler', 'file-watch', 'filesystem', 'trigger'],
    stats: { stars: 298, downloads: 890 },
    icon: '👁️',
    deploymentArchitecture: 'single-service',
    containerStructure: {
      files: [
        {
          path: 'file_watch_handler.py',
          isEntrypoint: true,
          content: `import time
import os
from watchdog.observers import Observer
from watchdog.events import FileSystemEventHandler
from lunch_runtime import deploy_task

class FileWatchEventHandler(FileSystemEventHandler):
    """Handler for file system events that deploys tasks."""
    
    def __init__(self, task_name: str, file_pattern: str = '*'):
        self.task_name = task_name
        self.file_pattern = file_pattern
    
    def on_created(self, event):
        if event.is_directory:
            return
        
        if self.matches_pattern(event.src_path):
            print(f"New file detected: {event.src_path}")
            self.deploy_task_for_file(event.src_path)
    
    def on_modified(self, event):
        if event.is_directory:
            return
        
        if self.matches_pattern(event.src_path):
            print(f"File modified: {event.src_path}")
            self.deploy_task_for_file(event.src_path)
    
    def matches_pattern(self, filepath: str) -> bool:
        import fnmatch
        return fnmatch.fnmatch(os.path.basename(filepath), self.file_pattern)
    
    def deploy_task_for_file(self, filepath: str):
        """Deploy task when file event occurs."""
        
        @deploy_task(task_name=self.task_name)
        def trigger():
            return {
                'file_path': filepath,
                'task': self.task_name,
                'event_time': time.time()
            }
        
        trigger()
        print(f"Task '{self.task_name}' deployed for file: {filepath}")

def watch_directory(watch_path: str, task_name: str, file_pattern: str = '*.csv'):
    """
    Watch a directory for file changes and deploy task.
    
    Args:
        watch_path: Directory path to watch
        task_name: Name of the task block to deploy
        file_pattern: File pattern to match (e.g., '*.csv', '*.json')
    """
    event_handler = FileWatchEventHandler(task_name, file_pattern)
    observer = Observer()
    observer.schedule(event_handler, watch_path, recursive=True)
    observer.start()
    
    print(f"File watch event handler started")
    print(f"Watching: {watch_path}")
    print(f"Pattern: {file_pattern}")
    print(f"Task: {task_name}")
    
    try:
        while True:
            time.sleep(1)
    except KeyboardInterrupt:
        observer.stop()
    
    observer.join()

if __name__ == '__main__':
    watch_directory(
        watch_path=os.getenv('WATCH_PATH', '/data/incoming'),
        task_name=os.getenv('TASK_NAME', 'extract-data-task'),
        file_pattern=os.getenv('FILE_PATTERN', '*.csv')
    )
`
        }
      ],
      dockerfile: `FROM python:3.11-slim

RUN pip install watchdog

COPY file_watch_handler.py /usr/local/bin/
RUN chmod +x /usr/local/bin/file_watch_handler.py

ENTRYPOINT ["python", "/usr/local/bin/file_watch_handler.py"]`,
      entrypoint: 'file_watch_handler.py'
    },
    clientCode: `# Deploy file watch handler
docker run -d \\
  -v /data:/data \\
  -e WATCH_PATH="/data/incoming" \\
  -e TASK_NAME="extract-data-task" \\
  -e FILE_PATTERN="*.csv" \\
  file-watch-event-handler:latest`,
    dependencies: [],
    languages: ['Python'],
    framework: 'Watchdog',
    libraryDependencies: ['watchdog'],
    blockDependencies: []
  },
  {
    id: 'http-webhook-event-handler',
    name: 'HTTP Webhook Event Handler',
    type: 'function',
    classification: 'concrete',
    category: 'code',
    blockLabel: 'supporting-service',
    author: '@lunch-official',
    version: '1.0.0',
    description: 'HTTP endpoint that triggers tasks via webhooks',
    longDescription: 'Event handler that exposes HTTP endpoints to receive webhooks and deploy tasks. Supports authentication, payload validation, and conditional task deployment based on webhook data.',
    tags: ['function', 'event-handler', 'webhook', 'http', 'api'],
    stats: { stars: 445, downloads: 1520 },
    icon: '🔗',
    deploymentArchitecture: 'single-service',
    arguments: {
      task_name: {
        type: 'string',
        required: true,
        description: 'Name of the task block to deploy when webhook is triggered'
      },
      webhook_path: {
        type: 'string',
        required: false,
        description: 'Custom webhook path (default: /webhook/{task_name})',
        default: '/webhook'
      },
      webhook_secret: {
        type: 'string',
        required: false,
        description: 'Secret for HMAC signature verification (optional for security)'
      }
    },
    containerStructure: {
      files: [
        {
          path: 'webhook_handler.py',
          isEntrypoint: true,
          content: `from fastapi import FastAPI, HTTPException, Header, Request
from pydantic import BaseModel
from typing import Optional, Dict, Any
from lunch_runtime import deploy_task
import hmac
import hashlib
import os

app = FastAPI()

class WebhookPayload(BaseModel):
    event: str
    data: Dict[str, Any]
    timestamp: Optional[str] = None

def verify_signature(payload: str, signature: str, secret: str) -> bool:
    """Verify HMAC signature for webhook security."""
    expected_signature = hmac.new(
        secret.encode(),
        payload.encode(),
        hashlib.sha256
    ).hexdigest()
    return hmac.compare_digest(f"sha256={expected_signature}", signature)

@app.post("/webhook/{task_name}")
async def webhook_handler(
    task_name: str,
    request: Request,
    payload: WebhookPayload,
    x_signature: Optional[str] = Header(None)
):
    """
    Webhook endpoint that deploys task when called.
    
    Args:
        task_name: Name of task to deploy
        payload: Webhook payload with event data
        x_signature: Optional HMAC signature for verification
    """
    # Verify signature if secret is configured
    webhook_secret = os.getenv('WEBHOOK_SECRET')
    if webhook_secret and x_signature:
        body = await request.body()
        if not verify_signature(body.decode(), x_signature, webhook_secret):
            raise HTTPException(status_code=401, detail="Invalid signature")
    
    print(f"Webhook received for task: {task_name}")
    print(f"Event: {payload.event}")
    
    # Deploy the task
    @deploy_task(task_name=task_name)
    def trigger():
        return {
            'task': task_name,
            'event': payload.event,
            'webhook_data': payload.data,
            'timestamp': payload.timestamp
        }
    
    result = trigger()
    print(f"Task '{task_name}' deployed via webhook")
    
    return {
        'status': 'success',
        'task': task_name,
        'event': payload.event,
        'deployed_at': payload.timestamp
    }

@app.get("/health")
async def health_check():
    return {'status': 'healthy', 'service': 'webhook-event-handler'}
`
        }
      ],
      dockerfile: `FROM python:3.11-slim

RUN pip install fastapi uvicorn pydantic

COPY webhook_handler.py /usr/local/bin/
RUN chmod +x /usr/local/bin/webhook_handler.py

EXPOSE 8000

ENTRYPOINT ["python", "/usr/local/bin/webhook_handler.py"]`,
      entrypoint: 'webhook_handler.py'
    },
    clientCode: `# Deploy webhook handler
docker run -d \\
  -p 8000:8000 \\
  -e WEBHOOK_SECRET="your-secret-key" \\
  http-webhook-event-handler:latest

# Trigger via webhook
curl -X POST http://localhost:8000/webhook/extract-data-task \\
  -H "Content-Type: application/json" \\
  -H "X-Signature: sha256=..." \\
  -d '{
    "event": "data.received",
    "data": {"source": "s3://bucket/data.csv"},
    "timestamp": "2025-11-12T10:30:00Z"
  }'`,
    openApiSpec: `openapi: 3.0.0
info:
  title: HTTP Webhook Event Handler API
  version: 1.0.0
  description: Webhook endpoints for triggering task deployments
paths:
  /webhook/{task_name}:
    post:
      summary: Trigger task deployment via webhook
      parameters:
        - name: task_name
          in: path
          required: true
          schema:
            type: string
          description: Name of the task block to deploy
        - name: X-Signature
          in: header
          required: false
          schema:
            type: string
          description: HMAC SHA256 signature for webhook verification
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              required:
                - event
                - data
              properties:
                event:
                  type: string
                  description: Event type identifier
                  example: "data.received"
                data:
                  type: object
                  description: Event payload data
                  example: {"source": "s3://bucket/data.csv"}
                timestamp:
                  type: string
                  format: date-time
                  description: ISO 8601 timestamp
                  example: "2025-11-12T10:30:00Z"
      responses:
        '200':
          description: Task deployed successfully
          content:
            application/json:
              schema:
                type: object
                properties:
                  status:
                    type: string
                    example: "success"
                  task:
                    type: string
                    example: "extract-data-task"
                  event:
                    type: string
                    example: "data.received"
                  deployed_at:
                    type: string
                    format: date-time
        '401':
          description: Invalid signature
  /health:
    get:
      summary: Health check endpoint
      responses:
        '200':
          description: Service is healthy
          content:
            application/json:
              schema:
                type: object
                properties:
                  status:
                    type: string
                    example: "healthy"
                  service:
                    type: string
                    example: "webhook-event-handler"`,
    dependencies: [],
    languages: ['Python'],
    framework: 'FastAPI',
    libraryDependencies: ['fastapi', 'uvicorn', 'pydantic'],
    blockDependencies: []
  },
  {
    id: 'database-poll-event-handler',
    name: 'Database Poll Event Handler',
    type: 'function',
    classification: 'concrete',
    category: 'code',
    blockLabel: 'supporting-service',
    author: '@lunch-official',
    version: '1.0.0',
    description: 'Poll database for changes and trigger tasks',
    longDescription: 'Event handler that continuously polls a database table for new records or changes and deploys tasks when conditions are met. Supports PostgreSQL, MySQL, and other SQL databases.',
    tags: ['function', 'event-handler', 'database', 'polling', 'sql'],
    stats: { stars: 334, downloads: 1050 },
    icon: '🗄️',
    deploymentArchitecture: 'single-service',
    containerStructure: {
      files: [
        {
          path: 'db_poll_handler.py',
          isEntrypoint: true,
          content: `import time
import os
from datetime import datetime
import psycopg2
from lunch_runtime import deploy_task

def database_poll_handler(
    connection_string: str,
    task_name: str,
    poll_query: str,
    poll_interval: int = 30
):
    """
    Poll database for changes and deploy task when new records found.
    
    Args:
        connection_string: Database connection string
        task_name: Name of task to deploy
        poll_query: SQL query to check for new records
        poll_interval: Seconds between polls (default: 30)
    """
    last_processed_id = 0
    
    print(f"Database poll event handler initialized")
    print(f"Task: {task_name}")
    print(f"Poll interval: {poll_interval}s")
    print(f"Query: {poll_query}")
    
    while True:
        try:
            conn = psycopg2.connect(connection_string)
            cursor = conn.cursor()
            
            # Execute poll query
            cursor.execute(poll_query, (last_processed_id,))
            new_records = cursor.fetchall()
            
            if new_records:
                print(f"Found {len(new_records)} new records")
                
                # Get the highest ID from new records
                new_last_id = max(record[0] for record in new_records)
                
                # Deploy task for the batch of new records
                @deploy_task(task_name=task_name)
                def trigger():
                    return {
                        'task': task_name,
                        'record_count': len(new_records),
                        'last_id': new_last_id,
                        'triggered_at': datetime.now().isoformat()
                    }
                
                trigger()
                print(f"Task '{task_name}' deployed for {len(new_records)} records")
                
                # Update last processed ID
                last_processed_id = new_last_id
            
            cursor.close()
            conn.close()
            
        except Exception as e:
            print(f"Error polling database: {e}")
        
        # Wait before next poll
        time.sleep(poll_interval)

if __name__ == '__main__':
    database_poll_handler(
        connection_string=os.getenv('DB_CONNECTION'),
        task_name=os.getenv('TASK_NAME', 'extract-data-task'),
        poll_query=os.getenv('POLL_QUERY', 'SELECT id, created_at FROM events WHERE id > %s ORDER BY id'),
        poll_interval=int(os.getenv('POLL_INTERVAL', 30))
    )
`
        }
      ],
      dockerfile: `FROM python:3.11-slim

RUN pip install psycopg2-binary

COPY db_poll_handler.py /usr/local/bin/
RUN chmod +x /usr/local/bin/db_poll_handler.py

ENTRYPOINT ["python", "/usr/local/bin/db_poll_handler.py"]`,
      entrypoint: 'db_poll_handler.py'
    },
    clientCode: `# Deploy database poll handler
docker run -d \\
  -e DB_CONNECTION="postgresql://user:pass@host:5432/db" \\
  -e TASK_NAME="extract-data-task" \\
  -e POLL_QUERY="SELECT id, data FROM events WHERE id > %s ORDER BY id" \\
  -e POLL_INTERVAL="30" \\
  database-poll-event-handler:latest`,
    dependencies: [],
    languages: ['Python'],
    framework: 'psycopg2',
    libraryDependencies: ['psycopg2-binary'],
    blockDependencies: []
  },

  // CHECKER FUNCTION BLOCKS - Functions that verify pre-conditions before task execution (return 0 or 1)
  {
    id: 'file-exists-checker',
    name: 'File Exists Checker',
    type: 'function',
    classification: 'concrete',
    category: 'code',
    blockLabel: 'supporting-service',
    author: '@lunch-official',
    version: '1.0.0',
    description: 'Verify that required files exist before task execution',
    longDescription: 'Checker function that validates file existence before allowing task execution. Returns 1 if all required files exist, 0 otherwise. Useful for data pipeline tasks that depend on input files.',
    tags: ['function', 'checker', 'validation', 'filesystem', 'pre-condition'],
    stats: { stars: 198, downloads: 650 },
    icon: '📁',
    deploymentArchitecture: 'single-service',
    arguments: {
      file_paths: {
        type: 'array',
        required: true,
        description: 'List of file paths that must exist'
      },
      check_readable: {
        type: 'boolean',
        required: false,
        description: 'Also verify files are readable',
        default: true
      }
    },
    containerStructure: {
      files: [
        {
          path: 'file_checker.py',
          isEntrypoint: true,
          content: `import os
import sys
from typing import List

def file_exists_checker(file_paths: List[str], check_readable: bool = True) -> int:
    """
    Check if required files exist before task execution.
    
    Args:
        file_paths: List of file paths to verify
        check_readable: Also check if files are readable
        
    Returns:
        1 if all files exist (and are readable if check_readable=True)
        0 if any file is missing or not readable
    """
    for file_path in file_paths:
        if not os.path.exists(file_path):
            print(f"CHECKER FAILED: File does not exist: {file_path}")
            return 0
        
        if check_readable and not os.access(file_path, os.R_OK):
            print(f"CHECKER FAILED: File is not readable: {file_path}")
            return 0
    
    print(f"CHECKER PASSED: All {len(file_paths)} files exist and are accessible")
    return 1
`
        }
      ],
      dockerfile: `FROM python:3.11-slim

COPY file_checker.py /usr/local/bin/
RUN chmod +x /usr/local/bin/file_checker.py

ENTRYPOINT ["python", "/usr/local/bin/file_checker.py"]`,
      entrypoint: 'file_checker.py'
    },
    clientCode: `# Use in DAG node to verify files before task
docker run --rm -v /data:/data file-exists-checker:latest \\
  --file_paths /data/input.csv /data/config.json`,
    dependencies: [],
    languages: ['Python'],
    framework: 'Python Standard Library',
    libraryDependencies: [],
    blockDependencies: []
  },
  {
    id: 'api-health-checker',
    name: 'API Health Checker',
    type: 'function',
    classification: 'concrete',
    category: 'code',
    blockLabel: 'supporting-service',
    author: '@lunch-official',
    version: '1.0.0',
    description: 'Verify API endpoint health before task execution',
    longDescription: 'Checker function that validates external API availability before task execution. Returns 1 if API responds with successful status, 0 otherwise. Essential for tasks depending on external services.',
    tags: ['function', 'checker', 'validation', 'api', 'health-check'],
    stats: { stars: 267, downloads: 820 },
    icon: '🏥',
    deploymentArchitecture: 'single-service',
    arguments: {
      api_url: {
        type: 'string',
        required: true,
        description: 'API endpoint URL to check'
      },
      timeout: {
        type: 'number',
        required: false,
        description: 'Request timeout in seconds',
        default: 10
      },
      expected_status: {
        type: 'number',
        required: false,
        description: 'Expected HTTP status code',
        default: 200
      }
    },
    containerStructure: {
      files: [
        {
          path: 'api_checker.py',
          isEntrypoint: true,
          content: `import requests
import sys

def api_health_checker(api_url: str, timeout: int = 10, expected_status: int = 200) -> int:
    """
    Check if API endpoint is healthy before task execution.
    
    Args:
        api_url: URL of the API endpoint to check
        timeout: Request timeout in seconds
        expected_status: Expected HTTP status code
        
    Returns:
        1 if API responds with expected status
        0 if API is unreachable or returns unexpected status
    """
    try:
        response = requests.get(api_url, timeout=timeout)
        
        if response.status_code == expected_status:
            print(f"CHECKER PASSED: API healthy at {api_url} (status: {response.status_code})")
            return 1
        else:
            print(f"CHECKER FAILED: API returned status {response.status_code}, expected {expected_status}")
            return 0
            
    except requests.exceptions.Timeout:
        print(f"CHECKER FAILED: API request timed out after {timeout}s")
        return 0
    except requests.exceptions.ConnectionError:
        print(f"CHECKER FAILED: Could not connect to API at {api_url}")
        return 0
    except Exception as e:
        print(f"CHECKER FAILED: Unexpected error: {str(e)}")
        return 0
`
        }
      ],
      dockerfile: `FROM python:3.11-slim

RUN pip install requests

COPY api_checker.py /usr/local/bin/
RUN chmod +x /usr/local/bin/api_checker.py

ENTRYPOINT ["python", "/usr/local/bin/api_checker.py"]`,
      entrypoint: 'api_checker.py'
    },
    clientCode: `# Use in DAG node to verify API before task
docker run --rm api-health-checker:latest \\
  --api_url https://api.example.com/health \\
  --timeout 5 \\
  --expected_status 200`,
    dependencies: [],
    languages: ['Python'],
    framework: 'Requests',
    libraryDependencies: ['requests'],
    blockDependencies: []
  },
  {
    id: 'database-connection-checker',
    name: 'Database Connection Checker',
    type: 'function',
    classification: 'concrete',
    category: 'code',
    blockLabel: 'supporting-service',
    author: '@lunch-official',
    version: '1.0.0',
    description: 'Verify database connectivity before task execution',
    longDescription: 'Checker function that validates database connection and optionally verifies table existence before task execution. Returns 1 if database is accessible, 0 otherwise.',
    tags: ['function', 'checker', 'validation', 'database', 'connectivity'],
    stats: { stars: 312, downloads: 950 },
    icon: '🔌',
    deploymentArchitecture: 'single-service',
    arguments: {
      connection_string: {
        type: 'string',
        required: true,
        description: 'Database connection string'
      },
      verify_table: {
        type: 'string',
        required: false,
        description: 'Optional table name to verify existence'
      }
    },
    containerStructure: {
      files: [
        {
          path: 'db_checker.py',
          isEntrypoint: true,
          content: `import psycopg2
from typing import Optional

def database_connection_checker(connection_string: str, verify_table: Optional[str] = None) -> int:
    """
    Check database connectivity before task execution.
    
    Args:
        connection_string: Database connection string
        verify_table: Optional table name to verify existence
        
    Returns:
        1 if database is accessible (and table exists if specified)
        0 if connection fails or table doesn't exist
    """
    try:
        conn = psycopg2.connect(connection_string)
        cursor = conn.cursor()
        
        # Test basic connectivity
        cursor.execute("SELECT 1")
        
        # Optionally verify table exists
        if verify_table:
            cursor.execute(
                "SELECT EXISTS (SELECT FROM information_schema.tables WHERE table_name = %s)",
                (verify_table,)
            )
            table_exists = cursor.fetchone()[0]
            
            if not table_exists:
                print(f"CHECKER FAILED: Table '{verify_table}' does not exist")
                cursor.close()
                conn.close()
                return 0
            
            print(f"CHECKER PASSED: Database connected and table '{verify_table}' exists")
        else:
            print(f"CHECKER PASSED: Database connection successful")
        
        cursor.close()
        conn.close()
        return 1
        
    except psycopg2.OperationalError as e:
        print(f"CHECKER FAILED: Could not connect to database: {str(e)}")
        return 0
    except Exception as e:
        print(f"CHECKER FAILED: Unexpected error: {str(e)}")
        return 0
`
        }
      ],
      dockerfile: `FROM python:3.11-slim

RUN pip install psycopg2-binary

COPY db_checker.py /usr/local/bin/
RUN chmod +x /usr/local/bin/db_checker.py

ENTRYPOINT ["python", "/usr/local/bin/db_checker.py"]`,
      entrypoint: 'db_checker.py'
    },
    clientCode: `# Use in DAG node to verify database before task
docker run --rm database-connection-checker:latest \\
  --connection_string "postgresql://user:pass@localhost:5432/db" \\
  --verify_table "events"`,
    dependencies: [],
    languages: ['Python'],
    framework: 'psycopg2',
    libraryDependencies: ['psycopg2-binary'],
    blockDependencies: []
  },

  // TASK BLOCKS - Individual tasks that can be used in DAG blocks
  {
    id: 'build-docker-task',
    name: 'Build Docker Image Task',
    type: 'task',
    classification: 'concrete',
    category: 'code',
    blockLabel: 'supporting-service',
    author: '@lunch-official',
    version: '1.0.0',
    description: 'Build and push Docker image to registry',
    longDescription: 'Reusable task for building Docker images from source code and pushing to container registry. Supports multi-stage builds, build args, and caching.',
    tags: ['task', 'docker', 'build', 'ci-cd', 'container'],
    stats: { stars: 245, downloads: 980 },
    icon: '🐳',
    deploymentArchitecture: 'single-service',
    arguments: {
      image_name: {
        type: 'string',
        required: true,
        description: 'Name of the Docker image to build'
      },
      image_tag: {
        type: 'string',
        required: true,
        description: 'Tag for the Docker image (e.g., latest, v1.0.0, git-sha)',
        default: 'latest'
      },
      registry: {
        type: 'string',
        required: true,
        description: 'Container registry URL (e.g., gcr.io, ghcr.io, docker.io)'
      },
      build_context: {
        type: 'string',
        required: false,
        description: 'Path to build context directory',
        default: '.'
      }
    },
    containerStructure: {
      files: [
        {
          path: 'build_image.sh',
          isEntrypoint: true,
          content: `#!/bin/bash
set -e

IMAGE_NAME=$1
IMAGE_TAG=$2
REGISTRY=$3

echo "Building Docker image: $IMAGE_NAME:$IMAGE_TAG"
docker build -t $IMAGE_NAME:$IMAGE_TAG .

echo "Pushing to registry: $REGISTRY"
docker tag $IMAGE_NAME:$IMAGE_TAG $REGISTRY/$IMAGE_NAME:$IMAGE_TAG
docker push $REGISTRY/$IMAGE_NAME:$IMAGE_TAG

echo "Image successfully built and pushed!"
`
        }
      ],
      dockerfile: `FROM docker:24-dind

COPY build_image.sh /usr/local/bin/
RUN chmod +x /usr/local/bin/build_image.sh

ENTRYPOINT ["/usr/local/bin/build_image.sh"]`,
      entrypoint: 'build_image.sh'
    },
    clientCode: `# Use in GitHub Actions or other CI/CD
- name: Build Docker Image
  run: |
    docker run --rm -v /var/run/docker.sock:/var/run/docker.sock \\
      build-docker-task:latest \\
      my-app latest gcr.io/my-project`,
    dependencies: [],
    languages: ['Bash'],
    framework: 'Docker',
    libraryDependencies: [],
    blockDependencies: []
  },
  {
    id: 'run-tests-task',
    name: 'Run Tests Task',
    type: 'task',
    classification: 'concrete',
    category: 'code',
    blockLabel: 'supporting-service',
    author: '@lunch-official',
    version: '1.0.0',
    description: 'Execute unit and integration tests',
    longDescription: 'Reusable task for running test suites. Supports multiple test frameworks (pytest, jest, go test) with coverage reporting and test result artifacts.',
    tags: ['task', 'testing', 'ci-cd', 'quality', 'coverage'],
    stats: { stars: 312, downloads: 1120 },
    icon: '✅',
    deploymentArchitecture: 'single-service',
    arguments: {
      framework: {
        type: 'string',
        required: true,
        description: 'Test framework to use (pytest, jest, go)',
        default: 'pytest'
      },
      test_path: {
        type: 'string',
        required: true,
        description: 'Path to test files or directory',
        default: 'tests/'
      },
      coverage: {
        type: 'boolean',
        required: false,
        description: 'Enable code coverage reporting',
        default: true
      }
    },
    containerStructure: {
      files: [
        {
          path: 'run_tests.py',
          isEntrypoint: true,
          content: `import subprocess
import sys
import os

def run_tests(framework, test_path, coverage=True):
    if framework == 'pytest':
        cmd = ['pytest', test_path]
        if coverage:
            cmd.extend(['--cov=.', '--cov-report=xml', '--cov-report=term'])
    elif framework == 'jest':
        cmd = ['npm', 'test', '--', '--coverage']
    elif framework == 'go':
        cmd = ['go', 'test', '-v', '-coverprofile=coverage.out', './...']
    else:
        print(f"Unsupported framework: {framework}")
        sys.exit(1)
    
    result = subprocess.run(cmd)
    sys.exit(result.returncode)

if __name__ == '__main__':
    framework = os.getenv('TEST_FRAMEWORK', 'pytest')
    test_path = os.getenv('TEST_PATH', 'tests/')
    run_tests(framework, test_path)
`
        }
      ],
      dockerfile: `FROM python:3.11-slim

RUN apt-get update && apt-get install -y nodejs npm golang && rm -rf /var/lib/apt/lists/*
RUN pip install pytest pytest-cov

COPY run_tests.py /usr/local/bin/
RUN chmod +x /usr/local/bin/run_tests.py

ENTRYPOINT ["python", "/usr/local/bin/run_tests.py"]`,
      entrypoint: 'run_tests.py'
    },
    clientCode: `# Use in any DAG
- name: Run Tests
  env:
    TEST_FRAMEWORK: pytest
    TEST_PATH: tests/
  run: docker run --rm -v $(pwd):/app -w /app run-tests-task:latest`,
    dependencies: [],
    languages: ['Python'],
    framework: 'pytest/jest/go',
    libraryDependencies: ['pytest', 'pytest-cov'],
    blockDependencies: []
  },
  {
    id: 'deploy-k8s-task',
    name: 'Deploy to Kubernetes Task',
    type: 'task',
    classification: 'concrete',
    category: 'code',
    blockLabel: 'supporting-service',
    author: '@lunch-official',
    version: '1.0.0',
    description: 'Deploy application to Kubernetes cluster',
    longDescription: 'Reusable task for deploying applications to Kubernetes. Supports kubectl apply, Helm charts, and Kustomize. Includes health checks and rollback on failure.',
    tags: ['task', 'kubernetes', 'deployment', 'k8s', 'helm'],
    stats: { stars: 423, downloads: 1450 },
    icon: '☸️',
    deploymentArchitecture: 'single-service',
    arguments: {
      namespace: {
        type: 'string',
        required: true,
        description: 'Kubernetes namespace for deployment',
        default: 'default'
      },
      deployment_name: {
        type: 'string',
        required: true,
        description: 'Name of the Kubernetes deployment'
      },
      image: {
        type: 'string',
        required: true,
        description: 'Container image to deploy (registry/image:tag)'
      },
      deployment_type: {
        type: 'string',
        required: false,
        description: 'Deployment method: kubectl, helm, or kustomize',
        default: 'kubectl'
      }
    },
    containerStructure: {
      files: [
        {
          path: 'deploy.sh',
          isEntrypoint: true,
          content: `#!/bin/bash
set -e

DEPLOYMENT_TYPE=$1
NAMESPACE=$2
MANIFEST_PATH=$3

echo "Deploying to Kubernetes..."
echo "Type: $DEPLOYMENT_TYPE"
echo "Namespace: $NAMESPACE"

case $DEPLOYMENT_TYPE in
  kubectl)
    kubectl apply -f $MANIFEST_PATH -n $NAMESPACE
    ;;
  helm)
    helm upgrade --install $RELEASE_NAME $CHART_PATH -n $NAMESPACE
    ;;
  kustomize)
    kubectl apply -k $MANIFEST_PATH -n $NAMESPACE
    ;;
esac

echo "Waiting for rollout to complete..."
kubectl rollout status deployment/$DEPLOYMENT_NAME -n $NAMESPACE

echo "Deployment successful!"
`
        }
      ],
      dockerfile: `FROM alpine/k8s:1.28.0

COPY deploy.sh /usr/local/bin/
RUN chmod +x /usr/local/bin/deploy.sh

ENTRYPOINT ["/usr/local/bin/deploy.sh"]`,
      entrypoint: 'deploy.sh'
    },
    clientCode: `# Use in deployment DAG
- name: Deploy to K8s
  env:
    DEPLOYMENT_TYPE: kubectl
    NAMESPACE: production
  run: |
    docker run --rm -v ~/.kube:/root/.kube \\
      deploy-k8s-task:latest kubectl production ./k8s/deployment.yaml`,
    dependencies: [],
    languages: ['Bash'],
    framework: 'Kubernetes',
    libraryDependencies: [],
    blockDependencies: []
  },
  {
    id: 'extract-data-task',
    name: 'Extract Data Task',
    type: 'task',
    classification: 'concrete',
    category: 'code',
    blockLabel: 'supporting-service',
    author: '@lunch-official',
    version: '1.0.0',
    description: 'Extract data from various sources',
    longDescription: 'Reusable ETL task for extracting data from databases, APIs, files, and cloud storage. Supports PostgreSQL, MySQL, S3, GCS, REST APIs, and more.',
    tags: ['task', 'etl', 'data-engineering', 'extraction', 'airflow'],
    stats: { stars: 289, downloads: 760 },
    icon: '📥',
    deploymentArchitecture: 'single-service',
    containerStructure: {
      files: [
        {
          path: 'extract.py',
          isEntrypoint: true,
          content: `import pandas as pd
import psycopg2
import boto3
import requests
import os

def extract_from_postgres(connection_string, query):
    conn = psycopg2.connect(connection_string)
    df = pd.read_sql(query, conn)
    conn.close()
    return df

def extract_from_s3(bucket, key):
    s3 = boto3.client('s3')
    obj = s3.get_object(Bucket=bucket, Key=key)
    df = pd.read_csv(obj['Body'])
    return df

def extract_from_api(url, headers=None):
    response = requests.get(url, headers=headers)
    return pd.DataFrame(response.json())

if __name__ == '__main__':
    source_type = os.getenv('SOURCE_TYPE')
    
    if source_type == 'postgres':
        df = extract_from_postgres(os.getenv('DB_CONNECTION'), os.getenv('QUERY'))
    elif source_type == 's3':
        df = extract_from_s3(os.getenv('S3_BUCKET'), os.getenv('S3_KEY'))
    elif source_type == 'api':
        df = extract_from_api(os.getenv('API_URL'))
    
    # Save extracted data
    df.to_parquet('/output/extracted_data.parquet')
    print(f"Extracted {len(df)} rows")
`
        }
      ],
      dockerfile: `FROM python:3.11-slim

RUN pip install pandas psycopg2-binary boto3 requests pyarrow

COPY extract.py /usr/local/bin/
RUN chmod +x /usr/local/bin/extract.py

ENTRYPOINT ["python", "/usr/local/bin/extract.py"]`,
      entrypoint: 'extract.py'
    },
    clientCode: `# Use in Airflow DAG
from airflow.operators.docker_operator import DockerOperator

extract_task = DockerOperator(
    task_id='extract_data',
    image='extract-data-task:latest',
    environment={
        'SOURCE_TYPE': 'postgres',
        'DB_CONNECTION': 'postgresql://user:pass@host:5432/db',
        'QUERY': 'SELECT * FROM sales WHERE date >= CURRENT_DATE - 1'
    }
)`,
    dependencies: [],
    languages: ['Python'],
    framework: 'Pandas',
    libraryDependencies: ['pandas', 'psycopg2-binary', 'boto3', 'requests'],
    blockDependencies: []
  },
  {
    id: 'transform-data-task',
    name: 'Transform Data Task',
    type: 'task',
    classification: 'concrete',
    category: 'code',
    blockLabel: 'supporting-service',
    author: '@lunch-official',
    version: '1.0.0',
    description: 'Transform and clean data',
    longDescription: 'Reusable ETL task for data transformation. Includes data cleaning, aggregation, joining, feature engineering, and quality checks.',
    tags: ['task', 'etl', 'data-engineering', 'transformation', 'pandas'],
    stats: { stars: 267, downloads: 690 },
    icon: '🔄',
    deploymentArchitecture: 'single-service',
    containerStructure: {
      files: [
        {
          path: 'transform.py',
          isEntrypoint: true,
          content: `import pandas as pd
import numpy as np
from datetime import datetime

def clean_data(df):
    # Remove duplicates
    df = df.drop_duplicates()
    
    # Handle missing values
    df = df.fillna(method='ffill')
    
    return df

def aggregate_data(df, group_by, agg_columns):
    return df.groupby(group_by).agg(agg_columns).reset_index()

def feature_engineering(df):
    # Add computed columns
    if 'date' in df.columns:
        df['year'] = pd.to_datetime(df['date']).dt.year
        df['month'] = pd.to_datetime(df['date']).dt.month
        df['day_of_week'] = pd.to_datetime(df['date']).dt.dayofweek
    
    return df

if __name__ == '__main__':
    # Load data
    df = pd.read_parquet('/input/extracted_data.parquet')
    
    # Apply transformations
    df = clean_data(df)
    df = feature_engineering(df)
    
    # Save transformed data
    df.to_parquet('/output/transformed_data.parquet')
    print(f"Transformed {len(df)} rows")
`
        }
      ],
      dockerfile: `FROM python:3.11-slim

RUN pip install pandas numpy pyarrow

COPY transform.py /usr/local/bin/
RUN chmod +x /usr/local/bin/transform.py

ENTRYPOINT ["python", "/usr/local/bin/transform.py"]`,
      entrypoint: 'transform.py'
    },
    clientCode: `# Use in Airflow DAG
transform_task = DockerOperator(
    task_id='transform_data',
    image='transform-data-task:latest',
    volumes=['/data:/input', '/data:/output']
)

# Chain with extract
extract_task >> transform_task`,
    dependencies: [],
    languages: ['Python'],
    framework: 'Pandas',
    libraryDependencies: ['pandas', 'numpy', 'pyarrow'],
    blockDependencies: []
  },
  {
    id: 'load-data-task',
    name: 'Load Data Task',
    type: 'task',
    classification: 'concrete',
    category: 'code',
    blockLabel: 'supporting-service',
    author: '@lunch-official',
    version: '1.0.0',
    description: 'Load data into data warehouse',
    longDescription: 'Reusable ETL task for loading data into destinations. Supports PostgreSQL, BigQuery, Snowflake, Redshift, and S3. Includes bulk loading and upsert operations.',
    tags: ['task', 'etl', 'data-engineering', 'loading', 'warehouse'],
    stats: { stars: 301, downloads: 820 },
    icon: '📤',
    deploymentArchitecture: 'single-service',
    containerStructure: {
      files: [
        {
          path: 'load.py',
          isEntrypoint: true,
          content: `import pandas as pd
from sqlalchemy import create_engine
import os

def load_to_postgres(df, connection_string, table_name, if_exists='append'):
    engine = create_engine(connection_string)
    df.to_sql(table_name, engine, if_exists=if_exists, index=False)
    print(f"Loaded {len(df)} rows to {table_name}")

def load_to_s3(df, bucket, key):
    import boto3
    s3 = boto3.client('s3')
    df.to_parquet(f's3://{bucket}/{key}')
    print(f"Loaded {len(df)} rows to s3://{bucket}/{key}")

if __name__ == '__main__':
    # Load transformed data
    df = pd.read_parquet('/input/transformed_data.parquet')
    
    destination = os.getenv('DESTINATION_TYPE')
    
    if destination == 'postgres':
        load_to_postgres(
            df,
            os.getenv('DB_CONNECTION'),
            os.getenv('TABLE_NAME'),
            os.getenv('IF_EXISTS', 'append')
        )
    elif destination == 's3':
        load_to_s3(df, os.getenv('S3_BUCKET'), os.getenv('S3_KEY'))
`
        }
      ],
      dockerfile: `FROM python:3.11-slim

RUN pip install pandas sqlalchemy psycopg2-binary boto3 pyarrow

COPY load.py /usr/local/bin/
RUN chmod +x /usr/local/bin/load.py

ENTRYPOINT ["python", "/usr/local/bin/load.py"]`,
      entrypoint: 'load.py'
    },
    clientCode: `# Use in Airflow DAG
load_task = DockerOperator(
    task_id='load_data',
    image='load-data-task:latest',
    environment={
        'DESTINATION_TYPE': 'postgres',
        'DB_CONNECTION': 'postgresql://user:pass@warehouse:5432/analytics',
        'TABLE_NAME': 'daily_sales',
        'IF_EXISTS': 'append'
    }
)

# Complete ETL chain
extract_task >> transform_task >> load_task`,
    dependencies: [],
    languages: ['Python'],
    framework: 'SQLAlchemy',
    libraryDependencies: ['pandas', 'sqlalchemy', 'psycopg2-binary', 'boto3'],
    blockDependencies: []
  },

  // DAG BLOCKS - 3 blocks
  {
    id: 'ci-pipeline',
    name: 'CI Pipeline DAG',
    type: 'dag',
    classification: 'concrete',
    category: 'ci',
    blockLabel: 'supporting-service',
    author: '@lunch-official',
    version: '1.0.0',
    description: 'Complete CI pipeline validating code blocks',
    longDescription: 'Production-ready CI DAG that validates, tests, and scans code blocks while preserving their types. Orchestrates testing, security scanning, build validation, and OAM template validation. Code blocks flow through unchanged (function → function, service → service). Generates CI artifacts but does NOT create deployable artifacts - that\'s the IDP\'s job.',
    tags: ['dag', 'ci', 'testing', 'validation', 'code-blocks'],
    stats: { stars: 412, downloads: 1340 },
    icon: '🔄',
    isLocked: true,
    lockReason: 'CI blocks require write permissions to the build infrastructure and container registry. As a developer, you have read-only access. Contact your DevOps team or administrator to request CI permissions.',
    languages: ['Bash', 'Python', 'YAML'],
    framework: 'Container-based Tasks',
    libraryDependencies: [],
    blockDependencies: ['http-webhook-event-handler', 'run-tests-task', 'file-exists-checker'],
    documentation: `# CI Pipeline DAG Workflow

## Overview
Production-ready CI DAG that validates and tests code blocks while preserving their types. Orchestrates testing and security scanning. Code blocks pass through with the same type (Python Function → Python Function, Go Service → Go Service). Generates CI artifacts (test reports, scan results) but does NOT build images or create deployable artifacts - the IDP handles that.

## Workflow Architecture
This DAG consists of two sequential stages:
1. **Test Stage**: Validates code quality through automated tests (code blocks unchanged)
2. **Security Scan Stage**: Runs static analysis and vulnerability scanning (code blocks unchanged)

**Key Principle**: Code blocks maintain their type throughout the pipeline. A Python Function enters as Python Function and exits as Python Function. The IDP transforms validated code blocks into deployable artifacts.

## Trigger Mechanism
- **Event Handler**: HTTP Webhook
- **Trigger Source**: Git push events, pull requests
- **Authentication**: HMAC signature verification
- **Webhook Endpoint**: POST /webhook/ci-pipeline

## State Flow Documentation

### Node 1: Run Tests
**Expected State (Before)**:
- Source code repository contains test files
- Test framework dependencies are installed
- Test configuration files exist (pytest.ini, jest.config.js, etc.)

**Output State (After)**:
- All tests pass successfully
- Code coverage report generated (>80% threshold)
- Test artifacts stored for review
- Exit code 0 indicates success

### Node 2: Security Scan
**Expected State (Before)**:
- Tests have passed (dependency on test-node)
- Source code available for scanning
- Security scanning tools configured (Trivy, Snyk, etc.)

**Output State (After)**:
- No critical or high vulnerabilities detected
- Dependency audit completed
- SAST (Static Application Security Testing) passed
- Scan report available in artifacts

## Pre-condition Checkers
Each task includes a checker function to validate prerequisites:
- **Test Node**: Verifies test files exist in tests/ directory
- **Scan Node**: Confirms security tools accessible and dependencies file present

## Error Handling
- Failed checker: Task is skipped, workflow stops
- Failed task: Workflow halts, code blocks marked as not validated
- Retry policy: 3 attempts with exponential backoff
- Notification: Teams/Slack webhook on failure

## Monitoring
- Webhook delivery logs
- Task execution logs per node
- Test metrics (duration, coverage, pass/fail rates)
- Security scan metrics (vulnerabilities found)

## Configuration
Set these environment variables:
- WEBHOOK_SECRET: For signature verification
- TRIVY_TOKEN: Security scanning service authentication
- GIT_SHA: Commit hash for traceability

## CI vs CD Separation
**CI Pipeline (This Block)**:
- ✅ Validates and transforms code blocks while preserving their types
- ✅ Tests code (function → function, service → service, no type changes)
- ✅ Scans for vulnerabilities
- ✅ Generates CI artifacts (test reports, scan results, validation logs)
- ❌ Does NOT build images or create any deployable artifacts
- ❌ Does NOT change code block types (function stays function, service stays service)
- ❌ Does NOT deploy to clusters

**CD (Handled by IDP)**:
- The IDP consumes validated code blocks and CI artifacts from the pipeline
- Builds container images from code blocks
- Creates deployable artifacts (OAM applications, K8s manifests) from code blocks
- Manages deployment workflows, approvals, and rollouts
- Handles multi-environment promotion

**Important**: CI tasks only validate code blocks, preserving their types. The IDP builds images, creates manifests, and deploys.

## Usage Example
Configure your Git repository webhook to POST to:
\`\`\`
https://your-domain/webhook/ci-pipeline
Content-Type: application/json
X-Signature: sha256=<hmac>
\`\`\``,
    dagStructure: {
      entrypoint: 'test-node',
      nodes: [
        {
          id: 'test-node',
          taskBlockId: 'run-tests-task',
          eventHandlerBlockId: 'http-webhook-event-handler',
          checkerBlockId: 'file-exists-checker',
          name: 'Run Tests',
          description: 'Execute unit and integration tests with coverage',
          dependencies: [],
          taskArguments: {
            source_code: { type: 'Python Code Block', description: 'Application source code to test' },
            test_code: { type: 'Python Code Block', description: 'Test files (pytest/unittest)' },
            test_config: { type: 'YAML Code Block', description: 'pytest.ini or test configuration' },
            framework: 'pytest',
            test_path: 'tests/',
            coverage: true,
            min_coverage: 80
          },
          eventHandlerArguments: {
            task_name: 'run-tests-task',
            webhook_path: '/webhook/ci-pipeline'
          },
          checkerArguments: {
            file_paths: ['tests/', 'pytest.ini'],
            check_readable: true
          },
          expectedState: `Source code repository contains test files in tests/ directory. Test framework (pytest) is configured with pytest.ini. All test dependencies are installed.`,
          outputState: `All unit and integration tests pass. Code coverage report generated and meets 80% threshold. Test artifacts and coverage report available for review. Exit code 0.

**Code Block Outputs** (same types as inputs, validated):
- Input \`source_code\` (Python Code Block) → Output \`source_code\` (Python Code Block) - Tested and validated
- Input \`test_code\` (Python Code Block) → Output \`test_code\` (Python Code Block) - Executed successfully
- Input \`test_config\` (YAML Code Block) → Output \`test_config\` (YAML Code Block) - Unchanged

**CI Artifacts Generated**:
- \`test-results.xml\` - JUnit format test results
- \`coverage.xml\` - Cobertura coverage report
- \`htmlcov/index.html\` - HTML coverage report
- \`pytest.log\` - Detailed test execution logs
- \`test-summary.json\` - Test metrics (passed/failed/skipped counts)`
        },
        {
          id: 'security-scan-node',
          taskBlockId: 'run-tests-task',
          eventHandlerBlockId: 'http-webhook-event-handler',
          checkerBlockId: 'file-exists-checker',
          name: 'Security Scan',
          description: 'Run SAST and dependency vulnerability scanning',
          dependencies: ['test-node'],
          taskArguments: {
            source_code: { type: 'Code Block (any language)', description: 'Application source code to scan' },
            dependencies_file: { type: 'Text Code Block', description: 'requirements.txt, package.json, go.mod, etc.' },
            dockerfile: { type: 'Dockerfile Code Block', description: 'Dockerfile for container scanning (optional)' },
            scanner: 'trivy',
            scan_type: 'fs',
            severity: 'HIGH,CRITICAL',
            exit_on_error: true
          },
          checkerArguments: {
            file_paths: ['package.json', 'requirements.txt', 'go.mod'],
            check_readable: false
          },
          expectedState: `Tests passed. Source code and dependencies available for scanning. Trivy or similar security scanning tool configured and accessible.`,
          outputState: `No critical or high severity vulnerabilities found. Dependency audit completed. SAST checks passed. Security scan report generated and stored in artifacts.

**Code Block Outputs** (same types as inputs, scanned and validated):
- Input \`source_code\` (Code Block) → Output \`source_code\` (Code Block) - Scanned, no changes
- Input \`dependencies_file\` (Text Code Block) → Output \`dependencies_file\` (Text Code Block) - Audited, no changes
- Input \`dockerfile\` (Dockerfile Code Block) → Output \`dockerfile\` (Dockerfile Code Block) - Scanned, no changes

**CI Artifacts Generated**:
- \`trivy-report.json\` - Detailed vulnerability scan results
- \`trivy-report.sarif\` - SARIF format for GitHub Security tab
- \`dependency-audit.txt\` - List of all dependencies with versions
- \`sast-findings.json\` - Static analysis security findings
- \`security-summary.md\` - Human-readable security summary`
        }
      ]
    }
  },
  {
    id: 'data-pipeline',
    name: 'Data Processing DAG',
    type: 'dag',
    classification: 'concrete',
    category: 'code',
    blockLabel: 'supporting-service',
    author: '@lunch-official',
    version: '1.0.0',
    description: 'Scheduled ETL DAG workflow',
    longDescription: 'Production-grade data DAG for ETL operations. Orchestrates data extraction from multiple sources, transformation with pandas, and loading into data warehouse. Includes data quality checks, alerting, and retry logic. Uses scheduled event handlers and container-based tasks, agnostic to any specific workflow orchestrator.',
    tags: ['dag', 'etl', 'data-engineering', 'python', 'scheduled'],
    stats: { stars: 567, downloads: 890 },
    icon: '🔀',
    dependencies: ['postgresql'],
    languages: ['Python', 'SQL'],
    framework: 'Container-based Tasks',
    libraryDependencies: ['pandas', 'requests', 'psycopg2-binary'],
    blockDependencies: ['postgresql', 'scheduled-event-handler', 'extract-data-task', 'transform-data-task', 'load-data-task', 'api-health-checker', 'database-connection-checker'],
    documentation: `# Data Processing ETL DAG

## Overview
Production-grade ETL (Extract, Transform, Load) DAG for daily data processing workflows. Orchestrates extraction from REST APIs, transformation with pandas, and loading into PostgreSQL data warehouse.

## Workflow Architecture
1. **Extract Stage**: Pull data from external APIs with pagination
2. **Transform Stage**: Clean, validate, and aggregate data
3. **Load Stage**: Insert/update data in warehouse

## Trigger Mechanism
- **Event Handler**: Scheduled (Cron)
- **Schedule**: Daily at 2:00 AM UTC (0 2 * * *)
- **Catchup**: Disabled (no backfilling)

## State Flow Documentation

### Node 1: Extract Data
**Expected State (Before)**:
- Source API is accessible and responding (health check passes)
- API authentication token is valid
- No active extraction job running (prevents concurrent runs)
- Network connectivity to external API endpoint

**Output State (After)**:
- Raw JSON data extracted and saved to /data/raw/extracted.json
- All pages fetched successfully with pagination
- Data timestamp recorded
- Extraction metrics logged (records count, API latency)

### Node 2: Transform Data
**Expected State (Before)**:
- Extracted JSON file exists at /data/raw/extracted.json
- File is readable and valid JSON format
- File size is non-zero
- pandas and transformation libraries available

**Output State (After)**:
- Data cleaned (nulls handled, duplicates removed)
- Schema validated and types converted
- Aggregations computed by time period
- Transformed CSV saved to /data/processed/transformed.csv
- Data quality metrics calculated and logged

### Node 3: Load to Warehouse
**Expected State (Before)**:
- Transformed CSV exists at /data/processed/transformed.csv
- PostgreSQL warehouse is accessible and accepting connections
- Target table 'summary' exists in analytics database
- Database user has INSERT/UPDATE permissions

**Output State (After)**:
- Data loaded into warehouse using UPSERT strategy
- Row count matches transformed data
- Unique constraints enforced (no duplicates)
- Load timestamp recorded in metadata table
- Warehouse indexes updated

## Pre-condition Checkers
- **Extract**: API health checker validates endpoint accessibility
- **Transform**: File checker ensures extracted data exists
- **Load**: Database connection checker validates warehouse availability

## Data Quality Checks
- Schema validation before and after transformation
- Null value percentage monitoring
- Record count consistency across stages
- Data freshness validation

## Error Handling
- API rate limiting with exponential backoff
- Retry policy: 3 attempts per task
- Failed extractions logged for manual review
- Partial load rollback on constraint violations

## Monitoring
- Scheduled execution logs
- Data volume metrics per stage
- Processing duration tracking
- Failure alerts via webhook

## Configuration
Environment variables:
- CRON_SCHEDULE: '0 2 * * *'
- API_URL: Source endpoint
- DB_CONNECTION: Warehouse connection string
- API_TOKEN: Authentication credential`,
    dagStructure: {
      entrypoint: 'extract-node',
      nodes: [
        {
          id: 'extract-node',
          taskBlockId: 'extract-data-task',
          eventHandlerBlockId: 'scheduled-event-handler',
          checkerBlockId: 'api-health-checker',
          name: 'Extract Data',
          description: 'Extract data from source databases and APIs',
          dependencies: [],
          taskArguments: {
            api_url: 'https://api.example.com/data',
            output_path: '/data/raw/extracted.json'
          },
          eventHandlerArguments: {
            cron_expression: '0 2 * * *',
            task_name: 'extract-data-task'
          },
          checkerArguments: {
            api_url: 'https://api.example.com/health',
            timeout: 10,
            expected_status: 200
          },
          expectedState: 'Source API at https://api.example.com is accessible and responding to health checks. API authentication token is valid. No concurrent extraction job is running. Network connectivity established.',
          outputState: 'Raw JSON data extracted from API and saved to /data/raw/extracted.json. All paginated responses fetched successfully. Data contains timestamp and source metadata. Record count logged.'
        },
        {
          id: 'transform-node',
          taskBlockId: 'transform-data-task',
          eventHandlerBlockId: 'scheduled-event-handler',
          checkerBlockId: 'file-exists-checker',
          name: 'Transform Data',
          description: 'Clean, aggregate and transform data',
          dependencies: ['extract-node'],
          taskArguments: {
            input_path: '/data/raw/extracted.json',
            output_path: '/data/processed/transformed.csv'
          },
          checkerArguments: {
            file_paths: ['/data/raw/extracted.json'],
            check_readable: true
          },
          expectedState: 'Extracted JSON file exists at /data/raw/extracted.json and is readable. File contains valid JSON with expected schema. File size is greater than 0 bytes. pandas library is available for processing.',
          outputState: 'Data cleaned with null values handled and duplicates removed. Schema validated and data types converted appropriately. Aggregations computed by time period and category. Transformed CSV saved to /data/processed/transformed.csv with quality metrics logged.'
        },
        {
          id: 'load-node',
          taskBlockId: 'load-data-task',
          eventHandlerBlockId: 'scheduled-event-handler',
          checkerBlockId: 'database-connection-checker',
          name: 'Load to Warehouse',
          description: 'Load transformed data into PostgreSQL warehouse',
          dependencies: ['transform-node'],
          taskArguments: {
            input_path: '/data/processed/transformed.csv',
            db_connection: 'postgresql://warehouse:5432/analytics',
            table_name: 'summary'
          },
          checkerArguments: {
            connection_string: 'postgresql://warehouse:5432/analytics',
            verify_table: 'summary'
          },
          expectedState: 'Transformed CSV file exists at /data/processed/transformed.csv. PostgreSQL warehouse is accessible at postgresql://warehouse:5432/analytics. Target table "summary" exists in analytics schema. Database user has INSERT and UPDATE permissions.',
          outputState: 'Data successfully loaded into warehouse table using UPSERT strategy. Row count matches transformed data. Unique constraints enforced with no duplicates. Load timestamp recorded in metadata table. Warehouse indexes updated and query performance optimized.'
        }
      ]
    }
  },
  {
    id: 'ml-training-pipeline',
    name: 'ML Training DAG',
    type: 'dag',
    classification: 'concrete',
    category: 'code',
    blockLabel: 'supporting-service',
    author: '@lunch-official',
    version: '1.0.0',
    description: 'ML training and deployment DAG workflow',
    longDescription: 'End-to-end machine learning DAG for model training and deployment. Orchestrates data preprocessing, model training, evaluation, versioning, and conditional deployment. Uses container-based tasks with TensorFlow, agnostic to any specific workflow orchestrator.',
    tags: ['dag', 'ml', 'machine-learning', 'mlops', 'tensorflow'],
    stats: { stars: 634, downloads: 720 },
    icon: '🤖',
    languages: ['Python'],
    framework: 'Container-based Tasks',
    libraryDependencies: ['tensorflow', 'scikit-learn', 'pandas'],
    blockDependencies: ['scheduled-event-handler', 'ml-preprocess-task', 'ml-train-task', 'ml-evaluate-task', 'ml-deploy-task', 'file-exists-checker', 'api-health-checker'],
    documentation: `# ML Training and Deployment DAG

## Overview
End-to-end machine learning workflow for automated model training, evaluation, and deployment. Orchestrates the complete MLOps lifecycle from data preprocessing through production deployment with quality gates.

## Workflow Architecture
1. **Preprocess Stage**: Feature engineering and data scaling
2. **Train Stage**: Neural network training with TensorFlow
3. **Evaluate Stage**: Model metrics and deployment decision
4. **Deploy Stage**: Conditional deployment based on accuracy threshold

## Trigger Mechanism
- **Event Handler**: Scheduled (Cron)
- **Schedule**: Weekly on Sundays at midnight (0 0 * * 0)
- **Use Case**: Retraining on accumulated weekly data

## State Flow Documentation

### Node 1: Preprocess Data
**Expected State (Before)**:
- Raw training data exists at /data/raw/training.csv
- Data contains required columns (features + target)
- CSV file is properly formatted and readable
- Sufficient disk space for processed data

**Output State (After)**:
- Data cleaned (null values removed, outliers handled)
- Features scaled using StandardScaler (mean=0, std=1)
- Train/test split created (80/20 ratio)
- Preprocessed CSV saved to /data/processed/preprocessed.csv
- Scaler model persisted for inference

### Node 2: Train Model
**Expected State (Before)**:
- Preprocessed data available at /data/processed/preprocessed.csv
- GPU resources available (or CPU fallback)
- TensorFlow and dependencies installed
- Model architecture defined
- Sufficient disk space for model artifacts

**Output State (After)**:
- Neural network trained for specified epochs
- Model converged (loss decreased over training)
- Training accuracy logged per epoch
- Model saved to /models/trained_model in SavedModel format
- Training metrics and history exported

### Node 3: Evaluate Model
**Expected State (Before)**:
- Trained model exists at /models/trained_model
- Test data available for evaluation
- Evaluation metrics defined (accuracy, precision, recall, F1)
- Accuracy threshold configured (default: 0.90)

**Output State (After)**:
- Model evaluated on test set
- Metrics calculated: accuracy, precision, recall, F1 score
- Binary deployment decision made (1 if accuracy >= threshold, 0 otherwise)
- Evaluation report generated with confusion matrix
- Decision logged for audit trail

### Node 4: Deploy Model (Conditional)
**Expected State (Before)**:
- Evaluate node completed with deploy=1 decision
- Model exists at /models/trained_model
- Kubernetes cluster accessible
- Model serving namespace exists
- Previous model version tracked (if exists)

**Output State (After)**:
- Model deployed to production namespace
- Inference endpoint created and healthy
- Model version tagged and registered
- A/B testing configured (gradual rollout)
- Old model version maintained for rollback

## Pre-condition Checkers
- **Preprocess**: File checker validates raw training data exists
- **Train**: File checker confirms preprocessed data available
- **Evaluate**: File checker verifies trained model exists
- **Deploy**: API checker validates Kubernetes cluster health

## Model Quality Gates
- Minimum accuracy threshold: 90%
- Maximum training loss threshold
- Model size constraints
- Inference latency requirements

## Error Handling
- Training divergence detection (NaN loss)
- Automatic checkpoint recovery
- Failed deployment rollback to previous version
- Alert notifications on quality gate failures

## Monitoring
- Training metrics: loss, accuracy, val_accuracy
- Resource utilization: GPU/CPU, memory
- Model drift detection in production
- Inference request latency

## Configuration
Environment variables:
- DATA_PATH: Training data location
- LEARNING_RATE: 0.001 (Adam optimizer)
- NUM_EPOCHS: 200
- ACCURACY_THRESHOLD: 0.90
- MODEL_REGISTRY: Storage for versioned models`,
    dagStructure: {
      entrypoint: 'preprocess-node',
      nodes: [
        {
          id: 'preprocess-node',
          taskBlockId: 'ml-preprocess-task',
          eventHandlerBlockId: 'scheduled-event-handler',
          checkerBlockId: 'file-exists-checker',
          name: 'Preprocess Data',
          description: 'Load, clean and scale training data',
          dependencies: [],
          taskArguments: {
            data_path: '/data/raw/training.csv',
            output_path: '/data/processed/preprocessed.csv'
          },
          eventHandlerArguments: {
            cron_expression: '0 0 * * 0',
            task_name: 'ml-preprocess-task'
          },
          checkerArguments: {
            file_paths: ['/data/raw/training.csv'],
            check_readable: true
          },
          expectedState: 'Raw training data CSV exists at /data/raw/training.csv with features and target column. File is readable and properly formatted. Contains at least 1000 samples for training. Sufficient disk space available (2x file size).',
          outputState: 'Data preprocessed with null values removed and outliers handled. Features scaled using StandardScaler (mean=0, std=1). Train/test split created (80/20). Output saved to /data/processed/preprocessed.csv. Scaler model persisted to /models/scaler.pkl for inference.'
        },
        {
          id: 'train-node',
          taskBlockId: 'ml-train-task',
          eventHandlerBlockId: 'scheduled-event-handler',
          checkerBlockId: 'file-exists-checker',
          name: 'Train Model',
          description: 'Train neural network with TensorFlow',
          dependencies: ['preprocess-node'],
          taskArguments: {
            data_path: '/data/processed/preprocessed.csv',
            model_path: '/models/trained_model',
            learning_rate: 0.001,
            num_epochs: 200
          },
          checkerArguments: {
            file_paths: ['/data/processed/preprocessed.csv', '/models/scaler.pkl'],
            check_readable: true
          },
          expectedState: 'Preprocessed data exists at /data/processed/preprocessed.csv. Scaler model available at /models/scaler.pkl. GPU resources allocated (or CPU fallback). TensorFlow 2.x installed. Sufficient memory for model training (4GB+).',
          outputState: 'Neural network trained for 200 epochs with early stopping. Final training accuracy logged. Model converged (loss stabilized). Model saved in SavedModel format to /models/trained_model. Training history and metrics exported to /models/training_history.json.'
        },
        {
          id: 'evaluate-node',
          taskBlockId: 'ml-evaluate-task',
          eventHandlerBlockId: 'scheduled-event-handler',
          checkerBlockId: 'file-exists-checker',
          name: 'Evaluate Model',
          description: 'Compute metrics and decide deployment',
          dependencies: ['train-node'],
          taskArguments: {
            model_path: '/models/trained_model',
            data_path: '/data/processed/preprocessed.csv',
            accuracy_threshold: 0.90
          },
          checkerArguments: {
            file_paths: ['/models/trained_model'],
            check_readable: true
          },
          expectedState: 'Trained model exists at /models/trained_model and is loadable. Test data available in preprocessed CSV. Evaluation metrics defined (accuracy, precision, recall, F1). Accuracy threshold set to 0.90.',
          outputState: 'Model evaluated on test set with metrics: accuracy, precision, recall, F1 score. Binary deployment decision made (1 if accuracy >= 0.90). Confusion matrix generated. Evaluation report saved to /models/eval_report.json. Decision: deploy=1 or deploy=0.'
        },
        {
          id: 'deploy-node',
          taskBlockId: 'ml-deploy-task',
          eventHandlerBlockId: 'scheduled-event-handler',
          checkerBlockId: 'api-health-checker',
          name: 'Deploy Model',
          description: 'Conditional deployment to production',
          dependencies: ['evaluate-node'],
          taskArguments: {
            model_path: '/models/trained_model',
            namespace: 'production',
            deployment_name: 'ml-model-serving'
          },
          checkerArguments: {
            api_url: 'https://kubernetes.default.svc/healthz',
            timeout: 5,
            expected_status: 200
          },
          expectedState: 'Evaluate node completed with deploy=1 decision (accuracy >= 0.90). Trained model at /models/trained_model ready for deployment. Kubernetes cluster accessible and healthy. Production namespace exists. Model serving infrastructure deployed.',
          outputState: 'Model deployed to production namespace as ml-model-serving. Inference endpoint created at /predict. Model version registered in model registry. Health checks passing. Gradual traffic rollout configured. Previous version maintained for A/B testing and rollback capability.'
        }
      ]
    }
  },

  // AI-POWERED SUPPORTING SERVICE BLOCKS
  {
    id: 'llm-api-gateway',
    name: 'LLM API Gateway',
    type: 'service',
    classification: 'concrete',
    category: 'supporting-services',
    blockLabel: 'supporting-service',
    author: '@lunch-official',
    version: '1.0.0',
    description: 'Multi-provider LLM API gateway with caching',
    longDescription: 'Unified API gateway for multiple LLM providers (OpenAI, Anthropic, Cohere). Includes intelligent routing, response caching, rate limiting, and cost tracking. Built with FastAPI and Redis.',
    tags: ['ai', 'llm', 'api-gateway', 'openai', 'anthropic', 'ml'],
    stats: { stars: 892, downloads: 2340 },
    icon: '🤖',
    isAI: true,
    deploymentArchitecture: 'single-service',
    containerStructure: {
      files: [
        {
          path: 'src/main.py',
          isEntrypoint: true,
          content: `from fastapi import FastAPI, HTTPException, Header
from pydantic import BaseModel
from typing import Optional, Literal
import openai
import anthropic
import cohere
import redis
import hashlib
import json
from datetime import datetime

app = FastAPI(title="LLM API Gateway")

# Initialize clients
openai_client = openai.Client()
anthropic_client = anthropic.Anthropic()
cohere_client = cohere.Client()
cache = redis.Redis(host='redis', decode_responses=True)

# Request/Response models
class CompletionRequest(BaseModel):
    prompt: str
    model: str = "gpt-4"
    provider: Literal["openai", "anthropic", "cohere"] = "openai"
    max_tokens: int = 1000
    temperature: float = 0.7
    use_cache: bool = True

class CompletionResponse(BaseModel):
    completion: str
    model: str
    provider: str
    cached: bool
    tokens_used: int
    cost_usd: float

# Cost tracking (per 1k tokens)
COSTS = {
    "gpt-4": {"input": 0.03, "output": 0.06},
    "gpt-3.5-turbo": {"input": 0.001, "output": 0.002},
    "claude-3-opus": {"input": 0.015, "output": 0.075},
    "claude-3-sonnet": {"input": 0.003, "output": 0.015},
    "command": {"input": 0.0015, "output": 0.002}
}

def calculate_cost(model: str, input_tokens: int, output_tokens: int) -> float:
    """Calculate cost based on token usage"""
    if model not in COSTS:
        return 0.0
    
    cost_info = COSTS[model]
    input_cost = (input_tokens / 1000) * cost_info["input"]
    output_cost = (output_tokens / 1000) * cost_info["output"]
    return input_cost + output_cost

def get_cache_key(request: CompletionRequest) -> str:
    """Generate cache key from request"""
    cache_data = f"{request.provider}:{request.model}:{request.prompt}:{request.temperature}"
    return hashlib.md5(cache_data.encode()).hexdigest()

async def call_openai(request: CompletionRequest) -> tuple[str, int]:
    """Call OpenAI API"""
    response = openai_client.chat.completions.create(
        model=request.model,
        messages=[{"role": "user", "content": request.prompt}],
        max_tokens=request.max_tokens,
        temperature=request.temperature
    )
    
    completion = response.choices[0].message.content
    tokens = response.usage.total_tokens
    return completion, tokens

async def call_anthropic(request: CompletionRequest) -> tuple[str, int]:
    """Call Anthropic API"""
    message = anthropic_client.messages.create(
        model=request.model,
        max_tokens=request.max_tokens,
        temperature=request.temperature,
        messages=[{"role": "user", "content": request.prompt}]
    )
    
    completion = message.content[0].text
    tokens = message.usage.input_tokens + message.usage.output_tokens
    return completion, tokens

async def call_cohere(request: CompletionRequest) -> tuple[str, int]:
    """Call Cohere API"""
    response = cohere_client.generate(
        model=request.model,
        prompt=request.prompt,
        max_tokens=request.max_tokens,
        temperature=request.temperature
    )
    
    completion = response.generations[0].text
    # Cohere doesn't return token count, estimate it
    tokens = len(request.prompt.split()) + len(completion.split())
    return completion, tokens

@app.post("/v1/completions", response_model=CompletionResponse)
async def create_completion(
    request: CompletionRequest,
    x_api_key: Optional[str] = Header(None)
):
    """Generate text completion using specified LLM provider"""
    
    # Check cache first
    cached = False
    if request.use_cache:
        cache_key = get_cache_key(request)
        cached_response = cache.get(cache_key)
        
        if cached_response:
            data = json.loads(cached_response)
            return CompletionResponse(**data, cached=True)
    
    # Route to appropriate provider
    try:
        if request.provider == "openai":
            completion, tokens = await call_openai(request)
        elif request.provider == "anthropic":
            completion, tokens = await call_anthropic(request)
        elif request.provider == "cohere":
            completion, tokens = await call_cohere(request)
        else:
            raise HTTPException(status_code=400, detail="Invalid provider")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Provider error: {str(e)}")
    
    # Calculate cost
    input_tokens = len(request.prompt.split())
    output_tokens = tokens - input_tokens
    cost = calculate_cost(request.model, input_tokens, output_tokens)
    
    # Create response
    response_data = {
        "completion": completion,
        "model": request.model,
        "provider": request.provider,
        "cached": cached,
        "tokens_used": tokens,
        "cost_usd": cost
    }
    
    # Cache the response (TTL: 1 hour)
    if request.use_cache:
        cache_key = get_cache_key(request)
        cache.setex(cache_key, 3600, json.dumps(response_data))
    
    # Track usage metrics
    track_usage(request.provider, request.model, tokens, cost)
    
    return CompletionResponse(**response_data)

def track_usage(provider: str, model: str, tokens: int, cost: float):
    """Track API usage for analytics"""
    today = datetime.now().strftime("%Y-%m-%d")
    
    cache.hincrby(f"usage:{today}", f"{provider}:{model}:tokens", tokens)
    cache.hincrbyfloat(f"usage:{today}", f"{provider}:{model}:cost", cost)
    cache.hincrby(f"usage:{today}", f"{provider}:{model}:requests", 1)

@app.get("/health")
async def health_check():
    return {"status": "healthy", "service": "llm-api-gateway"}`
        },
        {
          path: 'requirements.txt',
          content: `fastapi==0.104.1
uvicorn[standard]==0.24.0
openai==1.3.0
anthropic==0.7.0
cohere==4.37
redis==5.0.1
pydantic==2.5.0`
        }
      ],
      dockerfile: `FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY src/ ./src/

EXPOSE 8000

CMD ["uvicorn", "src.main:app", "--host", "0.0.0.0", "--port", "8000"]`,
      entrypoint: 'src/main.py'
    },
    clientCode: `import requests

# Call the LLM gateway
response = requests.post(
    "http://llm-gateway:8000/v1/completions",
    json={
        "prompt": "Explain quantum computing in simple terms",
        "model": "gpt-4",
        "provider": "openai",
        "max_tokens": 500,
        "temperature": 0.7,
        "use_cache": True
    },
    headers={"X-API-Key": "your-api-key"}
)

data = response.json()
print(f"Completion: {data['completion']}")
print(f"Tokens: {data['tokens_used']}, Cost: \${data['cost_usd']:.4f}")
print(f"Cached: {data['cached']}")`,
    openApiSpec: `openapi: 3.0.0
info:
  title: LLM API Gateway
  version: 1.0.0
paths:
  /v1/completions:
    post:
      summary: Generate text completion
      parameters:
        - name: X-API-Key
          in: header
          schema:
            type: string
      requestBody:
        content:
          application/json:
            schema:
              type: object
              properties:
                prompt:
                  type: string
                model:
                  type: string
                provider:
                  type: string
                  enum: [openai, anthropic, cohere]
                max_tokens:
                  type: integer
                temperature:
                  type: number
      responses:
        '200':
          description: Completion generated`,
    arguments: {
      llm_model: {
        type: 'LLM Model Artifact',
        required: false,
        description: 'Optional LLM model artifact for self-hosted inference (e.g., llama2-chat-model). If not provided, uses provider APIs.'
      }
    },
    dependencies: ['redis'],
    languages: ['Python'],
    framework: 'FastAPI',
    libraryDependencies: ['fastapi', 'openai', 'anthropic', 'cohere', 'redis'],
    blockDependencies: ['redis']
  },
  {
    id: 'vector-database',
    name: 'Vector Database Service',
    type: 'service',
    classification: 'concrete',
    category: 'code',
    blockLabel: 'supporting-service',
    author: '@lunch-official',
    version: '1.0.0',
    description: 'High-performance vector database with Qdrant',
    longDescription: 'Vector database service built on Qdrant for semantic search and similarity matching. Includes embedding generation with OpenAI, hybrid search (vector + keyword), and collection management. Perfect for RAG applications.',
    tags: ['ai', 'vector-db', 'embeddings', 'semantic-search', 'qdrant', 'ml'],
    stats: { stars: 745, downloads: 1890 },
    icon: '🔍',
    isAI: true,
    deploymentArchitecture: 'single-service',
    containerStructure: {
      files: [
        {
          path: 'src/main.py',
          isEntrypoint: true,
          content: `from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List, Optional, Dict, Any
from qdrant_client import QdrantClient
from qdrant_client.models import Distance, VectorParams, PointStruct, Filter, FieldCondition, MatchValue
import openai
import uuid

app = FastAPI(title="Vector Database Service")

# Initialize clients
qdrant = QdrantClient(host="qdrant", port=6333)
openai_client = openai.Client()

# Models
class Document(BaseModel):
    text: str
    metadata: Optional[Dict[str, Any]] = {}

class SearchRequest(BaseModel):
    query: str
    collection: str
    limit: int = 10
    filter_metadata: Optional[Dict[str, Any]] = None

class CreateCollectionRequest(BaseModel):
    name: str
    vector_size: int = 1536  # OpenAI embedding size
    distance: str = "Cosine"  # Cosine, Euclid, or Dot

# Embedding generation
def generate_embedding(text: str) -> List[float]:
    """Generate embedding vector using OpenAI"""
    response = openai_client.embeddings.create(
        model="text-embedding-3-small",
        input=text
    )
    return response.data[0].embedding

@app.post("/collections")
async def create_collection(request: CreateCollectionRequest):
    """Create a new vector collection"""
    try:
        distance_map = {
            "Cosine": Distance.COSINE,
            "Euclid": Distance.EUCLID,
            "Dot": Distance.DOT
        }
        
        qdrant.create_collection(
            collection_name=request.name,
            vectors_config=VectorParams(
                size=request.vector_size,
                distance=distance_map.get(request.distance, Distance.COSINE)
            )
        )
        
        return {
            "status": "success",
            "collection": request.name,
            "vector_size": request.vector_size,
            "distance": request.distance
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.post("/collections/{collection_name}/documents")
async def add_documents(collection_name: str, documents: List[Document]):
    """Add documents to collection with automatic embedding"""
    try:
        points = []
        
        for doc in documents:
            # Generate embedding
            vector = generate_embedding(doc.text)
            
            # Create point
            point = PointStruct(
                id=str(uuid.uuid4()),
                vector=vector,
                payload={
                    "text": doc.text,
                    **doc.metadata
                }
            )
            points.append(point)
        
        # Upsert to Qdrant
        qdrant.upsert(
            collection_name=collection_name,
            points=points
        )
        
        return {
            "status": "success",
            "documents_added": len(documents),
            "collection": collection_name
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.post("/search")
async def semantic_search(request: SearchRequest):
    """Perform semantic search using vector similarity"""
    try:
        # Generate query embedding
        query_vector = generate_embedding(request.query)
        
        # Build filter if provided
        filter_obj = None
        if request.filter_metadata:
            conditions = [
                FieldCondition(
                    key=key,
                    match=MatchValue(value=value)
                )
                for key, value in request.filter_metadata.items()
            ]
            filter_obj = Filter(must=conditions)
        
        # Search in Qdrant
        results = qdrant.search(
            collection_name=request.collection,
            query_vector=query_vector,
            limit=request.limit,
            query_filter=filter_obj
        )
        
        # Format results
        formatted_results = [
            {
                "id": hit.id,
                "score": hit.score,
                "text": hit.payload.get("text"),
                "metadata": {k: v for k, v in hit.payload.items() if k != "text"}
            }
            for hit in results
        ]
        
        return {
            "query": request.query,
            "results": formatted_results,
            "total": len(formatted_results)
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.get("/collections/{collection_name}/stats")
async def get_collection_stats(collection_name: str):
    """Get collection statistics"""
    try:
        info = qdrant.get_collection(collection_name)
        
        return {
            "collection": collection_name,
            "vectors_count": info.vectors_count,
            "points_count": info.points_count,
            "status": info.status
        }
    except Exception as e:
        raise HTTPException(status_code=404, detail=str(e))

@app.delete("/collections/{collection_name}")
async def delete_collection(collection_name: str):
    """Delete a collection"""
    try:
        qdrant.delete_collection(collection_name)
        return {"status": "success", "collection": collection_name}
    except Exception as e:
        raise HTTPException(status_code=404, detail=str(e))

@app.get("/health")
async def health_check():
    return {"status": "healthy", "service": "vector-database"}`
        },
        {
          path: 'requirements.txt',
          content: `fastapi==0.104.1
uvicorn[standard]==0.24.0
qdrant-client==1.6.9
openai==1.3.0
pydantic==2.5.0`
        }
      ],
      dockerfile: `FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY src/ ./src/

EXPOSE 8000

CMD ["uvicorn", "src.main:app", "--host", "0.0.0.0", "--port", "8000"]`,
      entrypoint: 'src/main.py'
    },
    clientCode: `import requests

# Create collection
requests.post("http://vector-db:8000/collections", json={
    "name": "documents",
    "vector_size": 1536,
    "distance": "Cosine"
})

# Add documents
requests.post("http://vector-db:8000/collections/documents/documents", json=[
    {
        "text": "Python is a high-level programming language",
        "metadata": {"category": "programming", "language": "en"}
    },
    {
        "text": "Machine learning is a subset of AI",
        "metadata": {"category": "ai", "language": "en"}
    }
])

# Semantic search
response = requests.post("http://vector-db:8000/search", json={
    "query": "What is machine learning?",
    "collection": "documents",
    "limit": 5
})

print(response.json())`,
    openApiSpec: `openapi: 3.0.0
info:
  title: Vector Database Service
  version: 1.0.0
paths:
  /collections:
    post:
      summary: Create vector collection
  /collections/{collection_name}/documents:
    post:
      summary: Add documents with auto-embedding
  /search:
    post:
      summary: Semantic search with filters
  /collections/{collection_name}/stats:
    get:
      summary: Get collection statistics`,
    arguments: {
      embedding_model: {
        type: 'Embedding Model Artifact',
        required: false,
        description: 'Embedding model artifact for generating vectors (e.g., text-embedding-model). Defaults to OpenAI text-embedding-3-small.'
      }
    },
    dependencies: [],
    languages: ['Python'],
    framework: 'FastAPI',
    libraryDependencies: ['fastapi', 'qdrant-client', 'openai'],
    blockDependencies: [],
    metadata: {
      resources: {
        cpu: '2 cores',
        memory: '4GB',
        storage: '20GB SSD'
      }
    }
  },
  {
    id: 'rag-service',
    name: 'RAG Service',
    type: 'service',
    classification: 'concrete',
    category: 'code',
    blockLabel: 'supporting-service',
    author: '@lunch-official',
    version: '1.0.0',
    description: 'Retrieval-Augmented Generation service',
    longDescription: 'Complete RAG (Retrieval-Augmented Generation) service combining vector search with LLM generation. Chunks documents, generates embeddings, performs semantic search, and augments LLM prompts with relevant context. Includes citation tracking.',
    tags: ['ai', 'rag', 'llm', 'vector-search', 'gpt', 'ml'],
    stats: { stars: 1023, downloads: 3120 },
    icon: '📚',
    isAI: true,
    deploymentArchitecture: 'single-service',
    containerStructure: {
      files: [
        {
          path: 'src/main.py',
          isEntrypoint: true,
          content: `from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List, Optional
from qdrant_client import QdrantClient
from qdrant_client.models import Distance, VectorParams, PointStruct
import openai
import uuid
import re

app = FastAPI(title="RAG Service")

# Initialize clients
qdrant = QdrantClient(host="qdrant", port=6333)
openai_client = openai.Client()

COLLECTION_NAME = "knowledge_base"

# Models
class Document(BaseModel):
    content: str
    source: str
    metadata: Optional[dict] = {}

class QueryRequest(BaseModel):
    question: str
    max_context_chunks: int = 5
    model: str = "gpt-4"
    temperature: float = 0.7

class RAGResponse(BaseModel):
    answer: str
    sources: List[dict]
    context_used: List[str]

# Document chunking
def chunk_document(text: str, chunk_size: int = 500, overlap: int = 50) -> List[str]:
    """Split document into overlapping chunks"""
    words = text.split()
    chunks = []
    
    for i in range(0, len(words), chunk_size - overlap):
        chunk = ' '.join(words[i:i + chunk_size])
        if chunk:
            chunks.append(chunk)
    
    return chunks

def generate_embedding(text: str) -> List[float]:
    """Generate embedding using OpenAI"""
    response = openai_client.embeddings.create(
        model="text-embedding-3-small",
        input=text
    )
    return response.data[0].embedding

# Initialize collection on startup
@app.on_event("startup")
async def startup():
    """Create knowledge base collection if it doesn't exist"""
    collections = qdrant.get_collections().collections
    collection_names = [c.name for c in collections]
    
    if COLLECTION_NAME not in collection_names:
        qdrant.create_collection(
            collection_name=COLLECTION_NAME,
            vectors_config=VectorParams(size=1536, distance=Distance.COSINE)
        )

@app.post("/ingest")
async def ingest_document(document: Document):
    """Ingest a document into the knowledge base"""
    try:
        # Chunk the document
        chunks = chunk_document(document.content)
        
        points = []
        for idx, chunk in enumerate(chunks):
            # Generate embedding
            vector = generate_embedding(chunk)
            
            # Create point
            point = PointStruct(
                id=str(uuid.uuid4()),
                vector=vector,
                payload={
                    "text": chunk,
                    "source": document.source,
                    "chunk_index": idx,
                    **document.metadata
                }
            )
            points.append(point)
        
        # Upsert to Qdrant
        qdrant.upsert(collection_name=COLLECTION_NAME, points=points)
        
        return {
            "status": "success",
            "source": document.source,
            "chunks_created": len(chunks)
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.post("/query", response_model=RAGResponse)
async def query_rag(request: QueryRequest):
    """Answer question using RAG (Retrieval-Augmented Generation)"""
    try:
        # Step 1: Generate query embedding
        query_vector = generate_embedding(request.question)
        
        # Step 2: Retrieve relevant chunks
        search_results = qdrant.search(
            collection_name=COLLECTION_NAME,
            query_vector=query_vector,
            limit=request.max_context_chunks
        )
        
        if not search_results:
            return RAGResponse(
                answer="I don't have enough information to answer this question.",
                sources=[],
                context_used=[]
            )
        
        # Step 3: Build context from retrieved chunks
        context_chunks = []
        sources = []
        
        for hit in search_results:
            context_chunks.append(hit.payload["text"])
            sources.append({
                "source": hit.payload["source"],
                "chunk_index": hit.payload["chunk_index"],
                "relevance_score": hit.score
            })
        
        context = "\\n\\n".join(context_chunks)
        
        # Step 4: Generate answer with LLM
        prompt = f"""Answer the following question based on the provided context. If the answer cannot be found in the context, say so.

Context:
{context}

Question: {request.question}

Answer:"""
        
        completion = openai_client.chat.completions.create(
            model=request.model,
            messages=[
                {"role": "system", "content": "You are a helpful assistant that answers questions based on provided context. Always cite your sources."},
                {"role": "user", "content": prompt}
            ],
            temperature=request.temperature
        )
        
        answer = completion.choices[0].message.content
        
        return RAGResponse(
            answer=answer,
            sources=sources,
            context_used=context_chunks
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/stats")
async def get_stats():
    """Get knowledge base statistics"""
    try:
        info = qdrant.get_collection(COLLECTION_NAME)
        return {
            "total_chunks": info.points_count,
            "vectors_count": info.vectors_count,
            "status": info.status
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/health")
async def health_check():
    return {"status": "healthy", "service": "rag-service"}`
        },
        {
          path: 'requirements.txt',
          content: `fastapi==0.104.1
uvicorn[standard]==0.24.0
qdrant-client==1.6.9
openai==1.3.0
pydantic==2.5.0`
        }
      ],
      dockerfile: `FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY src/ ./src/

EXPOSE 8000

CMD ["uvicorn", "src.main:app", "--host", "0.0.0.0", "--port", "8000"]`,
      entrypoint: 'src/main.py'
    },
    clientCode: `import requests

# Ingest documents
requests.post("http://rag-service:8000/ingest", json={
    "content": "RAG combines retrieval and generation. It retrieves relevant documents and uses them to generate contextual answers.",
    "source": "rag_docs.pdf",
    "metadata": {"topic": "ai", "date": "2024-01-01"}
})

# Query with RAG
response = requests.post("http://rag-service:8000/query", json={
    "question": "What is RAG and how does it work?",
    "max_context_chunks": 3,
    "model": "gpt-4",
    "temperature": 0.7
})

data = response.json()
print(f"Answer: {data['answer']}")
print(f"\\nSources: {data['sources']}")`,
    openApiSpec: `openapi: 3.0.0
info:
  title: RAG Service
  version: 1.0.0
paths:
  /ingest:
    post:
      summary: Ingest document into knowledge base
  /query:
    post:
      summary: Query using RAG (retrieval + generation)
      responses:
        '200':
          description: Answer with sources and context
  /stats:
    get:
      summary: Get knowledge base statistics`,
    arguments: {
      llm_model: {
        type: 'LLM Model Artifact',
        required: false,
        description: 'LLM model artifact for answer generation (e.g., llama2-chat-model). Defaults to OpenAI GPT-4.'
      },
      embedding_model: {
        type: 'Embedding Model Artifact',
        required: false,
        description: 'Embedding model artifact for document embeddings (e.g., text-embedding-model). Defaults to OpenAI text-embedding-3-small.'
      },
      knowledge_base: {
        type: 'Dataset Artifact',
        required: false,
        description: 'Optional dataset artifact to pre-populate knowledge base (e.g., customer-reviews-dataset)'
      }
    },
    dependencies: [],
    languages: ['Python'],
    framework: 'FastAPI',
    libraryDependencies: ['fastapi', 'qdrant-client', 'openai'],
    blockDependencies: [],
    metadata: {
      resources: {
        cpu: '2 cores',
        memory: '4GB'
      }
    }
  },

  // EXPERIMENTATION BLOCKS - Online Experimentation Protocols
  {
    id: 'ab-test-experiment',
    name: 'A/B Testing Experiment',
    type: 'experimentation',
    classification: 'custom',
    category: 'code',
    blockLabel: 'app-service',
    author: '@lunch-official',
    lastUpdated: '2025-11-12T10:00:00Z',
    version: '1.0.0',
    description: 'Run A/B tests to compare two service variants',
    longDescription: 'A/B testing allows you to compare two variants of a service by splitting traffic between them. The experiment runs for a specified duration, collecting metrics to determine which variant performs better.\n\n**How it works:**\n1. Traffic is split between variant A and variant B based on configured weights\n2. Each request is deterministically routed to one variant (sticky sessions supported)\n3. Metrics are collected for both variants in real-time\n4. Statistical analysis determines if there\'s a significant difference\n5. Optionally auto-promote the winning variant\n\n**Requirements:**\n- Both variants must have identical OpenAPI specifications\n- Variants must be independently deployable services\n- Sufficient traffic volume for statistical significance\n\n**Best practices:**\n- Run experiments for at least 7 days to account for weekly patterns\n- Ensure sample size is large enough for your confidence level\n- Monitor for Simpson\'s paradox and segment-level effects',
    tags: ['experimentation', 'ab-testing', 'traffic-splitting', 'online-evaluation'],
    stats: { stars: 89, downloads: 234 },
    icon: '🔬',
    arguments: {
      variantA: {
        type: 'blockId',
        required: true,
        description: 'First service variant to test (must have openApiSpec)'
      },
      variantB: {
        type: 'blockId',
        required: true,
        description: 'Second service variant to test (must have same openApiSpec as variantA)'
      },
      trafficSplitA: {
        type: 'number',
        required: false,
        default: 50,
        description: 'Percentage of traffic to route to variant A (0-100)'
      },
      duration: {
        type: 'string',
        required: false,
        default: '7 days',
        description: 'How long to run the experiment'
      },
      successMetric: {
        type: 'string',
        required: true,
        description: 'Primary metric to optimize (e.g., conversion_rate, latency_p95, success_rate)'
      },
      autoPromote: {
        type: 'boolean',
        required: false,
        default: false,
        description: 'Automatically promote winning variant at end of experiment'
      },
      confidenceLevel: {
        type: 'number',
        required: false,
        default: 95,
        description: 'Statistical confidence level (90, 95, or 99)'
      }
    },
    experimentConfig: {
      strategy: {
        type: 'ab-test',
        duration: '7 days',
        successCriteria: 'conversion_rate improvement > 5% with p < 0.05',
        autoPromote: false
      },
      variants: [
        {
          id: 'variant-a',
          name: 'Control (Variant A)',
          blockId: '', // Will be populated from arguments
          weight: 50,
          description: 'Current production version'
        },
        {
          id: 'variant-b',
          name: 'Treatment (Variant B)',
          blockId: '', // Will be populated from arguments
          weight: 50,
          description: 'New version being tested'
        }
      ],
      baselineVariantId: 'variant-a',
      metrics: ['success_rate', 'latency_p50', 'latency_p95', 'latency_p99', 'error_rate', 'conversion_rate'],
      confidenceLevel: 95
    },
    languages: ['Go'],
    framework: 'Envoy Proxy + Custom Controller',
    libraryDependencies: ['envoy', 'prometheus-client'],
    metadata: {
      resources: {
        cpu: '500m',
        memory: '512MB'
      }
    }
  },

  {
    id: 'multi-armed-bandit-experiment',
    name: 'Multi-Armed Bandit Experiment',
    type: 'experimentation',
    classification: 'custom',
    category: 'code',
    blockLabel: 'app-service',
    author: '@lunch-official',
    lastUpdated: '2025-11-12T10:00:00Z',
    version: '1.0.0',
    description: 'Dynamically optimize traffic allocation across multiple service variants',
    longDescription: 'Multi-armed bandits solve the exploration-exploitation tradeoff by continuously learning which variant performs best and dynamically adjusting traffic allocation.\n\n**Algorithms:**\n- **Thompson Sampling** (default): Bayesian approach, balances exploration/exploitation naturally\n- **UCB (Upper Confidence Bound)**: Optimistic approach, explores variants with uncertain performance\n- **Epsilon-Greedy**: Simple approach, explores randomly with probability ε\n\n**How it works:**\n1. Start with equal traffic split across all variants\n2. Collect reward signals from each variant (success rate, conversion, etc.)\n3. Update belief about each variant\'s performance\n4. Recompute traffic allocation to maximize expected reward\n5. Repeat every update interval\n\n**Advantages over A/B tests:**\n- Minimizes opportunity cost (reduces traffic to poor performers quickly)\n- Works with 2+ variants simultaneously\n- No need to pre-determine experiment duration\n- Continuously adapts to changing conditions\n\n**Requirements:**\n- All variants must have identical OpenAPI specifications\n- Reward metric must be measurable per-request or per-session\n- Sufficient traffic for learning (100+ requests per variant per update interval)\n\n**Best for:**\n- Scenarios where poor variants have high cost (e.g., user experience, revenue)\n- Testing 3+ variants simultaneously\n- Long-running optimization scenarios\n- Non-stationary environments (user behavior changes over time)',
    tags: ['experimentation', 'bandit', 'thompson-sampling', 'online-learning', 'optimization'],
    stats: { stars: 67, downloads: 145 },
    icon: '🎰',
    arguments: {
      variants: {
        type: 'blockId[]',
        required: true,
        description: 'List of service variant block IDs to test (2+ variants, all must have same openApiSpec)'
      },
      algorithm: {
        type: 'string',
        required: false,
        default: 'thompson-sampling',
        description: 'Bandit algorithm: thompson-sampling, ucb, or epsilon-greedy'
      },
      explorationRate: {
        type: 'number',
        required: false,
        default: 0.1,
        description: 'Exploration rate for epsilon-greedy (0.0-1.0)'
      },
      rewardMetric: {
        type: 'string',
        required: true,
        description: 'Metric to optimize (e.g., conversion_rate, -latency_p95, success_rate)'
      },
      updateInterval: {
        type: 'string',
        required: false,
        default: '5 minutes',
        description: 'How often to recompute traffic allocation'
      },
      minTrafficPerVariant: {
        type: 'number',
        required: false,
        default: 5,
        description: 'Minimum traffic percentage per variant (prevents starvation)'
      }
    },
    experimentConfig: {
      strategy: {
        type: 'multi-armed-bandit',
        successCriteria: 'Maximize expected reward over time',
        autoPromote: false
      },
      variants: [
        {
          id: 'variant-1',
          name: 'Variant 1 (Baseline)',
          blockId: '',
          weight: 33.3,
          description: 'Initial variant'
        },
        {
          id: 'variant-2',
          name: 'Variant 2',
          blockId: '',
          weight: 33.3,
          description: 'Alternative variant'
        },
        {
          id: 'variant-3',
          name: 'Variant 3',
          blockId: '',
          weight: 33.4,
          description: 'Alternative variant'
        }
      ],
      baselineVariantId: 'variant-1',
      metrics: ['success_rate', 'latency_p50', 'latency_p95', 'error_rate', 'conversion_rate', 'rewardScore'],
      confidenceLevel: 90
    },
    languages: ['Go', 'Python'],
    framework: 'Envoy Proxy + Thompson Sampling Controller',
    libraryDependencies: ['envoy', 'numpy', 'scipy'],
    metadata: {
      resources: {
        cpu: '1 core',
        memory: '1GB'
      }
    }
  },

  {
    id: 'canary-deployment-experiment',
    name: 'Canary Deployment',
    type: 'experimentation',
    classification: 'custom',
    category: 'code',
    blockLabel: 'app-service',
    author: '@lunch-official',
    lastUpdated: '2025-11-12T10:00:00Z',
    version: '1.0.0',
    description: 'Gradually roll out a new service version with automatic rollback',
    longDescription: 'Canary deployments reduce deployment risk by gradually shifting traffic from the stable version to the new canary version, with continuous monitoring and automatic rollback.\n\n**Progressive Traffic Stages:**\n1. **5% canary traffic**: Initial smoke test, minimal user impact\n2. **10% canary traffic**: Expand exposure, confirm stability\n3. **25% canary traffic**: Significant sample size for metrics\n4. **50% canary traffic**: Half of users, high confidence\n5. **100% canary traffic**: Full rollout, canary becomes stable\n\n**Rollback Triggers:**\n- **Error rate**: Canary error rate exceeds threshold (e.g., > 5%)\n- **Latency degradation**: p95/p99 latency increases significantly (e.g., > 50%)\n- **Custom metrics**: Any business metric exceeds threshold\n- **Manual override**: Operator manually triggers rollback\n\n**How it works:**\n1. Deploy canary version alongside stable version\n2. Route initial traffic percentage (e.g., 5%) to canary\n3. Monitor canary metrics for configured duration (e.g., 10 min)\n4. If metrics are healthy, increase canary traffic by increment\n5. If metrics breach threshold, immediately rollback to stable\n6. Repeat until 100% or rollback\n\n**Requirements:**\n- Both versions must have identical OpenAPI specifications\n- Prometheus or similar metrics system for monitoring\n- Load balancer with weighted traffic routing (Envoy, Istio, etc.)\n\n**Best for:**\n- High-risk deployments to production\n- Services with strict SLAs\n- Gradual feature rollouts\n- Testing with real production traffic\n\n**Advantages:**\n- Limits blast radius (only affects small % of users if issues occur)\n- Automatic rollback protects users\n- Builds confidence before full rollout\n- Works with existing monitoring infrastructure',
    tags: ['experimentation', 'canary', 'progressive-delivery', 'deployment', 'rollback'],
    stats: { stars: 156, downloads: 423 },
    icon: '🐤',
    arguments: {
      stableVersion: {
        type: 'blockId',
        required: true,
        description: 'Current stable service version (must have openApiSpec)'
      },
      canaryVersion: {
        type: 'blockId',
        required: true,
        description: 'New canary service version (must have same openApiSpec as stableVersion)'
      },
      initialTraffic: {
        type: 'number',
        required: false,
        default: 5,
        description: 'Initial canary traffic percentage (0-100)'
      },
      trafficIncrement: {
        type: 'number',
        required: false,
        default: 10,
        description: 'Traffic percentage increase per step'
      },
      stepDuration: {
        type: 'string',
        required: false,
        default: '10 minutes',
        description: 'How long to observe each traffic level before increasing'
      },
      rollbackThreshold: {
        type: 'object',
        required: false,
        default: {
          error_rate: 5.0,
          latency_p95_increase: 50.0
        },
        description: 'Automatic rollback triggers (e.g., error_rate > 5%)'
      },
      autoPromote: {
        type: 'boolean',
        required: false,
        default: true,
        description: 'Automatically promote to 100% if canary succeeds'
      }
    },
    experimentConfig: {
      strategy: {
        type: 'canary',
        duration: 'Progressive (5% → 10% → 25% → 50% → 100%)',
        successCriteria: 'Error rate < 5%, latency_p95 increase < 50%',
        rollbackThreshold: 'error_rate > 5% OR latency_p95 > 1.5x baseline',
        autoPromote: true
      },
      variants: [
        {
          id: 'stable',
          name: 'Stable Version',
          blockId: '',
          trafficPercentage: 95,
          description: 'Current production version'
        },
        {
          id: 'canary',
          name: 'Canary Version',
          blockId: '',
          trafficPercentage: 5,
          description: 'New version being progressively rolled out'
        }
      ],
      baselineVariantId: 'stable',
      metrics: ['success_rate', 'latency_p50', 'latency_p95', 'latency_p99', 'error_rate', 'throughput'],
      confidenceLevel: 99
    },
    languages: ['Go'],
    framework: 'Flagger + Envoy/Istio',
    libraryDependencies: ['flagger', 'prometheus-operator'],
    metadata: {
      resources: {
        cpu: '500m',
        memory: '512MB'
      }
    }
  },

  {
    id: 'blue-green-deployment',
    name: 'Blue-Green Deployment',
    type: 'experimentation',
    classification: 'custom',
    category: 'code',
    blockLabel: 'app-service',
    author: '@lunch-official',
    lastUpdated: '2025-11-12T10:00:00Z',
    version: '1.0.0',
    description: 'Zero-downtime deployment with instant rollback capability',
    longDescription: 'Blue-green deployment enables zero-downtime deployments with instant rollback by maintaining two identical production environments.\n\n**Deployment Process:**\n1. **Blue active**: Current version serves 100% of traffic\n2. **Deploy green**: New version deployed in parallel (0% traffic)\n3. **Warm up green**: Pre-warm caches, run health checks, smoke tests\n4. **Atomic switch**: Instantly route 100% traffic from blue to green\n5. **Monitor green**: Watch metrics for configured period (e.g., 15 min)\n6. **Decommission blue** (if successful) OR **Rollback to blue** (if issues)\n\n**Traffic Switch Mechanism:**\n- **Load balancer**: Update upstream targets (Nginx, HAProxy, AWS ALB)\n- **DNS**: Update DNS records (not recommended due to TTL delays)\n- **Service mesh**: Update routing rules (Istio, Linkerd)\n- **Kubernetes**: Update Service selector labels\n\n**Rollback:**\n- **Instant**: Single operation to switch back to blue\n- **No redeployment needed**: Blue environment still running\n- **Minimal downtime**: Typically < 1 second\n\n**Requirements:**\n- Both versions must have identical OpenAPI specifications\n- Sufficient infrastructure capacity for 2x resources during switch\n- Database migrations must be backward-compatible\n- Shared state (DB, cache) must work with both versions\n\n**Best for:**\n- Critical production deployments requiring instant rollback\n- Applications with strict zero-downtime requirements\n- Scenarios where canary complexity is overkill\n- Testing against real production data before switching traffic\n\n**Advantages:**\n- True zero-downtime deployments\n- Instant rollback (just switch back)\n- Simple mental model (only 2 states: blue or green)\n- Production smoke testing before traffic switch\n\n**Disadvantages:**\n- Requires 2x infrastructure capacity during deployment\n- All-or-nothing (no gradual rollout)\n- Database schema changes must be carefully managed\n- No partial rollback (unlike canary)',
    tags: ['experimentation', 'blue-green', 'zero-downtime', 'deployment', 'instant-rollback'],
    stats: { stars: 198, downloads: 567 },
    icon: '🔵',
    arguments: {
      blueVersion: {
        type: 'blockId',
        required: true,
        description: 'Current blue (active) service version (must have openApiSpec)'
      },
      greenVersion: {
        type: 'blockId',
        required: true,
        description: 'New green service version (must have same openApiSpec as blueVersion)'
      },
      warmupDuration: {
        type: 'string',
        required: false,
        default: '5 minutes',
        description: 'Time to warm up green environment before switching traffic'
      },
      healthCheckEndpoint: {
        type: 'string',
        required: false,
        default: '/health',
        description: 'Health check endpoint to verify green is ready'
      },
      rollbackOnError: {
        type: 'boolean',
        required: false,
        default: true,
        description: 'Automatically rollback to blue if error rate spikes'
      },
      postSwitchMonitoring: {
        type: 'string',
        required: false,
        default: '15 minutes',
        description: 'How long to monitor green after switch before decommissioning blue'
      }
    },
    experimentConfig: {
      strategy: {
        type: 'blue-green',
        duration: 'Instant switch (0% → 100%)',
        successCriteria: 'Green health checks pass, no error rate spike',
        rollbackThreshold: 'error_rate > 2x baseline OR health check fails',
        autoPromote: true
      },
      variants: [
        {
          id: 'blue',
          name: 'Blue (Current)',
          blockId: '',
          trafficPercentage: 100,
          description: 'Currently active version'
        },
        {
          id: 'green',
          name: 'Green (New)',
          blockId: '',
          trafficPercentage: 0,
          description: 'New version, warmed up but not receiving traffic'
        }
      ],
      baselineVariantId: 'blue',
      metrics: ['success_rate', 'latency_p50', 'latency_p95', 'error_rate', 'health_check_status'],
      confidenceLevel: 99
    },
    languages: ['Go'],
    framework: 'Kubernetes + Ingress Controller',
    libraryDependencies: ['kubernetes-client', 'prometheus-client'],
    metadata: {
      resources: {
        cpu: '200m',
        memory: '256MB'
      }
    }
  },

  {
    id: 'shadow-traffic-experiment',
    name: 'Shadow Traffic Experiment',
    type: 'experimentation',
    classification: 'custom',
    category: 'code',
    blockLabel: 'app-service',
    author: '@lunch-official',
    lastUpdated: '2025-11-12T10:00:00Z',
    version: '1.0.0',
    description: 'Test new service version with production traffic without affecting users',
    longDescription: 'Shadow traffic (also called dark traffic or mirroring) lets you test a new service version with production traffic patterns without any risk to users.\n\n**How it works:**\n1. **Request arrives**: User sends request to primary service\n2. **Mirror to shadow**: Request is duplicated and sent to shadow service\n3. **Primary responds**: Primary service response is returned to user (normal flow)\n4. **Shadow processes**: Shadow service processes request but response is discarded\n5. **Compare & analyze**: Optionally compare shadow vs primary responses and metrics\n\n**Traffic Flow:**\n```\nUser → [Load Balancer] → Primary Service → Response to User\n                           ↓\n                         (mirror)\n                           ↓\n                    Shadow Service → Response discarded\n```\n\n**What you can test:**\n- **Performance**: Compare latency, resource usage, throughput\n- **Correctness**: Detect differences in responses (bugs, behavior changes)\n- **Stability**: Monitor error rates, crashes, memory leaks\n- **Capacity**: Test scalability with real production load\n- **Database impact**: Observe database query patterns (use read replicas!)\n\n**Use cases:**\n- **Pre-production validation**: Test before canary/blue-green deployment\n- **Performance regression**: Detect latency regressions early\n- **Refactoring verification**: Ensure refactored code produces same results\n- **Load testing**: Use real production traffic patterns\n- **ML model comparison**: Compare new model predictions vs current model\n\n**Requirements:**\n- Both versions must have identical OpenAPI specifications\n- Shadow requests must be idempotent or use read replicas (no side effects!)\n- Sufficient infrastructure for shadow service (doesn\'t need to match primary scale)\n\n**Important Considerations:**\n- **Shadow writes**: Be careful with write operations! Use read replicas or mock writes\n- **External API calls**: Shadow service should not call external APIs (or use mocks)\n- **Sampling**: Mirror only a % of traffic if shadow can\'t handle 100%\n- **Async processing**: Shadow responses are discarded, but async jobs may still run\n\n**Best for:**\n- Risk-free production testing\n- Performance regression detection\n- Validating refactors and optimizations\n- Testing with realistic production traffic patterns\n\n**Advantages:**\n- Zero user impact (responses are discarded)\n- Test with real production request patterns\n- Can run indefinitely for continuous comparison\n- No need for synthetic test data\n\n**Disadvantages:**\n- Requires extra infrastructure for shadow service\n- Side effects must be carefully managed\n- Response comparison can be complex (JSON field ordering, timestamps, etc.)\n- Doesn\'t test full user experience (response is discarded)',
    tags: ['experimentation', 'shadow-traffic', 'testing', 'risk-free', 'production-testing'],
    stats: { stars: 134, downloads: 289 },
    icon: '👥',
    arguments: {
      primaryVersion: {
        type: 'blockId',
        required: true,
        description: 'Primary service version (serves actual user responses, must have openApiSpec)'
      },
      shadowVersion: {
        type: 'blockId',
        required: true,
        description: 'Shadow service version (receives mirrored traffic, must have same openApiSpec)'
      },
      shadowPercentage: {
        type: 'number',
        required: false,
        default: 100,
        description: 'Percentage of requests to mirror to shadow (0-100)'
      },
      compareResponses: {
        type: 'boolean',
        required: false,
        default: true,
        description: 'Compare shadow responses with primary (detects behavior differences)'
      },
      duration: {
        type: 'string',
        required: false,
        default: '24 hours',
        description: 'How long to run shadow traffic experiment'
      },
      alertOnDifference: {
        type: 'boolean',
        required: false,
        default: true,
        description: 'Alert if shadow responses differ from primary by > threshold'
      }
    },
    experimentConfig: {
      strategy: {
        type: 'shadow',
        duration: '24 hours',
        successCriteria: 'Shadow version has similar performance and no critical differences',
        rollbackThreshold: 'N/A (shadow traffic has no user impact)',
        autoPromote: false
      },
      variants: [
        {
          id: 'primary',
          name: 'Primary Version',
          blockId: '',
          trafficPercentage: 100,
          description: 'Serves actual user responses'
        },
        {
          id: 'shadow',
          name: 'Shadow Version',
          blockId: '',
          trafficPercentage: 100,
          description: 'Receives mirrored traffic, responses discarded'
        }
      ],
      baselineVariantId: 'primary',
      metrics: ['latency_p50', 'latency_p95', 'latency_p99', 'error_rate', 'response_difference_rate', 'throughput'],
      confidenceLevel: 95
    },
    languages: ['Go'],
    framework: 'Envoy Proxy (Traffic Mirroring)',
    libraryDependencies: ['envoy', 'response-comparator'],
    metadata: {
      resources: {
        cpu: '1 core',
        memory: '1GB'
      }
    }
  },

  // AI ARTIFACT BLOCKS - Models, Prompts, Agents, Datasets
  {
    id: 'sentiment-analysis-model',
    name: 'Customer Sentiment Analysis Model',
    type: 'function',
    classification: 'concrete',
    category: 'code',
    blockLabel: 'app-service',
    author: '@lunch-official',
    lastUpdated: '2025-11-10T14:30:00Z',
    version: '2.1.0',
    description: 'BERT-based sentiment classifier for customer feedback',
    longDescription: 'Fine-tuned DistilBERT model for classifying customer sentiment from text. Trained on 500K customer reviews with 93% accuracy. Supports English language, returns POSITIVE/NEGATIVE/NEUTRAL with confidence scores. Hosted on HuggingFace Hub for easy deployment.',
    tags: ['model', 'nlp', 'sentiment-analysis', 'bert', 'huggingface'],
    stats: { stars: 1245, downloads: 8920 },
    icon: '🎭',
    isAI: true,
    aiArtifactCategory: 'model',
    modelFormat: 'HuggingFace',
    modelType: 'DL',
    modelParameters: '66M',
    modelSize: 0.26,
    arguments: {
      text: {
        type: 'string',
        required: true,
        description: 'Text to analyze for sentiment'
      },
      threshold: {
        type: 'number',
        required: false,
        default: 0.5,
        description: 'Confidence threshold for classification'
      }
    },
    languages: ['Python'],
    framework: 'HuggingFace Transformers',
    libraryDependencies: ['transformers', 'torch', 'sentencepiece'],
    metadata: {
      resources: {
        cpu: '2 cores',
        memory: '4GB'
      }
    }
  },

  {
    id: 'product-recommendation-model',
    name: 'E-commerce Product Recommender',
    type: 'function',
    classification: 'concrete',
    category: 'code',
    blockLabel: 'app-service',
    author: '@lunch-official',
    lastUpdated: '2025-11-09T10:15:00Z',
    version: '1.5.3',
    description: 'Collaborative filtering model for product recommendations',
    longDescription: 'PyTorch-based collaborative filtering model using matrix factorization. Trained on 2M user-item interactions with nDCG@10 of 0.78. Supports cold-start users via content-based features. Model weights stored in S3, includes real-time inference API.',
    tags: ['model', 'recommendations', 'collaborative-filtering', 'pytorch'],
    stats: { stars: 892, downloads: 3450 },
    icon: '🛍️',
    isAI: true,
    aiArtifactCategory: 'model',
    modelFormat: 'PyTorch',
    modelType: 'ML',
    modelParameters: '2.5M',
    modelSize: 0.01,
    arguments: {
      userId: {
        type: 'string',
        required: true,
        description: 'User ID for personalized recommendations'
      },
      context: {
        type: 'object',
        required: false,
        description: 'Additional context (category, price range, etc.)'
      },
      topK: {
        type: 'number',
        required: false,
        default: 10,
        description: 'Number of recommendations to return'
      }
    },
    languages: ['Python'],
    framework: 'PyTorch',
    libraryDependencies: ['torch', 'numpy', 'scipy'],
    metadata: {
      resources: {
        cpu: '4 cores',
        memory: '8GB'
      }
    }
  },

  {
    id: 'text-embedding-model',
    name: 'Text Embedding Model',
    type: 'function',
    classification: 'concrete',
    category: 'code',
    blockLabel: 'app-service',
    author: '@lunch-official',
    lastUpdated: '2025-11-11T00:00:00Z',
    version: '1.0.0',
    description: 'High-performance text embedding model for semantic search',
    longDescription: 'Lightweight text embedding model based on sentence-transformers. Generates 384-dimensional vectors optimized for semantic similarity and clustering. Trained on 1B+ sentence pairs. Perfect for RAG, search, and recommendation systems.',
    tags: ['model', 'embeddings', 'nlp', 'semantic-search', 'sentence-transformers'],
    stats: { stars: 3240, downloads: 12800 },
    icon: '🔤',
    isAI: true,
    aiArtifactCategory: 'model',
    modelFormat: 'ONNX',
    modelType: 'DL',
    modelParameters: '33M',
    modelSize: 0.13,
    arguments: {
      texts: {
        type: 'array',
        required: true,
        description: 'Array of text strings to embed'
      },
      normalize: {
        type: 'boolean',
        required: false,
        default: true,
        description: 'Normalize embeddings to unit length'
      },
      batch_size: {
        type: 'number',
        required: false,
        default: 32,
        description: 'Batch size for processing'
      }
    },
    languages: ['Python'],
    framework: 'SentenceTransformers',
    libraryDependencies: ['sentence-transformers', 'onnxruntime', 'numpy'],
    metadata: {
      resources: {
        cpu: '2 cores',
        memory: '2GB'
      }
    }
  },

  {
    id: 'llama2-chat-model',
    name: 'Llama 2 7B Chat',
    type: 'function',
    classification: 'virtual',
    category: 'code',
    blockLabel: 'app-service',
    author: '@meta',
    lastUpdated: '2025-10-15T08:00:00Z',
    version: '7b-chat-hf',
    description: 'Meta\'s Llama 2 conversational AI model',
    longDescription: 'Meta\'s open-source Llama 2 7B parameter model fine-tuned for chat/dialogue. Optimized for instruction following and multi-turn conversations. Available on HuggingFace Hub. Supports 4096 token context, multilingual capabilities.',
    tags: ['model', 'llm', 'chat', 'generative', 'huggingface'],
    stats: { stars: 15230, downloads: 45600 },
    icon: '🦙',
    provider: 'Meta/HuggingFace',
    requiresSecret: true,
    isAI: true,
    aiArtifactCategory: 'model',
    modelFormat: 'GGUF',
    modelType: 'LLM',
    modelParameters: '7B',
    modelSize: 3.8,
    arguments: {
      messages: {
        type: 'array',
        required: true,
        description: 'Array of conversation messages with role and content'
      },
      temperature: {
        type: 'number',
        required: false,
        default: 0.7,
        description: 'Sampling temperature (0-2)'
      },
      maxTokens: {
        type: 'number',
        required: false,
        default: 2048,
        description: 'Maximum tokens to generate'
      }
    },
    languages: ['Python'],
    framework: 'HuggingFace Transformers',
    libraryDependencies: ['transformers', 'torch', 'accelerate'],
    metadata: {
      resources: {
        cpu: '8 cores',
        memory: '32GB'
      }
    }
  },

  {
    id: 'code-review-prompt',
    name: 'AI Code Review Prompt',
    type: 'function',
    classification: 'concrete',
    category: 'code',
    blockLabel: 'app-service',
    author: '@lunch-official',
    lastUpdated: '2025-11-11T16:45:00Z',
    version: '3.2.0',
    description: 'Structured prompt for automated code review with GPT-4',
    longDescription: 'Production-tested prompt template for AI-powered code reviews. Covers security vulnerabilities, performance issues, code style, maintainability, and test coverage. Includes few-shot examples and output formatting instructions. Optimized for GPT-4 with temperature 0.3.',
    tags: ['prompt', 'code-review', 'gpt-4', 'developer-tools'],
    stats: { stars: 2134, downloads: 12450 },
    icon: '📝',
    isAI: true,
    aiArtifactCategory: 'prompt',
    arguments: {
      code: {
        type: 'string',
        required: true,
        description: 'Code to review'
      },
      language: {
        type: 'string',
        required: true,
        description: 'Programming language (python, javascript, go, etc.)'
      },
      context: {
        type: 'string',
        required: false,
        description: 'Additional context about the code purpose'
      }
    },
    languages: ['Prompt Engineering'],
    framework: 'OpenAI GPT-4',
    metadata: {
      resources: {
        cpu: '100m',
        memory: '128MB'
      }
    }
  },

  {
    id: 'customer-support-prompt',
    name: 'Customer Support Agent Prompt',
    type: 'function',
    classification: 'concrete',
    category: 'code',
    blockLabel: 'app-service',
    author: '@lunch-official',
    lastUpdated: '2025-11-08T11:20:00Z',
    version: '2.0.1',
    description: 'Conversational prompt for customer support chatbot',
    longDescription: 'Comprehensive prompt template for customer support AI agents. Includes brand voice guidelines, escalation criteria, FAQ integration, and empathy instructions. Supports multi-turn conversations with context retention. Works with GPT-3.5-turbo for cost efficiency.',
    tags: ['prompt', 'customer-support', 'chatbot', 'conversational-ai'],
    stats: { stars: 1567, downloads: 9870 },
    icon: '💬',
    isAI: true,
    aiArtifactCategory: 'prompt',
    arguments: {
      customerMessage: {
        type: 'string',
        required: true,
        description: 'Customer\'s message or question'
      },
      conversationHistory: {
        type: 'array',
        required: false,
        default: [],
        description: 'Previous conversation messages for context'
      },
      customerProfile: {
        type: 'object',
        required: false,
        description: 'Customer metadata (tier, purchase history, etc.)'
      }
    },
    languages: ['Prompt Engineering'],
    framework: 'OpenAI GPT-3.5-turbo',
    metadata: {
      resources: {
        cpu: '100m',
        memory: '128MB'
      }
    }
  },

  {
    id: 'sql-analyst-agent',
    name: 'SQL Data Analyst Agent',
    type: 'function',
    classification: 'concrete',
    category: 'code',
    blockLabel: 'app-service',
    author: '@lunch-official',
    lastUpdated: '2025-11-12T09:00:00Z',
    version: '1.8.0',
    description: 'Autonomous agent for SQL querying and data analysis',
    longDescription: 'LangChain-based autonomous agent that can write SQL queries, execute them safely, analyze results, and generate visualizations. Includes schema understanding, query optimization, and natural language explanation of findings. Uses GPT-4 with SQLDatabase tools.',
    tags: ['agent', 'data-analysis', 'sql', 'autonomous', 'langchain'],
    stats: { stars: 3421, downloads: 15600 },
    icon: '🤖',
    isAI: true,
    aiArtifactCategory: 'agent',
    arguments: {
      question: {
        type: 'string',
        required: true,
        description: 'Natural language question about the data'
      },
      database: {
        type: 'string',
        required: true,
        description: 'Database connection string'
      },
      maxIterations: {
        type: 'number',
        required: false,
        default: 10,
        description: 'Maximum agent iterations before stopping'
      },
      allowedTables: {
        type: 'array',
        required: false,
        description: 'Whitelist of tables the agent can query'
      }
    },
    languages: ['Python'],
    framework: 'LangChain + GPT-4',
    libraryDependencies: ['langchain', 'openai', 'sqlalchemy', 'pandas'],
    metadata: {
      resources: {
        cpu: '1 core',
        memory: '2GB'
      }
    }
  },

  {
    id: 'web-research-agent',
    name: 'Web Research Agent',
    type: 'function',
    classification: 'concrete',
    category: 'code',
    blockLabel: 'app-service',
    author: '@lunch-official',
    lastUpdated: '2025-11-10T13:30:00Z',
    version: '2.3.0',
    description: 'Multi-step agent for automated web research and summarization',
    longDescription: 'AutoGPT-style autonomous agent that can search the web, read articles, follow links, and synthesize information. Includes fact-checking, source citation, and configurable search depth. Uses GPT-4 with web browsing tools (Serper, Playwright). Ideal for competitive intelligence and market research.',
    tags: ['agent', 'web-scraping', 'research', 'autonomous', 'multi-step'],
    stats: { stars: 2789, downloads: 11200 },
    icon: '🔍',
    isAI: true,
    aiArtifactCategory: 'agent',
    arguments: {
      researchQuery: {
        type: 'string',
        required: true,
        description: 'Topic or question to research'
      },
      depth: {
        type: 'number',
        required: false,
        default: 3,
        description: 'How many levels deep to follow links (1-5)'
      },
      maxSources: {
        type: 'number',
        required: false,
        default: 10,
        description: 'Maximum number of sources to consult'
      },
      outputFormat: {
        type: 'string',
        required: false,
        default: 'summary',
        description: 'Output format: summary, bullet-points, or detailed-report'
      }
    },
    languages: ['Python'],
    framework: 'LangChain + GPT-4',
    libraryDependencies: ['langchain', 'openai', 'playwright', 'beautifulsoup4'],
    metadata: {
      resources: {
        cpu: '2 cores',
        memory: '4GB'
      }
    }
  },

  {
    id: 'customer-reviews-dataset',
    name: 'Amazon Product Reviews Dataset',
    type: 'infrastructure',
    classification: 'virtual',
    category: 'infra',
    blockLabel: 'ir-infra',
    author: '@huggingface',
    lastUpdated: '2025-09-20T00:00:00Z',
    version: '1.0.0',
    description: '3.6M Amazon product reviews with sentiment labels',
    longDescription: 'Large-scale dataset of Amazon product reviews with positive/negative sentiment labels. Contains 3.6M reviews across multiple product categories. Includes review text, star ratings, helpfulness votes, and product metadata. Available on HuggingFace Hub. Perfect for training sentiment analysis and review summarization models.',
    tags: ['dataset', 'nlp', 'sentiment', 'reviews', 'huggingface'],
    stats: { stars: 8920, downloads: 34500 },
    icon: '📦',
    provider: 'HuggingFace',
    isAI: true,
    aiArtifactCategory: 'dataset',
    datasetFormat: 'Parquet',
    datasetEntries: '3.6M',
    datasetSize: 2.3,
    datasetPreview: [
      { id: 1, rating: 5, review_text: "Excellent product! Exactly what I was looking for.", sentiment: "POSITIVE", helpfulness: 12 },
      { id: 2, rating: 2, review_text: "Quality is poor, broke after 2 weeks of use.", sentiment: "NEGATIVE", helpfulness: 8 },
      { id: 3, rating: 4, review_text: "Good value for money. Some minor issues but overall satisfied.", sentiment: "POSITIVE", helpfulness: 5 },
      { id: 4, rating: 5, review_text: "Fast shipping and great customer service!", sentiment: "POSITIVE", helpfulness: 15 },
      { id: 5, rating: 1, review_text: "Not as described. Very disappointed.", sentiment: "NEGATIVE", helpfulness: 20 }
    ],
    arguments: {
      split: {
        type: 'string',
        required: false,
        default: 'train',
        description: 'Dataset split: train, test, or validation'
      },
      streamingMode: {
        type: 'boolean',
        required: false,
        default: false,
        description: 'Load dataset in streaming mode for large datasets'
      }
    },
    metadata: {
      resources: {
        storage: '2.3GB'
      }
    }
  },

  {
    id: 'imagenet-dataset',
    name: 'ImageNet Dataset',
    type: 'infrastructure',
    classification: 'virtual',
    category: 'infra',
    blockLabel: 'ir-infra',
    author: '@stanford',
    lastUpdated: '2025-08-15T00:00:00Z',
    version: '2012',
    description: '14M labeled images across 20K+ categories',
    longDescription: 'ImageNet Large Scale Visual Recognition Challenge (ILSVRC) dataset. Contains 14.2M hand-labeled images organized by WordNet hierarchy, covering 20,000+ object categories. Includes bounding boxes for object detection tasks. Standard benchmark for computer vision models. Download requires registration.',
    tags: ['dataset', 'computer-vision', 'image-classification', 'object-detection'],
    stats: { stars: 25300, downloads: 89400 },
    icon: '🖼️',
    provider: 'Stanford/ImageNet',
    requiresSecret: true,
    isAI: true,
    aiArtifactCategory: 'dataset',
    datasetFormat: 'Images',
    datasetEntries: '14.2M',
    datasetSize: 150,
    arguments: {
      subset: {
        type: 'string',
        required: false,
        default: 'ILSVRC2012',
        description: 'Dataset subset: ILSVRC2012, ILSVRC2017, etc.'
      },
      task: {
        type: 'string',
        required: false,
        default: 'classification',
        description: 'Task type: classification, detection, or segmentation'
      }
    },
    metadata: {
      resources: {
        storage: '150GB'
      }
    }
  },

  {
    id: 'code-commits-dataset',
    name: 'GitHub Code Commits Dataset',
    type: 'infrastructure',
    classification: 'virtual',
    category: 'infra',
    blockLabel: 'ir-infra',
    author: '@google',
    lastUpdated: '2025-10-01T00:00:00Z',
    version: '3.0.0',
    description: '10M code commit pairs for code generation training',
    longDescription: 'Curated dataset of 10M commit diffs from open-source GitHub repositories across 50+ programming languages. Each example includes before/after code, commit message, and metadata. Filtered for quality (excludes trivial changes, merges). Ideal for training code completion, bug fixing, and refactoring models.',
    tags: ['dataset', 'code-generation', 'programming', 'github'],
    stats: { stars: 4560, downloads: 18900 },
    icon: '💻',
    provider: 'Google Research',
    isAI: true,
    aiArtifactCategory: 'dataset',
    datasetFormat: 'JSONL',
    datasetEntries: '10M',
    datasetSize: 45,
    datasetPreview: [
      { 
        commit_id: "a3f2e1b",
        language: "python",
        before: "def calculate(x, y):\n    return x + y",
        after: "def calculate(x: int, y: int) -> int:\n    \"\"\"Add two numbers.\"\"\"\n    return x + y",
        message: "Add type hints and docstring",
        lines_changed: 3
      },
      {
        commit_id: "b7c4d2a",
        language: "javascript",
        before: "const result = data.map(x => x * 2)",
        after: "const result = data.map(x => x * 2).filter(x => x > 0)",
        message: "Filter positive values",
        lines_changed: 1
      },
      {
        commit_id: "e9f1a3c",
        language: "java",
        before: "public void process() {\n    // TODO\n}",
        after: "public void process() {\n    validateInput();\n    executeTask();\n}",
        message: "Implement process method",
        lines_changed: 3
      }
    ],
    arguments: {
      language: {
        type: 'string',
        required: false,
        description: 'Filter by programming language (python, javascript, java, etc.)'
      },
      minDiffSize: {
        type: 'number',
        required: false,
        default: 10,
        description: 'Minimum lines changed in commit'
      },
      maxDiffSize: {
        type: 'number',
        required: false,
        default: 500,
        description: 'Maximum lines changed in commit'
      }
    },
    metadata: {
      resources: {
        storage: '45GB'
      }
    }
  }
];


