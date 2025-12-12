import { useState } from 'react';
import { Filter, Building2, Search, Server, Cloud, Package, GitBranch } from 'lucide-react';
import { marketplaceBlocks } from '../data/marketplaceBlocks';
import { privateRegistryBlocks, libraryGuidance, codingConventions } from '../data/privateRegistry';
import type { MarketplaceBlock, BlockLabel, BlockType } from '../data/marketplaceBlocks';
import { BlockCard } from '../components/BlockCard';
import { BlockDetailModal } from '../components/BlockDetailModal';

type FilterCategory = BlockType | BlockLabel | 'ai-powered';
type PrivateRegistryTab = 'blocks' | 'libraries' | 'conventions';
type MainTab = 'services' | 'infra' | 'artifacts' | 'online-experiments' | 'ci';
type ArtifactsSubTab = 'data-engineering' | 'ai';
type DataEngineeringTab = 'dags' | 'tasks' | 'event-handlers' | 'data-transformations' | 'broker-topics' | 'database-schemas';
type AITab = 'ai-models' | 'ai-prompts' | 'agent-definitions' | 'datasets';

export function LunchHubPage() {
  const [selectedBlock, setSelectedBlock] = useState<MarketplaceBlock | null>(null);
  const [selectedFilters, setSelectedFilters] = useState<FilterCategory[]>([]);
  const [registryView, setRegistryView] = useState<'marketplace' | 'private'>('marketplace');
  const [privateTab, setPrivateTab] = useState<PrivateRegistryTab>('blocks');
  const [searchQuery, setSearchQuery] = useState('');
  const [mainTab, setMainTab] = useState<MainTab>('services');
  const [artifactsSubTab, setArtifactsSubTab] = useState<ArtifactsSubTab>('data-engineering');
  const [dataEngineeringTab, setDataEngineeringTab] = useState<DataEngineeringTab>('dags');
  const [aiTab, setAITab] = useState<AITab>('ai-models');

  const handleImportBlock = (blockId: string) => {
    // TODO: Implement actual import to Lunch-Cycle
    console.log('Importing block to Lunch-Cycle:', blockId);
    // This would integrate with the Lunch-Cycle workflow system
    alert(`Block "${blockId}" will be imported to Lunch-Cycle workflow`);
  };

  const allFilters: { value: FilterCategory; label: string; group: string }[] = [
    // Block Types
    { value: 'service', label: 'Service', group: 'Type & Category' },
    { value: 'dag', label: 'DAG', group: 'Type & Category' },
    { value: 'task', label: 'Task', group: 'Type & Category' },
    { value: 'function', label: 'Function', group: 'Type & Category' },
    { value: 'infrastructure', label: 'Infrastructure', group: 'Type & Category' },
    { value: 'workloads-infra', label: 'Workloads Infra', group: 'Type & Category' },
    // Block Labels
    { value: 'app-service', label: 'App Service', group: 'Type & Category' },
    { value: 'supporting-service', label: 'Supporting Service', group: 'Type & Category' },
    { value: 'ir-infra', label: 'IR Infra', group: 'Type & Category' },
    { value: 'code-workloads-infra', label: 'Code+Workloads Infra', group: 'Type & Category' },
    // Special
    { value: 'ai-powered', label: 'AI-Powered', group: 'Special' }
  ];

  const toggleFilter = (filter: FilterCategory) => {
    setSelectedFilters(prev =>
      prev.includes(filter)
        ? prev.filter(f => f !== filter)
        : [...prev, filter]
    );
  };

  const filteredBlocks = marketplaceBlocks.filter(block => {
    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      const matchesSearch = 
        block.name.toLowerCase().includes(query) ||
        block.description.toLowerCase().includes(query) ||
        block.tags.some(tag => tag.toLowerCase().includes(query));
      
      if (!matchesSearch) return false;
    }

    // Apply category filters
    if (selectedFilters.length === 0) return true;
    
    return selectedFilters.some(filter => {
      if (filter === 'ai-powered') return block.isAI === true;
      if (filter === block.type) return true;
      if (filter === block.blockLabel) return true;
      return false;
    });
  });

  // Mock private registry blocks (empty for now)
  const privateBlocks: MarketplaceBlock[] = privateRegistryBlocks;

  const displayBlocks = registryView === 'marketplace' ? filteredBlocks : privateBlocks.filter(block => {
    // Apply search filter to private blocks
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      const matchesSearch = 
        block.name.toLowerCase().includes(query) ||
        block.description.toLowerCase().includes(query) ||
        block.tags.some(tag => tag.toLowerCase().includes(query));
      
      if (!matchesSearch) return false;
    }

    // Apply category filters
    if (selectedFilters.length === 0) return true;
    
    return selectedFilters.some(filter => {
      if (filter === 'ai-powered') return block.isAI === true;
      if (filter === block.type) return true;
      if (filter === block.blockLabel) return true;
      return false;
    });
  });

  // Group filters by category
  const groupedFilters = allFilters.reduce((acc, filter) => {
    if (!acc[filter.group]) acc[filter.group] = [];
    acc[filter.group].push(filter);
    return acc;
  }, {} as Record<string, typeof allFilters>);

  return (
    <div className="h-full overflow-y-auto p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-[#cccccc] mb-2">Block Hub</h1>
          <p className="text-[#858585]">HuggingFace Hub for Software Engineering</p>
        </div>

        {/* Registry View Tabs */}
        <div className="mb-4 flex gap-2">
          <button
            onClick={() => setRegistryView('marketplace')}
            className={`px-4 py-2 rounded text-sm font-semibold transition-colors ${
              registryView === 'marketplace'
                ? 'bg-[#007acc] text-white'
                : 'bg-[#252526] text-[#cccccc] border border-[#3e3e42] hover:border-[#007acc]'
            }`}
          >
            🌐 Marketplace
          </button>
          <button
            onClick={() => setRegistryView('private')}
            className={`px-4 py-2 rounded text-sm font-semibold transition-colors flex items-center gap-2 ${
              registryView === 'private'
                ? 'bg-[#007acc] text-white'
                : 'bg-[#252526] text-[#cccccc] border border-[#3e3e42] hover:border-[#007acc]'
            }`}
          >
            <Building2 className="w-4 h-4" />
            Private Registry
          </button>
        </div>

        {/* Private Registry Sub-tabs */}
        {registryView === 'private' && (
          <div className="mb-4 flex gap-2 pl-4 border-l-2 border-[#007acc]">
            <button
              onClick={() => setPrivateTab('blocks')}
              className={`px-3 py-1.5 rounded text-sm transition-colors ${
                privateTab === 'blocks'
                  ? 'bg-[#0e639c] text-white'
                  : 'text-[#cccccc] hover:bg-[#2a2d2e]'
              }`}
            >
              Blocks
            </button>
            <button
              onClick={() => setPrivateTab('libraries')}
              className={`px-3 py-1.5 rounded text-sm transition-colors ${
                privateTab === 'libraries'
                  ? 'bg-[#0e639c] text-white'
                  : 'text-[#cccccc] hover:bg-[#2a2d2e]'
              }`}
            >
              Libraries
            </button>
            <button
              onClick={() => setPrivateTab('conventions')}
              className={`px-3 py-1.5 rounded text-sm transition-colors ${
                privateTab === 'conventions'
                  ? 'bg-[#0e639c] text-white'
                  : 'text-[#cccccc] hover:bg-[#2a2d2e]'
              }`}
            >
              Conventions
            </button>
          </div>
        )}

        {/* Main Tabs (Services, Infra, Artifacts, Online Experiments) - Only show for blocks view */}
        {(registryView === 'marketplace' || privateTab === 'blocks') && (
          <div className="mb-4">
            <div className="flex gap-2">
              <button
                onClick={() => setMainTab('services')}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors flex items-center gap-2 ${
                  mainTab === 'services'
                    ? 'bg-[#007acc] text-white'
                    : 'bg-[#1e1e1e] text-[#cccccc] hover:bg-[#2a2d2e]'
                }`}
              >
                <Server className="w-4 h-4" />
                Services
              </button>
              <button
                onClick={() => setMainTab('infra')}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors flex items-center gap-2 ${
                  mainTab === 'infra'
                    ? 'bg-[#007acc] text-white'
                    : 'bg-[#1e1e1e] text-[#cccccc] hover:bg-[#2a2d2e]'
                }`}
              >
                <Cloud className="w-4 h-4" />
                Infra
              </button>
              <button
                onClick={() => setMainTab('artifacts')}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors flex items-center gap-2 ${
                  mainTab === 'artifacts'
                    ? 'bg-[#007acc] text-white'
                    : 'bg-[#1e1e1e] text-[#cccccc] hover:bg-[#2a2d2e]'
                }`}
              >
                <Package className="w-4 h-4" />
                Artifacts
              </button>
              <button
                onClick={() => setMainTab('online-experiments')}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
                  mainTab === 'online-experiments'
                    ? 'bg-[#007acc] text-white'
                    : 'bg-[#1e1e1e] text-[#cccccc] hover:bg-[#2a2d2e]'
                }`}
              >
                🧪 Online Experiments
              </button>
              <button
                onClick={() => setMainTab('ci')}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors flex items-center gap-2 ${
                  mainTab === 'ci'
                    ? 'bg-[#007acc] text-white'
                    : 'bg-[#1e1e1e] text-[#cccccc] hover:bg-[#2a2d2e]'
                }`}
              >
                <GitBranch className="w-4 h-4" />
                CI
              </button>
            </div>

            {/* Artifacts Sub-tabs */}
            {mainTab === 'artifacts' && (
              <div className="mt-3 flex gap-2 pl-4 border-l-2 border-[#007acc]">
                <button
                  onClick={() => setArtifactsSubTab('data-engineering')}
                  className={`px-3 py-1.5 rounded text-sm transition-colors ${
                    artifactsSubTab === 'data-engineering'
                      ? 'bg-[#0e639c] text-white'
                      : 'text-[#cccccc] hover:bg-[#2a2d2e]'
                  }`}
                >
                  Data Engineering
                </button>
                <button
                  onClick={() => setArtifactsSubTab('ai')}
                  className={`px-3 py-1.5 rounded text-sm transition-colors ${
                    artifactsSubTab === 'ai'
                      ? 'bg-[#0e639c] text-white'
                      : 'text-[#cccccc] hover:bg-[#2a2d2e]'
                  }`}
                >
                  AI
                </button>
              </div>
            )}

            {/* Data Engineering Artifact Type Tabs */}
            {mainTab === 'artifacts' && artifactsSubTab === 'data-engineering' && (
              <div className="mt-3 flex flex-wrap gap-2 pl-8">
                <button
                  onClick={() => setDataEngineeringTab('dags')}
                  className={`px-3 py-1 rounded text-xs transition-colors ${
                    dataEngineeringTab === 'dags'
                      ? 'bg-[#4ec9b0] text-[#1e1e1e]'
                      : 'bg-[#252526] text-[#858585] hover:text-[#cccccc]'
                  }`}
                >
                  DAGs
                </button>
                <button
                  onClick={() => setDataEngineeringTab('tasks')}
                  className={`px-3 py-1 rounded text-xs transition-colors ${
                    dataEngineeringTab === 'tasks'
                      ? 'bg-[#4ec9b0] text-[#1e1e1e]'
                      : 'bg-[#252526] text-[#858585] hover:text-[#cccccc]'
                  }`}
                >
                  Tasks
                </button>
                <button
                  onClick={() => setDataEngineeringTab('event-handlers')}
                  className={`px-3 py-1 rounded text-xs transition-colors ${
                    dataEngineeringTab === 'event-handlers'
                      ? 'bg-[#4ec9b0] text-[#1e1e1e]'
                      : 'bg-[#252526] text-[#858585] hover:text-[#cccccc]'
                  }`}
                >
                  Event Handlers
                </button>
                <button
                  onClick={() => setDataEngineeringTab('data-transformations')}
                  className={`px-3 py-1 rounded text-xs transition-colors ${
                    dataEngineeringTab === 'data-transformations'
                      ? 'bg-[#4ec9b0] text-[#1e1e1e]'
                      : 'bg-[#252526] text-[#858585] hover:text-[#cccccc]'
                  }`}
                >
                  Data Transformations
                </button>
                <button
                  onClick={() => setDataEngineeringTab('broker-topics')}
                  className={`px-3 py-1 rounded text-xs transition-colors ${
                    dataEngineeringTab === 'broker-topics'
                      ? 'bg-[#4ec9b0] text-[#1e1e1e]'
                      : 'bg-[#252526] text-[#858585] hover:text-[#cccccc]'
                  }`}
                >
                  Broker Topics
                </button>
                <button
                  onClick={() => setDataEngineeringTab('database-schemas')}
                  className={`px-3 py-1 rounded text-xs transition-colors ${
                    dataEngineeringTab === 'database-schemas'
                      ? 'bg-[#4ec9b0] text-[#1e1e1e]'
                      : 'bg-[#252526] text-[#858585] hover:text-[#cccccc]'
                  }`}
                >
                  Database Schemas
                </button>
              </div>
            )}

            {/* AI Artifact Type Tabs */}
            {mainTab === 'artifacts' && artifactsSubTab === 'ai' && (
              <div className="mt-3 flex flex-wrap gap-2 pl-8">
                <button
                  onClick={() => setAITab('ai-models')}
                  className={`px-3 py-1 rounded text-xs transition-colors ${
                    aiTab === 'ai-models'
                      ? 'bg-[#ce9178] text-[#1e1e1e]'
                      : 'bg-[#252526] text-[#858585] hover:text-[#cccccc]'
                  }`}
                >
                  AI Models
                </button>
                <button
                  onClick={() => setAITab('ai-prompts')}
                  className={`px-3 py-1 rounded text-xs transition-colors ${
                    aiTab === 'ai-prompts'
                      ? 'bg-[#ce9178] text-[#1e1e1e]'
                      : 'bg-[#252526] text-[#858585] hover:text-[#cccccc]'
                  }`}
                >
                  AI Prompts
                </button>
                <button
                  onClick={() => setAITab('agent-definitions')}
                  className={`px-3 py-1 rounded text-xs transition-colors ${
                    aiTab === 'agent-definitions'
                      ? 'bg-[#ce9178] text-[#1e1e1e]'
                      : 'bg-[#252526] text-[#858585] hover:text-[#cccccc]'
                  }`}
                >
                  Agent Definitions
                </button>
                <button
                  onClick={() => setAITab('datasets')}
                  className={`px-3 py-1 rounded text-xs transition-colors ${
                    aiTab === 'datasets'
                      ? 'bg-[#ce9178] text-[#1e1e1e]'
                      : 'bg-[#252526] text-[#858585] hover:text-[#cccccc]'
                  }`}
                >
                  Datasets
                </button>
              </div>
            )}
          </div>
        )}

        {/* Search Bar */}
        {(registryView === 'marketplace' || privateTab === 'blocks') && mainTab !== 'artifacts' && (
          <div className="mb-4 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#858585]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={registryView === 'marketplace' 
                ? "Search for distributed cache system, real-time analytics pipeline, multi-cloud kubernetes..."
                : "Search internal blocks: user authentication service, company ML inference pipeline..."
              }
              className="w-full bg-[#252526] border border-[#3e3e42] rounded-lg pl-10 pr-4 py-3 text-[#cccccc] placeholder-[#6e6e6e] focus:outline-none focus:border-[#007acc] transition-colors"
            />
          </div>
        )}

        {/* Unified Filter */}
        {(registryView === 'marketplace' || privateTab === 'blocks') && (
          <div className="mb-6 bg-[#252526] border border-[#3e3e42] rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-[#858585]" />
                <span className="text-sm font-semibold text-[#cccccc]">Filters</span>
              </div>
              {selectedFilters.length > 0 && (
                <button
                  onClick={() => setSelectedFilters([])}
                  className="px-3 py-1 rounded text-xs border border-[#3e3e42] text-[#858585] hover:text-[#cccccc] hover:border-[#858585]"
                >
                  Clear All
                </button>
              )}
            </div>

            {/* Filter Groups */}
            <div className="space-y-4">
              {Object.entries(groupedFilters).map(([group, filters]) => (
                <div key={group}>
                  <div className="text-xs text-[#858585] uppercase font-semibold mb-2">{group}</div>
                  <div className="flex flex-wrap gap-2">
                    {filters.map(({ value, label }) => (
                      <button
                        key={value}
                        onClick={() => toggleFilter(value)}
                        className={`px-3 py-1.5 rounded text-sm border transition-colors ${
                          selectedFilters.includes(value)
                            ? 'bg-[#007acc] border-[#007acc] text-white'
                            : 'bg-[#1e1e1e] border-[#3e3e42] text-[#cccccc] hover:border-[#007acc]'
                        }`}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {selectedFilters.length > 0 && (
              <p className="text-xs text-[#858585] mt-4">
                Showing {displayBlocks.length} of {registryView === 'marketplace' ? marketplaceBlocks.length : privateBlocks.length} blocks
              </p>
            )}
          </div>
        )}

        {/* Blocks Grid */}
        {(registryView === 'marketplace' || (registryView === 'private' && privateTab === 'blocks')) && mainTab !== 'artifacts' ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {displayBlocks
                .filter(block => {
                  if (mainTab === 'services') return block.type === 'service' || block.type === 'service-block';
                  if (mainTab === 'infra') return block.type === 'infrastructure' || block.type === 'workloads-infra';
                  if (mainTab === 'online-experiments') return block.type === 'experimentation';
                  if (mainTab === 'ci') return block.category === 'ci';
                  return true;
                })
                .map((block) => (
                  <BlockCard
                    key={block.id}
                    block={block}
                    onClick={() => setSelectedBlock(block)}
                    onImport={handleImportBlock}
                  />
                ))}
            </div>

            {displayBlocks.filter(block => {
              if (mainTab === 'services') return block.type === 'service' || block.type === 'service-block';
              if (mainTab === 'infra') return block.type === 'infrastructure' || block.type === 'workloads-infra';
              if (mainTab === 'online-experiments') return block.type === 'experimentation';
              if (mainTab === 'ci') return block.category === 'ci';
              return true;
            }).length === 0 && (
              <div className="text-center text-[#858585] py-12">
                {registryView === 'private' 
                  ? 'No private blocks available. Add your company-specific blocks here.'
                  : 'No blocks match the selected filters'}
              </div>
            )}
          </>
        ) : null}

        {/* Artifacts View */}
        {(registryView === 'marketplace' || (registryView === 'private' && privateTab === 'blocks')) && mainTab === 'artifacts' && (
          <div className="space-y-4">
            {/* Data Engineering Artifacts */}
            {artifactsSubTab === 'data-engineering' && (
              <>
                {/* DAGs - Show actual DAG blocks from marketplace (excluding CI/CD) */}
                {dataEngineeringTab === 'dags' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {displayBlocks
                      .filter(block => block.type === 'dag' && block.category !== 'ci-cd')
                      .map((block) => (
                        <BlockCard
                          key={block.id}
                          block={block}
                          onClick={() => setSelectedBlock(block)}
                          onImport={handleImportBlock}
                        />
                      ))}
                  </div>
                )}

                {/* Tasks - Show task blocks */}
                {dataEngineeringTab === 'tasks' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {displayBlocks
                      .filter(block => block.type === 'task')
                      .map((block) => (
                        <BlockCard
                          key={block.id}
                          block={block}
                          onClick={() => setSelectedBlock(block)}
                          onImport={handleImportBlock}
                        />
                      ))}
                  </div>
                )}

                {/* Event Handlers - Show function blocks tagged as event handlers */}
                {dataEngineeringTab === 'event-handlers' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {displayBlocks
                      .filter(block => block.type === 'function' && block.tags?.some(tag => tag.includes('event')))
                      .map((block) => (
                        <BlockCard
                          key={block.id}
                          block={block}
                          onClick={() => setSelectedBlock(block)}
                          onImport={handleImportBlock}
                        />
                      ))}
                  </div>
                )}

                {/* Data Transformations - Show function blocks tagged as transformations */}
                {dataEngineeringTab === 'data-transformations' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {displayBlocks
                      .filter(block => block.type === 'function' && block.tags?.some(tag => tag.includes('transform')))
                      .map((block) => (
                        <BlockCard
                          key={block.id}
                          block={block}
                          onClick={() => setSelectedBlock(block)}
                          onImport={handleImportBlock}
                        />
                      ))}
                  </div>
                )}

                {/* Broker Topics - Show infrastructure blocks for messaging */}
                {dataEngineeringTab === 'broker-topics' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {displayBlocks
                      .filter(block => block.tags?.some(tag => tag.includes('kafka') || tag.includes('messaging') || tag.includes('pubsub')))
                      .map((block) => (
                        <BlockCard
                          key={block.id}
                          block={block}
                          onClick={() => setSelectedBlock(block)}
                          onImport={handleImportBlock}
                        />
                      ))}
                  </div>
                )}

                {/* Database Schemas - Show database infrastructure blocks */}
                {dataEngineeringTab === 'database-schemas' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {displayBlocks
                      .filter(block => block.tags?.some(tag => tag.includes('database') || tag.includes('postgres') || tag.includes('mysql') || tag.includes('mongo')))
                      .map((block) => (
                        <BlockCard
                          key={block.id}
                          block={block}
                          onClick={() => setSelectedBlock(block)}
                          onImport={handleImportBlock}
                        />
                      ))}
                  </div>
                )}
              </>
            )}

            {/* AI Artifacts */}
            {artifactsSubTab === 'ai' && (
              <>
                {/* AI Models - Show blocks with aiArtifactCategory === 'model' */}
                {aiTab === 'ai-models' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {displayBlocks
                      .filter(block => block.aiArtifactCategory === 'model')
                      .map((block) => (
                        <BlockCard
                          key={block.id}
                          block={block}
                          onClick={() => setSelectedBlock(block)}
                          onImport={handleImportBlock}
                        />
                      ))}
                  </div>
                )}

                {/* AI Prompts - Show blocks with aiArtifactCategory === 'prompt' */}
                {aiTab === 'ai-prompts' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {displayBlocks
                      .filter(block => block.aiArtifactCategory === 'prompt')
                      .map((block) => (
                        <BlockCard
                          key={block.id}
                          block={block}
                          onClick={() => setSelectedBlock(block)}
                          onImport={handleImportBlock}
                        />
                      ))}
                  </div>
                )}

                {/* Agent Definitions - Show blocks with aiArtifactCategory === 'agent' */}
                {aiTab === 'agent-definitions' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {displayBlocks
                      .filter(block => block.aiArtifactCategory === 'agent')
                      .map((block) => (
                        <BlockCard
                          key={block.id}
                          block={block}
                          onClick={() => setSelectedBlock(block)}
                          onImport={handleImportBlock}
                        />
                      ))}
                  </div>
                )}

                {/* Datasets - Show blocks with aiArtifactCategory === 'dataset' */}
                {aiTab === 'datasets' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {displayBlocks
                      .filter(block => block.aiArtifactCategory === 'dataset')
                      .map((block) => (
                        <BlockCard
                          key={block.id}
                          block={block}
                          onClick={() => setSelectedBlock(block)}
                          onImport={handleImportBlock}
                        />
                      ))}
                  </div>
                )}
              </>
            )}
          </div>
        )}

        {/* Libraries Tab */}
        {registryView === 'private' && privateTab === 'libraries' && (
          <div className="space-y-6">
            {libraryGuidance.map((lang) => (
              <div key={lang.language} className="bg-[#252526] border border-[#3e3e42] rounded-lg p-6">
                <h3 className="text-xl font-semibold text-[#cccccc] mb-4">{lang.language}</h3>
                
                {/* Mandatory Libraries */}
                {lang.mandatory.length > 0 && (
                  <div className="mb-4">
                    <h4 className="text-sm font-semibold text-[#f48771] uppercase mb-2">Mandatory</h4>
                    <div className="space-y-2">
                      {lang.mandatory.map((lib) => (
                        <div key={lib.name} className="bg-[#1e1e1e] border border-[#3e3e42] rounded p-3">
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-mono text-[#4ec9b0]">{lib.name}</span>
                            {lib.version && <span className="text-xs text-[#858585]">{lib.version}</span>}
                          </div>
                          <div className="text-sm text-[#cccccc]">{lib.purpose}</div>
                          <div className="text-xs text-[#858585] mt-1">{lib.reason}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Recommended Libraries */}
                {lang.recommended.length > 0 && (
                  <div className="mb-4">
                    <h4 className="text-sm font-semibold text-[#4ec9b0] uppercase mb-2">Recommended</h4>
                    <div className="space-y-2">
                      {lang.recommended.map((lib) => (
                        <div key={lib.name} className="bg-[#1e1e1e] border border-[#3e3e42] rounded p-3">
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-mono text-[#4ec9b0]">{lib.name}</span>
                            {lib.version && <span className="text-xs text-[#858585]">{lib.version}</span>}
                          </div>
                          <div className="text-sm text-[#cccccc]">{lib.purpose}</div>
                          <div className="text-xs text-[#858585] mt-1">{lib.reason}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Not Recommended Libraries */}
                {lang.notRecommended.length > 0 && (
                  <div className="mb-4">
                    <h4 className="text-sm font-semibold text-[#ce9178] uppercase mb-2">Not Recommended</h4>
                    <div className="space-y-2">
                      {lang.notRecommended.map((lib) => (
                        <div key={lib.name} className="bg-[#1e1e1e] border border-[#3e3e42] rounded p-3">
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-mono text-[#ce9178]">{lib.name}</span>
                          </div>
                          <div className="text-sm text-[#cccccc]">{lib.purpose}</div>
                          <div className="text-xs text-[#858585] mt-1">{lib.reason}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Prohibited Libraries */}
                {lang.prohibited.length > 0 && (
                  <div>
                    <h4 className="text-sm font-semibold text-[#f14c4c] uppercase mb-2">Prohibited</h4>
                    <div className="space-y-2">
                      {lang.prohibited.map((lib) => (
                        <div key={lib.name} className="bg-[#1e1e1e] border border-[#f14c4c4d] rounded p-3">
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-mono text-[#f14c4c]">{lib.name}</span>
                          </div>
                          <div className="text-sm text-[#cccccc]">{lib.purpose}</div>
                          <div className="text-xs text-[#f14c4c] mt-1">⚠️ {lib.reason}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Conventions Tab */}
        {registryView === 'private' && privateTab === 'conventions' && (
          <div className="space-y-6">
            {codingConventions.map((lang) => (
              <div key={lang.language} className="bg-[#252526] border border-[#3e3e42] rounded-lg p-6">
                <h3 className="text-xl font-semibold text-[#cccccc] mb-4">{lang.language}</h3>
                
                {/* Mandatory Conventions */}
                <div className="mb-4">
                  <h4 className="text-sm font-semibold text-[#f48771] uppercase mb-2">Mandatory</h4>
                  <div className="space-y-3">
                    {lang.mandatory.map((conv) => (
                      <div key={conv.name} className="bg-[#1e1e1e] border border-[#3e3e42] rounded p-4">
                        <div className="font-semibold text-[#4ec9b0] mb-2">{conv.name}</div>
                        <div className="text-sm text-[#cccccc] mb-2">{conv.description}</div>
                        {conv.example && (
                          <pre className="bg-[#0d1117] border border-[#3e3e42] rounded p-3 text-xs text-[#c9d1d9] overflow-x-auto">
                            {conv.example}
                          </pre>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Recommended Conventions */}
                <div>
                  <h4 className="text-sm font-semibold text-[#4ec9b0] uppercase mb-2">Recommended</h4>
                  <div className="space-y-3">
                    {lang.recommended.map((conv) => (
                      <div key={conv.name} className="bg-[#1e1e1e] border border-[#3e3e42] rounded p-4">
                        <div className="font-semibold text-[#4ec9b0] mb-2">{conv.name}</div>
                        <div className="text-sm text-[#cccccc] mb-2">{conv.description}</div>
                        {conv.example && (
                          <pre className="bg-[#0d1117] border border-[#3e3e42] rounded p-3 text-xs text-[#c9d1d9] overflow-x-auto">
                            {conv.example}
                          </pre>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {selectedBlock && (
        <BlockDetailModal
          block={selectedBlock}
          onClose={() => setSelectedBlock(null)}
        />
      )}
    </div>
  );
}
