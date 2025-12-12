import { useState, useEffect } from 'react';
import Editor from '@monaco-editor/react';
import { RotateCcw, Terminal as TerminalIcon } from 'lucide-react';

interface CodeEditorProps {
  code: string;
  language: string;
  readOnly?: boolean;
  onCodeChange?: (code: string) => void;
}

export function CodeEditor({ code, language, readOnly = false, onCodeChange }: CodeEditorProps) {
  const [editorCode, setEditorCode] = useState(code);

  useEffect(() => {
    setEditorCode(code);
  }, [code]);

  const handleEditorChange = (value: string | undefined) => {
    const newCode = value || '';
    setEditorCode(newCode);
    onCodeChange?.(newCode);
  };

  const handleReset = () => {
    setEditorCode(code);
    onCodeChange?.(code);
  };

  return (
    <div className="flex flex-col h-full">
      {!readOnly && (
        <div className="flex items-center justify-between px-3 py-2 bg-[#1e1e1e] border-b border-[#3e3e42]">
          <div className="flex items-center gap-2">
            <TerminalIcon className="w-4 h-4 text-[#858585]" />
            <span className="text-sm text-[#858585]">Code Editor</span>
          </div>
          <button
            onClick={handleReset}
            className="flex items-center gap-1 px-2 py-1 text-xs text-[#cccccc] hover:bg-[#2d2d2d] rounded"
          >
            <RotateCcw className="w-3 h-3" />
            Reset
          </button>
        </div>
      )}
      <div className="flex-1 min-h-[400px]">
        <Editor
          height="100%"
          defaultLanguage={language}
          value={editorCode}
          onChange={handleEditorChange}
          theme="vs-dark"
          options={{
            readOnly,
            minimap: { enabled: false },
            fontSize: 13,
            lineNumbers: 'on',
            scrollBeyondLastLine: false,
            automaticLayout: true,
            tabSize: 2,
            wordWrap: 'on',
          }}
        />
      </div>
    </div>
  );
}
