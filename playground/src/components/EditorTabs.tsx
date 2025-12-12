import { X } from 'lucide-react';

interface EditorTab {
  id: string;
  name: string;
  path: string;
  isActive: boolean;
}

interface EditorTabsProps {
  tabs: EditorTab[];
  onTabClick: (id: string) => void;
  onTabClose: (id: string) => void;
}

export function EditorTabs({ tabs, onTabClick, onTabClose }: EditorTabsProps) {
  if (tabs.length === 0) {
    return null;
  }

  return (
    <div className="h-9 bg-[#252526] flex items-center border-b border-[#1e1e1e] overflow-x-auto">
      {tabs.map((tab) => (
        <div
          key={tab.id}
          className={`flex items-center gap-2 px-3 h-full border-r border-[#1e1e1e] cursor-pointer group relative ${
            tab.isActive 
              ? 'bg-[#1e1e1e] text-white' 
              : 'bg-[#2d2d2d] text-[#969696] hover:text-white hover:bg-[#2d2d2d]'
          }`}
          onClick={() => onTabClick(tab.id)}
        >
          <span className="text-[13px]">{tab.name}</span>
          <button
            className={`rounded p-0.5 transition-opacity ${
              tab.isActive 
                ? 'opacity-100 hover:bg-[#3e3e3e]' 
                : 'opacity-0 group-hover:opacity-100 hover:bg-[#3e3e3e]'
            }`}
            onClick={(e) => {
              e.stopPropagation();
              onTabClose(tab.id);
            }}
          >
            <X size={14} />
          </button>
          {tab.isActive && (
            <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-[#007acc]"></div>
          )}
        </div>
      ))}
    </div>
  );
}
