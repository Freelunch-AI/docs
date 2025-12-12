import { useState } from 'react';
import { File, FileCode, Rocket, Package } from 'lucide-react';
import type { ContainerStructure } from '../data/marketplaceBlocks';
import { CodeHighlight, detectLanguage } from './CodeHighlight';
import { SidecarViewer } from './SidecarViewer';
import type { SidecarContainer } from '../data/marketplaceBlocks';

interface ContainerPreviewProps {
  structure: ContainerStructure;
}

export function ContainerPreview({ structure }: ContainerPreviewProps) {
  const [selectedFile, setSelectedFile] = useState(structure.files[0]);
  const [selectedSidecar, setSelectedSidecar] = useState<SidecarContainer | null>(null);

  return (
    <div className="border border-[#3e3e42] rounded-lg overflow-hidden bg-[#1e1e1e]">
      {/* Header */}
      <div className="bg-[#252526] border-b border-[#3e3e42] px-4 py-2 flex items-center justify-between">
        <h4 className="text-sm font-semibold text-[#cccccc]">Container Structure</h4>
        {structure.sidecars && structure.sidecars.length > 0 && (
          <div className="flex items-center gap-2">
            <span className="text-xs text-[#858585]">Sidecars:</span>
            {structure.sidecars.map((sidecar) => (
              <button
                key={sidecar.id}
                onClick={() => setSelectedSidecar(sidecar)}
                className="px-2 py-1 bg-[#4ec9b0]/20 hover:bg-[#4ec9b0]/30 text-[#4ec9b0] text-xs rounded border border-[#4ec9b0]/30 flex items-center gap-1"
              >
                <Package className="w-3 h-3" />
                {sidecar.icon} {sidecar.name}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="flex" style={{ height: '500px' }}>
        {/* File Tree Sidebar */}
        <div className="w-64 border-r border-[#3e3e42] bg-[#252526] overflow-y-auto">
          <div className="p-2">
            {/* Sidecars Section */}
            {structure.sidecars && structure.sidecars.length > 0 ? (
              <div className="mb-4 pb-4 border-b border-[#3e3e42]">
                <div className="text-xs text-[#858585] uppercase font-semibold mb-2 px-2 flex items-center gap-2">
                  <Package className="w-3 h-3" />
                  Sidecars ({structure.sidecars.length})
                </div>
                {structure.sidecars.map((sidecar) => (
                  <button
                    key={sidecar.id}
                    onClick={() => setSelectedSidecar(sidecar)}
                    className="w-full text-left px-2 py-2 rounded text-sm flex items-center gap-2 mb-1 bg-[#4ec9b0]/10 hover:bg-[#4ec9b0]/30 text-[#4ec9b0] border border-[#4ec9b0]/50 transition-colors"
                  >
                    <Package className="w-4 h-4 flex-shrink-0" />
                    <span className="text-lg">{sidecar.icon}</span>
                    <div className="flex-1 min-w-0">
                      <div className="truncate font-semibold">{sidecar.name}</div>
                      <div className="text-xs text-[#4ec9b0]/70 truncate">{sidecar.purpose}</div>
                    </div>
                  </button>
                ))}
              </div>
            ) : (
              <div className="mb-4 pb-4 border-b border-[#3e3e42]">
                <div className="text-xs text-[#858585] uppercase font-semibold mb-2 px-2">
                  Sidecars
                </div>
                <div className="px-2 py-2 text-xs text-[#858585] italic">
                  No sidecars attached
                </div>
              </div>
            )}
            
            {/* Files Section */}
            <div className="mb-4">
              <div className="text-xs text-[#858585] uppercase font-semibold mb-2 px-2">
                Files
              </div>
              {structure.files.map((file) => (
                <button
                  key={file.path}
                  onClick={() => setSelectedFile(file)}
                  className={`w-full text-left px-2 py-1.5 rounded text-sm flex items-center gap-2 ${
                    selectedFile.path === file.path
                      ? 'bg-[#37373d] text-[#cccccc]'
                      : 'text-[#cccccc] hover:bg-[#2d2d2d]'
                  }`}
                >
                  {file.isEntrypoint ? (
                    <Rocket className="w-4 h-4 text-[#4ec9b0] flex-shrink-0" />
                  ) : file.path.endsWith('.json') ? (
                    <FileCode className="w-4 h-4 text-[#ce9178] flex-shrink-0" />
                  ) : (
                    <File className="w-4 h-4 text-[#519aba] flex-shrink-0" />
                  )}
                  <span className="truncate">{file.path}</span>
                  {file.isEntrypoint && (
                    <span className="ml-auto text-xs text-[#4ec9b0]">entry</span>
                  )}
                </button>
              ))}
            </div>

            {/* Dockerfile Section */}
            <div>
              <div className="text-xs text-[#858585] uppercase font-semibold mb-2 px-2">
                Container
              </div>
              <button
                onClick={() => setSelectedFile({ 
                  path: 'Dockerfile', 
                  content: structure.dockerfile 
                })}
                className={`w-full text-left px-2 py-1.5 rounded text-sm flex items-center gap-2 ${
                  selectedFile.path === 'Dockerfile'
                    ? 'bg-[#37373d] text-[#cccccc]'
                    : 'text-[#cccccc] hover:bg-[#2d2d2d]'
                }`}
              >
                <File className="w-4 h-4 text-[#569cd6] flex-shrink-0" />
                <span>Dockerfile</span>
              </button>
            </div>
          </div>
        </div>

        {/* Code Viewer */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* File Header */}
          <div className="bg-[#252526] border-b border-[#3e3e42] px-4 py-2 flex items-center gap-2">
            <span className="text-sm text-[#cccccc] font-mono">{selectedFile.path}</span>
            {selectedFile.isEntrypoint && (
              <span className="px-2 py-0.5 bg-[#4ec9b0]/20 text-[#4ec9b0] rounded text-xs flex items-center gap-1">
                <Rocket className="w-3 h-3" />
                Entrypoint
              </span>
            )}
          </div>

          {/* Code Content */}
          <div className="flex-1 overflow-auto">
            <CodeHighlight 
              code={selectedFile.content} 
              language={detectLanguage(selectedFile.path)} 
            />
          </div>
        </div>
      </div>

      {/* Footer Info */}
      <div className="bg-[#252526] border-t border-[#3e3e42] px-4 py-2 flex items-center justify-between text-xs text-[#858585]">
        <span>
          {structure.files.length} file{structure.files.length !== 1 ? 's' : ''} + Dockerfile
        </span>
        <span>
          Entrypoint: <code className="text-[#4ec9b0] font-mono">{structure.entrypoint}</code>
        </span>
      </div>

      {/* Sidecar Viewer Modal */}
      {selectedSidecar && (
        <SidecarViewer sidecar={selectedSidecar} onClose={() => setSelectedSidecar(null)} />
      )}
    </div>
  );
}
