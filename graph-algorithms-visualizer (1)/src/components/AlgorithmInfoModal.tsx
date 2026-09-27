import React from 'react';
import { AlgorithmMetadata } from '../types';
import { X, CheckCircle2, Clock, HardDrive, Info } from 'lucide-react';

interface AlgorithmInfoModalProps {
  metadata: AlgorithmMetadata;
  isOpen: boolean;
  onClose: () => void;
}

export const AlgorithmInfoModal: React.FC<AlgorithmInfoModalProps> = ({
  metadata,
  isOpen,
  onClose
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/40 backdrop-blur-xs">
      <div className="bg-white rounded-2xl border border-stone-200 shadow-xl max-w-xl w-full overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-stone-200 bg-stone-50">
          <div>
            <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider">
              {metadata.category}
            </span>
            <h2 className="text-base font-bold text-stone-900">{metadata.name}</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 space-y-5 text-sm">
          {/* Complexity Cards */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 bg-stone-50 rounded-xl border border-stone-200">
              <div className="flex items-center gap-1.5 text-stone-500 text-xs font-semibold mb-1">
                <Clock className="w-3.5 h-3.5" />
                Time Complexity
              </div>
              <div className="text-base font-bold font-mono text-stone-900">
                {metadata.timeComplexity}
              </div>
            </div>

            <div className="p-3 bg-stone-50 rounded-xl border border-stone-200">
              <div className="flex items-center gap-1.5 text-stone-500 text-xs font-semibold mb-1">
                <HardDrive className="w-3.5 h-3.5" />
                Space Complexity
              </div>
              <div className="text-base font-bold font-mono text-stone-900">
                {metadata.spaceComplexity}
              </div>
            </div>
          </div>

          {/* Description */}
          <div>
            <h3 className="text-xs font-bold text-stone-500 uppercase tracking-wider mb-1.5">
              How It Works
            </h3>
            <p className="text-stone-700 leading-relaxed text-xs sm:text-sm">
              {metadata.description}
            </p>
          </div>

          {/* Best For / Use Cases */}
          <div>
            <h3 className="text-xs font-bold text-stone-500 uppercase tracking-wider mb-1.5">
              Ideal Applications & Use Cases
            </h3>
            <p className="text-stone-700 leading-relaxed text-xs sm:text-sm">
              {metadata.bestFor}
            </p>
          </div>

          {/* Feature Matrix */}
          <div className="pt-2 border-t border-stone-100 flex flex-wrap gap-4 text-xs">
            <div className="flex items-center gap-1.5">
              <CheckCircle2
                className={`w-4 h-4 ${
                  metadata.supportsDirected ? 'text-emerald-600' : 'text-stone-300'
                }`}
              />
              <span className="text-stone-700 font-medium">
                {metadata.supportsDirected ? 'Supports Directed Graphs' : 'Undirected Graphs Only'}
              </span>
            </div>

            <div className="flex items-center gap-1.5">
              <CheckCircle2
                className={`w-4 h-4 ${
                  metadata.requiresWeights ? 'text-emerald-600' : 'text-stone-400'
                }`}
              />
              <span className="text-stone-700 font-medium">
                {metadata.requiresWeights ? 'Weighted Edges Essential' : 'Unweighted / Uniform Weights'}
              </span>
            </div>

            <div className="flex items-center gap-1.5">
              <CheckCircle2
                className={`w-4 h-4 ${
                  metadata.supportsNegativeWeights ? 'text-emerald-600' : 'text-stone-300'
                }`}
              />
              <span className="text-stone-700 font-medium">
                {metadata.supportsNegativeWeights
                  ? 'Negative Weights & Cycle Detection'
                  : 'Requires Non-Negative Weights'}
              </span>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 bg-stone-50 border-t border-stone-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-semibold bg-stone-900 text-white rounded-lg hover:bg-stone-800 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
