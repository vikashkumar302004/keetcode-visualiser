/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Play, RefreshCw, AlertCircle, Trash2, Plus } from 'lucide-react';
import { SimulationStep, Interval, MergeIntervalsState, InsertIntervalState, EraseOverlapState, MeetingRoomsState, MeetingRoomsIIState, AlgoId } from '../types';

interface IntervalVisualizerProps {
  algoId: AlgoId;
  currentStep: SimulationStep;
  onCustomInputSubmit: (input: any) => void;
}

export const IntervalVisualizer: React.FC<IntervalVisualizerProps> = ({
  algoId,
  currentStep,
  onCustomInputSubmit
}) => {
  // Parsing states
  const [mergeInputText, setMergeInputText] = useState('[1,3], [2,6], [8,10], [15,18]');
  const [insertListText, setInsertListText] = useState('[1,3], [6,9]');
  const [insertNewText, setInsertNewText] = useState('[2,5]');
  const [eraseInputText, setEraseInputText] = useState('[1,2], [2,3], [3,4], [1,3]');
  const [meetingInputText, setMeetingInputText] = useState('[0,30], [5,10], [15,20]');
  const [meetingInputIIText, setMeetingInputIIText] = useState('[0,30], [5,10], [15,20]');
  const [errorMsg, setErrorMsg] = useState('');

  // Universal resilient parser
  const parseIntervalsText = (text: string): Interval[] => {
    // Looks for brackets e.g. [1,3] or standard pairs
    const regex = /\[?\s*(\d+)\s*,\s*(\d+)\s*\]?/g;
    const matches = [...text.matchAll(regex)];
    if (matches.length > 0) {
      return matches.map((m, idx) => ({
        id: idx + 1,
        start: parseInt(m[1], 10),
        end: parseInt(m[2], 10)
      }));
    }
    
    // Fallback parser splits by spaces/commas
    const tokens = text.split(/[\s,]+/).map(v => parseInt(v.trim(), 10)).filter(v => !isNaN(v));
    const result: Interval[] = [];
    for (let i = 0; i < tokens.length; i += 2) {
      if (i + 1 < tokens.length) {
        result.push({
          id: (i / 2) + 1,
          start: tokens[i],
          end: tokens[i + 1]
        });
      }
    }
    return result;
  };

  const handleMergeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    const parsed = parseIntervalsText(mergeInputText);
    if (parsed.length === 0) {
      setErrorMsg('No valid intervals found. Use format: [1,3], [2,6]');
      return;
    }
    // Check ranges validity
    if (parsed.some(item => item.start > item.end)) {
      setErrorMsg('Start time must be less than or equal to End time for all intervals.');
      return;
    }
    onCustomInputSubmit(parsed);
  };

  const handleInsertSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    const list = parseIntervalsText(insertListText);
    const newItem = parseIntervalsText(insertNewText);
    
    if (list.length === 0) {
      setErrorMsg('Please enter a valid sorted list of intervals.');
      return;
    }
    if (newItem.length !== 1) {
      setErrorMsg('Please enter exactly one interval to insert (e.g. [2,5]).');
      return;
    }
    if (list.some(item => item.start > item.end) || newItem[0].start > newItem[0].end) {
      setErrorMsg('Start time must be less than or equal to End time.');
      return;
    }

    // Sort intervals list automatically to adhere to C++ input requirement
    const sortedList = [...list].sort((a, b) => a.start - b.start).map((item, idx) => ({
      ...item,
      id: idx + 1
    }));

    onCustomInputSubmit({
      intervals: sortedList,
      newInterval: { ...newItem[0], id: 99 }
    });
  };

  const handleEraseSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    const parsed = parseIntervalsText(eraseInputText);
    if (parsed.length === 0) {
      setErrorMsg('No valid intervals found. Use format: [1,2], [2,3]');
      return;
    }
    if (parsed.some(item => item.start > item.end)) {
      setErrorMsg('Start time must be less than or equal to End time.');
      return;
    }
    onCustomInputSubmit(parsed);
  };

  const handleMeetingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    const parsed = parseIntervalsText(meetingInputText);
    if (parsed.length === 0) {
      setErrorMsg('No valid intervals found. Use format: [0,30], [5,10]');
      return;
    }
    if (parsed.some(item => item.start > item.end)) {
      setErrorMsg('Start time must be less than or equal to End time.');
      return;
    }
    onCustomInputSubmit(parsed);
  };

  const handleMeetingIISubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    const parsed = parseIntervalsText(meetingInputIIText);
    if (parsed.length === 0) {
      setErrorMsg('No valid intervals found. Use format: [0,30], [5,10]');
      return;
    }
    if (parsed.some(item => item.start > item.end)) {
      setErrorMsg('Start time must be less than or equal to End time.');
      return;
    }
    onCustomInputSubmit(parsed);
  };

  // Timeline coordinate scaling calculations
  const computeTimelineRange = (): { min: number; max: number; steps: number[] } => {
    let allRanges: Interval[] = [];

    if (algoId === 'merge-intervals') {
      const state: MergeIntervalsState = currentStep.dataState;
      allRanges = [...(state?.intervals || [])];
    } else if (algoId === 'insert-interval') {
      const state: InsertIntervalState = currentStep.dataState;
      allRanges = [...(state?.intervals || [])];
      if (state?.newInterval) allRanges.push(state.newInterval);
    } else if (algoId === 'erase-overlap') {
      const state: EraseOverlapState = currentStep.dataState;
      allRanges = [...(state?.intervals || [])];
    } else if (algoId === 'meeting-rooms') {
      const state: MeetingRoomsState = currentStep.dataState;
      allRanges = [...(state?.intervals || [])];
    } else if (algoId === 'meeting-rooms-ii') {
      const state: MeetingRoomsIIState = currentStep.dataState;
      allRanges = [...(state?.intervals || [])];
    }

    if (allRanges.length === 0) {
      return { min: 0, max: 10, steps: [0, 2, 4, 6, 8, 10] };
    }

    const minS = Math.max(0, Math.min(...allRanges.map(it => it.start)));
    const maxE = Math.max(...allRanges.map(it => it.end));
    
    // Grid boundary bounds
    const minCoord = Math.max(0, minS - 1);
    const maxCoord = maxE + 1;
    const range = maxCoord - minCoord;

    // Create 6-8 interval ticks for axis
    const ticks: number[] = [];
    const stepSize = Math.max(1, Math.round(range / 8));
    for (let t = minCoord; t <= maxCoord; t += stepSize) {
      ticks.push(t);
    }
    if (ticks[ticks.length - 1] < maxCoord) {
      ticks.push(maxCoord);
    }

    return { min: minCoord, max: maxCoord, steps: ticks };
  };

  const { min: minCoord, max: maxCoord, steps: timelineTicks } = computeTimelineRange();
  const scalePercent = (coord: number) => {
    const total = maxCoord - minCoord;
    if (total === 0) return 0;
    return ((coord - minCoord) / total) * 100;
  };

  return (
    <div id="interval-visualizer-container" className="flex flex-col gap-6 h-full">
      {/* Dynamic Playground Panel */}
      <div id="interval-playground" className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
        <h4 id="playground-title" className="font-sans font-bold text-xs tracking-wider uppercase text-slate-400 mb-3 flex items-center gap-1.5">
          <Play id="playground-icon" className="w-3.5 h-3.5 text-indigo-500" />
          Interval Coordinate Playground
        </h4>

        {algoId === 'merge-intervals' && (
          <form id="merge-intervals-form" onSubmit={handleMergeSubmit} className="flex flex-col gap-3">
            <label id="lbl-merge-intervals" className="font-sans text-xs font-semibold text-slate-700">
              Overlap Ranges Input Configuration:
            </label>
            <div id="merge-input-row" className="flex flex-col sm:flex-row gap-2">
              <input
                id="inp-merge-intervals"
                type="text"
                value={mergeInputText}
                onChange={(e) => setMergeInputText(e.target.value)}
                className="flex-1 px-3 py-2 border border-slate-200 rounded-lg text-sm font-mono focus:outline-none focus:ring-2 focus:ring-indigo-600/20"
                placeholder="e.g. [1,3], [2,6], [8,10]"
              />
              <button
                id="btn-merge-submit"
                type="submit"
                className="px-5 py-2 rounded-lg bg-slate-900 text-white font-sans font-medium text-xs hover:bg-slate-800 transition-colors flex items-center justify-center gap-2"
                style={{ paddingLeft: '20px', paddingRight: '20px' }}
              >
                <RefreshCw id="refresh-icon-merge" className="w-3.5 h-3.5" />
                <span>Simulate</span>
              </button>
            </div>
          </form>
        )}

        {algoId === 'insert-interval' && (
          <form id="insert-interval-form" onSubmit={handleInsertSubmit} className="flex flex-col gap-3">
            <div id="insert-inputs-grid" className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div id="insert-col-existing" className="flex flex-col gap-1.5">
                <label id="lbl-insert-list" className="font-sans text-xs font-semibold text-slate-700">
                  Sorted Disjoint Intervals:
                </label>
                <input
                  id="inp-insert-list"
                  type="text"
                  value={insertListText}
                  onChange={(e) => setInsertListText(e.target.value)}
                  className="px-3 py-2 border border-slate-200 rounded-lg text-sm font-mono focus:outline-none focus:ring-2 focus:ring-indigo-600/20"
                  placeholder="e.g. [1,3], [6,9]"
                />
              </div>

              <div id="insert-col-new" className="flex flex-col gap-1.5">
                <label id="lbl-insert-new" className="font-sans text-xs font-semibold text-slate-700">
                  New Range to Insert:
                </label>
                <div className="flex gap-2">
                  <input
                    id="inp-insert-new"
                    type="text"
                    value={insertNewText}
                    onChange={(e) => setInsertNewText(e.target.value)}
                    className="flex-1 px-3 py-2 border border-slate-200 rounded-lg text-sm font-mono focus:outline-none focus:ring-2 focus:ring-indigo-600/20"
                    placeholder="e.g. [2,5]"
                  />
                  <button
                    id="btn-insert-submit"
                    type="submit"
                    className="px-4 py-2 rounded-lg bg-slate-900 text-white font-sans font-medium text-xs hover:bg-slate-800 transition-colors flex items-center justify-center gap-1"
                    style={{ paddingLeft: '16px', paddingRight: '16px' }}
                  >
                    <Plus id="plus-icon-insert" className="w-3.5 h-3.5" />
                    <span>Insert</span>
                  </button>
                </div>
              </div>
            </div>
          </form>
        )}

        {algoId === 'erase-overlap' && (
          <form id="erase-overlap-form" onSubmit={handleEraseSubmit} className="flex flex-col gap-3">
            <label id="lbl-erase-overlap" className="font-sans text-xs font-semibold text-slate-700">
              Unsorted Schedule Timeline Intervals:
            </label>
            <div id="erase-input-row" className="flex flex-col sm:flex-row gap-2">
              <input
                id="inp-erase-overlap"
                type="text"
                value={eraseInputText}
                onChange={(e) => setEraseInputText(e.target.value)}
                className="flex-1 px-3 py-2 border border-slate-200 rounded-lg text-sm font-mono focus:outline-none focus:ring-2 focus:ring-indigo-600/20"
                placeholder="e.g. [1,2], [2,3], [3,4], [1,3]"
              />
              <button
                id="btn-erase-submit"
                type="submit"
                className="px-5 py-2 rounded-lg bg-slate-900 text-white font-sans font-medium text-xs hover:bg-slate-800 transition-colors flex items-center justify-center gap-2"
                style={{ paddingLeft: '20px', paddingRight: '20px' }}
              >
                <RefreshCw id="refresh-icon-erase" className="w-3.5 h-3.5" />
                <span>Simulate</span>
              </button>
            </div>
          </form>
        )}

        {algoId === 'meeting-rooms' && (
          <form id="meeting-rooms-form" onSubmit={handleMeetingSubmit} className="flex flex-col gap-3">
            <label id="lbl-meeting-rooms" className="font-sans text-xs font-semibold text-slate-700">
              Meeting Schedule Configuration:
            </label>
            <div id="meeting-input-row" className="flex flex-col sm:flex-row gap-2">
              <input
                id="inp-meeting-rooms"
                type="text"
                value={meetingInputText}
                onChange={(e) => setMeetingInputText(e.target.value)}
                className="flex-1 px-3 py-2 border border-slate-200 rounded-lg text-sm font-mono focus:outline-none focus:ring-2 focus:ring-indigo-600/20"
                placeholder="e.g. [0,30], [5,10], [15,20]"
              />
              <button
                id="btn-meeting-submit"
                type="submit"
                className="px-5 py-2 rounded-lg bg-slate-900 text-white font-sans font-medium text-xs hover:bg-slate-800 transition-colors flex items-center justify-center gap-2"
                style={{ paddingLeft: '20px', paddingRight: '20px' }}
              >
                <RefreshCw id="refresh-icon-meeting" className="w-3.5 h-3.5" />
                <span>Simulate</span>
              </button>
            </div>
          </form>
        )}

        {algoId === 'meeting-rooms-ii' && (
          <form id="meeting-rooms-ii-form" onSubmit={handleMeetingIISubmit} className="flex flex-col gap-3">
            <label id="lbl-meeting-rooms-ii" className="font-sans text-xs font-semibold text-slate-700">
              Meeting Rooms Schedule Configuration:
            </label>
            <div id="meeting-ii-input-row" className="flex flex-col sm:flex-row gap-2">
              <input
                id="inp-meeting-rooms-ii"
                type="text"
                value={meetingInputIIText}
                onChange={(e) => setMeetingInputIIText(e.target.value)}
                className="flex-1 px-3 py-2 border border-slate-200 rounded-lg text-sm font-mono focus:outline-none focus:ring-2 focus:ring-indigo-600/20"
                placeholder="e.g. [0,30], [5,10], [15,20]"
              />
              <button
                id="btn-meeting-ii-submit"
                type="submit"
                className="px-5 py-2 rounded-lg bg-slate-900 text-white font-sans font-medium text-xs hover:bg-slate-800 transition-colors flex items-center justify-center gap-2"
                style={{ paddingLeft: '20px', paddingRight: '20px' }}
              >
                <RefreshCw id="refresh-icon-meeting-ii" className="w-3.5 h-3.5" />
                <span>Simulate</span>
              </button>
            </div>
          </form>
        )}

        {errorMsg && (
          <p id="error-message-row" className="text-xs text-rose-600 font-sans mt-2 flex items-center gap-1.5">
            <AlertCircle id="err-alert-icon" className="w-3.5 h-3.5" />
            {errorMsg}
          </p>
        )}
      </div>

      {/* Main Timeline Stage */}
      <div id="interval-timeline-stage" className="flex-1 bg-white border border-slate-200 rounded-xl p-6 shadow-sm flex flex-col justify-between min-h-[400px]">
        {/* Timeline Header */}
        <div id="timeline-stage-header" className="flex justify-between items-center mb-4">
          <span id="timeline-stage-lbl" className="font-sans text-xs font-bold text-slate-400 uppercase tracking-wider">
            Continuous Coordinate Timeline Axis
          </span>
          <span id="timeline-axis-bounds" className="font-mono text-xs text-slate-500 bg-slate-50 border border-slate-100 px-2 py-0.5 rounded">
            Scale: {minCoord} to {maxCoord}
          </span>
        </div>

        {/* Visual Timeline Coordinates Track Container */}
        <div id="timeline-render-track-area" className="flex-1 relative border border-slate-100 rounded-xl bg-slate-50/20 min-h-[220px] p-6 mb-6">
          {/* Vertical Gridlines */}
          <div id="timeline-gridlines" className="absolute inset-0 flex justify-between pointer-events-none">
            {timelineTicks.map((tick) => {
              const leftPercent = scalePercent(tick);
              if (leftPercent < 0 || leftPercent > 100) return null;
              return (
                <div
                  id={`gridline-tick-${tick}`}
                  key={tick}
                  className="absolute top-0 bottom-0 border-l border-slate-200/50 border-dashed flex flex-col justify-end"
                  style={{ left: `${leftPercent}%` }}
                >
                  <span className="font-mono text-[10px] text-slate-400 font-medium translate-x-[-50%] translate-y-[20px] bg-white px-1">
                    {tick}
                  </span>
                </div>
              );
            })}
          </div>

          {/* End Pointer Line for Erase Overlap intervals (Greedy pointer) */}
          {algoId === 'erase-overlap' && (() => {
            const state: EraseOverlapState = currentStep.dataState;
            if (state.prevEnd !== null) {
              const pointerLeft = scalePercent(state.prevEnd);
              return (
                <div
                  id="erase-overlap-end-pointer"
                  className="absolute top-0 bottom-0 border-l-2 border-indigo-500 z-10 pointer-events-none flex items-start"
                  style={{ left: `${pointerLeft}%` }}
                >
                  <div className="bg-indigo-600 text-white font-mono text-[9px] font-bold px-1.5 py-0.5 rounded shadow-sm translate-x-[-50%] translate-y-[-12px] whitespace-nowrap">
                    prev_end = {state.prevEnd}
                  </div>
                </div>
              );
            }
            return null;
          })()}

          {/* Render Intervals Track Bars */}
          <div id="timeline-bars-stack" className="relative h-full flex flex-col gap-3 justify-center z-5">
            {algoId === 'merge-intervals' && (() => {
              const state: MergeIntervalsState = currentStep.dataState;
              
              return (state?.intervals || []).map((item, idx) => {
                const isCurrent = idx === state?.currentIndex;
                const inStack = (state?.stack || []).some(st => st.start === item.start && st.end === item.end);
                
                // Layout calculation
                const left = scalePercent(item.start);
                const width = scalePercent(item.end) - left;
                
                return (
                  <motion.div
                    id={`merge-item-bar-${item.id}`}
                    key={item.id}
                    layout
                    className={`h-8 rounded-lg relative flex items-center px-3 text-white font-sans text-xs font-semibold shadow-sm transition-all ${
                      isCurrent
                        ? 'ring-4 ring-indigo-200 scale-[1.02] border border-indigo-600 z-10'
                        : ''
                    }`}
                    style={{
                      left: `${left}%`,
                      width: `${width}%`,
                      backgroundColor: item.color || '#4f46e5',
                      opacity: isCurrent ? 1 : inStack ? 0.85 : 0.45
                    }}
                  >
                    <span className="truncate">
                      [{item.start}, {item.end}] {isCurrent ? '👈 Active' : ''}
                    </span>
                  </motion.div>
                );
              });
            })()}

            {algoId === 'insert-interval' && (() => {
              const state: InsertIntervalState = currentStep.dataState;
              
              return (
                <>
                  {/* Existing Intervals */}
                  {(state?.intervals || []).map((item, idx) => {
                    const isCurrent = idx === state?.currentIndex;
                    const inResult = (state?.result || []).some(r => r.start === item.start && r.end === item.end);
                    const left = scalePercent(item.start);
                    const width = scalePercent(item.end) - left;

                    return (
                      <motion.div
                        id={`insert-item-bar-${item.id}`}
                        key={item.id}
                        layout
                        className={`h-8 rounded-lg relative flex items-center px-3 text-slate-800 font-sans text-xs font-semibold border shadow-sm ${
                          isCurrent
                            ? 'bg-amber-100 border-amber-400 ring-2 ring-amber-200 z-10'
                            : inResult
                              ? 'bg-slate-100 border-slate-300 opacity-60'
                              : 'bg-white border-slate-200'
                        }`}
                        style={{
                          left: `${left}%`,
                          width: `${width}%`
                        }}
                      >
                        <span className="truncate">
                          [{item.start}, {item.end}] {isCurrent ? '⚠️ Overlap Check' : ''}
                        </span>
                      </motion.div>
                    );
                  })}

                  {/* New Interval Overlay */}
                  {state?.newInterval && (() => {
                    const left = scalePercent(state.newInterval.start);
                    const width = scalePercent(state.newInterval.end) - left;
                    const isMergingPhase = state.phase === 'merge';
                    const isDone = state.phase === 'done' || state.phase === 'right';

                    return (
                      <motion.div
                        id="insert-new-interval-bar"
                        layout
                        className={`h-8 rounded-lg relative flex items-center px-3 text-white font-sans text-xs font-bold border shadow-md ${
                          isMergingPhase
                            ? 'bg-amber-500 border-amber-600 ring-4 ring-amber-100 animate-pulse'
                            : isDone
                              ? 'bg-emerald-600 border-emerald-700'
                              : 'bg-indigo-600 border-indigo-700'
                        }`}
                        style={{
                          left: `${left}%`,
                          width: `${width}%`
                        }}
                      >
                        <span className="truncate">
                          New: [{state.newInterval.start}, {state.newInterval.end}] {isMergingPhase ? 'Merging...' : isDone ? 'Inserted 🎉' : 'Inserting...'}
                        </span>
                      </motion.div>
                    );
                  })()}
                </>
              );
            })()}

            {algoId === 'erase-overlap' && (() => {
              const state: EraseOverlapState = currentStep.dataState;
              
              return (state?.intervals || []).map((item, idx) => {
                const isCurrent = idx === state?.currentIndex;
                const isSelected = (state?.selectedIndices || []).includes(idx);
                const isRemoved = (state?.removedIndices || []).includes(idx);
                
                const left = scalePercent(item.start);
                const width = scalePercent(item.end) - left;
                
                return (
                  <motion.div
                    id={`erase-item-bar-${item.id}`}
                    key={item.id}
                    layout
                    className={`h-8 rounded-lg relative flex items-center px-3 font-sans text-xs font-semibold border shadow-sm transition-colors ${
                      isCurrent
                        ? 'bg-indigo-50 border-indigo-500 ring-2 ring-indigo-200 z-10 text-indigo-900'
                        : isSelected
                          ? 'bg-emerald-50 border-emerald-400 text-emerald-800'
                          : isRemoved
                            ? 'bg-rose-50 border-rose-300 text-rose-700 line-through opacity-70'
                            : 'bg-white border-slate-200 text-slate-500'
                    }`}
                    style={{
                      left: `${left}%`,
                      width: `${width}%`
                    }}
                  >
                    <span className="truncate">
                      [{item.start}, {item.end}] {isSelected ? '✅ Kept' : isRemoved ? '❌ Erased' : isCurrent ? '🔎 Current' : ''}
                    </span>
                  </motion.div>
                );
              });
            })()}

            {algoId === 'meeting-rooms' && (() => {
              const state: MeetingRoomsState = currentStep.dataState;
              
              return (state?.intervals || []).map((item, idx) => {
                const isCurrent = idx === state?.currentIndex;
                const isConflict = state?.conflictPairs?.includes(idx);
                const left = scalePercent(item.start);
                const width = scalePercent(item.end) - left;
                
                return (
                  <motion.div
                    id={`meeting-item-bar-${item.id}`}
                    key={item.id}
                    layout
                    className={`h-8 rounded-lg relative flex items-center px-3 font-sans text-xs font-semibold border shadow-sm transition-all ${
                      isConflict
                        ? 'bg-rose-500 border-rose-600 text-white ring-4 ring-rose-200 z-15 animate-pulse'
                        : isCurrent
                          ? 'bg-indigo-600 border-indigo-700 text-white ring-2 ring-indigo-200 z-10 font-bold shadow-md'
                          : 'bg-slate-50 border-slate-200 text-slate-600'
                    }`}
                    style={{
                      left: `${left}%`,
                      width: `${width}%`
                    }}
                  >
                    <span className="truncate">
                      Meeting {idx + 1}: [{item.start}, {item.end}] {isConflict ? '⚠️ Overlap Conflict!' : isCurrent ? '🔍 Comparing' : ''}
                    </span>
                  </motion.div>
                );
              });
            })()}

            {algoId === 'meeting-rooms-ii' && (() => {
              const state: MeetingRoomsIIState = currentStep.dataState;
              
              return (state?.intervals || []).map((item, idx) => {
                const left = scalePercent(item.start);
                const width = scalePercent(item.end) - left;
                
                // Determine if this meeting is currently active (a start has been processed, but its end is not yet reached)
                // In Two Pointer Sweep, start times list startsSorted[i] handles the incoming meetings.
                // An interval with start value <= startsSorted[startIndex] and end value > endsSorted[endIndex-1] (or similar) is active.
                const hasStarted = state?.startIndex !== undefined && state.startIndex !== -1 && item.start <= state.starts[state.startIndex];
                const hasEnded = state?.endIndex !== undefined && state.endIndex !== -1 && item.end <= state.ends[state.endIndex - 1];
                const isActive = hasStarted && !hasEnded;

                return (
                  <motion.div
                    id={`meeting-ii-item-bar-${item.id}`}
                    key={item.id}
                    layout
                    className={`h-8 rounded-lg relative flex items-center px-3 font-sans text-xs font-semibold border shadow-sm transition-all ${
                      isActive
                        ? 'bg-amber-500 border-amber-600 text-white ring-2 ring-amber-150 z-10'
                        : hasEnded
                          ? 'bg-slate-100 border-slate-200 text-slate-400 opacity-50'
                          : 'bg-white border-slate-200 text-slate-700'
                    }`}
                    style={{
                      left: `${left}%`,
                      width: `${width}%`
                    }}
                  >
                    <span className="truncate">
                      Meeting {item.id}: [{item.start}, {item.end}] {isActive ? '🏢 Occupying Room' : hasEnded ? '✅ Finished' : '💤 Scheduled'}
                    </span>
                  </motion.div>
                );
              });
            })()}
          </div>
        </div>

        {/* Bottom comparison and stack logs display */}
        <div id="interval-bottom-logs" className="border border-slate-200 rounded-xl p-4 bg-slate-50/50">
          {algoId === 'merge-intervals' && (() => {
            const state: MergeIntervalsState = currentStep.dataState;
            return (
              <div id="merge-stack-row" className="flex flex-col gap-2.5">
                <span id="merge-stack-lbl" className="font-sans font-bold text-[10px] tracking-wider uppercase text-slate-400">
                  Merged Result Stack (`vector&lt;vector&lt;int&gt;&gt; merged`)
                </span>
                <div id="merge-stack-items" className="flex flex-wrap gap-2 items-center p-3.5 bg-white border border-slate-100 rounded-lg min-h-[50px]">
                  {(state?.stack || []).length === 0 ? (
                    <span id="merge-stack-empty" className="text-slate-400 text-xs italic">Awaiting first push...</span>
                  ) : (
                    (state?.stack || []).map((item, idx) => (
                      <div
                        id={`stack-item-${idx}`}
                        key={idx}
                        className="px-3 py-1.5 rounded-lg text-xs font-mono font-bold text-indigo-700 bg-indigo-50 border border-indigo-150 flex items-center gap-1.5 shadow-sm"
                      >
                        <span>[{item.start}, {item.end}]</span>
                        {idx === (state?.stack || []).length - 1 && (
                          <span className="bg-indigo-600 text-white text-[8px] font-sans px-1 rounded uppercase">Top</span>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </div>
            );
          })()}

          {algoId === 'insert-interval' && (() => {
            const state: InsertIntervalState = currentStep.dataState;
            return (
              <div id="insert-stack-row" className="flex flex-col gap-2.5">
                <span id="insert-stack-lbl" className="font-sans font-bold text-[10px] tracking-wider uppercase text-slate-400">
                  Result Collector (`vector&lt;vector&lt;int&gt;&gt; result`)
                </span>
                <div id="insert-stack-items" className="flex flex-wrap gap-2 items-center p-3.5 bg-white border border-slate-100 rounded-lg min-h-[50px]">
                  {(state?.result || []).length === 0 ? (
                    <span id="insert-stack-empty" className="text-slate-400 text-xs italic">Awaiting insertions...</span>
                  ) : (
                    (state?.result || []).map((item, idx) => (
                      <div
                        id={`insert-res-item-${idx}`}
                        key={idx}
                        className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold flex items-center gap-1.5 shadow-sm border ${
                          item.id === 99
                            ? 'bg-indigo-50 text-indigo-700 border-indigo-150'
                            : 'bg-slate-50 text-slate-600 border-slate-200'
                        }`}
                      >
                        <span>[{item.start}, {item.end}]</span>
                        {item.id === 99 && (
                          <span className="bg-indigo-600 text-white text-[8px] font-sans px-1 rounded uppercase">Inserted</span>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </div>
            );
          })()}

          {algoId === 'erase-overlap' && (() => {
            const state: EraseOverlapState = currentStep.dataState;
            return (
              <div id="erase-stats-row" className="grid grid-cols-2 gap-4">
                <div id="erase-stats-kept" className="flex flex-col gap-1 p-2.5 bg-emerald-50/50 border border-emerald-100 rounded-lg">
                  <span className="font-sans font-bold text-[9px] tracking-wider uppercase text-emerald-600">Kept (Non-overlapping)</span>
                  <span className="font-sans text-xs font-bold text-emerald-800">
                    {(state?.selectedIndices || []).length} Interval(s)
                  </span>
                </div>
                <div id="erase-stats-removed" className="flex flex-col gap-1 p-2.5 bg-rose-50/50 border border-rose-100 rounded-lg">
                  <span className="font-sans font-bold text-[9px] tracking-wider uppercase text-rose-600">Removed Overlaps</span>
                  <span className="font-sans text-xs font-bold text-rose-800">
                    {state?.count || 0} Erased
                  </span>
                </div>
              </div>
            );
          })()}

          {algoId === 'meeting-rooms' && (() => {
            const state: MeetingRoomsState = currentStep.dataState;
            return (
              <div id="meeting-stats-row" className="grid grid-cols-2 gap-4">
                <div id="meeting-stats-conflict" className={`flex flex-col gap-1 p-2.5 border rounded-lg ${
                  state?.hasConflict
                    ? 'bg-rose-50 border-rose-200 text-rose-800'
                    : 'bg-emerald-50 border-emerald-200 text-emerald-800'
                }`}>
                  <span className="font-sans font-bold text-[9px] tracking-wider uppercase">Attendance Status</span>
                  <span className="font-sans text-xs font-bold">
                    {state?.hasConflict ? '⚠️ Overlap Found (Cannot Attend)' : '✅ No Overlap (Can Attend)'}
                  </span>
                </div>
                <div id="meeting-stats-index" className="flex flex-col gap-1 p-2.5 bg-slate-50 border border-slate-200 rounded-lg">
                  <span className="font-sans font-bold text-[9px] tracking-wider uppercase text-slate-505">Comparison Pointer</span>
                  <span className="font-mono text-xs font-bold text-slate-800">
                    {state?.currentIndex !== undefined && state.currentIndex !== -1
                      ? `Comparing intervals [${state.currentIndex - 1}] and [${state.currentIndex}]`
                      : 'Not Comparing'}
                  </span>
                </div>
              </div>
            );
          })()}

          {algoId === 'meeting-rooms-ii' && (() => {
            const state: MeetingRoomsIIState = currentStep.dataState;
            return (
              <div id="meeting-ii-stats-row" className="flex flex-col gap-3">
                <span className="font-sans font-bold text-[10px] tracking-wider uppercase text-slate-400">
                  Chronological Sweep Trace Arrays
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="p-3 bg-white border border-slate-200 rounded-lg">
                    <span className="block font-sans font-bold text-[9px] text-indigo-600 uppercase mb-1.5">Sorted Starts Sweep:</span>
                    <div className="flex items-center gap-1.5 flex-wrap">
                      {(state?.starts || []).map((val, idx) => {
                        const isCurrent = idx === state?.startIndex;
                        return (
                          <span
                            key={idx}
                            className={`px-2 py-1 rounded font-mono text-xs font-bold ${
                              isCurrent
                                ? 'bg-indigo-600 text-white ring-2 ring-indigo-200'
                                : 'bg-slate-50 text-slate-600 border border-slate-100'
                            }`}
                          >
                            {val} {isCurrent && '👈 i'}
                          </span>
                        );
                      })}
                    </div>
                  </div>
                  
                  <div className="p-3 bg-white border border-slate-200 rounded-lg">
                    <span className="block font-sans font-bold text-[9px] text-amber-600 uppercase mb-1.5">Sorted Ends Sweep:</span>
                    <div className="flex items-center gap-1.5 flex-wrap">
                      {(state?.ends || []).map((val, idx) => {
                        const isCurrent = idx === state?.endIndex;
                        return (
                          <span
                            key={idx}
                            className={`px-2 py-1 rounded font-mono text-xs font-bold ${
                              isCurrent
                                ? 'bg-amber-600 text-white ring-2'
                                : 'bg-slate-50 text-slate-600 border border-slate-100'
                            }`}
                          >
                            {val} {isCurrent && '👈 endIdx'}
                          </span>
                        );
                      })}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 mt-1">
                  <div className="p-2.5 bg-amber-50/50 border border-amber-150 rounded-lg flex flex-col gap-0.5">
                    <span className="font-sans font-bold text-[9px] text-amber-700 uppercase">Active Rooms Right Now</span>
                    <span className="font-sans text-xs font-bold text-amber-900">{state?.activeRooms || 0} Rooms</span>
                  </div>
                  <div className="p-2.5 bg-indigo-50/50 border border-indigo-150 rounded-lg flex flex-col gap-0.5">
                    <span className="font-sans font-bold text-[9px] text-indigo-700 uppercase">Peak Peak Rooms Needed</span>
                    <span className="font-sans text-xs font-bold text-indigo-900">{state?.maxRooms || 0} Rooms Required</span>
                  </div>
                </div>
              </div>
            );
          })()}
        </div>
      </div>
    </div>
  );
};
