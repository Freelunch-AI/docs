import type { ReactNode } from 'react';
import { useState } from 'react';
import { Activity, Box } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FileExplorer } from './FileExplorer';
import { Terminal } from './Terminal';
import { EditorTabs } from './EditorTabs';
import { ResizeHandle } from './ResizeHandle';

interface VSCodeLayoutProps {
  children: ReactNode;
}

interface EditorTab {
  id: string;
  name: string;
  path: string;
  isActive: boolean;
}

export function VSCodeLayout({ children }: VSCodeLayoutProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const [openTabs, setOpenTabs] = useState<EditorTab[]>([]);
  const [activeTabId, setActiveTabId] = useState<string | null>(null);
  const [sidebarWidth, setSidebarWidth] = useState(256); // 64rem = 256px
  const [terminalHeight, setTerminalHeight] = useState(256); // 64rem = 256px

  const activityItems = [
    { id: 'cycle', icon: Activity, label: 'lunch-cycle', path: '/cycle' },
    { id: 'hub', icon: Box, label: 'lunch-hub', path: '/hub' },
  ];

  const isActive = (path: string) => location.pathname === path || (location.pathname === '/' && path === '/cycle');

  const handleFileClick = (path: string) => {
    const fileName = path.split('/').pop() || path;
    const existingTab = openTabs.find(tab => tab.path === path);
    
    if (existingTab) {
      setActiveTabId(existingTab.id);
      setOpenTabs(tabs => tabs.map(tab => ({
        ...tab,
        isActive: tab.id === existingTab.id
      })));
    } else {
      const newTab: EditorTab = {
        id: `tab-${Date.now()}`,
        name: fileName,
        path: path,
        isActive: true
      };
      setOpenTabs(tabs => [...tabs.map(tab => ({ ...tab, isActive: false })), newTab]);
      setActiveTabId(newTab.id);
    }
  };

  const handleTabClick = (id: string) => {
    setActiveTabId(id);
    setOpenTabs(tabs => tabs.map(tab => ({
      ...tab,
      isActive: tab.id === id
    })));
  };

  const handleTabClose = (id: string) => {
    const tabIndex = openTabs.findIndex(tab => tab.id === id);
    const newTabs = openTabs.filter(tab => tab.id !== id);
    setOpenTabs(newTabs);
    
    if (activeTabId === id && newTabs.length > 0) {
      const newActiveTab = newTabs[Math.max(0, tabIndex - 1)];
      setActiveTabId(newActiveTab.id);
    } else if (newTabs.length === 0) {
      setActiveTabId(null);
    }
  };

  const handleSidebarResize = (delta: number) => {
    setSidebarWidth(prev => Math.max(200, Math.min(600, prev + delta)));
  };

  const handleTerminalResize = (delta: number) => {
    setTerminalHeight(prev => Math.max(100, Math.min(600, prev - delta)));
  };

  return (
    <div className="flex flex-col h-screen w-screen bg-vscode-bg text-vscode-text overflow-hidden">
      {/* Title Bar */}
      <div className="h-9 bg-vscode-titleBar flex items-center px-2 text-sm select-none">
        <div className="flex gap-2 mr-2">
          <div className="w-3 h-3 rounded-full bg-[#ff5f57]"></div>
          <div className="w-3 h-3 rounded-full bg-[#febc2e]"></div>
          <div className="w-3 h-3 rounded-full bg-[#28c840]"></div>
        </div>
        <div className="flex-1 text-center text-sm" style={{ color: '#9d9d9d' }}>
          lunch-idp Interactive Playground
        </div>
      </div>

      {/* Fixed Role & Project Header */}
      <div className="h-8 bg-[#1e1e1e] border-b border-[#3e3e42] px-4 flex items-center gap-6 flex-shrink-0 z-50">
        <div className="flex items-center gap-2">
          <span className="text-xs text-[#858585] uppercase font-semibold">Role:</span>
          <span className="text-sm text-[#cccccc] font-mono">Developer</span>
        </div>
        <div className="w-px h-4 bg-[#3e3e42]"></div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-[#858585] uppercase font-semibold">Project:</span>
          <span className="text-sm text-[#cccccc] font-mono">Micromart</span>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Activity Bar */}
        <div className="w-12 bg-vscode-activityBar flex flex-col items-center pt-1">
          {activityItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);
            return (
              <button
                key={item.id}
                onClick={() => navigate(item.path)}
                className={`w-12 h-12 flex items-center justify-center cursor-pointer transition-colors relative
                  ${active ? 'text-white' : 'text-[#858585] hover:text-white'}`}
                title={item.label}
                aria-label={item.label}
              >
                <Icon size={24} strokeWidth={1.5} />
                {active && (
                  <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-white"></div>
                )}
              </button>
            );
          })}
        </div>

        {/* Sidebar + Editor Area */}
        <div className="flex flex-1 overflow-hidden">
          {/* File Explorer Sidebar */}
          <div style={{ width: `${sidebarWidth}px` }} className="flex-shrink-0">
            <FileExplorer onFileClick={handleFileClick} />
          </div>
          
          {/* Resize Handle for Sidebar */}
          <ResizeHandle direction="horizontal" onResize={handleSidebarResize} />
          
          {/* Editor Area */}
          <div className="flex-1 flex flex-col overflow-hidden min-w-0">
            {/* Editor Tabs */}
            <EditorTabs 
              tabs={openTabs} 
              onTabClick={handleTabClick}
              onTabClose={handleTabClose}
            />
            
            {/* Editor Content */}
            <div className="flex-1 overflow-hidden bg-vscode-bg" style={{ height: `calc(100% - ${terminalHeight}px)` }}>
              {openTabs.length === 0 ? (
                // Show module pages when no files are open
                children
              ) : (
                // Show file editor placeholder when files are open
                <div className="w-full h-full p-4">
                  <div className="text-vscode-textMuted text-sm">
                    File preview: {openTabs.find(t => t.isActive)?.path}
                  </div>
                  <div className="mt-4 text-vscode-text text-xs font-mono">
                    {/* File content would be loaded here */}
                    <div className="p-4 bg-vscode-bgLight rounded">
                      Editor content placeholder for: {openTabs.find(t => t.isActive)?.name}
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            {/* Resize Handle for Terminal */}
            <ResizeHandle direction="vertical" onResize={handleTerminalResize} />
            
            {/* Terminal Panel */}
            <div style={{ height: `${terminalHeight}px` }} className="flex-shrink-0">
              <Terminal />
            </div>
          </div>
        </div>
      </div>

      {/* Status Bar */}
      <div className="h-6 bg-vscode-statusBar flex items-center px-2 text-xs text-white select-none">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1">
            <Activity size={14} />
            <span>main</span>
          </span>
          <span>✓</span>
          <span>4 blocks</span>
        </div>
        <div className="flex-1"></div>
        <div className="flex items-center gap-3">
          <span>TypeScript React</span>
          <span>UTF-8</span>
          <span>Ln 1, Col 1</span>
        </div>
      </div>
    </div>
  );
}
