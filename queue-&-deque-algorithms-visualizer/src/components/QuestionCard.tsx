import React, { useState, useEffect } from 'react';
import { HelpCircle, ChevronDown, ChevronUp, Play, RefreshCw, Info } from 'lucide-react';
import { QueueProblem } from '../types';

interface QuestionCardProps {
  problem: QueueProblem;
  inputs: Record<string, any>;
  onInputsChange: (newInputs: Record<string, any>) => void;
  onSimulate: () => void;
  onResetCase: () => void;
}

export const QuestionCard: React.FC<QuestionCardProps> = ({
  problem,
  inputs,
  onInputsChange,
  onSimulate,
  onResetCase,
}) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [localInputs, setLocalInputs] = useState<Record<string, any>>(inputs);

  // Sync local inputs when problem or outer inputs change
  useEffect(() => {
    setLocalInputs(inputs);
  }, [inputs, problem.id]);

  const handleInputChange = (key: string, value: any) => {
    setLocalInputs((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleSimulateClick = (e: React.FormEvent) => {
    e.preventDefault();
    onInputsChange(localInputs);
    // Give state a brief tick to commit
    setTimeout(() => {
      onSimulate();
    }, 50);
  };

  const difficultyColors = {
    Easy: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    Medium: 'bg-amber-100 text-amber-800 border-amber-200',
    Hard: 'bg-rose-100 text-rose-800 border-rose-200',
  };

  // Helper to render active inputs based on ID
  const renderDynamicInputs = () => {
    switch (problem.id) {
      case '01':
      case '02':
      case '03':
        return (
          <div className="flex flex-wrap items-center gap-3 w-full">
            <div className="flex-1 min-w-[280px]">
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                Sequence of Operations (Comma-Separated)
              </label>
              <input
                type="text"
                value={localInputs.operations || ''}
                onChange={(e) => handleInputChange('operations', e.target.value)}
                className="w-full text-xs px-2.5 py-1.5 rounded border border-slate-200 focus:outline-none focus:ring-1 focus:ring-amber-500 font-mono bg-white"
                placeholder="Enqueue(10), Dequeue(), Peek()"
              />
            </div>
          </div>
        );
      case '04':
      case '05':
        return (
          <div className="flex flex-wrap items-center gap-3 w-full">
            <div className="flex-1 min-w-[280px]">
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                Stack / Queue Operations (Comma-Separated)
              </label>
              <input
                type="text"
                value={localInputs.operations || ''}
                onChange={(e) => handleInputChange('operations', e.target.value)}
                className="w-full text-xs px-2.5 py-1.5 rounded border border-slate-200 focus:outline-none focus:ring-1 focus:ring-amber-500 font-mono bg-white"
                placeholder="Push(10), Push(20), Pop(), Top()"
              />
            </div>
          </div>
        );
      case '06':
        return (
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex-1 min-w-[200px]">
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                Input Array (Comma-Separated Numbers)
              </label>
              <input
                type="text"
                value={localInputs.array || ''}
                onChange={(e) => handleInputChange('array', e.target.value)}
                className="w-full text-xs px-2.5 py-1.5 rounded border border-slate-200 focus:outline-none focus:ring-1 focus:ring-amber-500 font-mono bg-white"
              />
            </div>
            <div className="w-24">
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                Window Size k
              </label>
              <input
                type="number"
                min="1"
                max="8"
                value={localInputs.k || 3}
                onChange={(e) => handleInputChange('k', parseInt(e.target.value, 10) || 3)}
                className="w-full text-xs px-2.5 py-1.5 rounded border border-slate-200 focus:outline-none focus:ring-1 focus:ring-amber-500 font-mono bg-white"
              />
            </div>
          </div>
        );
      case '07':
        return (
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex-1 min-w-[200px]">
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                Input Array (Comma-Separated)
              </label>
              <input
                type="text"
                value={localInputs.array || ''}
                onChange={(e) => handleInputChange('array', e.target.value)}
                className="w-full text-xs px-2.5 py-1.5 rounded border border-slate-200 focus:outline-none focus:ring-1 focus:ring-amber-500 font-mono bg-white"
              />
            </div>
            <div className="w-24">
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                Abs Diff Limit
              </label>
              <input
                type="number"
                min="0"
                max="50"
                value={localInputs.limit || 4}
                onChange={(e) => handleInputChange('limit', parseInt(e.target.value, 10) || 4)}
                className="w-full text-xs px-2.5 py-1.5 rounded border border-slate-200 focus:outline-none focus:ring-1 focus:ring-amber-500 font-mono bg-white"
              />
            </div>
          </div>
        );
      case '08':
        return (
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex-1 min-w-[200px]">
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                Input Array (supports +/-)
              </label>
              <input
                type="text"
                value={localInputs.array || ''}
                onChange={(e) => handleInputChange('array', e.target.value)}
                className="w-full text-xs px-2.5 py-1.5 rounded border border-slate-200 focus:outline-none focus:ring-1 focus:ring-amber-500 font-mono bg-white"
              />
            </div>
            <div className="w-24">
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                Target Sum K
              </label>
              <input
                type="number"
                value={localInputs.k || 3}
                onChange={(e) => handleInputChange('k', parseInt(e.target.value, 10) || 3)}
                className="w-full text-xs px-2.5 py-1.5 rounded border border-slate-200 focus:outline-none focus:ring-1 focus:ring-amber-500 font-mono bg-white"
              />
            </div>
          </div>
        );
      case '09':
        return (
          <div className="flex flex-wrap items-center gap-3 w-full">
            <div className="flex-1 min-w-[280px]">
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                Character Stream Input (Comma-Separated Letters)
              </label>
              <input
                type="text"
                value={localInputs.stream || ''}
                onChange={(e) => handleInputChange('stream', e.target.value)}
                className="w-full text-xs px-2.5 py-1.5 rounded border border-slate-200 focus:outline-none focus:ring-1 focus:ring-amber-500 font-mono bg-white"
                placeholder="a,a,b,c,b,d"
              />
            </div>
          </div>
        );
      case '10':
        return (
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex-1 min-w-[200px]">
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                Stream Array (Comma-Separated Numbers)
              </label>
              <input
                type="text"
                value={localInputs.array || ''}
                onChange={(e) => handleInputChange('array', e.target.value)}
                className="w-full text-xs px-2.5 py-1.5 rounded border border-slate-200 focus:outline-none focus:ring-1 focus:ring-amber-500 font-mono bg-white"
              />
            </div>
            <div className="w-24">
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                Window Size
              </label>
              <input
                type="number"
                min="1"
                max="10"
                value={localInputs.size || 3}
                onChange={(e) => handleInputChange('size', parseInt(e.target.value, 10) || 3)}
                className="w-full text-xs px-2.5 py-1.5 rounded border border-slate-200 focus:outline-none focus:ring-1 focus:ring-amber-500 font-mono bg-white"
              />
            </div>
          </div>
        );
      case '11':
        return (
          <div className="flex flex-wrap items-center gap-3 w-full">
            <div className="flex-1 min-w-[280px]">
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                Deck Cards (Comma-Separated integers)
              </label>
              <input
                type="text"
                value={localInputs.array || ''}
                onChange={(e) => handleInputChange('array', e.target.value)}
                className="w-full text-xs px-2.5 py-1.5 rounded border border-slate-200 focus:outline-none focus:ring-1 focus:ring-amber-500 font-mono bg-white"
              />
            </div>
          </div>
        );
      case '12':
        return (
          <div className="flex flex-wrap items-center gap-3 w-full">
            <div className="flex-1 min-w-[280px]">
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                Orange Grid Layout (rows separated by semicolon, cells by comma)
              </label>
              <input
                type="text"
                value={localInputs.grid || ''}
                onChange={(e) => handleInputChange('grid', e.target.value)}
                className="w-full text-xs px-2.5 py-1.5 rounded border border-slate-200 focus:outline-none focus:ring-1 focus:ring-amber-500 font-mono bg-white"
                placeholder="2,1,1;1,1,0;0,1,1"
              />
              <span className="text-[10px] text-slate-400 block mt-1">2 = Rotten Orange, 1 = Fresh, 0 = Empty</span>
            </div>
          </div>
        );
      case '13':
        return (
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex-1 min-w-[150px]">
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                Gas Available at Station i
              </label>
              <input
                type="text"
                value={localInputs.gas || ''}
                onChange={(e) => handleInputChange('gas', e.target.value)}
                className="w-full text-xs px-2.5 py-1.5 rounded border border-slate-200 focus:outline-none focus:ring-1 focus:ring-amber-500 font-mono bg-white"
              />
            </div>
            <div className="flex-1 min-w-[150px]">
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                Cost to reach Station i+1
              </label>
              <input
                type="text"
                value={localInputs.cost || ''}
                onChange={(e) => handleInputChange('cost', e.target.value)}
                className="w-full text-xs px-2.5 py-1.5 rounded border border-slate-200 focus:outline-none focus:ring-1 focus:ring-amber-500 font-mono bg-white"
              />
            </div>
          </div>
        );
      case '14':
        return (
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex-1 min-w-[200px]">
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                Task Stream (Comma-Separated chars)
              </label>
              <input
                type="text"
                value={localInputs.tasks || ''}
                onChange={(e) => handleInputChange('tasks', e.target.value)}
                className="w-full text-xs px-2.5 py-1.5 rounded border border-slate-200 focus:outline-none focus:ring-1 focus:ring-amber-500 font-mono bg-white"
              />
            </div>
            <div className="w-24">
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                Cooldown n
              </label>
              <input
                type="number"
                min="0"
                max="6"
                value={localInputs.n ?? 2}
                onChange={(e) => handleInputChange('n', parseInt(e.target.value, 10) ?? 2)}
                className="w-full text-xs px-2.5 py-1.5 rounded border border-slate-200 focus:outline-none focus:ring-1 focus:ring-amber-500 font-mono bg-white"
              />
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-3 shadow-xs font-sans">
      {/* Title block */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1">
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <span className="text-[10px] font-extrabold px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 font-mono border border-slate-200">
              SEQ #{String(problem.sequenceNum).padStart(2, '0')}
            </span>
            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-800 text-amber-400 font-mono">
              {problem.leetcodeTag}
            </span>
            <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded border ${difficultyColors[problem.difficulty]}`}>
              {problem.difficulty}
            </span>
          </div>
          <h2 className="text-xl font-bold font-serif text-slate-900 leading-tight">
            {problem.title}
          </h2>
        </div>

        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center gap-1 text-[11px] font-medium text-slate-500 hover:text-slate-800 bg-slate-50 hover:bg-slate-100 px-2.5 py-1.5 rounded-lg border border-slate-200 transition select-none cursor-pointer"
        >
          <span>Problem Details</span>
          {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>
      </div>

      {/* Collapsible problem details */}
      {isExpanded && (
        <div className="mt-2.5 pt-2.5 border-t border-slate-100 text-xs text-slate-600 space-y-2 leading-relaxed animate-fadeIn">
          <p>{problem.description}</p>
          <div className="p-2 bg-amber-50/70 border border-amber-100 rounded-lg flex gap-2">
            <HelpCircle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
            <div>
              <strong className="text-amber-900 font-semibold block text-[11px] uppercase tracking-wider">Key Algorithmic Insight:</strong>
              <span className="text-amber-800">{problem.keyInsight}</span>
            </div>
          </div>
        </div>
      )}

      {/* Dynamic input form */}
      <form onSubmit={handleSimulateClick} className="mt-3 pt-3 border-t border-slate-100 flex flex-col md:flex-row items-end gap-3.5 justify-between">
        {/* Active inputs */}
        <div className="flex-1 w-full">
          {renderDynamicInputs()}
        </div>

        {/* Form controls */}
        <div className="flex items-center gap-2 shrink-0 w-full md:w-auto justify-end">
          <button
            type="button"
            onClick={onResetCase}
            className="flex items-center gap-1 text-xs px-3 py-2 bg-slate-50 text-slate-600 rounded-lg hover:bg-slate-100 border border-slate-200 font-medium transition cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5 text-slate-400" />
            <span>Reset Case</span>
          </button>

          <button
            type="submit"
            className="flex items-center gap-1.5 text-xs px-4 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-semibold rounded-lg shadow-sm hover:shadow-md transition cursor-pointer border border-amber-600/20"
          >
            <Play className="fill-current w-3.5 h-3.5 text-slate-950" />
            <span>Simulate</span>
          </button>
        </div>
      </form>
    </div>
  );
};
