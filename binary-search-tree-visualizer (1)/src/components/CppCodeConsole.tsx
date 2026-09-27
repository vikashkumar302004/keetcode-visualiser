import React, { useEffect, useRef, useState } from 'react';
import { Code2, Copy, Check, Terminal, Sparkles } from 'lucide-react';

interface CppCodeConsoleProps {
  cppCode: string;
  activeLine: number;
  algorithmTitle: string;
  activeLineDesc?: string;
}

export const CppCodeConsole: React.FC<CppCodeConsoleProps> = ({
  cppCode,
  activeLine,
  algorithmTitle,
  activeLineDesc,
}) => {
  const [copied, setCopied] = useState<boolean>(false);
  const activeLineRef = useRef<HTMLTableRowElement>(null);
  const consoleContainerRef = useRef<HTMLDivElement>(null);

  // Auto-scroll active line into view smoothly
  useEffect(() => {
    if (activeLineRef.current && consoleContainerRef.current) {
      activeLineRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
      });
    }
  }, [activeLine]);

  const handleCopy = () => {
    navigator.clipboard.writeText(cppCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const lines = cppCode.split('\n');

  // Lightweight robust C++ syntax highlighter
  const highlightCpp = (lineText: string) => {
    // Check if line is a comment
    const trimmed = lineText.trim();
    if (trimmed.startsWith('//')) {
      return <span className="text-slate-400 italic">{lineText}</span>;
    }

    // Split by token boundaries while preserving delimiters
    const tokens = lineText.split(/(\b(?:TreeNode|nullptr|int|bool|void|const|vector|delete|new|return|if|else|while|long|minVal|maxVal|low|high|key|val|root|left|right|mid|suc|pre|succ|temp)\b|[()\-+><=;,*{}.&])/g);

    return tokens.map((token, i) => {
      if (!token) return null;
      if (['TreeNode', 'int', 'bool', 'void', 'long', 'vector'].includes(token)) {
        return <span key={i} className="text-blue-600 font-semibold">{token}</span>;
      }
      if (['nullptr', 'true', 'false'].includes(token)) {
        return <span key={i} className="text-purple-600 font-semibold">{token}</span>;
      }
      if (['if', 'else', 'return', 'while', 'new', 'delete', 'const'].includes(token)) {
        return <span key={i} className="text-rose-600 font-medium">{token}</span>;
      }
      if (['root', 'left', 'right', 'succ', 'temp', 'pre', 'suc'].includes(token)) {
        return <span key={i} className="text-indigo-600">{token}</span>;
      }
      if (/^\d+$/.test(token)) {
        return <span key={i} className="text-amber-700">{token}</span>;
      }
      if (['->', '*', '&'].includes(token)) {
        return <span key={i} className="text-amber-600 font-bold">{token}</span>;
      }
      return <span key={i} className="text-slate-800">{token}</span>;
    });
  };

  return (
    <div className="flex flex-col h-[460px] lg:h-[540px] bg-[#FFFFFF] border border-slate-200 rounded-2xl shadow-xs overflow-hidden">
      {/* Console Header */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-slate-50 border-b border-slate-200 shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-slate-300" />
          <div className="w-2.5 h-2.5 rounded-full bg-slate-300" />
          <div className="w-2.5 h-2.5 rounded-full bg-slate-300" />
          <span className="text-xs font-mono font-medium text-slate-600 ml-1.5 flex items-center gap-1.5">
            <Terminal className="w-3.5 h-3.5 text-slate-500" />
            <span>bst_trace.cpp</span>
            <span className="text-[10px] bg-slate-200/80 text-slate-600 px-1.5 py-0.2 rounded font-mono">
              C++17
            </span>
          </span>
        </div>

        <button
          onClick={handleCopy}
          title="Copy C++ Code"
          className="flex items-center gap-1 text-[11px] font-medium text-slate-600 hover:text-slate-900 bg-white border border-slate-200 hover:border-slate-300 rounded-md px-2 py-1 transition-colors cursor-pointer"
        >
          {copied ? (
            <>
              <Check className="w-3 h-3 text-emerald-600" />
              <span className="text-emerald-700">Copied</span>
            </>
          ) : (
            <>
              <Copy className="w-3 h-3" />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>

      {/* Active Line Explanation Pill */}
      {activeLineDesc && (
        <div className="bg-amber-50/80 border-b border-amber-200/60 px-3.5 py-1.5 text-xs text-amber-900 flex items-start gap-2 shrink-0">
          <Sparkles className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
          <div className="leading-snug">
            <span className="font-semibold font-mono text-[11px] text-amber-800 mr-1.5">
              Line {activeLine}:
            </span>
            <span className="font-sans text-[11px]">{activeLineDesc}</span>
          </div>
        </div>
      )}

      {/* Code Viewer with Line Numbers */}
      <div
        ref={consoleContainerRef}
        className="flex-1 overflow-y-auto overflow-x-auto p-3 font-mono text-xs leading-6 select-text"
      >
        <table className="w-full border-collapse">
          <tbody>
            {lines.map((lineText, idx) => {
              const lineNum = idx + 1;
              const isCurrent = lineNum === activeLine;

              return (
                <tr
                  key={lineNum}
                  ref={isCurrent ? activeLineRef : null}
                  className={`transition-colors duration-150 ${
                    isCurrent
                      ? 'bg-amber-100/70 font-medium'
                      : 'hover:bg-slate-50/80'
                  }`}
                >
                  {/* Line Number & Indicator */}
                  <td className="w-10 pr-2 select-none text-right align-top py-0.5">
                    <div className="flex items-center justify-end gap-1">
                      {isCurrent ? (
                        <span className="text-amber-600 font-bold text-[10px] animate-pulse">
                          ▶
                        </span>
                      ) : (
                        <span className="w-2" />
                      )}
                      <span
                        className={`text-[11px] ${
                          isCurrent ? 'text-amber-900 font-semibold' : 'text-slate-400'
                        }`}
                      >
                        {lineNum}
                      </span>
                    </div>
                  </td>

                  {/* Code Line Text */}
                  <td className="pl-3 pr-4 whitespace-pre font-mono py-0.5 align-top">
                    {highlightCpp(lineText)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Footer Info */}
      <div className="px-3.5 py-2 bg-slate-50 border-t border-slate-200 text-[11px] text-slate-500 flex items-center justify-between shrink-0 font-sans">
        <span>Active Procedure: <strong className="text-slate-700 font-mono">{algorithmTitle}</strong></span>
        <span>Line {activeLine} of {lines.length}</span>
      </div>
    </div>
  );
};
