import React from 'react';
import { X, Sparkles, Code2, Cpu, GraduationCap, Linkedin, ShieldCheck, Heart, Terminal } from 'lucide-react';

interface AboutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenContact: () => void;
}

export const AboutModal: React.FC<AboutModalProps> = ({ isOpen, onClose, onOpenContact }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-lg animate-fade-rise font-sans">
      <div className="relative w-full max-w-3xl liquid-glass rounded-3xl border border-white/20 p-8 max-h-[90vh] overflow-y-auto shadow-2xl">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-9 h-9 rounded-full liquid-glass flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full liquid-glass text-xs tracking-wider uppercase text-blue-300 mb-4 border border-blue-500/20 font-mono">
          <Sparkles className="w-3.5 h-3.5 text-blue-400" />
          <span>About Keetcode®</span>
        </div>

        {/* Title */}
        <h2 
          className="text-4xl sm:text-5xl text-white font-semibold mb-4 leading-tight"
          style={{ fontFamily: "'Playfair Display', serif", letterSpacing: '-0.02em' }}
        >
          Crafting digital spaces for <em className="not-italic text-gray-400">deep algorithmic focus.</em>
        </h2>

        {/* Bio Narrative */}
        <p className="text-sm text-gray-300 leading-relaxed mb-8 font-sans">
          Keetcode® was created to transform complex Data Structures and Algorithms from abstract theoretical concepts into vivid, step-by-step visual experiences. Built for competitive programmers, software engineers, and deep thinkers.
        </p>

        {/* Core Pillars Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-5">
            <div className="w-10 h-10 rounded-xl liquid-glass flex items-center justify-center text-blue-400 mb-3 border border-white/10">
              <Cpu className="w-5 h-5" />
            </div>
            <h4 
              className="text-lg text-white font-semibold mb-1"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              16 Standalone Engines
            </h4>
            <p className="text-xs text-gray-400 font-sans leading-relaxed">
              Dedicated visualizer suites covering Arrays, Trees, Graphs, Backtracking, and Dynamic Programming.
            </p>
          </div>

          <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-5">
            <div className="w-10 h-10 rounded-xl liquid-glass flex items-center justify-center text-emerald-400 mb-3 border border-white/10">
              <Terminal className="w-5 h-5" />
            </div>
            <h4 
              className="text-lg text-white font-semibold mb-1"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Real Code Trace
            </h4>
            <p className="text-xs text-gray-400 font-sans leading-relaxed">
              Synchronized line-by-line code execution, pointer animations, and memory state inspection.
            </p>
          </div>

          <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-5">
            <div className="w-10 h-10 rounded-xl liquid-glass flex items-center justify-center text-amber-400 mb-3 border border-white/10">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h4 
              className="text-lg text-white font-semibold mb-1"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Cinematic Glass UI
            </h4>
            <p className="text-xs text-gray-400 font-sans leading-relaxed">
              Zero-distraction glassmorphic design crafted with Playfair Display and Inter typography.
            </p>
          </div>
        </div>

        {/* Creator Info Section */}
        <div className="bg-white/[0.04] border border-white/10 rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-6 mb-8">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl liquid-glass border border-white/20 flex items-center justify-center text-white font-bold text-2xl shadow-xl shrink-0">
              V
            </div>

            <div>
              <span className="text-[10px] uppercase font-mono bg-white/10 text-gray-300 px-2.5 py-0.5 rounded-full border border-white/10">
                Founder & Lead Architect
              </span>
              <h3 
                className="text-2xl text-white font-semibold mt-1"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                Vikash
              </h3>
              <p className="text-xs text-gray-300 font-medium flex items-center gap-1.5 mt-0.5 font-sans">
                <GraduationCap className="w-4 h-4 text-emerald-400" />
                <span>B.Tech</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <a
              href="https://www.linkedin.com/feed"
              target="_blank"
              rel="noopener noreferrer"
              className="liquid-glass rounded-full px-5 py-2.5 text-xs text-white font-semibold flex items-center gap-2 hover:scale-105 transition-transform"
            >
              <Linkedin className="w-4 h-4 text-blue-400" />
              <span>Connect on LinkedIn</span>
            </a>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="pt-4 border-t border-white/10 flex items-center justify-between">
          <p className="text-xs text-gray-400 font-sans">
            Have questions or feedback?
          </p>

          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-5 py-2 text-xs text-gray-300 hover:text-white font-medium"
            >
              Close
            </button>
            <button
              onClick={() => {
                onClose();
                onOpenContact();
              }}
              className="liquid-glass rounded-full px-6 py-2.5 text-xs text-white font-semibold hover:scale-[1.03] transition-transform cursor-pointer"
            >
              Contact Developer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
