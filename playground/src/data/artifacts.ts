// Data Engineering Artifacts
export interface DAGArtifact {
  id: string;
  name: string;
  description: string;
  owner: string;
  schedule?: string;
  tasks: string[]; // IDs of task artifacts
  tags: string[];
}

export interface TaskArtifact {
  id: string;
  name: string;
  description: string;
  type: 'data-ingestion' | 'transformation' | 'validation' | 'export';
  language: string;
  code?: string;
  dependencies: string[];
  tags: string[];
}

export interface EventHandlerArtifact {
  id: string;
  name: string;
  description: string;
  eventType: string;
  triggerConditions: string;
  handler: string; // Code or reference
  tags: string[];
}

export interface DataTransformationArtifact {
  id: string;
  name: string;
  description: string;
  inputSchema: string;
  outputSchema: string;
  transformationType: 'map' | 'filter' | 'aggregate' | 'join' | 'window';
  code: string;
  language: 'sql' | 'python' | 'spark' | 'dbt';
  tags: string[];
}

export interface BrokerTopicArtifact {
  id: string;
  name: string;
  description: string;
  broker: 'kafka' | 'pulsar' | 'rabbitmq' | 'sqs';
  partitions?: number;
  replicationFactor?: number;
  schema: string; // JSON schema or Avro
  producers: string[];
  consumers: string[];
  tags: string[];
}

export interface DatabaseSchemaArtifact {
  id: string;
  name: string;
  description: string;
  database: 'postgresql' | 'mysql' | 'mongodb' | 'cassandra';
  tables: Array<{
    name: string;
    schema: string; // DDL or schema definition
    indexes: string[];
  }>;
  migrations: string[];
  version: string;
  tags: string[];
}

// AI Artifacts
export interface AIModelArtifact {
  id: string;
  name: string;
  description: string;
  modelType: 'classification' | 'regression' | 'generation' | 'embedding' | 'object-detection' | 'nlp';
  framework: 'pytorch' | 'tensorflow' | 'scikit-learn' | 'huggingface' | 'openai';
  version: string;
  location: 'local' | 'huggingface' | 's3';
  huggingfaceId?: string; // e.g., 'bert-base-uncased'
  localPath?: string;
  s3Bucket?: string;
  metrics: Record<string, number>; // accuracy, f1, etc.
  inputSchema: string;
  outputSchema: string;
  tags: string[];
}

export interface AIPromptArtifact {
  id: string;
  name: string;
  description: string;
  model: string; // gpt-4, claude, llama-2, etc.
  systemPrompt?: string;
  userPromptTemplate: string;
  examples?: Array<{ input: string; output: string }>;
  parameters: {
    temperature?: number;
    maxTokens?: number;
    topP?: number;
    [key: string]: any;
  };
  tags: string[];
}

export interface AgentDefinitionArtifact {
  id: string;
  name: string;
  description: string;
  agentType: 'conversational' | 'task-oriented' | 'autonomous' | 'multi-agent';
  llm: string;
  systemPrompt: string;
  tools: Array<{
    name: string;
    description: string;
    function: string;
  }>;
  memory: 'short-term' | 'long-term' | 'vector-db';
  maxIterations?: number;
  tags: string[];
}

export interface DatasetArtifact {
  id: string;
  name: string;
  description: string;
  datasetType: 'tabular' | 'image' | 'text' | 'audio' | 'video' | 'time-series';
  size: string; // e.g., "1.2GB", "50K rows"
  location: 'local' | 'huggingface' | 's3' | 'url';
  huggingfaceId?: string; // e.g., 'imdb'
  localPath?: string;
  s3Bucket?: string;
  url?: string;
  schema?: string; // Data schema definition
  splits?: Array<{ name: string; size: string }>; // train, validation, test
  license?: string;
  tags: string[];
}

// Sample Data Engineering Artifacts
export const dagArtifacts: DAGArtifact[] = [
  {
    id: 'user-analytics-pipeline',
    name: 'User Analytics Pipeline',
    description: 'Daily pipeline for processing user behavior data and generating analytics reports',
    owner: 'data-team',
    schedule: '0 2 * * *', // Daily at 2 AM
    tasks: ['ingest-clickstream', 'transform-user-events', 'generate-reports'],
    tags: ['analytics', 'user-data', 'daily']
  },
  {
    id: 'ml-feature-pipeline',
    name: 'ML Feature Engineering Pipeline',
    description: 'Real-time pipeline for computing ML features from raw events',
    owner: 'ml-team',
    tasks: ['stream-events', 'compute-features', 'write-feature-store'],
    tags: ['ml', 'features', 'real-time']
  }
];

