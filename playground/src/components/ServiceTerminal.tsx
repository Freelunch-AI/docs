import React, { useState, useRef, useEffect } from 'react';
import { X, Terminal as TerminalIcon } from 'lucide-react';

interface ServiceTerminalProps {
  serviceName: string;
  serviceId: string;
  onClose: () => void;
}

interface TerminalLine {
  type: 'input' | 'output' | 'error';
  content: string;
}

const ServiceTerminal: React.FC<ServiceTerminalProps> = ({ serviceName, serviceId, onClose }) => {
  const [lines, setLines] = useState<TerminalLine[]>([
    { type: 'output', content: `Connected to ${serviceName} (${serviceId})` },
    { type: 'output', content: 'Type "help" for available commands' },
  ]);
  const [currentCommand, setCurrentCommand] = useState('');
  const terminalEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [lines]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const executeCommand = (cmd: string) => {
    const trimmedCmd = cmd.trim();
    
    // Add the command to history
    setLines(prev => [...prev, { type: 'input', content: `$ ${trimmedCmd}` }]);

    if (!trimmedCmd) {
      return;
    }

    // Mock command execution
    let output: string[] = [];
    
    switch (trimmedCmd.toLowerCase()) {
      case 'help':
        output = [
          'Available commands:',
          '  ps          - List running processes',
          '  ls          - List files in current directory',
          '  env         - Show environment variables',
          '  logs        - Show service logs',
          '  curl        - Make HTTP requests (simulated)',
          '  netstat     - Show network connections',
          '  df          - Show disk usage',
          '  top         - Show resource usage',
          '  cat <file>  - Display file contents',
          '  clear       - Clear terminal',
          '  help        - Show this help message',
        ];
        break;
      
      case 'ps':
        output = [
          'PID    USER     TIME   COMMAND',
          '1      root     0:01   node server.js',
          '42     root     0:00   npm start',
          '103    root     0:00   /bin/sh',
        ];
        break;
      
      case 'ls':
        output = [
          'node_modules/',
          'src/',
          'package.json',
          'tsconfig.json',
          'Dockerfile',
          'README.md',
        ];
        break;
      
      case 'env':
        output = [
          'NODE_ENV=production',
          'PORT=8080',
          'SERVICE_NAME=' + serviceName,
          'LOG_LEVEL=info',
          'OTEL_EXPORTER_OTLP_ENDPOINT=http://otel-collector:4317',
          'DATABASE_URL=postgresql://db:5432/app',
        ];
        break;
      
      case 'logs':
        output = [
          '[2024-01-15 10:23:45] INFO: Service started on port 8080',
          '[2024-01-15 10:23:46] INFO: Connected to database',
          '[2024-01-15 10:24:12] INFO: Received request GET /health',
          '[2024-01-15 10:24:12] INFO: Health check passed',
          '[2024-01-15 10:25:03] INFO: Received request POST /api/data',
          '[2024-01-15 10:25:03] INFO: Processing request...',
        ];
        break;
      
      case 'netstat':
        output = [
          'Active Internet connections',
          'Proto  Local Address      Foreign Address    State',
          'tcp    0.0.0.0:8080       0.0.0.0:*          LISTEN',
          'tcp    10.0.1.5:45678     10.0.1.8:5432      ESTABLISHED',
          'tcp    10.0.1.5:45679     10.0.1.12:4317     ESTABLISHED',
        ];
        break;
      
      case 'df':
        output = [
          'Filesystem     Size  Used  Avail  Use%  Mounted on',
          '/dev/sda1      20G   8.2G  10.8G  43%   /',
          'tmpfs          2.0G  0     2.0G   0%    /tmp',
        ];
        break;
      
      case 'top':
        output = [
          'Tasks: 4 total,   1 running',
          'CPU:  12.5%   Memory: 45.2%',
          '',
          'PID    CPU%   MEM%   COMMAND',
          '1      8.2%   35.1%  node server.js',
          '42     2.1%   8.3%   npm start',
          '103    0.1%   1.8%   /bin/sh',
        ];
        break;
      
      case 'clear':
        setLines([]);
        return;
      
      default:
        if (trimmedCmd.startsWith('curl ')) {
          output = [
            '{"status": "ok", "service": "' + serviceName + '", "timestamp": "2024-01-15T10:30:00Z"}',
          ];
        } else if (trimmedCmd.startsWith('cat ')) {
          const file = trimmedCmd.substring(4).trim();
          output = [
            `// ${file}`,
            'export default {',
            '  name: "' + serviceName + '",',
            '  version: "1.0.0",',
            '  port: 8080',
            '}',
          ];
        } else {
          setLines(prev => [...prev, { 
            type: 'error', 
            content: `Command not found: ${trimmedCmd}. Type "help" for available commands.` 
          }]);
          return;
        }
    }

    // Add output lines
    output.forEach(line => {
      setLines(prev => [...prev, { type: 'output', content: line }]);
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      executeCommand(currentCommand);
      setCurrentCommand('');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-[#1e1e1e] border border-[#3e3e42] rounded-lg shadow-2xl w-full max-w-4xl h-[600px] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-[#3e3e42] bg-[#252526]">
          <div className="flex items-center gap-3">
            <TerminalIcon className="w-5 h-5 text-[#858585]" />
            <div>
              <h3 className="text-sm font-semibold text-[#cccccc]">Terminal - {serviceName}</h3>
              <p className="text-xs text-[#858585]">Interactive container shell</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-[#858585] hover:text-[#cccccc] transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Terminal Content */}
        <div className="flex-1 overflow-y-auto p-4 bg-[#1e1e1e] font-mono text-sm">
          {lines.map((line, idx) => (
            <div key={idx} className={`mb-1 ${
              line.type === 'input' ? 'text-[#4ec9b0]' : 
              line.type === 'error' ? 'text-[#f48771]' : 
              'text-[#cccccc]'
            }`}>
              {line.content}
            </div>
          ))}
          <div ref={terminalEndRef} />
        </div>

        {/* Input Line */}
        <div className="flex items-center gap-2 px-4 py-3 border-t border-[#3e3e42] bg-[#252526]">
          <span className="text-[#4ec9b0] font-mono text-sm">$</span>
          <input
            ref={inputRef}
            type="text"
            value={currentCommand}
            onChange={(e) => setCurrentCommand(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1 bg-transparent text-[#cccccc] font-mono text-sm outline-none"
            placeholder="Enter command..."
            autoFocus
          />
        </div>
      </div>
    </div>
  );
};

export default ServiceTerminal;
