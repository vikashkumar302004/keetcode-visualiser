import React, { useState } from 'react';
import { X, Check, AlertCircle, RefreshCw } from 'lucide-react';
import { ProblemDefinition, TestCasePreset } from '../types';

interface CustomInputModalProps {
  isOpen: boolean;
  onClose: () => void;
  problem: ProblemDefinition;
  currentInput: string;
  currentK: number;
  currentTarget: string;
  onApply: (input: string, k: number, target: string) => void;
}

export const CustomInputModal: React.FC<CustomInputModalProps> = ({
  isOpen,
  onClose,
  problem,
  currentInput,
  currentK,
  currentTarget,
  onApply
}) => {
  const [inputVal, setInputVal] = useState(currentInput);
  const [paramK, setParamK] = useState(currentK);
  const [paramTarget, setParamTarget] = useState(currentTarget);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handlePresetClick = (preset: TestCasePreset) => {
    setInputVal(preset.input);
    if (preset.paramK !== undefined) setParamK(preset.paramK);
    if (preset.paramTarget !== undefined) setParamTarget(preset.paramTarget);
    setError(null);
  };

  const handleSave = () => {
    // Validation
    if (!inputVal.trim()) {
      setError('Input cannot be empty.');
      return;
    }

    if (problem.inputType === 'array') {
      const numbers = inputVal.split(/[\s,]+/).map(s => s.trim()).filter(Boolean);
      const invalid = numbers.some(n => isNaN(Number(n)));
      if (invalid) {
        setError('Please enter valid comma-separated or space-separated numbers.');
        return;
      }
      if (numbers.length === 0) {
        setError('Array must contain at least one element.');
        return;
      }
    }

    onApply(inputVal, paramK, paramTarget);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4">
      <div className="bg-white rounded-lg border border-slate-200 shadow-xl max-w-lg w-full p-5 space-y-4">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h3 className="font-serif font-bold text-lg text-slate-900">
              Customize Test Case
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Configure input array or string and window parameters for #{problem.seq} {problem.title}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Presets shortcut */}
        {problem.presets.length > 0 && (
          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1.5">
              Available Presets:
            </label>
            <div className="flex flex-wrap gap-1.5">
              {problem.presets.map((p, idx) => (
                <button
                  key={idx}
                  onClick={() => handlePresetClick(p)}
                  className="px-2.5 py-1 text-xs font-mono rounded-md border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 transition-colors"
                >
                  {p.name}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input Field */}
        <div>
          <label className="text-xs font-semibold text-slate-700 block mb-1">
            {problem.inputType === 'array' ? 'Array Elements (numbers, comma/space separated)' : 'Input String s'}
          </label>
          <textarea
            value={inputVal}
            onChange={(e) => {
              setInputVal(e.target.value);
              setError(null);
            }}
            rows={2}
            className="w-full font-mono text-xs p-2.5 rounded-md border border-slate-200 bg-slate-50 focus:bg-white focus:border-amber-400 focus:outline-hidden"
            placeholder={problem.inputType === 'array' ? 'e.g. 2, 1, 5, 1, 3, 2' : 'e.g. ADOBECODEBANC'}
          />
        </div>

        {/* Parameter K */}
        {problem.paramLabel && (
          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1">
              {problem.paramLabel}
            </label>
            <input
              type="number"
              value={paramK}
              onChange={(e) => setParamK(Math.max(1, Number(e.target.value) || 1))}
              min={1}
              className="w-full font-mono text-xs p-2 rounded-md border border-slate-200 bg-slate-50 focus:bg-white focus:border-amber-400 focus:outline-hidden"
            />
          </div>
        )}

        {/* Parameter Target */}
        {problem.paramTargetLabel && (
          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1">
              {problem.paramTargetLabel}
            </label>
            <input
              type="text"
              value={paramTarget}
              onChange={(e) => setParamTarget(e.target.value)}
              className="w-full font-mono text-xs p-2 rounded-md border border-slate-200 bg-slate-50 focus:bg-white focus:border-amber-400 focus:outline-hidden"
            />
          </div>
        )}

        {/* Error message if any */}
        {error && (
          <div className="flex items-center space-x-1.5 text-xs text-rose-700 bg-rose-50 border border-rose-200 p-2 rounded-md">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Footer Actions */}
        <div className="flex items-center justify-end space-x-2 pt-2 border-t border-slate-100">
          <button
            onClick={onClose}
            className="px-3 py-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 border border-slate-200 rounded-md hover:bg-slate-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-1.5 text-xs font-semibold text-white bg-amber-500 hover:bg-amber-600 rounded-md shadow-2xs transition-colors flex items-center space-x-1"
          >
            <Check className="w-3.5 h-3.5" />
            <span>Apply &amp; Simulate</span>
          </button>
        </div>
      </div>
    </div>
  );
};
