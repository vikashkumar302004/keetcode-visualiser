import React from 'react';
import { ArrowRight, HelpCircle, GitCommit, ChevronDown, Check } from 'lucide-react';
import { TokenItem, PrecedenceComparison } from '../types';

interface ExpressionCanvasProps {
  tokens: TokenItem[];
  outputString?: string;
  precedenceCompare?: PrecedenceComparison;
  inputCursor: number;
}

export const ExpressionCanvas: React.FC<ExpressionCanvasProps> = ({
  tokens = [],
  outputString = '',
  precedenceCompare,
  inputCursor
}) => {
  const getTokenTypeStyles = (type: TokenItem['type'], isActive: boolean) => {
    if (isActive) {
      return 'bg-amber-500 text-amber-950 border-amber-400 ring-2 ring-amber-500/20 font-extrabold scale-110';
    }
    switch (type) {
      case 'operand':
        return 'bg-indigo-50 text-indigo-800 border-indigo-100 font-bold';
      case 'operator':
        return 'bg-amber-50 text-amber-800 border-amber-100 font-bold';
      case 'parenthesis':
        return 'bg-slate-50 text-slate-800 border-slate-200/70 font-semibold';
      default:
        return 'bg-slate-50 text-slate-500 border-slate-100';
    }
  };

  return (
    <div className="w-full flex flex-col gap-4 select-none h-full justify-center">
      {/* 1. Token Stream Ribbon */}
      <div className="flex flex-col gap-1.5 shrink-0">
        <span className="font-sans text-[11px] font-bold text-slate-500 uppercase tracking-wider">
          Token Stream Ribbon
        </span>
        <div className="w-full h-12 bg-white border border-slate-200 rounded-lg p-2 flex items-center gap-1.5 overflow-x-auto shadow-inner">
          {tokens.length === 0 ? (
            <span className="text-xs text-slate-400 italic">No expression loaded</span>
          ) : (
            tokens.map((token, idx) => {
              const isActive = idx === inputCursor;
              const isScanned = idx < inputCursor;
              return (
                <div key={idx} className="flex items-center shrink-0">
                  <div
                    className={`h-8 min-w-[32px] px-2 rounded-md flex items-center justify-center border font-mono text-xs transition-all duration-200 ${getTokenTypeStyles(
                      token.type,
                      isActive
                    )} ${isScanned ? 'opacity-40 line-through decoration-slate-300' : ''}`}
                  >
                    {token.value}
                  </div>
                  {idx < tokens.length - 1 && (
                    <ArrowRight className="w-3 h-3 text-slate-300 mx-0.5 shrink-0" />
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* 2. Middle Row: Precedence Matrix & Live Visualizer Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1 min-h-0">
        {/* Precedence comparison matrix */}
        <div className="bg-white border border-slate-200/80 rounded-lg p-3 flex flex-col justify-between shadow-xs">
          <div className="flex items-center gap-1.5 mb-2 border-b border-slate-100 pb-1.5 shrink-0">
            <HelpCircle className="w-4 h-4 text-amber-600" />
            <span className="font-sans text-xs font-bold text-slate-800">
              Operator Precedence Matrix
            </span>
          </div>

          {precedenceCompare ? (
            <div className="flex-1 flex flex-col justify-center text-xs font-sans gap-2">
              <div className="flex items-center justify-between bg-slate-50 p-2 rounded border border-slate-200/50">
                <div className="text-center">
                  <p className="text-[10px] text-slate-400 font-mono">Incoming Op</p>
                  <p className="font-mono text-base font-bold text-indigo-700">
                    {precedenceCompare.op1}
                  </p>
                  <p className="text-[10px] text-indigo-600">Precedence: {precedenceCompare.prec1}</p>
                </div>

                <div className="flex flex-col items-center gap-1">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider bg-amber-100 text-amber-800">
                    {precedenceCompare.result}
                  </span>
                  <span className="text-[14px] text-slate-400">VS</span>
                </div>

                <div className="text-center">
                  <p className="text-[10px] text-slate-400 font-mono">Stack Top Op</p>
                  <p className="font-mono text-base font-bold text-amber-700">
                    {precedenceCompare.op2}
                  </p>
                  <p className="text-[10px] text-amber-600">Precedence: {precedenceCompare.prec2}</p>
                </div>
              </div>

              <div className="text-[11px] leading-relaxed text-slate-600 italic border-l-2 border-amber-500 pl-2">
                {precedenceCompare.reason}
              </div>
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-slate-400 font-sans text-xs italic gap-1">
              <GitCommit className="w-5 h-5 text-slate-300" />
              <span>No operator comparison active</span>
            </div>
          )}
        </div>

        {/* Associativity & Shunting-Yard Guide */}
        <div className="bg-amber-50/20 border border-amber-200/60 rounded-lg p-3 flex flex-col shadow-xs">
          <span className="font-sans text-xs font-bold text-amber-800 mb-1">
            Dijkstra's Shunting-Yard Guide
          </span>
          <ul className="text-[11px] text-slate-600 space-y-1 font-sans leading-snug">
            <li className="flex items-start gap-1">
              <span className="text-amber-600 font-bold">•</span>
              <span>
                <strong>Operands</strong> (a, b, c...) bypass the stack directly to the Output string.
              </span>
            </li>
            <li className="flex items-start gap-1">
              <span className="text-amber-600 font-bold">•</span>
              <span>
                <strong>Operators</strong> pop the stack as long as the stack top operator has higher or equal precedence.
              </span>
            </li>
            <li className="flex items-start gap-1">
              <span className="text-amber-600 font-bold">•</span>
              <span>
                <strong>Parentheses</strong> enforce bounds. "(" is pushed unconditionally, while ")" pops elements until "(" matches.
              </span>
            </li>
          </ul>
        </div>
      </div>

      {/* 3. Result Output Ribbon */}
      <div className="flex flex-col gap-1.5 shrink-0">
        <span className="font-sans text-[11px] font-bold text-slate-500 uppercase tracking-wider">
          Expression Output Ribbon
        </span>
        <div className="w-full h-11 bg-slate-900 border border-slate-955 rounded-lg p-2.5 flex items-center justify-between shadow-md">
          <div className="flex items-center gap-2 overflow-x-auto">
            <span className="font-mono text-slate-400 text-xs select-none">RESULT:</span>
            <span className="font-mono text-sm font-bold text-emerald-400 tracking-wider">
              {outputString || 'empty'}
            </span>
          </div>

          <div className="flex items-center gap-1.5 text-[10px] font-sans font-semibold text-emerald-500/80 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
            <Check className="w-3.5 h-3.5" />
            <span>Synchronized</span>
          </div>
        </div>
      </div>
    </div>
  );
};
