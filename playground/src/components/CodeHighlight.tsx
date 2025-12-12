import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

interface CodeHighlightProps {
  code: string;
  language?: string;
}

const detectLanguage = (filename: string): string => {
  const ext = filename.split('.').pop()?.toLowerCase();
  
  const languageMap: Record<string, string> = {
    'ts': 'typescript',
    'tsx': 'typescript',
    'js': 'javascript',
    'jsx': 'javascript',
    'py': 'python',
    'yml': 'yaml',
    'yaml': 'yaml',
    'json': 'json',
    'sh': 'bash',
    'bash': 'bash',
    'sql': 'sql',
    'dockerfile': 'docker',
    'md': 'markdown',
    'markdown': 'markdown',
    'go': 'go',
    'tf': 'hcl',
    'java': 'java',
    'rs': 'rust',
    'rb': 'ruby',
    'php': 'php',
    'c': 'c',
    'cpp': 'cpp',
    'cs': 'csharp',
    'swift': 'swift',
    'kt': 'kotlin',
  };
  
  return languageMap[ext || ''] || 'text';
};

export function CodeHighlight({ code, language }: CodeHighlightProps) {
  const lang = language || 'text';
  
  return (
    <SyntaxHighlighter
      language={lang}
      style={vscDarkPlus}
      customStyle={{
        margin: 0,
        padding: '1rem',
        background: '#1e1e1e',
        fontSize: '0.875rem',
        lineHeight: '1.5',
        borderRadius: '0.375rem'
      }}
      showLineNumbers
      wrapLines
      lineNumberStyle={{
        minWidth: '3em',
        paddingRight: '1em',
        color: '#858585',
        userSelect: 'none'
      }}
    >
      {code}
    </SyntaxHighlighter>
  );
}

export { detectLanguage };
