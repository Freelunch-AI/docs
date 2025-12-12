import { useState } from 'react';

type CycleTab = 'graph' | 'observability' | 'ci-runs';

export function LunchCyclePage() {
  const [activeTab, setActiveTab] = useState<CycleTab>('graph');

  return (
    <div className="w-full h-full flex flex-col bg-vscode-bg">
      {/* Tab Navigation */}
      <div className="flex border-b border-vscode-border bg-vscode-bgLight">
        <button
          onClick={() => setActiveTab('graph')}
          className={`px-4 py-2 text-sm font-medium transition-colors ${
            activeTab === 'graph'
              ? 'text-vscode-textBright border-b-2 border-green-500 bg-vscode-bg'
              : 'text-vscode-textMuted hover:text-vscode-text hover:bg-vscode-bg/50'
          }`}
        >
          Dependency Graph
        </button>
        <button
          onClick={() => setActiveTab('observability')}
          className={`px-4 py-2 text-sm font-medium transition-colors ${
            activeTab === 'observability'
              ? 'text-vscode-textBright border-b-2 border-green-500 bg-vscode-bg'
              : 'text-vscode-textMuted hover:text-vscode-text hover:bg-vscode-bg/50'
          }`}
        >
          Observability
        </button>
        <button
          onClick={() => setActiveTab('ci-runs')}
          className={`px-4 py-2 text-sm font-medium transition-colors ${
            activeTab === 'ci-runs'
              ? 'text-vscode-textBright border-b-2 border-green-500 bg-vscode-bg'
              : 'text-vscode-textMuted hover:text-vscode-text hover:bg-vscode-bg/50'
          }`}
        >
          CI Runs
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === 'graph' && (
        <div className="flex-1 flex items-center justify-center flex-col gap-6">
          <div className="flex items-center gap-3">
            <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center text-3xl">
              🔄
            </div>
            <div>
              <h1 className="text-3xl font-semibold text-vscode-textBright">lunch-cycle</h1>
              <p className="text-vscode-textMuted">Microservice Lifecycle IDE</p>
            </div>
          </div>
          <p className="text-sm text-vscode-text max-w-xl text-center leading-relaxed">
            Build and visualize microservice architectures with a node-based graph editor.
            View dependencies, edit service code, and compare branches side-by-side.
          </p>
          <div className="mt-4 px-4 py-2 bg-vscode-bgLight rounded text-xs text-vscode-textMuted">
            Phase 1 coming soon: Graph visualization with React Flow
          </div>
        </div>
      )}

      {activeTab === 'observability' && (
        <div className="flex-1 flex items-center justify-center flex-col gap-6">
          <div className="flex items-center gap-3">
            <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-blue-400 to-purple-600 flex items-center justify-center text-3xl">
              👁️
            </div>
            <div>
              <h1 className="text-3xl font-semibold text-vscode-textBright">Observability</h1>
              <p className="text-vscode-textMuted">Metrics, Traces & Logs</p>
            </div>
          </div>
          <p className="text-sm text-vscode-text max-w-xl text-center leading-relaxed">
            Monitor your microservices with integrated observability tools.
            View metrics, distributed traces, and logs in one unified interface.
          </p>
          <div className="mt-4 px-4 py-2 bg-vscode-bgLight rounded text-xs text-vscode-textMuted">
            Observability features coming soon
          </div>
        </div>
      )}

      {activeTab === 'ci-runs' && (
        <div className="flex-1 flex items-center justify-center flex-col gap-6">
          <div className="flex items-center gap-3">
            <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-orange-400 to-pink-600 flex items-center justify-center text-3xl">
              🚀
            </div>
            <div>
              <h1 className="text-3xl font-semibold text-vscode-textBright">CI Pipeline Runs</h1>
              <p className="text-vscode-textMuted">Build & Test Execution History</p>
            </div>
          </div>
          <p className="text-sm text-vscode-text max-w-2xl text-center leading-relaxed">
            Visualize CI pipeline executions with DAG-based flow diagrams. Track each task's status, 
            view generated artifacts (test reports, SBOM, OAM definitions), inspect logs, and drill down 
            into specific build steps. See code blocks flowing through test → scan → build → OAM generation 
            stages with real-time progress and artifact lineage.
          </p>
          <div className="mt-4 space-y-2 text-xs text-vscode-text max-w-2xl">
            <div className="flex items-start gap-2">
              <span className="text-green-400">✓</span>
              <span><strong>Pipeline Visualization:</strong> Interactive DAG showing all CI tasks and their dependencies</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-green-400">✓</span>
              <span><strong>Artifact Explorer:</strong> Browse test results, coverage reports, security scans, SBOMs, and OAM manifests</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-green-400">✓</span>
              <span><strong>Code Block Tracing:</strong> Track which code blocks were input to each CI task and their transformations</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-green-400">✓</span>
              <span><strong>Run History:</strong> Timeline of all pipeline executions with filtering by branch, commit, or trigger</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-green-400">✓</span>
              <span><strong>Task Drill-down:</strong> Click any task node to view logs, duration, exit codes, and generated artifacts</span>
            </div>
          </div>
          <div className="mt-4 px-4 py-2 bg-vscode-bgLight rounded text-xs text-vscode-textMuted">
            CI Runs visualization coming soon
          </div>
        </div>
      )}
    </div>
  );
}