export const taskArtifacts: TaskArtifact[] = [
  {
    id: 'ingest-clickstream',
    name: 'Ingest Clickstream Data',
    description: 'Ingest clickstream events from Kafka and write to data lake',
    type: 'data-ingestion',
    language: 'python',
    code: 'from kafka import KafkaConsumer\n\n# Consume clickstream events...',
    dependencies: ['kafka-python', 's3fs'],
    tags: ['ingestion', 'kafka', 's3']
  },
  {
    id: 'transform-user-events',
    name: 'Transform User Events',
    description: 'Clean and aggregate user events into user sessions',
    type: 'transformation',
    language: 'python',
    dependencies: ['pandas', 'pyarrow'],
    tags: ['transformation', 'aggregation']
  }
];

export const eventHandlerArtifacts: EventHandlerArtifact[] = [
  {
    id: 'order-created-handler',
    name: 'Order Created Handler',
    description: 'Handles order creation events and triggers downstream workflows',
    eventType: 'order.created',
    triggerConditions: 'order.total > 100',
    handler: 'async function handleOrderCreated(event) { /* ... */ }',
    tags: ['orders', 'event-driven']
  }
];

export const dataTransformationArtifacts: DataTransformationArtifact[] = [
  {
    id: 'user-sessions-agg',
    name: 'User Session Aggregation',
    description: 'Aggregate clickstream events into user sessions',
    inputSchema: '{ "user_id": "string", "event_type": "string", "timestamp": "timestamp" }',
    outputSchema: '{ "user_id": "string", "session_id": "string", "event_count": "int", "duration": "int" }',
    transformationType: 'aggregate',
    code: 'SELECT user_id, session_id, COUNT(*) as event_count, MAX(timestamp) - MIN(timestamp) as duration FROM events GROUP BY user_id, session_id',
    language: 'sql',
    tags: ['aggregation', 'sessions']
  }
];

export const brokerTopicArtifacts: BrokerTopicArtifact[] = [
  {
    id: 'user-events-topic',
    name: 'user.events',
    description: 'Stream of all user interaction events',
    broker: 'kafka',
    partitions: 12,
    replicationFactor: 3,
    schema: '{ "type": "record", "name": "UserEvent", "fields": [{"name": "user_id", "type": "string"}, {"name": "event_type", "type": "string"}] }',
    producers: ['web-app', 'mobile-app'],
    consumers: ['analytics-service', 'ml-feature-pipeline'],
    tags: ['events', 'user-data']
  }
];

export const databaseSchemaArtifacts: DatabaseSchemaArtifact[] = [
  {
    id: 'users-schema',
    name: 'Users Database Schema',
    description: 'Schema for user authentication and profile data',
    database: 'postgresql',
    tables: [
      {
        name: 'users',
        schema: 'CREATE TABLE users (id UUID PRIMARY KEY, email VARCHAR(255) UNIQUE NOT NULL, created_at TIMESTAMP DEFAULT NOW());',
        indexes: ['CREATE INDEX idx_users_email ON users(email);']
      },
      {
        name: 'profiles',
        schema: 'CREATE TABLE profiles (user_id UUID REFERENCES users(id), name VARCHAR(255), avatar_url TEXT);',
        indexes: ['CREATE INDEX idx_profiles_user_id ON profiles(user_id);']
      }
    ],
    migrations: ['001_create_users.sql', '002_add_profiles.sql'],
    version: '1.2.0',
    tags: ['users', 'auth']
  }
];

// Sample AI Artifacts
export const aiModelArtifacts: AIModelArtifact[] = [
  {
    id: 'sentiment-classifier',
    name: 'Customer Sentiment Classifier',
    description: 'BERT-based model for classifying customer feedback sentiment',
    modelType: 'classification',
    framework: 'huggingface',
    version: '2.1.0',
    location: 'huggingface',
    huggingfaceId: 'distilbert-base-uncased-finetuned-sst-2-english',
    metrics: {
      accuracy: 0.93,
      f1_score: 0.92,
      precision: 0.94,
      recall: 0.91
    },
    inputSchema: '{ "text": "string" }',
    outputSchema: '{ "label": "POSITIVE | NEGATIVE", "score": "float" }',
    tags: ['nlp', 'sentiment', 'classification']
  },
  {
    id: 'product-recommender',
    name: 'Product Recommendation Model',
    description: 'Collaborative filtering model for product recommendations',
    modelType: 'embedding',
    framework: 'pytorch',
    version: '1.5.3',
    location: 's3',
    s3Bucket: 's3://ml-models/product-recommender-v1.5.3.pt',
    metrics: {
      ndcg_at_10: 0.78,
      map_at_10: 0.72,
      recall_at_10: 0.81
    },
    inputSchema: '{ "user_id": "string", "context": "object" }',
    outputSchema: '{ "product_ids": "array<string>", "scores": "array<float>" }',
    tags: ['recommendations', 'collaborative-filtering']
  },
  {
    id: 'llama2-chat',
    name: 'Llama 2 Chat Model',
    description: 'Fine-tuned Llama 2 for customer support conversations',
    modelType: 'generation',
    framework: 'huggingface',
    version: '7b-chat',
    location: 'huggingface',
    huggingfaceId: 'meta-llama/Llama-2-7b-chat-hf',
    metrics: {
      perplexity: 4.2,
      bleu_score: 0.65
    },
    inputSchema: '{ "messages": "array<{role: string, content: string}>" }',
    outputSchema: '{ "response": "string" }',
    tags: ['llm', 'chat', 'customer-support']
  }
];

