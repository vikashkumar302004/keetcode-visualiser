/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Binary, Layers, HelpCircle, ChevronRight, Sparkles, Cpu, GitMerge } from 'lucide-react';
import { TrackId, AlgoId } from '../types';
import { motion, AnimatePresence } from 'motion/react';

interface TrackSelectorProps {
  activeTrack: TrackId;
  onTrackChange: (track: TrackId) => void;
  activeAlgo: AlgoId | null;
  onAlgoChange: (algo: AlgoId | null) => void;
}

export const TrackSelector: React.FC<TrackSelectorProps> = ({
  activeTrack,
  onTrackChange,
  activeAlgo,
  onAlgoChange
}) => {
  // Keep track of which category card is expanded/opened
  const [expandedCategory, setExpandedCategory] = useState<TrackId | null>(activeTrack || 'bit');

  const algorithmsList = {
    bit: [
      {
        id: 'single-number' as AlgoId,
        title: 'Single Number',
        badge: 'XOR logic',
        desc: 'Find the non-duplicate element in an array of pairs in O(N) time and O(1) space.',
        math: 'A ⊕ A = 0'
      },
      {
        id: 'hamming-weight' as AlgoId,
        title: 'Hamming Weight',
        badge: 'Brian Kernighan',
        desc: 'Count set bits (1s) efficiently in a 32-bit integer register grid.',
        math: 'n & (n - 1)'
      },
      {
        id: 'power-of-two' as AlgoId,
        title: 'Power of Two',
        badge: 'Bitwise AND',
        desc: 'Verify if an integer is a power of two with zero loops in O(1) time.',
        math: 'n & (n - 1) == 0'
      }
    ],
    interval: [
      {
        id: 'merge-intervals' as AlgoId,
        title: 'Merge Intervals',
        badge: 'Sorting & Stack',
        desc: 'Sort and consolidate overlapping ranges into contiguous intervals.',
        math: 'B.start <= A.end'
      },
      {
        id: 'insert-interval' as AlgoId,
        title: 'Insert Interval',
        badge: 'Collision Check',
        desc: 'Insert a new range into a sorted list and dynamically merge collisions.',
        math: 'Overlaps Merge'
      },
      {
        id: 'erase-overlap' as AlgoId,
        title: 'Erase Overlap Intervals',
        badge: 'Greedy Scheduling',
        desc: 'Find the minimum number of overlapping intervals to erase to prevent conflict.',
        math: 'Sort by End Time'
      },
      {
        id: 'meeting-rooms' as AlgoId,
        title: 'Meeting Rooms I',
        badge: 'Overlap Check',
        desc: 'Determine if a single person can attend all scheduled meetings with no overlap conflict.',
        math: 'curr.start < prev.end'
      },
      {
        id: 'meeting-rooms-ii' as AlgoId,
        title: 'Meeting Rooms II',
        badge: 'Chronological Sweep',
        desc: 'Find the minimum number of separate rooms required to host all concurrent meetings.',
        math: 'starts[i] < ends[j]'
      }
    ]
  };

  const handleCategorySelect = (track: TrackId) => {
    setExpandedCategory(track);
    onTrackChange(track);
  };

  return (
    <div id="track-selector-root" className="w-full flex flex-col gap-8">
      {/* Category Cards Choice Section */}
      <div id="category-cards-grid" className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Track A: Bit Manipulation */}
        <button
          id="category-card-bit"
          onClick={() => handleCategorySelect('bit')}
          className={`flex flex-col text-left p-6 rounded-2xl border-2 transition-all duration-300 relative overflow-hidden group bg-white cursor-pointer ${
            expandedCategory === 'bit'
              ? 'border-indigo-600 ring-4 ring-indigo-50 shadow-md'
              : 'border-slate-200 hover:border-slate-300 hover:shadow-sm'
          }`}
        >
          {/* Subtle design element */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50/30 rounded-full blur-3xl -mr-8 -mt-8 group-hover:scale-110 transition-transform"></div>

          <div className="flex items-center justify-between gap-3 mb-4">
            <div className={`p-3 rounded-xl ${expandedCategory === 'bit' ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-500'}`}>
              <Binary className="w-6 h-6" />
            </div>
            {expandedCategory === 'bit' && (
              <span className="text-[10px] font-sans font-bold tracking-widest text-indigo-600 uppercase bg-indigo-50 px-2.5 py-1 rounded-full border border-indigo-100">
                Selected Track
              </span>
            )}
          </div>

          <h3 className="font-display font-bold text-lg text-slate-950 mb-2 flex items-center gap-2">
            Track A: Bit Manipulation
          </h3>
          <p className="font-sans text-sm text-slate-500 leading-relaxed mb-4">
            Master the rules of binary arithmetic, bitwise shifts, masks, and XOR algebraic simplification.
          </p>

          <div className="mt-auto pt-2 flex items-center justify-between w-full border-t border-slate-100/80">
            <span className="text-xs font-sans text-slate-400 font-medium">3 Interactive Visualizers</span>
            <div className={`flex items-center gap-1 text-xs font-sans font-bold transition-all ${expandedCategory === 'bit' ? 'text-indigo-600' : 'text-slate-500'}`}>
              <span>{expandedCategory === 'bit' ? 'Currently viewing questions' : 'View questions'}</span>
              <ChevronRight className={`w-3.5 h-3.5 transition-transform ${expandedCategory === 'bit' ? 'rotate-90' : ''}`} />
            </div>
          </div>
        </button>

        {/* Track B: Interval Range Algorithms */}
        <button
          id="category-card-interval"
          onClick={() => handleCategorySelect('interval')}
          className={`flex flex-col text-left p-6 rounded-2xl border-2 transition-all duration-300 relative overflow-hidden group bg-white cursor-pointer ${
            expandedCategory === 'interval'
              ? 'border-indigo-600 ring-4 ring-indigo-50 shadow-md'
              : 'border-slate-200 hover:border-slate-300 hover:shadow-sm'
          }`}
        >
          {/* Subtle design element */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50/30 rounded-full blur-3xl -mr-8 -mt-8 group-hover:scale-110 transition-transform"></div>

          <div className="flex items-center justify-between gap-3 mb-4">
            <div className={`p-3 rounded-xl ${expandedCategory === 'interval' ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-500'}`}>
              <Layers className="w-6 h-6" />
            </div>
            {expandedCategory === 'interval' && (
              <span className="text-[10px] font-sans font-bold tracking-widest text-indigo-600 uppercase bg-indigo-50 px-2.5 py-1 rounded-full border border-indigo-100">
                Selected Track
              </span>
            )}
          </div>

          <h3 className="font-display font-bold text-lg text-slate-950 mb-2 flex items-center gap-2">
            Track B: Interval Ranges
          </h3>
          <p className="font-sans text-sm text-slate-500 leading-relaxed mb-4">
            Model overlap conditions, resolve conflicts on a shared coordinate timeline, and apply greedy scheduling algorithms.
          </p>

          <div className="mt-auto pt-2 flex items-center justify-between w-full border-t border-slate-100/80">
            <span className="text-xs font-sans text-slate-400 font-medium">3 Interactive Visualizers</span>
            <div className={`flex items-center gap-1 text-xs font-sans font-bold transition-all ${expandedCategory === 'interval' ? 'text-indigo-600' : 'text-slate-500'}`}>
              <span>{expandedCategory === 'interval' ? 'Currently viewing questions' : 'View questions'}</span>
              <ChevronRight className={`w-3.5 h-3.5 transition-transform ${expandedCategory === 'interval' ? 'rotate-90' : ''}`} />
            </div>
          </div>
        </button>

      </div>

      {/* Expanded Questions Accordion Panel */}
      <AnimatePresence mode="wait">
        {expandedCategory && (
          <motion.div
            key={expandedCategory}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="flex flex-col gap-4 border-t border-slate-200/60 pt-6"
          >
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-sans font-bold text-xs tracking-wider uppercase text-slate-400 flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
                Select a Question to Start Visualizing
              </h4>
              <span className="text-xs font-mono text-slate-500 bg-slate-100 px-2.5 py-0.5 rounded-md">
                {expandedCategory === 'bit' ? 'C++ Bitwise Operations' : 'C++ Interval Overlaps'}
              </span>
            </div>

            {/* Questions Grid */}
            <div id="questions-sub-grid" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {algorithmsList[expandedCategory].map((algo) => {
                const isSelected = activeAlgo === algo.id;
                return (
                  <button
                    id={`algo-sub-card-${algo.id}`}
                    key={algo.id}
                    onClick={() => onAlgoChange(algo.id)}
                    className={`flex flex-col text-left p-5 rounded-xl border-2 transition-all duration-200 cursor-pointer bg-white group/sub relative ${
                      isSelected
                        ? 'border-indigo-600 bg-indigo-50/10 shadow-sm'
                        : 'border-slate-200/80 hover:border-slate-300 hover:shadow-sm'
                    }`}
                  >
                    <div className="flex justify-between items-start gap-2 mb-3 w-full">
                      <span className={`text-[10px] font-sans font-bold tracking-wider uppercase px-2 py-0.5 rounded-md ${
                        isSelected 
                          ? 'bg-indigo-100 text-indigo-700'
                          : 'bg-slate-100 text-slate-600'
                      }`}>
                        {algo.badge}
                      </span>
                      <span className="font-mono text-[10px] text-indigo-500 font-semibold bg-indigo-50 px-1.5 py-0.5 rounded">
                        {algo.math}
                      </span>
                    </div>

                    <h3 className="font-sans font-bold text-sm text-slate-900 group-hover/sub:text-indigo-600 transition-colors mb-1.5 flex items-center gap-1.5">
                      {algo.title}
                    </h3>
                    <p className="font-sans text-xs text-slate-500 leading-normal mb-4">
                      {algo.desc}
                    </p>

                    <div className="mt-auto pt-2.5 border-t border-slate-100 flex items-center justify-between w-full">
                      <span className="text-[10px] font-sans text-slate-400 font-medium">Click to visualize</span>
                      <div className="w-6 h-6 rounded-lg bg-slate-50 group-hover/sub:bg-indigo-600 group-hover/sub:text-white flex items-center justify-center transition-all text-slate-400">
                        <ChevronRight className="w-4 h-4" />
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
