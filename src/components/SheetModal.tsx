import React from 'react';
import { X, ExternalLink, Sparkles, BookOpen, CheckCircle } from 'lucide-react';

interface SheetModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SheetModal: React.FC<SheetModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-lg animate-fade-rise font-sans">
      <div className="relative w-full max-w-2xl liquid-glass rounded-3xl border border-white/20 p-8 shadow-2xl">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-9 h-9 rounded-full liquid-glass flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-2xl liquid-glass border border-white/15 flex items-center justify-center text-emerald-400">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] uppercase font-mono bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full border border-emerald-500/30">
                Official DSA Sheet
              </span>
            </div>
            <h2 
              className="text-3xl text-white font-semibold mt-1"
              style={{ fontFamily: "'Playfair Display', serif", letterSpacing: '-0.02em' }}
            >
              Keetcode® Master DSA Sheet
            </h2>
          </div>
        </div>

        {/* Body Description */}
        <p className="text-sm text-gray-300 leading-relaxed mb-6 font-sans">
          Access the complete curated Data Structures and Algorithms problem set with interactive code visualizers and solution guides hosted on Vercel.
        </p>

        {/* Card for Vercel Link */}
        <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-5 mb-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-gray-400 mb-1">
              <Sparkles className="w-3.5 h-3.5 text-blue-400" />
              <span>Live Application Target</span>
            </div>
            <a 
              href="https://keetcode-eight.vercel.app/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-base text-blue-300 hover:text-white font-mono underline break-all"
            >
              https://keetcode-eight.vercel.app/
            </a>
          </div>

          <a
            href="https://keetcode-eight.vercel.app/"
            target="_blank"
            rel="noopener noreferrer"
            className="liquid-glass rounded-full px-6 py-3 text-xs text-white font-semibold flex items-center gap-2 hover:scale-105 transition-transform shrink-0"
          >
            <span>Open Sheet App</span>
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>

        {/* Topic Highlights */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
          {['Arrays & Matrices', 'Trees & BST', 'Graph Pathfinding', 'Dynamic Programming', 'Sliding Window', 'Recursion & Backtracking'].map((topic, idx) => (
            <div key={idx} className="flex items-center gap-2 text-xs text-gray-300 bg-white/5 px-3 py-2 rounded-xl border border-white/5">
              <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>{topic}</span>
            </div>
          ))}
        </div>

        {/* Footer Actions */}
        <div className="pt-4 border-t border-white/10 flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="px-6 py-2.5 text-xs text-gray-300 hover:text-white font-medium"
          >
            Close
          </button>
          <a
            href="https://keetcode-eight.vercel.app/"
            target="_blank"
            rel="noopener noreferrer"
            className="liquid-glass rounded-full px-6 py-2.5 text-xs text-white font-semibold flex items-center gap-2"
          >
            <span>Visit keetcode-eight.vercel.app</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </div>
  );
};
