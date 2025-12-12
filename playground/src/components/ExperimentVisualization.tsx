import type { ExperimentConfiguration } from '../types';
import { TrendingUp, Zap, Activity, GitBranch, Users } from 'lucide-react';

interface ExperimentVisualizationProps {
  config: ExperimentConfiguration;
}

export function ExperimentVisualization({ config }: ExperimentVisualizationProps) {
  const { strategy, variants, baselineVariantId } = config;

  // Render based on experiment type
  switch (strategy.type) {
    case 'ab-test':
      return <ABTestVisualization variants={variants} baselineVariantId={baselineVariantId} />;
    case 'multi-armed-bandit':
      return <BanditVisualization variants={variants} />;
    case 'canary':
      return <CanaryVisualization variants={variants} />;
    case 'blue-green':
      return <BlueGreenVisualization variants={variants} />;
    case 'shadow':
      return <ShadowVisualization variants={variants} />;
    default:
      return null;
  }
}

// A/B Test Visualization
function ABTestVisualization({ variants, baselineVariantId }: { variants: any[], baselineVariantId?: string }) {
  const variantA = variants[0];
  const variantB = variants[1];

  return (
    <div className="bg-[#1e1e1e] border border-[#3e3e42] rounded-lg p-6">
      <div className="flex items-center gap-2 mb-4">
        <GitBranch size={20} className="text-blue-400" />
        <h3 className="text-lg font-semibold text-[#cccccc]">A/B Test: Traffic Split</h3>
      </div>

      {/* Visual Diagram */}
      <div className="space-y-4">
        {/* Incoming Traffic */}
        <div className="flex items-center justify-center">
          <div className="flex items-center gap-2 bg-[#252526] border border-[#007acc] rounded px-4 py-2">
            <Users size={18} className="text-[#007acc]" />
            <span className="text-sm text-[#cccccc]">Incoming Traffic (100%)</span>
          </div>
        </div>

        {/* Arrow down */}
        <div className="flex justify-center">
          <div className="border-l-2 border-dashed border-[#3e3e42] h-8"></div>
        </div>

        {/* Traffic Splitter */}
        <div className="flex items-center justify-center">
          <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 rounded-lg px-6 py-3">
            <div className="text-center">
              <div className="text-xs text-purple-400 font-semibold mb-1">TRAFFIC ROUTER</div>
              <div className="text-[10px] text-[#858585]">Random assignment • Sticky sessions</div>
            </div>
          </div>
        </div>

        {/* Split arrows */}
        <div className="relative h-16">
          {/* Left arrow to A */}
          <svg className="absolute left-[25%] top-0 w-1/4 h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <path d="M 50,0 L 0,100" stroke="#4ec9b0" strokeWidth="2" fill="none" strokeDasharray="5,5" />
          </svg>
          {/* Right arrow to B */}
          <svg className="absolute right-[25%] top-0 w-1/4 h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <path d="M 50,0 L 100,100" stroke="#f48771" strokeWidth="2" fill="none" strokeDasharray="5,5" />
          </svg>
        </div>

        {/* Variants */}
        <div className="grid grid-cols-2 gap-4">
          {/* Variant A */}
          <div className="bg-[#252526] border-2 border-[#4ec9b0] rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-[#4ec9b0] rounded-full"></div>
                <span className="text-sm font-semibold text-[#4ec9b0]">{variantA?.name || 'Variant A'}</span>
              </div>
              {baselineVariantId === variantA?.id && (
                <span className="text-[10px] bg-orange-500/20 text-orange-400 px-2 py-0.5 rounded">CONTROL</span>
              )}
            </div>
            <div className="text-center mb-2">
              <div className="text-3xl font-bold text-[#4ec9b0]">{variantA?.weight || 50}%</div>
              <div className="text-[10px] text-[#858585]">of traffic</div>
            </div>
            <div className="text-xs text-[#858585] text-center">
              {variantA?.description || 'Control variant'}
            </div>
          </div>

          {/* Variant B */}
          <div className="bg-[#252526] border-2 border-[#f48771] rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-[#f48771] rounded-full"></div>
                <span className="text-sm font-semibold text-[#f48771]">{variantB?.name || 'Variant B'}</span>
              </div>
              {baselineVariantId !== variantB?.id && (
                <span className="text-[10px] bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded">TREATMENT</span>
              )}
            </div>
            <div className="text-center mb-2">
              <div className="text-3xl font-bold text-[#f48771]">{variantB?.weight || 50}%</div>
              <div className="text-[10px] text-[#858585]">of traffic</div>
            </div>
            <div className="text-xs text-[#858585] text-center">
              {variantB?.description || 'Treatment variant'}
            </div>
          </div>
        </div>

        {/* Metrics Collection */}
        <div className="flex justify-center mt-4">
          <div className="bg-[#252526] border border-[#3e3e42] rounded-lg px-6 py-3">
            <div className="flex items-center gap-3">
              <Activity size={16} className="text-yellow-400" />
              <div>
                <div className="text-xs font-semibold text-[#cccccc]">Metrics Collected</div>
                <div className="text-[10px] text-[#858585]">Latency • Error Rate • Conversion • Success Rate</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Multi-Armed Bandit Visualization
function BanditVisualization({ variants }: { variants: any[] }) {
  return (
    <div className="bg-[#1e1e1e] border border-[#3e3e42] rounded-lg p-6">
      <div className="flex items-center gap-2 mb-4">
        <Zap size={20} className="text-yellow-400" />
        <h3 className="text-lg font-semibold text-[#cccccc]">Multi-Armed Bandit: Adaptive Traffic Allocation</h3>
      </div>

      <div className="space-y-4">
        {/* Incoming Traffic */}
        <div className="flex items-center justify-center">
          <div className="flex items-center gap-2 bg-[#252526] border border-[#007acc] rounded px-4 py-2">
            <Users size={18} className="text-[#007acc]" />
            <span className="text-sm text-[#cccccc]">Incoming Traffic (100%)</span>
          </div>
        </div>

        <div className="flex justify-center">
          <div className="border-l-2 border-dashed border-[#3e3e42] h-6"></div>
        </div>

        {/* Bandit Controller */}
        <div className="flex items-center justify-center">
          <div className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-500/30 rounded-lg px-6 py-3">
            <div className="text-center">
              <div className="text-xs text-yellow-400 font-semibold mb-1">🎰 BANDIT CONTROLLER</div>
              <div className="text-[10px] text-[#858585]">Thompson Sampling • Updates every 5 min</div>
            </div>
          </div>
        </div>

        <div className="flex justify-center">
          <div className="border-l-2 border-dashed border-[#3e3e42] h-6"></div>
        </div>

        {/* Dynamic arrows to variants */}
        <div className="relative h-20">
          {variants.map((_, idx) => {
            const totalVariants = variants.length;
            const xPos = ((idx + 1) / (totalVariants + 1)) * 100;
            return (
              <svg key={idx} className="absolute top-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                <path
                  d={`M 50,0 L ${xPos},100`}
                  stroke="#fbbf24"
                  strokeWidth="2"
                  fill="none"
                  strokeDasharray="5,5"
                  opacity={0.6}
                />
              </svg>
            );
          })}
        </div>

        {/* Variants with dynamic weights */}
        <div className={`grid grid-cols-${Math.min(variants.length, 3)} gap-3`}>
          {variants.map((variant, idx) => {
            const colors = ['#4ec9b0', '#f48771', '#c586c0', '#569cd6', '#dcdcaa'];
            const color = colors[idx % colors.length];
            
            return (
              <div key={variant.id} className="bg-[#252526] border-2 rounded-lg p-3" style={{ borderColor: color }}>
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: color }}></div>
                  <span className="text-xs font-semibold" style={{ color }}>{variant.name}</span>
                </div>
                <div className="text-center mb-1">
                  <div className="text-2xl font-bold" style={{ color }}>{variant.weight?.toFixed(1) || '33.3'}%</div>
                  <div className="text-[9px] text-[#858585]">current allocation</div>
                </div>
                <div className="mt-2 pt-2 border-t border-[#3e3e42]">
                  <div className="flex items-center justify-between text-[9px]">
                    <span className="text-[#858585]">Reward:</span>
                    <span className="text-green-400 font-semibold">0.73</span>
                  </div>
                  <div className="flex items-center justify-between text-[9px] mt-1">
                    <span className="text-[#858585]">Uncertainty:</span>
                    <span className="text-yellow-400 font-semibold">±0.12</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Adaptive Note */}
        <div className="flex justify-center mt-4">
          <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg px-4 py-2">
            <div className="flex items-center gap-2">
              <TrendingUp size={14} className="text-yellow-400" />
              <span className="text-xs text-yellow-400 font-medium">Traffic auto-adjusts to maximize reward</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Canary Visualization
function CanaryVisualization({ variants }: { variants: any[] }) {
  const stable = variants.find(v => v.id === 'stable');
  const canary = variants.find(v => v.id === 'canary');

  const stages = [
    { canary: 5, stable: 95, label: 'Initial' },
    { canary: 10, stable: 90, label: 'Step 1' },
    { canary: 25, stable: 75, label: 'Step 2' },
    { canary: 50, stable: 50, label: 'Step 3' },
    { canary: 100, stable: 0, label: 'Complete' },
  ];

  return (
    <div className="bg-[#1e1e1e] border border-[#3e3e42] rounded-lg p-6">
      <div className="flex items-center gap-2 mb-4">
        <Activity size={20} className="text-green-400" />
        <h3 className="text-lg font-semibold text-[#cccccc]">Canary Deployment: Progressive Rollout</h3>
      </div>

      <div className="space-y-6">
        {/* Timeline visualization */}
        <div className="bg-[#252526] rounded-lg p-4">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-[#858585]">ROLLOUT STAGES</span>
            <span className="text-xs text-[#858585]">10 min per stage</span>
          </div>

          <div className="space-y-3">
            {stages.map((stage, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-[#cccccc] font-medium">{stage.label}</span>
                  <span className="text-[#858585]">{idx * 10} min</span>
                </div>
                <div className="flex h-8 rounded overflow-hidden border border-[#3e3e42]">
                  {/* Stable (Blue) */}
                  <div
                    className="bg-blue-500/30 border-r border-blue-500/50 flex items-center justify-center transition-all"
                    style={{ width: `${stage.stable}%` }}
                  >
                    {stage.stable > 15 && (
                      <span className="text-xs font-semibold text-blue-300">{stage.stable}%</span>
                    )}
                  </div>
                  {/* Canary (Yellow) */}
                  <div
                    className="bg-yellow-500/30 flex items-center justify-center transition-all"
                    style={{ width: `${stage.canary}%` }}
                  >
                    {stage.canary > 0 && (
                      <span className="text-xs font-semibold text-yellow-300">{stage.canary}%</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="flex items-center gap-4 mt-4 pt-3 border-t border-[#3e3e42]">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-blue-500/50 rounded"></div>
              <span className="text-xs text-[#cccccc]">Stable ({stable?.name})</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-yellow-500/50 rounded"></div>
              <span className="text-xs text-[#cccccc]">Canary ({canary?.name})</span>
            </div>
          </div>
        </div>

        {/* Rollback Monitoring */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-[#252526] border border-green-500/30 rounded-lg p-3">
            <div className="text-xs text-green-400 font-semibold mb-2">✓ Health Checks</div>
            <div className="text-[10px] text-[#858585] space-y-1">
              <div>• Error rate {'<'} 5%</div>
              <div>• Latency p95 {'<'} +50%</div>
              <div>• Success rate {'>'} 95%</div>
            </div>
          </div>

          <div className="bg-[#252526] border border-red-500/30 rounded-lg p-3">
            <div className="text-xs text-red-400 font-semibold mb-2">⚠ Auto-Rollback Triggers</div>
            <div className="text-[10px] text-[#858585] space-y-1">
              <div>• Error rate {'>'} 5%</div>
              <div>• Latency spike {'>'} 2x</div>
              <div>• Health check fails</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Blue-Green Visualization
function BlueGreenVisualization({ variants }: { variants: any[] }) {
  const blue = variants.find(v => v.id === 'blue');
  const green = variants.find(v => v.id === 'green');

  return (
    <div className="bg-[#1e1e1e] border border-[#3e3e42] rounded-lg p-6">
      <div className="flex items-center gap-2 mb-4">
        <GitBranch size={20} className="text-cyan-400" />
        <h3 className="text-lg font-semibold text-[#cccccc]">Blue-Green Deployment: Atomic Switch</h3>
      </div>

      <div className="space-y-4">
        {/* Load Balancer */}
        <div className="flex items-center justify-center">
          <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 rounded-lg px-6 py-3">
            <div className="text-center">
              <div className="text-xs text-purple-400 font-semibold mb-1">⚡ LOAD BALANCER</div>
              <div className="text-[10px] text-[#858585]">Atomic traffic switch</div>
            </div>
          </div>
        </div>

        <div className="flex justify-center">
          <div className="border-l-2 border-dashed border-[#3e3e42] h-8"></div>
        </div>

        {/* Environment selector visualization */}
        <div className="relative bg-[#252526] rounded-lg p-4 border-2 border-[#3e3e42]">
          <div className="grid grid-cols-2 gap-4">
            {/* Blue Environment */}
            <div className={`rounded-lg p-4 border-2 transition-all ${
              blue?.trafficPercentage === 100
                ? 'border-blue-500 bg-blue-500/20'
                : 'border-[#3e3e42] bg-[#1e1e1e] opacity-50'
            }`}>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
                  <span className="text-sm font-semibold text-blue-400">Blue Environment</span>
                </div>
                {blue?.trafficPercentage === 100 && (
                  <span className="text-[10px] bg-green-500/20 text-green-400 px-2 py-0.5 rounded font-semibold">
                    ACTIVE
                  </span>
                )}
              </div>
              
              <div className="text-center mb-2">
                <div className="text-3xl font-bold text-blue-400">{blue?.trafficPercentage || 0}%</div>
                <div className="text-[10px] text-[#858585]">Production Traffic</div>
              </div>

              <div className="text-xs text-[#858585]">{blue?.description}</div>
              
              {blue?.trafficPercentage === 100 && (
                <div className="mt-3 pt-3 border-t border-blue-500/30">
                  <div className="text-[10px] text-blue-400 font-semibold">Currently serving users</div>
                </div>
              )}
            </div>

            {/* Green Environment */}
            <div className={`rounded-lg p-4 border-2 transition-all ${
              green?.trafficPercentage === 100
                ? 'border-green-500 bg-green-500/20'
                : 'border-[#3e3e42] bg-[#1e1e1e] opacity-50'
            }`}>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                  <span className="text-sm font-semibold text-green-400">Green Environment</span>
                </div>
                {green?.trafficPercentage === 100 && (
                  <span className="text-[10px] bg-green-500/20 text-green-400 px-2 py-0.5 rounded font-semibold">
                    ACTIVE
                  </span>
                )}
                {green?.trafficPercentage === 0 && (
                  <span className="text-[10px] bg-orange-500/20 text-orange-400 px-2 py-0.5 rounded font-semibold">
                    STANDBY
                  </span>
                )}
              </div>
              
              <div className="text-center mb-2">
                <div className="text-3xl font-bold text-green-400">{green?.trafficPercentage || 0}%</div>
                <div className="text-[10px] text-[#858585]">Production Traffic</div>
              </div>

              <div className="text-xs text-[#858585]">{green?.description}</div>
              
              {green?.trafficPercentage === 0 && (
                <div className="mt-3 pt-3 border-t border-green-500/30">
                  <div className="text-[10px] text-green-400 font-semibold">Warming up, ready to switch</div>
                </div>
              )}
            </div>
          </div>

          {/* Switch indicator */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <div className="bg-[#1e1e1e] border-2 border-yellow-500 rounded-full p-2">
              <div className="text-2xl">⚡</div>
            </div>
          </div>
        </div>

        {/* Switch process */}
        <div className="bg-[#252526] rounded-lg p-4">
          <div className="text-xs font-semibold text-[#cccccc] mb-3">SWITCH PROCESS</div>
          <div className="space-y-2 text-xs text-[#858585]">
            <div className="flex items-center gap-2">
              <span className="text-blue-400">1.</span>
              <span>Blue (current) serves 100% of traffic</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-green-400">2.</span>
              <span>Deploy Green (new version), warm up</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-yellow-400">3.</span>
              <span>Atomic switch: 100% traffic → Green</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-purple-400">4.</span>
              <span>Monitor Green, keep Blue for instant rollback</span>
            </div>
          </div>
        </div>

        {/* Benefits */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-green-500/10 border border-green-500/30 rounded px-3 py-2">
            <div className="text-xs text-green-400 font-semibold">✓ Zero Downtime</div>
          </div>
          <div className="bg-green-500/10 border border-green-500/30 rounded px-3 py-2">
            <div className="text-xs text-green-400 font-semibold">✓ Instant Rollback</div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Shadow Traffic Visualization
function ShadowVisualization({ variants }: { variants: any[] }) {
  const primary = variants.find(v => v.id === 'primary');
  const shadow = variants.find(v => v.id === 'shadow');

  return (
    <div className="bg-[#1e1e1e] border border-[#3e3e42] rounded-lg p-6">
      <div className="flex items-center gap-2 mb-4">
        <Users size={20} className="text-purple-400" />
        <h3 className="text-lg font-semibold text-[#cccccc]">Shadow Traffic: Risk-Free Testing</h3>
      </div>

      <div className="space-y-4">
        {/* User request */}
        <div className="flex items-center justify-center">
          <div className="flex items-center gap-2 bg-[#252526] border border-[#007acc] rounded px-4 py-2">
            <Users size={18} className="text-[#007acc]" />
            <span className="text-sm text-[#cccccc]">User Request</span>
          </div>
        </div>

        <div className="flex justify-center">
          <div className="border-l-2 border-dashed border-[#3e3e42] h-6"></div>
        </div>

        {/* Traffic Mirroring */}
        <div className="flex items-center justify-center">
          <div className="bg-gradient-to-r from-purple-500/20 to-indigo-500/20 border border-purple-500/30 rounded-lg px-6 py-3">
            <div className="text-center">
              <div className="text-xs text-purple-400 font-semibold mb-1">👥 TRAFFIC MIRROR</div>
              <div className="text-[10px] text-[#858585]">Duplicates requests • 100% mirrored</div>
            </div>
          </div>
        </div>

        {/* Split flow */}
        <div className="relative h-16">
          {/* Left arrow to Primary */}
          <svg className="absolute left-[25%] top-0 w-1/4 h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <path d="M 50,0 L 0,100" stroke="#4ec9b0" strokeWidth="3" fill="none" />
          </svg>
          {/* Right arrow to Shadow */}
          <svg className="absolute right-[25%] top-0 w-1/4 h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <path d="M 50,0 L 100,100" stroke="#858585" strokeWidth="2" fill="none" strokeDasharray="5,5" />
          </svg>
        </div>

        {/* Services */}
        <div className="grid grid-cols-2 gap-4">
          {/* Primary Service */}
          <div className="bg-[#252526] border-2 border-[#4ec9b0] rounded-lg p-4">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-3 h-3 bg-[#4ec9b0] rounded-full"></div>
              <span className="text-sm font-semibold text-[#4ec9b0]">{primary?.name || 'Primary Service'}</span>
            </div>
            
            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-[#858585]">Traffic:</span>
                <span className="text-[#4ec9b0] font-semibold">100%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#858585]">Responses:</span>
                <span className="text-green-400 font-semibold">→ Users</span>
              </div>
            </div>

            <div className="mt-3 pt-3 border-t border-[#3e3e42]">
              <div className="text-[10px] text-[#4ec9b0] font-semibold">✓ Serves actual users</div>
            </div>
          </div>

          {/* Shadow Service */}
          <div className="bg-[#252526] border-2 border-[#858585] border-dashed rounded-lg p-4">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-3 h-3 bg-[#858585] rounded-full"></div>
              <span className="text-sm font-semibold text-[#858585]">{shadow?.name || 'Shadow Service'}</span>
            </div>
            
            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-[#858585]">Traffic:</span>
                <span className="text-[#858585] font-semibold">100% (mirrored)</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#858585]">Responses:</span>
                <span className="text-red-400 font-semibold">✗ Discarded</span>
              </div>
            </div>

            <div className="mt-3 pt-3 border-t border-[#3e3e42]">
              <div className="text-[10px] text-[#858585] font-semibold">⚠ Testing only (no user impact)</div>
            </div>
          </div>
        </div>

        {/* Comparison */}
        <div className="bg-[#252526] rounded-lg p-4">
          <div className="flex items-center gap-2 mb-3">
            <Activity size={16} className="text-yellow-400" />
            <span className="text-xs font-semibold text-[#cccccc]">Response Comparison & Analysis</span>
          </div>
          <div className="grid grid-cols-3 gap-2 text-[10px]">
            <div className="bg-[#1e1e1e] rounded p-2 text-center">
              <div className="text-[#858585] mb-1">Latency Diff</div>
              <div className="text-green-400 font-semibold">+12ms</div>
            </div>
            <div className="bg-[#1e1e1e] rounded p-2 text-center">
              <div className="text-[#858585] mb-1">Error Rate</div>
              <div className="text-green-400 font-semibold">0.1%</div>
            </div>
            <div className="bg-[#1e1e1e] rounded p-2 text-center">
              <div className="text-[#858585] mb-1">Diff Rate</div>
              <div className="text-yellow-400 font-semibold">2.3%</div>
            </div>
          </div>
        </div>

        {/* Key Feature */}
        <div className="flex justify-center">
          <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg px-4 py-2">
            <div className="flex items-center gap-2">
              <span className="text-purple-400 text-lg">🛡️</span>
              <span className="text-xs text-purple-400 font-medium">Zero risk: Shadow responses don't affect users</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
