import React, { useRef, useEffect } from 'react';
import { AlgorithmType, ExecutionStep } from '../types';
import { CPP_ALGORITHM_CODES } from '../algorithms/cppCode';
import { Terminal, Copy, Check, ChevronRight } from 'lucide-react';

interface CppConsoleProps {
  algorithm: AlgorithmType;
  currentStep?: ExecutionStep;
}

// Tokenize C++ code for clean, readable syntax highlighting
function highlightCppLine(line: string) {
  // Check comments
  if (line.trim().startsWith('//')) {
    return <span className="text-stone-400 italic">{line}</span>;
  }

  // Basic regex tokenization for C++ primitives
  const tokens = line.split(/(\b(?:void|int|bool|auto|vector|queue|stack|priority_queue|greater|pair|tuple|DisjointSet|Edge|enum|State|const|while|for|if|else|return|break|continue|false|true|INF)\b|[(),{}<>[\];=+\-*!&|]|\s+|"[^"]*"|\b\d+\b)/g);

  return (
    <>
      {tokens.map((token, i) => {
        if (!token) return null;

        // Keywords
        if (/^(while|for|if|else|return|break|continue|enum|const)$/.test(token)) {
          return <span key={i} className="text-purple-700 font-semibold">{token}</span>;
        }
        // Types
        if (/^(void|int|bool|auto|vector|queue|stack|priority_queue|greater|pair|tuple|DisjointSet|Edge|State)$/.test(token)) {
          return <span key={i} className="text-blue-700 font-semibold">{token}</span>;
        }
        // Booleans / Literals
        if (/^(true|false|INF)$/.test(token)) {
          return <span key={i} className="text-amber-700 font-medium">{token}</span>;
        }
        // Numbers
        if (/^\d+$/.test(token)) {
          return <span key={i} className="text-emerald-700">{token}</span>;
        }
        // Operators & punctuation
        if (/^[(),{}<>[\];=+\-*!&|]$/.test(token)) {
          return <span key={i} className="text-stone-500">{token}</span>;
        }
        // Function names before '('
        if (/^[a-zA-Z_]\w*$/.test(token)) {
          return <span key={i} className="text-stone-900 font-medium">{token}</span>;
        }

        return <span key={i} className="text-stone-800">{token}</span>;
      })}
    </>
  );
}

export const CppConsole: React.FC<CppConsoleProps> = ({ algorithm, currentStep }) => {
  const codeDef = CPP_ALGORITHM_CODES[algorithm];
  const activeLine = currentStep?.cppLine;
  const lineContainerRef = useRef<HTMLDivElement | null>(null);
  const [copied, setCopied] = React.useState(false);

  // Auto-scroll to active line if needed
  useEffect(() => {
    if (activeLine && lineContainerRef.current) {
      const lineEl = lineContainerRef.current.querySelector(`[data-line="${activeLine}"]`);
      if (lineEl) {
        lineEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    }
  }, [activeLine]);

  const handleCopyCode = () => {
    navigator.clipboard.writeText(codeDef.lines.join('\n'));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-col h-full bg-[#fcfcfb] rounded-xl border border-stone-200/90 overflow-hidden shadow-xs">
      {/* Console Header */}
      <div className="flex items-center justify-between px-3.5 py-2.5 bg-stone-100/70 border-b border-stone-200/80">
        <div className="flex items-center gap-2">
          <Terminal className="w-3.5 h-3.5 text-stone-600" />
          <span className="text-xs font-bold text-stone-800 tracking-tight">
            C++ Execution Tracer
          </span>
          <span className="text-[10px] px-1.5 py-0.5 rounded font-mono bg-stone-200 text-stone-700 font-medium">
            C++20
          </span>
        </div>

        <div className="flex items-center gap-2">
          {activeLine && (
            <span className="text-[11px] font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 font-semibold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Line {activeLine}
            </span>
          )}
          <button
            onClick={handleCopyCode}
            className="p-1 rounded text-stone-400 hover:text-stone-700 hover:bg-stone-200/60 transition-colors"
            title="Copy C++ Source Code"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Code Viewer */}
      <div
        ref={lineContainerRef}
        className="flex-1 overflow-y-auto overflow-x-auto p-2 font-mono text-xs leading-relaxed"
      >
        {codeDef.lines.map((line, idx) => {
          const lineNumber = idx + 1;
          const isActive = lineNumber === activeLine;

          return (
            <div
              key={lineNumber}
              data-line={lineNumber}
              className={`flex items-start rounded px-1.5 py-0.5 transition-colors duration-150 ${
                isActive
                  ? 'bg-amber-100/80 border-l-3 border-amber-600 font-medium'
                  : 'hover:bg-stone-100/60'
              }`}
            >
              {/* Active Indicator & Line Number */}
              <div className="w-10 flex items-center justify-between pr-2 text-stone-400 select-none text-[11px] shrink-0">
                <span className="w-3 text-amber-700 font-bold">
                  {isActive && '▶'}
                </span>
                <span>{lineNumber}</span>
              </div>

              {/* Code Line Content */}
              <div className="flex-1 whitespace-pre pl-1">
                {highlightCppLine(line)}
              </div>
            </div>
          );
        })}
      </div>

      {/* Variables Inspector Footer */}
      {currentStep?.variables && Object.keys(currentStep.variables).length > 0 && (
        <div className="px-3 py-2 bg-stone-50 border-t border-stone-200 text-xs font-mono">
          <div className="text-[10px] uppercase font-bold text-stone-500 mb-1 tracking-wider">
            Scope Variables:
          </div>
          <div className="flex flex-wrap gap-1.5">
            {Object.entries(currentStep.variables).map(([k, v]) => (
              <span
                key={k}
                className="px-2 py-0.5 rounded bg-white border border-stone-200 text-stone-800 text-[11px] font-semibold"
              >
                <span className="text-stone-500">{k}:</span> {String(v)}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
