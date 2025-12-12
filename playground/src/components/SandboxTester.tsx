import { useState } from 'react';
import { Play, X, Plus, Trash2, Activity, Info, Network } from 'lucide-react';
import type { MarketplaceBlock } from '../data/marketplaceBlocks';
import { NotebookTester } from './NotebookTester';
import { TracingView } from './TracingView';
import { ObservabilityGraph } from './ObservabilityGraph';
import { marketplaceBlocks } from '../data/marketplaceBlocks';

interface SandboxTesterProps {
  block: MarketplaceBlock;
  onClose: () => void;
}

interface Request {
  id: string;
  method: string;
  path: string;
  headers: string;
  body: string;
}

interface Response {
  status: number;
  headers: string;
  body: string;
  duration: number;
}

export function SandboxTester({ block, onClose }: SandboxTesterProps) {
  // If block has SDK, show notebook interface instead
  if (block.hasSDK) {
    return <NotebookTester block={block} onClose={onClose} />;
  }

  // Get example usage block if this is an infra block
  const exampleBlock = block.exampleUsageBlock 
    ? marketplaceBlocks.find(b => b.id === block.exampleUsageBlock)
    : null;

  // Otherwise show CRUD testing interface
  const [activeTab, setActiveTab] = useState<'testing' | 'tracing' | 'graph'>('testing');
  const [requests, setRequests] = useState<Request[]>([
    {
      id: '1',
      method: 'GET',
      path: '/api/health',
      headers: 'Content-Type: application/json',
      body: ''
    }
  ]);
  const [selectedRequestId, setSelectedRequestId] = useState('1');
  const [response, setResponse] = useState<Response | null>(null);
  const [isRunning, setIsRunning] = useState(false);

  const selectedRequest = requests.find(r => r.id === selectedRequestId) || requests[0];

  const handleAddRequest = () => {
    const newId = String(Date.now());
    const newRequest: Request = {
      id: newId,
      method: 'GET',
      path: '/',
      headers: 'Content-Type: application/json',
      body: ''
    };
    setRequests([...requests, newRequest]);
    setSelectedRequestId(newId);
  };

  const handleDeleteRequest = (id: string) => {
    const newRequests = requests.filter(r => r.id !== id);
    setRequests(newRequests);
    if (selectedRequestId === id && newRequests.length > 0) {
      setSelectedRequestId(newRequests[0].id);
    }
  };

  const updateRequest = (field: keyof Request, value: string) => {
    setRequests(requests.map(r => 
      r.id === selectedRequestId ? { ...r, [field]: value } : r
    ));
  };

  const handleRunTest = async () => {
    setIsRunning(true);
    const startTime = Date.now();
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500 + Math.random() * 1000));
    
    const duration = Date.now() - startTime;
    
    // Simulate response based on block type and request
    const mockResponse: Response = {
      status: 200,
      headers: 'Content-Type: application/json\nX-Request-ID: ' + Math.random().toString(36).substring(7),
      body: JSON.stringify({
        success: true,
        block: block.name,
        path: selectedRequest.path,
        method: selectedRequest.method,
        timestamp: new Date().toISOString(),
        data: {
          message: `Response from ${block.name}`,
          version: block.version
        }
      }, null, 2),
      duration
    };

    setResponse(mockResponse);
    setIsRunning(false);
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div 
        className="bg-[#252526] border border-[#3e3e42] rounded-lg max-w-7xl w-full h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-[#3e3e42]">
          <div className="flex items-center gap-3">
            <Activity className="w-5 h-5 text-[#007acc]" />
            <div>
              <h2 className="text-lg font-semibold text-[#cccccc]">Sandbox Tester</h2>
              <p className="text-sm text-[#858585]">{block.name} - Testing Environment</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-[#2d2d2d] rounded text-[#858585] hover:text-[#cccccc]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-[#3e3e42] bg-[#1e1e1e]">
          <button
            onClick={() => setActiveTab('testing')}
            className={`px-4 py-2 text-sm font-medium ${
              activeTab === 'testing'
                ? 'text-[#cccccc] border-b-2 border-[#007acc]'
                : 'text-[#858585] hover:text-[#cccccc]'
            }`}
          >
            API Testing
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
          <button
            onClick={() => setActiveTab('graph')}
            className={`px-4 py-2 text-sm font-medium ${
              activeTab === 'graph'
                ? 'text-[#cccccc] border-b-2 border-[#007acc]'
                : 'text-[#858585] hover:text-[#cccccc]'
            }`}
          >
            <Network className="w-4 h-4 inline mr-2" />
            Observability
          </button>
        </div>

        {/* Workloads Infrastructure Info */}
        {(block.workloadsInfraBlock || exampleBlock?.workloadsInfraBlock) && (
          <div className="px-4 py-2 bg-[#252526] border-b border-[#3e3e42] flex items-center gap-3">
            <div className="flex items-center gap-2 text-[#858585] text-sm">
              <span>🏗️</span>
              <span>Workloads Infrastructure:</span>
              <span className="text-[#4ec9b0] font-mono">
                {marketplaceBlocks.find(b => b.id === (block.workloadsInfraBlock || exampleBlock?.workloadsInfraBlock))?.name || (block.workloadsInfraBlock || exampleBlock?.workloadsInfraBlock)}
              </span>
            </div>
          </div>
        )}

        {/* Example Usage Info (for infra blocks) */}
        {exampleBlock && (
          <div className="px-4 py-3 bg-[#007acc]/10 border-b border-[#007acc]/30 flex items-start gap-3">
            <Info className="w-5 h-5 text-[#007acc] flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm text-[#cccccc] mb-1">
                <strong>Infrastructure Block Testing</strong>
              </p>
              <p className="text-xs text-[#858585]">
                This sandbox shows <span className="text-[#007acc] font-semibold">{exampleBlock.name}</span> running on top of this infrastructure.
                The tracing view demonstrates how requests flow through the deployed application.
              </p>
            </div>
          </div>
        )}

        {/* Tab Content */}
        {activeTab === 'testing' ? (
          <div className="flex-1 flex overflow-hidden">
            {/* Request List Sidebar */}
            <div className="w-48 border-r border-[#3e3e42] bg-[#1e1e1e] flex flex-col">
            <div className="p-2 border-b border-[#3e3e42]">
              <button
                onClick={handleAddRequest}
                className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-[#007acc] hover:bg-[#005a9e] text-white rounded text-sm"
              >
                <Plus className="w-4 h-4" />
                New Request
              </button>
            </div>
            <div className="flex-1 overflow-y-auto">
              {requests.map(req => (
                <div
                  key={req.id}
                  className={`flex items-center justify-between p-2 cursor-pointer border-b border-[#3e3e42] ${
                    selectedRequestId === req.id ? 'bg-[#37373d]' : 'hover:bg-[#2d2d2d]'
                  }`}
                  onClick={() => setSelectedRequestId(req.id)}
                >
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-semibold text-[#cccccc]">{req.method}</div>
                    <div className="text-xs text-[#858585] truncate">{req.path}</div>
                  </div>
                  {requests.length > 1 && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteRequest(req.id);
                      }}
                      className="p-1 hover:bg-[#3e3e42] rounded text-[#858585] hover:text-red-400"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Request Editor */}
          <div className="flex-1 flex flex-col">
            <div className="flex-1 flex overflow-hidden">
              {/* Request Panel */}
              <div className="flex-1 flex flex-col border-r border-[#3e3e42]">
                <div className="p-4 border-b border-[#3e3e42]">
                  <div className="flex gap-2 mb-3">
                    <select
                      value={selectedRequest.method}
                      onChange={(e) => updateRequest('method', e.target.value)}
                      className="px-3 py-2 bg-[#3c3c3c] text-[#cccccc] border border-[#3e3e42] rounded"
                    >
                      <option>GET</option>
                      <option>POST</option>
                      <option>PUT</option>
                      <option>PATCH</option>
                      <option>DELETE</option>
                    </select>
                    <input
                      type="text"
                      value={selectedRequest.path}
                      onChange={(e) => updateRequest('path', e.target.value)}
                      placeholder="/api/endpoint"
                      className="flex-1 px-3 py-2 bg-[#3c3c3c] text-[#cccccc] border border-[#3e3e42] rounded focus:outline-none focus:border-[#007acc]"
                    />
                    <button
                      onClick={handleRunTest}
                      disabled={isRunning}
                      className="flex items-center gap-2 px-4 py-2 bg-[#0e7e30] hover:bg-[#0c6b28] disabled:bg-[#3c3c3c] text-white rounded"
                    >
                      <Play className="w-4 h-4" />
                      {isRunning ? 'Running...' : 'Send'}
                    </button>
                  </div>
                </div>

                <div className="flex-1 flex flex-col overflow-hidden">
                  <div className="px-4 py-2 bg-[#1e1e1e] border-b border-[#3e3e42]">
                    <span className="text-sm text-[#cccccc]">Request Headers</span>
                  </div>
                  <div className="px-4 py-2 flex-shrink-0">
                    <textarea
                      value={selectedRequest.headers}
                      onChange={(e) => updateRequest('headers', e.target.value)}
                      placeholder="Header-Name: value"
                      className="w-full h-20 px-3 py-2 bg-[#1e1e1e] text-[#cccccc] border border-[#3e3e42] rounded font-mono text-sm resize-none focus:outline-none focus:border-[#007acc]"
                    />
                  </div>

                  <div className="px-4 py-2 bg-[#1e1e1e] border-b border-[#3e3e42]">
                    <span className="text-sm text-[#cccccc]">Request Body</span>
                  </div>
                  <div className="flex-1 px-4 py-2 overflow-hidden">
                    <textarea
                      value={selectedRequest.body}
                      onChange={(e) => updateRequest('body', e.target.value)}
                      placeholder='{\n  "key": "value"\n}'
                      className="w-full h-full px-3 py-2 bg-[#1e1e1e] text-[#cccccc] border border-[#3e3e42] rounded font-mono text-sm resize-none focus:outline-none focus:border-[#007acc]"
                    />
                  </div>
                </div>
              </div>

              {/* Response Panel */}
              <div className="flex-1 flex flex-col">
                <div className="px-4 py-3 bg-[#1e1e1e] border-b border-[#3e3e42]">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-[#cccccc]">Response</span>
                    {response && (
                      <div className="flex items-center gap-4 text-xs">
                        <span className={`px-2 py-1 rounded ${
                          response.status < 300 ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                        }`}>
                          Status: {response.status}
                        </span>
                        <span className="text-[#858585]">Time: {response.duration}ms</span>
                      </div>
                    )}
                  </div>
                </div>

                {response ? (
                  <div className="flex-1 flex flex-col overflow-hidden">
                    <div className="px-4 py-2 bg-[#1e1e1e] border-b border-[#3e3e42]">
                      <span className="text-sm text-[#cccccc]">Headers</span>
                    </div>
                    <div className="px-4 py-2 flex-shrink-0">
                      <pre className="text-xs text-[#858585] font-mono whitespace-pre-wrap">
                        {response.headers}
                      </pre>
                    </div>

                    <div className="px-4 py-2 bg-[#1e1e1e] border-b border-[#3e3e42]">
                      <span className="text-sm text-[#cccccc]">Body</span>
                    </div>
                    <div className="flex-1 px-4 py-2 overflow-auto">
                      <pre className="text-sm text-[#cccccc] font-mono">
                        {response.body}
                      </pre>
                    </div>
                  </div>
                ) : (
                  <div className="flex-1 flex items-center justify-center">
                    <div className="text-center text-[#858585]">
                      <Activity className="w-12 h-12 mx-auto mb-2 opacity-50" />
                      <p>No response yet</p>
                      <p className="text-sm mt-1">Send a request to see the response</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
          </div>
        ) : activeTab === 'tracing' ? (
          <TracingView 
            block={exampleBlock || block}
            requestPath={selectedRequest.path}
            requestMethod={selectedRequest.method}
          />
        ) : (
          <ObservabilityGraph block={exampleBlock || block} />
        )}

        {/* Footer Info */}
        <div className="px-4 py-2 bg-[#1e1e1e] border-t border-[#3e3e42] text-xs text-[#858585]">
          <span>💡 Testing {block.name} v{block.version} in isolated sandbox environment</span>
        </div>
      </div>
    </div>
  );
}
