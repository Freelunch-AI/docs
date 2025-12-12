import { useState } from 'react';
import { X, Package } from 'lucide-react';
import type { SidecarContainer } from '../data/marketplaceBlocks';
import { CodeHighlight } from './CodeHighlight';

interface SidecarViewerProps {
  sidecar: SidecarContainer;
  onClose: () => void;
}

export function SidecarViewer({ sidecar, onClose }: SidecarViewerProps) {
  const [selectedFile, setSelectedFile] = useState(sidecar.files[0]?.path || '');

  const currentFile = sidecar.files.find(f => f.path === selectedFile);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-[#1e1e1e] border border-[#3e3e42] rounded-lg w-full max-w-5xl max-h-[90vh] flex flex-col shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-[#3e3e42]">
          <div className="flex items-center gap-3">
            <Package className="w-5 h-5 text-[#4ec9b0]" />
            <div>
              <h2 className="text-lg font-semibold text-[#cccccc]">{sidecar.icon} {sidecar.name}</h2>
              <p className="text-sm text-[#858585]">{sidecar.description}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-[#2d2d2d] rounded text-[#858585] hover:text-[#cccccc]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Purpose Badge */}
        <div className="px-4 py-2 bg-[#252526] border-b border-[#3e3e42]">
          <div className="flex items-center gap-2">
            <span className="text-xs text-[#858585]">Purpose:</span>
            <span className="px-2 py-1 bg-[#4ec9b0]/20 text-[#4ec9b0] text-xs rounded">
              {sidecar.purpose}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 flex overflow-hidden">
          {/* File List */}
          <div className="w-64 bg-[#252526] border-r border-[#3e3e42] overflow-y-auto">
            <div className="p-3 border-b border-[#3e3e42]">
              <h3 className="text-sm font-semibold text-[#cccccc]">Container Files</h3>
            </div>
            <div className="p-2">
              {/* Dockerfile */}
              <button
                onClick={() => setSelectedFile('Dockerfile')}
                className={`w-full text-left px-3 py-2 rounded text-sm ${
                  selectedFile === 'Dockerfile'
                    ? 'bg-[#007acc] text-[#ffffff]'
                    : 'text-[#cccccc] hover:bg-[#2d2d2d]'
                }`}
              >
                📄 Dockerfile
              </button>
              
              {/* Config Files */}
              {sidecar.files.map(file => (
                <button
                  key={file.path}
                  onClick={() => setSelectedFile(file.path)}
                  className={`w-full text-left px-3 py-2 rounded text-sm mt-1 ${
                    selectedFile === file.path
                      ? 'bg-[#007acc] text-[#ffffff]'
                      : 'text-[#cccccc] hover:bg-[#2d2d2d]'
                  }`}
                >
                  {file.isEntrypoint ? '⚡' : '📝'} {file.path}
                </button>
              ))}
            </div>
          </div>

          {/* File Content */}
          <div className="flex-1 overflow-auto bg-[#1e1e1e]">
            {selectedFile === 'Dockerfile' ? (
              <div className="p-4">
                <div className="mb-2 text-sm text-[#858585]">Dockerfile</div>
                <CodeHighlight code={sidecar.dockerfile} language="docker" />
              </div>
            ) : currentFile ? (
              <div className="p-4">
                <div className="mb-2 text-sm text-[#858585]">{currentFile.path}</div>
                <CodeHighlight 
                  code={currentFile.content} 
                  language={
                    currentFile.path.endsWith('.yaml') || currentFile.path.endsWith('.yml') ? 'yaml' :
                    currentFile.path.endsWith('.json') ? 'json' :
                    currentFile.path.endsWith('.ts') ? 'typescript' :
                    currentFile.path.endsWith('.js') ? 'javascript' :
                    currentFile.path.endsWith('.py') ? 'python' :
                    'text'
                  }
                />
              </div>
            ) : (
              <div className="flex items-center justify-center h-full text-[#858585]">
                Select a file to view its content
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
