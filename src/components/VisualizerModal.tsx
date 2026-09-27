import React, { useState, useEffect } from 'react';
import { VisualizerModule } from '../types';
import { X, Play, Pause, RotateCcw, ChevronRight, Terminal, Code, Cpu, ExternalLink, Zap } from 'lucide-react';

interface VisualizerModalProps {
  module: VisualizerModule | null;
  onClose: () => void;
}

export const VisualizerModal: React.FC<VisualizerModalProps> = ({ module, onClose }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [arrayData, setArrayData] = useState<number[]>([45, 12, 89, 34, 67, 23, 90, 56]);
  const [activeIndices, setActiveIndices] = useState<number[]>([1, 2]);

  useEffect(() => {
    // Generate fresh random sample data when module opens
    if (module) {
      setArrayData([34, 18, 92, 54, 27, 81, 40, 65]);
      setCurrentStep(0);
      setIsPlaying(false);
    }
  }, [module]);

  useEffect(() => {
    let interval: any = null;
    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentStep((prev) => {
          const next = (prev + 1) % 8;
          setActiveIndices([(next * 2) % 8, (next * 2 + 1) % 8]);
          return next;
        });
      }, 700);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isPlaying]);

  if (!module) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-lg animate-fade-rise">
      <div className="relative w-full max-w-5xl liquid-glass rounded-3xl border border-white/20 p-6 md:p-8 max-h-[90vh] overflow-y-auto shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between pb-6 border-b border-white/10">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <span className="text-xs uppercase tracking-wider text-gray-400 font-mono">
                {module.category}
              </span>
              <span className="text-xs bg-white/10 text-white px-2.5 py-0.5 rounded-full font-semibold">
                {module.difficulty}
              </span>
            </div>
            <h2 
              className="text-3xl sm:text-4xl text-white font-normal"
              style={{ fontFamily: "'Instrument Serif', serif" }}
            >
              {module.title}
            </h2>
          </div>

          <button
            onClick={onClose}
            className="w-10 h-10 rounded-full liquid-glass flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Interactive Visualizer Canvas Box */}
        <div className="my-6 bg-black/40 rounded-2xl p-6 border border-white/10">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs font-mono text-gray-300">
                Interactive Engine Simulator (Step {currentStep + 1} / 8)
              </span>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="liquid-glass px-4 py-2 rounded-full text-xs text-white flex items-center gap-2 hover:bg-white/10 transition-all cursor-pointer"
              >
                {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 text-emerald-400" />}
                <span>{isPlaying ? 'Pause Simulation' : 'Run Algorithm'}</span>
              </button>
              <button
                onClick={() => {
                  setCurrentStep(0);
                  setIsPlaying(false);
                }}
                className="p-2 rounded-full liquid-glass text-gray-400 hover:text-white transition-colors"
                title="Reset"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Visualization Bars / Graphic elements */}
          <div className="h-56 flex items-end justify-center gap-3 sm:gap-4 p-4 bg-white/[0.02] rounded-xl border border-white/5">
            {arrayData.map((val, idx) => {
              const isActive = activeIndices.includes(idx);
              return (
                <div key={idx} className="flex-1 flex flex-col items-center gap-2 max-w-[50px]">
                  <span className="text-xs font-mono text-gray-400">{val}</span>
                  <div
                    className={`w-full rounded-t-lg transition-all duration-300 ${
                      isActive
                        ? 'bg-gradient-to-t from-blue-600 to-indigo-400 shadow-lg shadow-blue-500/50 scale-105'
                        : 'bg-white/20'
                    }`}
                    style={{ height: `${val * 1.8}px` }}
                  />
                  <span className="text-[10px] text-gray-500 font-mono">[{idx}]</span>
                </div>
              );
            })}
          </div>

          {/* Trace Log Bar */}
          <div className="mt-4 flex items-center gap-3 bg-black/60 p-3 rounded-lg border border-white/5 text-xs font-mono text-gray-300">
            <Terminal className="w-4 h-4 text-emerald-400 shrink-0" />
            <p className="truncate">
              Step {currentStep + 1}: Evaluating elements at indices [{activeIndices.join(', ')}] — State: Optimal Subproblem Processing
            </p>
          </div>
        </div>

        {/* Algorithm Topics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="text-sm font-semibold text-gray-300 mb-3 flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-400" />
              <span>Core Algorithms Included</span>
            </h4>
            <div className="flex flex-wrap gap-2">
              {module.topics.map((t, idx) => (
                <span
                  key={idx}
                  className="text-xs bg-white/5 text-gray-300 px-3 py-1.5 rounded-lg border border-white/10"
                >
                  {t}
                </span>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-gray-300 mb-3 flex items-center gap-2">
              <Cpu className="w-4 h-4 text-blue-400" />
              <span>Module Specs</span>
            </h4>
            <div className="text-xs text-gray-400 space-y-1.5 font-mono">
              <p>Folder: <span className="text-white">{module.folderName}</span></p>
              <p>Algorithms Count: <span className="text-white">{module.algorithmsCount}</span></p>
              <p>Recommended Environment: <span className="text-white">React 19 + Vite + Tailwind</span></p>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="mt-8 pt-6 border-t border-white/10 flex items-center justify-between">
          <span className="text-xs text-gray-400">
            Standalone Vite App Port: <code className="text-blue-300">http://localhost:{module.port}</code>
          </span>

          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-6 py-2.5 text-xs text-gray-300 hover:text-white transition-colors"
            >
              Close
            </button>
            <button
              onClick={() => {
                alert(`Starting standalone dev server for folder: ${module.folderName}`);
              }}
              className="liquid-glass rounded-full px-6 py-2.5 text-xs text-white flex items-center gap-2 hover:scale-[1.03] transition-transform cursor-pointer"
            >
              <span>Launch Dedicated Dev Server</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
