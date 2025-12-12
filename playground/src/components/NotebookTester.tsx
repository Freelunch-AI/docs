import { useState } from 'react';
import { X, Play, Book } from 'lucide-react';
import type { MarketplaceBlock } from '../data/marketplaceBlocks';
import { TracingView } from './TracingView';

interface NotebookTesterProps {
  block: MarketplaceBlock;
  onClose: () => void;
}

interface NotebookCell {
  id: string;
  type: 'markdown' | 'code';
  content: string;
  output?: string;
  status?: 'idle' | 'running' | 'success' | 'error';
}

export function NotebookTester({ block, onClose }: NotebookTesterProps) {
  const [activeTab, setActiveTab] = useState<'notebook' | 'tracing'>('notebook');
  const [cells, setCells] = useState<NotebookCell[]>(() => {
    // Generate scaffolded SDK code based on block
    const scaffoldedCells: NotebookCell[] = [
      {
        id: '1',
        type: 'markdown',
        content: `# ${block.name} - SDK Testing Notebook\n\nInteractive notebook for testing ${block.name} SDK.\nVersion: ${block.version}`
      },
      {
        id: '2',
        type: 'markdown',
        content: `## Installation\n\nFirst, install the required SDK:`
      },
      {
        id: '3',
        type: 'code',
        content: getInstallationCode(block),
        status: 'idle'
      },
      {
        id: '4',
        type: 'markdown',
        content: `## Initialize Client\n\nSet up the client connection:`
      },
      {
        id: '5',
        type: 'code',
        content: getInitializationCode(block),
        status: 'idle'
      },
      {
        id: '6',
        type: 'markdown',
        content: `## Basic Operations\n\nTry out common operations:`
      },
      {
        id: '7',
        type: 'code',
        content: getBasicOperationsCode(block),
        status: 'idle'
      }
    ];

    return scaffoldedCells;
  });

  const [selectedCellId, setSelectedCellId] = useState('3');

  const handleRunCell = async (cellId: string) => {
    // Update cell status to running
    setCells(cells.map(c => 
      c.id === cellId ? { ...c, status: 'running', output: undefined } : c
    ));

    // Simulate code execution
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1500));

    const cell = cells.find(c => c.id === cellId);
    if (!cell || cell.type !== 'code') return;

    // Generate mock output based on code content
    const mockOutput = generateMockOutput(cell.content, block);

    setCells(cells.map(c => 
      c.id === cellId ? { ...c, status: 'success', output: mockOutput } : c
    ));
  };

  const handleAddCell = (type: 'markdown' | 'code') => {
    const newId = String(Date.now());
    const newCell: NotebookCell = {
      id: newId,
      type,
      content: type === 'markdown' ? '# New Markdown Cell' : '// New code cell',
      status: type === 'code' ? 'idle' : undefined
    };

    const selectedIndex = cells.findIndex(c => c.id === selectedCellId);
    const newCells = [...cells];
    newCells.splice(selectedIndex + 1, 0, newCell);
    setCells(newCells);
    setSelectedCellId(newId);
  };

  const updateCell = (cellId: string, content: string) => {
    setCells(cells.map(c => 
      c.id === cellId ? { ...c, content } : c
    ));
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div 
        className="bg-[#252526] border border-[#3e3e42] rounded-lg max-w-6xl w-full h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-[#3e3e42]">
          <div className="flex items-center gap-3">
            <Book className="w-5 h-5 text-[#007acc]" />
            <div>
              <h2 className="text-lg font-semibold text-[#cccccc]">SDK Notebook</h2>
              <p className="text-sm text-[#858585]">{block.name} - Interactive Testing</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {activeTab === 'notebook' && (
              <>
                <button
                  onClick={() => handleAddCell('markdown')}
                  className="px-3 py-1.5 text-sm bg-[#3c3c3c] hover:bg-[#4c4c4c] text-[#cccccc] rounded"
                >
                  + Markdown
                </button>
                <button
                  onClick={() => handleAddCell('code')}
                  className="px-3 py-1.5 text-sm bg-[#007acc] hover:bg-[#005a9e] text-white rounded"
                >
                  + Code
                </button>
              </>
            )}
            <button
              onClick={onClose}
              className="p-2 hover:bg-[#2d2d2d] rounded text-[#858585] hover:text-[#cccccc]"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-[#3e3e42] bg-[#1e1e1e]">
          <button
            onClick={() => setActiveTab('notebook')}
            className={`px-4 py-2 text-sm font-medium ${
              activeTab === 'notebook'
                ? 'text-[#cccccc] border-b-2 border-[#007acc]'
                : 'text-[#858585] hover:text-[#cccccc]'
            }`}
          >
            SDK Notebook
          </button>
          <button
            onClick={() => setActiveTab('tracing')}
            className={`px-4 py-2 text-sm font-medium ${
              activeTab === 'tracing'
                ? 'text-[#cccccc] border-b-2 border-[#007acc]'
                : 'text-[#858585] hover:text-[#cccccc]'
            }`}
          >
            Distributed Tracing
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === 'notebook' ? (
          <>
            {/* Notebook Cells */}
            <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {cells.map((cell, index) => (
            <div
              key={cell.id}
              className={`border rounded ${
                selectedCellId === cell.id 
                  ? 'border-[#007acc]' 
                  : 'border-[#3e3e42]'
              }`}
              onClick={() => setSelectedCellId(cell.id)}
            >
              <div className="flex items-center justify-between px-3 py-1 bg-[#1e1e1e] border-b border-[#3e3e42]">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-[#858585]">Cell {index + 1}</span>
                  <span className={`text-xs px-2 py-0.5 rounded ${
                    cell.type === 'markdown' 
                      ? 'bg-purple-500/20 text-purple-400' 
                      : 'bg-blue-500/20 text-blue-400'
                  }`}>
                    {cell.type}
                  </span>
                  {cell.status && (
                    <span className={`text-xs px-2 py-0.5 rounded ${
                      cell.status === 'running' ? 'bg-yellow-500/20 text-yellow-400' :
                      cell.status === 'success' ? 'bg-green-500/20 text-green-400' :
                      cell.status === 'error' ? 'bg-red-500/20 text-red-400' :
                      'bg-gray-500/20 text-gray-400'
                    }`}>
                      {cell.status}
                    </span>
                  )}
                </div>
                {cell.type === 'code' && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRunCell(cell.id);
                    }}
                    disabled={cell.status === 'running'}
                    className="flex items-center gap-1 px-2 py-1 text-xs bg-[#0e7e30] hover:bg-[#0c6b28] disabled:bg-[#3c3c3c] text-white rounded"
                  >
                    <Play className="w-3 h-3" />
                    Run
                  </button>
                )}
              </div>

              <div className="p-3">
                {cell.type === 'markdown' ? (
                  <textarea
                    value={cell.content}
                    onChange={(e) => updateCell(cell.id, e.target.value)}
                    className="w-full min-h-[80px] px-3 py-2 bg-[#1e1e1e] text-[#cccccc] border border-[#3e3e42] rounded font-mono text-sm resize-y focus:outline-none focus:border-[#007acc]"
                    placeholder="# Markdown content"
                  />
                ) : (
                  <div>
                    <textarea
                      value={cell.content}
                      onChange={(e) => updateCell(cell.id, e.target.value)}
                      className="w-full min-h-[120px] px-3 py-2 bg-[#1e1e1e] text-[#cccccc] border border-[#3e3e42] rounded font-mono text-sm resize-y focus:outline-none focus:border-[#007acc]"
                      placeholder="// Enter code here"
                    />
                    {cell.output && (
                      <div className="mt-3 p-3 bg-[#0e0e0e] border border-[#3e3e42] rounded">
                        <div className="text-xs text-[#858585] mb-1">Output:</div>
                        <pre className="text-sm text-[#4ec9b0] font-mono whitespace-pre-wrap">
                          {cell.output}
                        </pre>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="px-4 py-2 bg-[#1e1e1e] border-t border-[#3e3e42] text-xs text-[#858585]">
          <span>💡 Interactive notebook with pre-scaffolded SDK code for {block.name}</span>
        </div>
          </>
        ) : (
          <TracingView 
            block={block} 
            requestPath="/api/execute"
            requestMethod="POST"
          />
        )}
      </div>
    </div>
  );
}

// Helper functions to generate scaffolded code
function getInstallationCode(block: MarketplaceBlock): string {
  if (block.id === 'redis-cache') {
    return `# Install Redis SDK\n!pip install redis ioredis`;
  } else if (block.id === 'kafka-broker') {
    return `# Install Kafka SDK\n!pip install kafka-python`;
  } else if (block.id === 'postgresql-ha') {
    return `# Install PostgreSQL SDK\n!pip install psycopg2-binary`;
  } else if (block.id === 's3-storage') {
    return `# Install AWS SDK\n!pip install boto3`;
  } else if (block.id === 'secrets-vault') {
    return `# Install Vault SDK\n!pip install hvac`;
  } else if (block.id === 'auth-service') {
    return `# Install Keycloak SDK\n!pip install python-keycloak`;
  }
  return `# Install SDK for ${block.name}\n!pip install ${block.name.toLowerCase().replace(/\s+/g, '-')}`;
}

function getInitializationCode(block: MarketplaceBlock): string {
  if (block.id === 'redis-cache') {
    return `import redis\n\n# Connect to Redis\nclient = redis.Redis(\n    host='redis.example.com',\n    port=6379,\n    password='your-password',\n    decode_responses=True\n)\n\nprint("Connected to Redis!")`;
  } else if (block.id === 'kafka-broker') {
    return `from kafka import KafkaProducer, KafkaConsumer\nimport json\n\n# Create Kafka producer\nproducer = KafkaProducer(\n    bootstrap_servers=['kafka:9092'],\n    value_serializer=lambda v: json.dumps(v).encode('utf-8')\n)\n\nprint("Connected to Kafka!")`;
  } else if (block.id === 'postgresql-ha') {
    return `import psycopg2\n\n# Connect to PostgreSQL\nconn = psycopg2.connect(\n    host="postgresql-ha.example.com",\n    port=5432,\n    database="myapp",\n    user="postgres",\n    password="password"\n)\n\nprint("Connected to PostgreSQL!")`;
  } else if (block.id === 's3-storage') {
    return `import boto3\n\n# Create S3 client\ns3 = boto3.client(\n    's3',\n    endpoint_url='https://s3.example.com',\n    aws_access_key_id='ACCESS_KEY',\n    aws_secret_access_key='SECRET_KEY'\n)\n\nprint("Connected to S3!")`;
  } else if (block.id === 'secrets-vault') {
    return `import hvac\nimport os\n\n# Connect to Vault\nclient = hvac.Client(\n    url='https://vault.example.com',\n    token=os.environ.get('VAULT_TOKEN')\n)\n\nprint("Connected to Vault!")`;
  } else if (block.id === 'auth-service') {
    return `from keycloak import KeycloakOpenID\n\n# Configure Keycloak\nkeycloak_openid = KeycloakOpenID(\n    server_url="https://auth.example.com",\n    client_id="my-app",\n    realm_name="my-realm",\n    client_secret_key="client-secret"\n)\n\nprint("Connected to Keycloak!")`;
  }
  return `# Initialize ${block.name} SDK\nimport ${block.name.toLowerCase().replace(/\s+/g, '_')}\n\nclient = ${block.name.toLowerCase().replace(/\s+/g, '_')}.Client()\nprint("Connected!")`;
}

function getBasicOperationsCode(block: MarketplaceBlock): string {
  if (block.id === 'redis-cache') {
    return `# Set a value\nclient.set('user:123', 'John Doe')\n\n# Get a value\nvalue = client.get('user:123')\nprint(f"Retrieved: {value}")\n\n# Hash operations\nclient.hset('user:profile:123', mapping={'name': 'John', 'age': 30})\nprofile = client.hgetall('user:profile:123')\nprint(f"Profile: {profile}")`;
  } else if (block.id === 'kafka-broker') {
    return `# Send a message\nproducer.send('orders', {'order_id': 123, 'total': 99.99})\nproducer.flush()\n\nprint("Message sent to Kafka topic 'orders'")`;
  } else if (block.id === 'postgresql-ha') {
    return `# Execute query\ncur = conn.cursor()\ncur.execute("SELECT * FROM users LIMIT 5")\nusers = cur.fetchall()\n\nfor user in users:\n    print(user)\n\ncur.close()`;
  } else if (block.id === 's3-storage') {
    return `# Upload a file\ns3.put_object(\n    Bucket='my-bucket',\n    Key='test.txt',\n    Body=b'Hello from S3!',\n    ContentType='text/plain'\n)\n\nprint("File uploaded to S3!")`;
  } else if (block.id === 'secrets-vault') {
    return `# Read a secret\nsecret = client.secrets.kv.v2.read_secret_version(\n    path='database',\n    mount_point='secret'\n)\n\ndb_password = secret['data']['data']['password']\nprint(f"Retrieved secret: {db_password}")`;
  } else if (block.id === 'auth-service') {
    return `# Get token\ntoken = keycloak_openid.token(username='user', password='password')\naccess_token = token['access_token']\n\nprint(f"Access token: {access_token[:50]}...")`;
  }
  return `# Perform basic operations\nresult = client.execute_operation()\nprint(result)`;
}

function generateMockOutput(code: string, block: MarketplaceBlock): string {
  if (code.includes('pip install') || code.includes('!pip')) {
    return `Requirement already satisfied\nSuccessfully installed ${block.name} SDK`;
  } else if (code.includes('Connected')) {
    return `Connected to ${block.name}!\nConnection status: Active\nVersion: ${block.version}`;
  } else if (block.id === 'redis-cache' && code.includes('get')) {
    return `Retrieved: John Doe\nProfile: {'name': 'John', 'age': '30'}`;
  } else if (block.id === 'kafka-broker') {
    return `Message sent to Kafka topic 'orders'\nPartition: 2\nOffset: 12345`;
  } else if (block.id === 'postgresql-ha') {
    return `(1, 'John Doe', 'john@example.com')\n(2, 'Jane Smith', 'jane@example.com')\n(3, 'Bob Johnson', 'bob@example.com')`;
  } else if (block.id === 's3-storage') {
    return `File uploaded to S3!\nETag: "abc123def456"\nVersionId: v1.0`;
  } else if (block.id === 'secrets-vault') {
    return `Retrieved secret: super_secret_password`;
  } else if (block.id === 'auth-service') {
    return `Access token: eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6...`;
  }
  return `Operation completed successfully\nResult: ${JSON.stringify({ success: true, timestamp: new Date().toISOString() }, null, 2)}`;
}
