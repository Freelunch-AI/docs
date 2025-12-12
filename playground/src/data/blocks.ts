import type { Block } from '../types';

// Sample blocks for the main branch (4 services)
export const mainBranchBlocks: Block[] = [
  // Infrastructure Block
  {
    id: 'aws-account',
    name: 'AWS Account',
    type: 'infrastructure',
    classification: 'concrete',
    version: '1.0.0',
    description: 'AWS cloud infrastructure foundation',
    arguments: {
      region: 'us-east-1',
      accountId: '123456789012',
    },
    dependencies: [],
    metadata: {
      monthlyCost: 0,
      health: 'healthy',
      uptime: '99.99%',
      created: '2024-01-01',
      author: '@lunch-official',
    },
    tags: ['cloud', 'aws', 'infrastructure', 'concrete'],
  },
  
  // Workloads Infrastructure Block
  {
    id: 'eks-production',
    name: 'EKS Production',
    type: 'workloadsInfra',
    classification: 'concrete',
    version: '1.28.0',
    description: 'Kubernetes cluster for production workloads',
    arguments: {
      clusterName: 'lunch-production',
      nodeCount: 5,
      nodeType: 't3.large',
      autoScaling: true,
    },
    dependencies: [
      {
        targetId: 'aws-account',
        type: 'read',
        pattern: 'requestResponse',
        description: 'Runs on AWS infrastructure',
      },
    ],
    metadata: {
      cpu: '20 vCPU',
      memory: '80Gi',
      monthlyCost: 500,
      health: 'healthy',
      uptime: '99.95%',
      created: '2024-06-01',
      author: '@lunch-official',
    },
    tags: ['kubernetes', 'eks', 'workloads', 'concrete'],
  },
  
  // Service Block - PostgreSQL
  {
    id: 'products-db',
    name: 'Products Database',
    type: 'serviceBlock',
    classification: 'concrete',
    version: '16.0.0',
    description: 'PostgreSQL database for product data',
    arguments: {
      dbName: 'products',
      replicas: 3,
      backupEnabled: true,
      storageSize: '100Gi',
    },
    dependencies: [
      {
        targetId: 'eks-production',
        type: 'read',
        pattern: 'requestResponse',
        description: 'Runs on EKS cluster',
      },
    ],
    metadata: {
      cpu: '2 vCPU',
      memory: '4Gi',
      monthlyCost: 120,
      health: 'healthy',
      uptime: '99.98%',
      created: '2024-08-01',
      author: '@lunch-official',
    },
    tags: ['database', 'postgresql', 'sql', 'concrete'],
  },
  
  // Service Block - Redis
  {
    id: 'product-cache',
    name: 'Product Cache',
    type: 'serviceBlock',
    classification: 'concrete',
    version: '7.2.0',
    description: 'Redis cache for product catalog',
    arguments: {
      maxMemory: '4Gi',
      persistenceEnabled: true,
      evictionPolicy: 'allkeys-lru',
    },
    dependencies: [
      {
        targetId: 'eks-production',
        type: 'read',
        pattern: 'requestResponse',
        description: 'Runs on EKS cluster',
      },
    ],
    metadata: {
      cpu: '500m',
      memory: '4Gi',
      monthlyCost: 45,
      health: 'healthy',
      uptime: '99.99%',
      created: '2024-08-01',
      author: '@lunch-official',
    },
    tags: ['cache', 'redis', 'in-memory', 'concrete'],
  },
  
  // Service Block - Kafka
  {
    id: 'event-stream',
    name: 'Event Stream',
    type: 'serviceBlock',
    classification: 'concrete',
    version: '3.5.0',
    description: 'Kafka message broker for events',
    arguments: {
      partitions: 10,
      replicationFactor: 3,
      retentionHours: 168,
    },
    dependencies: [
      {
        targetId: 'eks-production',
        type: 'read',
        pattern: 'requestResponse',
        description: 'Runs on EKS cluster',
      },
    ],
    metadata: {
      cpu: '3 vCPU',
      memory: '6Gi',
      monthlyCost: 90,
      health: 'healthy',
      uptime: '99.97%',
      created: '2024-08-01',
      author: '@lunch-official',
    },
    tags: ['messaging', 'kafka', 'streaming', 'concrete'],
  },
  
  // Service - Product Catalog
  {
    id: 'product-catalog',
    name: 'Product Catalog',
    type: 'service',
    classification: 'concrete',
    version: '1.2.0',
    description: 'Product listing and search API',
    language: 'Python',
    framework: 'FastAPI',
    arguments: {
      port: 8080,
      workers: 4,
      environment: 'production',
    },
    dependencies: [
      {
        targetId: 'eks-production',
        type: 'read',
        pattern: 'requestResponse',
        description: 'Deployed on EKS cluster',
      },
      {
        targetId: 'products-db',
        type: 'readWrite',
        pattern: 'requestResponse',
        endpoint: 'SELECT/INSERT/UPDATE queries',
        description: 'Reads and writes product data',
      },
      {
        targetId: 'product-cache',
        type: 'readWrite',
        pattern: 'requestResponse',
        endpoint: 'GET/SET operations',
        description: 'Caches product data',
      },
      {
        targetId: 'event-stream',
        type: 'write',
        pattern: 'streaming',
        topic: 'product.viewed',
        description: 'Publishes view events',
      },
    ],
    metadata: {
      cpu: '500m',
      memory: '512Mi',
      monthlyCost: 45,
      health: 'healthy',
      uptime: '99.95%',
      created: '2024-09-01',
      author: '@engineering-team',
    },
    endpoints: [
      'GET /products/{id}',
      'POST /products',
      'PUT /products/{id}',
      'GET /products/search',
    ],
    rpcCalls: [],
    tags: ['api', 'python', 'fastapi', 'service', 'concrete'],
    code: {
      'main.py': `# Product Catalog Service
from lunch_time import Database, Cache, PubSub
from lunch_time.rpc import service, endpoint

@service(name="product-catalog", port=8080)
class ProductCatalog:
    def __init__(self):
        self.db = Database("products-db")
        self.cache = Cache("product-cache")
        self.events = PubSub("event-stream")
    
    @endpoint("/products/{id}", methods=["GET"])
    async def get_product(self, id: str):
        # Check cache first
        cached = await self.cache.get(f"product:{id}")
        if cached:
            return cached
        
        # Fetch from database
        product = await self.db.query_one(
            "SELECT * FROM products WHERE id = $1", id
        )
        
        # Update cache
        await self.cache.set(f"product:{id}", product, ttl=300)
        
        # Publish event
        await self.events.publish("product.viewed", {"id": id})
        
        return product
`,
    },
  },
  
  // Service - Order Service
  {
    id: 'order-service',
    name: 'Order Service',
    type: 'service',
    classification: 'concrete',
    version: '1.1.0',
    description: 'Order creation and management',
    language: 'Python',
    framework: 'FastAPI',
    arguments: {
      port: 8081,
      workers: 4,
      environment: 'production',
    },
    dependencies: [
      {
        targetId: 'eks-production',
        type: 'read',
        pattern: 'requestResponse',
        description: 'Deployed on EKS cluster',
      },
      {
        targetId: 'products-db',
        type: 'readWrite',
        pattern: 'requestResponse',
        endpoint: 'Orders table queries',
        description: 'Manages order data',
      },
      {
        targetId: 'event-stream',
        type: 'write',
        pattern: 'streaming',
        topic: 'order.created',
        description: 'Publishes order events',
      },
    ],
    metadata: {
      cpu: '500m',
      memory: '512Mi',
      monthlyCost: 45,
      health: 'healthy',
      uptime: '99.94%',
      created: '2024-09-01',
      author: '@engineering-team',
    },
    endpoints: [
      'POST /orders',
      'GET /orders/{id}',
      'GET /orders/user/{userId}',
    ],
    rpcCalls: [],
    tags: ['api', 'python', 'fastapi', 'service', 'concrete'],
  },
  
  // Service - Payment Gateway
  {
    id: 'payment-gateway',
    name: 'Payment Gateway',
    type: 'service',
    classification: 'concrete',
    version: '1.0.0',
    description: 'Payment processing integration',
    language: 'Python',
    framework: 'FastAPI',
    arguments: {
      port: 8082,
      workers: 2,
      environment: 'production',
    },
    dependencies: [
      {
        targetId: 'eks-production',
        type: 'read',
        pattern: 'requestResponse',
        description: 'Deployed on EKS cluster',
      },
      {
        targetId: 'product-cache',
        type: 'read',
        pattern: 'requestResponse',
        description: 'Checks idempotency',
      },
    ],
    metadata: {
      cpu: '250m',
      memory: '256Mi',
      monthlyCost: 30,
      health: 'healthy',
      uptime: '99.98%',
      created: '2024-09-01',
      author: '@engineering-team',
    },
    endpoints: [
      'POST /calculate-price',
      'POST /charge',
      'POST /refund',
    ],
    rpcCalls: [],
    tags: ['api', 'python', 'payments', 'service', 'concrete'],
  },
  
  // Service - Notification Service
  {
    id: 'notification-service',
    name: 'Notification Service',
    type: 'service',
    classification: 'concrete',
    version: '1.0.0',
    description: 'Email and SMS notifications',
    language: 'Python',
    framework: 'FastAPI',
    arguments: {
      port: 8083,
      workers: 2,
      environment: 'production',
    },
    dependencies: [
      {
        targetId: 'eks-production',
        type: 'read',
        pattern: 'requestResponse',
        description: 'Deployed on EKS cluster',
      },
      {
        targetId: 'event-stream',
        type: 'read',
        pattern: 'streaming',
        topic: 'order.created',
        description: 'Listens to order events',
      },
    ],
    metadata: {
      cpu: '250m',
      memory: '256Mi',
      monthlyCost: 20,
      health: 'healthy',
      uptime: '99.96%',
      created: '2024-09-01',
      author: '@engineering-team',
    },
    endpoints: [
      'POST /send-email',
      'POST /send-sms',
    ],
    rpcCalls: [],
    tags: ['api', 'python', 'notifications', 'service', 'concrete'],
  },
];

export const mainBranchState = {
  branch: 'main' as const,
  blocks: mainBranchBlocks,
};
