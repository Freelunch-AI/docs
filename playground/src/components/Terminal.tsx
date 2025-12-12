import { Terminal as TerminalIcon, ChevronUp, X } from 'lucide-react';

export function Terminal() {
  return (
    <div className="w-full h-full bg-[#1e1e1e] border-t border-[#2b2b2b] flex flex-col">
      {/* Terminal Tabs */}
      <div className="h-9 bg-[#252526] flex items-center px-2 border-b border-[#2b2b2b] justify-between flex-shrink-0">
        <div className="flex items-center gap-1">
          <div className="flex items-center gap-1.5 px-3 py-1 text-[#cccccc] text-[13px]">
            <TerminalIcon size={14} />
            <span>bash</span>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <button className="p-1 hover:bg-[#3e3e3e] rounded text-[#cccccc]">
            <ChevronUp size={16} />
          </button>
          <button className="p-1 hover:bg-[#3e3e3e] rounded text-[#cccccc]">
            <X size={16} />
          </button>
        </div>
      </div>
      
      {/* Terminal Content */}
      <div className="flex-1 p-3 font-mono text-[13px] overflow-y-auto">
        <div className="flex items-center gap-1">
          <span className="text-[#4ec9b0]">bruno@playground</span>
          <span className="text-[#cccccc]">:</span>
          <span className="text-[#3b8eea]">~/learning/docs/playground</span>
          <span className="text-[#cccccc]">$</span>
          <span className="text-[#cccccc] animate-pulse ml-1">_</span>
        </div>
        <div className="text-[#cccccc] mt-2">
          <div>VITE v7.2.2  ready in 234 ms</div>
          <div className="text-[#4ec9b0]">➜  Local:   http://localhost:5173/</div>
        </div>
      </div>
    </div>
  );
}