export const aiPromptArtifacts: AIPromptArtifact[] = [
  {
    id: 'code-review-prompt',
    name: 'Code Review Assistant Prompt',
    description: 'Prompt for automated code review and suggestions',
    model: 'gpt-4',
    systemPrompt: 'You are an experienced software engineer reviewing code. Focus on security, performance, and maintainability.',
    userPromptTemplate: 'Review the following {{language}} code and provide specific feedback:\n\n```{{language}}\n{{code}}\n```',
    examples: [
      {
        input: 'Review this Python code: def add(a, b): return a + b',
        output: 'The function is simple and correct, but consider adding type hints and a docstring for better maintainability.'
      }
    ],
    parameters: {
      temperature: 0.3,
      maxTokens: 1000,
      topP: 0.9
    },
    tags: ['code-review', 'automation']
  },
  {
    id: 'customer-support-prompt',
    name: 'Customer Support Agent Prompt',
    description: 'Prompt template for customer support chatbot',
    model: 'gpt-3.5-turbo',
    systemPrompt: 'You are a helpful customer support agent for an e-commerce platform. Be concise, friendly, and solution-oriented.',
    userPromptTemplate: 'Customer: {{customer_message}}\n\nPrevious context: {{context}}',
    parameters: {
      temperature: 0.7,
      maxTokens: 500
    },
    tags: ['customer-support', 'chatbot']
  }
];

export const agentDefinitionArtifacts: AgentDefinitionArtifact[] = [
  {
    id: 'data-analyst-agent',
    name: 'Data Analyst Agent',
    description: 'Autonomous agent for querying and analyzing data',
    agentType: 'task-oriented',
    llm: 'gpt-4',
    systemPrompt: 'You are a data analyst. Use SQL queries and Python for data analysis. Always explain your findings clearly.',
    tools: [
      {
        name: 'execute_sql',
        description: 'Execute a SQL query on the data warehouse',
        function: 'async function execute_sql(query: string): Promise<QueryResult>'
      },
      {
        name: 'plot_chart',
        description: 'Create a visualization from data',
        function: 'async function plot_chart(data: any[], chartType: string): Promise<Chart>'
      }
    ],
    memory: 'short-term',
    maxIterations: 10,
    tags: ['analytics', 'autonomous', 'sql']
  }
];

export const datasetArtifacts: DatasetArtifact[] = [
  {
    id: 'customer-reviews-dataset',
    name: 'Customer Product Reviews',
    description: 'Dataset of customer product reviews with sentiment labels',
    datasetType: 'text',
    size: '2.3GB (500K reviews)',
    location: 'huggingface',
    huggingfaceId: 'amazon_polarity',
    schema: '{ "text": "string", "label": "int (0=negative, 1=positive)" }',
    splits: [
      { name: 'train', size: '400K' },
      { name: 'test', size: '100K' }
    ],
    license: 'Apache 2.0',
    tags: ['nlp', 'sentiment', 'reviews']
  },
  {
    id: 'user-clickstream-dataset',
    name: 'User Clickstream Events',
    description: 'Anonymized clickstream data for user behavior analysis',
    datasetType: 'tabular',
    size: '15GB (50M events)',
    location: 's3',
    s3Bucket: 's3://data-lake/clickstream/2024/',
    schema: '{ "user_id": "string", "event_type": "string", "timestamp": "timestamp", "page_url": "string", "session_id": "string" }',
    splits: [
      { name: 'jan-mar', size: '5GB' },
      { name: 'apr-jun', size: '5GB' },
      { name: 'jul-sep', size: '5GB' }
    ],
    tags: ['analytics', 'user-behavior', 'clickstream']
  },
  {
    id: 'product-images-dataset',
    name: 'Product Images',
    description: 'Product catalog images for image classification and search',
    datasetType: 'image',
    size: '50GB (100K images)',
    location: 's3',
    s3Bucket: 's3://data-lake/product-images/',
    schema: '{ "image_id": "string", "product_id": "string", "category": "string", "url": "string" }',
    license: 'Internal use only',
    tags: ['images', 'products', 'classification']
  }
];
