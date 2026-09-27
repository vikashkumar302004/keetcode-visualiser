/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { RefreshCw, Play, Binary, HelpCircle, AlertCircle } from 'lucide-react';
import { SimulationStep, SingleNumberState, HammingWeightState, PowerOfTwoState, AlgoId } from '../types';
import { toBinaryString } from '../simulationEngine';

interface BitManipulationVisualizerProps {
  algoId: AlgoId;
  currentStep: SimulationStep;
  onCustomInputSubmit: (input: any) => void;
}

export const BitManipulationVisualizer: React.FC<BitManipulationVisualizerProps> = ({
  algoId,
  currentStep,
  onCustomInputSubmit
}) => {
  // Playground state
  const [singleNumInput, setSingleNumInput] = useState('4, 1, 2, 1, 2');
  const [hammingInput, setHammingInput] = useState(11);
  const [powerInput, setPowerInput] = useState(16);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSingleNumSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    try {
      const arr = singleNumInput
        .split(',')
        .map(v => parseInt(v.trim(), 10))
        .filter(v => !isNaN(v));
      
      if (arr.length === 0) {
        setErrorMsg('Please enter a valid comma-separated list of numbers.');
        return;
      }
      
      onCustomInputSubmit(arr);
    } catch (err) {
      setErrorMsg('Invalid input format. Use numbers separated by commas.');
    }
  };

  const handleHammingSubmit = (val: number) => {
    if (isNaN(val) || val < 0 || val > 1000000000) return;
    setHammingInput(val);
    onCustomInputSubmit(val);
  };

  const handlePowerSubmit = (val: number) => {
    if (isNaN(val) || val < 0 || val > 1000000000) return;
    setPowerInput(val);
    onCustomInputSubmit(val);
  };

  // Helper to toggle a bit in Hamming weight register
  const toggleHammingBit = (bitIndex: number) => {
    // Toggles the bitIndex-th bit of current input value
    const mask = 1 << bitIndex;
    const newValue = hammingInput ^ mask;
    handleHammingSubmit(newValue);
  };

  // Helper to toggle a bit in Power of Two register
  const togglePowerBit = (bitIndex: number) => {
    const mask = 1 << bitIndex;
    const newValue = powerInput ^ mask;
    handlePowerSubmit(newValue);
  };

  return (
    <div id="bit-manipulation-visualizer-container" className="flex flex-col gap-6 h-full">
      {/* Playground Controls Panel */}
      <div id="playground-controls" className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
        <h4 id="playground-title" className="font-sans font-bold text-xs tracking-wider uppercase text-slate-400 mb-3 flex items-center gap-1.5">
          <Play id="playground-icon" className="w-3.5 h-3.5 text-indigo-500" />
          Interactive Playground
        </h4>

        {algoId === 'single-number' && (
          <form id="single-number-form" onSubmit={handleSingleNumSubmit} className="flex flex-col gap-3">
            <label id="lbl-single-number" className="font-sans text-xs font-semibold text-slate-700">
              Custom Array Elements (odd frequency counts will be identified):
            </label>
            <div id="single-number-input-row" className="flex flex-col sm:flex-row gap-2">
              <input
                id="inp-single-number-list"
                type="text"
                value={singleNumInput}
                onChange={(e) => setSingleNumInput(e.target.value)}
                className="flex-1 px-3 py-2 border border-slate-200 rounded-lg text-sm font-mono focus:outline-none focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600"
                placeholder="e.g. 4, 1, 2, 1, 2"
              />
              <button
                id="btn-single-number-submit"
                type="submit"
                className="px-5 py-2 rounded-lg bg-slate-900 text-white font-sans font-medium text-xs hover:bg-slate-800 transition-colors flex items-center justify-center gap-2"
                style={{ paddingLeft: '20px', paddingRight: '20px' }}
              >
                <RefreshCw id="refresh-icon-single-num" className="w-3.5 h-3.5" />
                <span>Simulate</span>
              </button>
            </div>
            {errorMsg && (
              <p id="err-single-number" className="text-xs text-rose-600 font-sans flex items-center gap-1.5">
                <AlertCircle id="err-alert-icon" className="w-3.5 h-3.5" />
                {errorMsg}
              </p>
            )}
            <p id="tip-single-number" className="text-[11px] text-slate-500 font-sans">
              Pro-tip: Include duplicate numbers to watch the visual registry cancel them out bit-by-bit!
            </p>
          </form>
        )}

        {algoId === 'hamming-weight' && (
          <div id="hamming-weight-controls" className="flex flex-col gap-3">
            <div id="hamming-input-row" className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div id="hamming-label-group">
                <label id="lbl-hamming" className="font-sans text-xs font-semibold text-slate-700 block mb-1">
                  Active Register Integer Value (Decimal):
                </label>
                <div id="hamming-quick-presets" className="flex items-center gap-1.5 flex-wrap">
                  {[7, 11, 23, 128, 255].map((preset) => (
                    <button
                      id={`btn-hamming-preset-${preset}`}
                      key={preset}
                      onClick={() => handleHammingSubmit(preset)}
                      className={`px-2 py-0.5 rounded text-[11px] font-mono border transition-all ${
                        hammingInput === preset
                          ? 'bg-indigo-50 border-indigo-200 text-indigo-700 font-semibold'
                          : 'bg-slate-50 hover:bg-slate-100 text-slate-600 border-slate-200'
                      }`}
                    >
                      {preset}
                    </button>
                  ))}
                </div>
              </div>
              <div id="hamming-input-container" className="flex items-center gap-2 w-full sm:w-auto">
                <input
                  id="inp-hamming-value"
                  type="number"
                  min="0"
                  max="1000000000"
                  value={hammingInput}
                  onChange={(e) => handleHammingSubmit(parseInt(e.target.value, 10))}
                  className="w-full sm:w-32 px-3 py-2 border border-slate-200 rounded-lg text-sm font-mono focus:outline-none focus:ring-2 focus:ring-indigo-600/20"
                />
              </div>
            </div>
            
            {/* Clickable quick bit editor */}
            <div id="hamming-interactive-bits-container" className="border border-slate-100 rounded-lg p-2.5 bg-slate-50/50">
              <span id="hamming-bits-label" className="font-sans text-[11px] font-semibold text-slate-500 block mb-2">
                Click bits below directly to customize register state (0 - 15):
              </span>
              <div id="hamming-bits-grid" className="flex gap-1 overflow-x-auto pb-1 justify-between">
                {Array.from({ length: 16 }).map((_, i) => {
                  const bitIndex = 15 - i;
                  const isSet = (hammingInput & (1 << bitIndex)) !== 0;
                  return (
                    <button
                      id={`btn-hamming-bit-toggle-${bitIndex}`}
                      key={bitIndex}
                      onClick={() => toggleHammingBit(bitIndex)}
                      className={`flex-1 min-w-[28px] h-8 flex flex-col items-center justify-center rounded border font-mono text-[11px] transition-all ${
                        isSet 
                          ? 'bg-emerald-50 border-emerald-300 text-emerald-700 font-bold shadow-sm'
                          : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-400'
                      }`}
                    >
                      <span className="text-[8px] text-slate-400 leading-none mb-0.5">{bitIndex}</span>
                      <span className="leading-none">{isSet ? '1' : '0'}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {algoId === 'power-of-two' && (
          <div id="power-of-two-controls" className="flex flex-col gap-3">
            <div id="power-input-row" className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div id="power-label-group">
                <label id="lbl-power" className="font-sans text-xs font-semibold text-slate-700 block mb-1">
                  Evaluate Integer Value (Decimal):
                </label>
                <div id="power-quick-presets" className="flex items-center gap-1.5 flex-wrap">
                  {[8, 12, 16, 31, 64, 100].map((preset) => (
                    <button
                      id={`btn-power-preset-${preset}`}
                      key={preset}
                      onClick={() => handlePowerSubmit(preset)}
                      className={`px-2 py-0.5 rounded text-[11px] font-mono border transition-all ${
                        powerInput === preset
                          ? 'bg-indigo-50 border-indigo-200 text-indigo-700 font-semibold'
                          : 'bg-slate-50 hover:bg-slate-100 text-slate-600 border-slate-200'
                      }`}
                    >
                      {preset}
                    </button>
                  ))}
                </div>
              </div>
              <div id="power-input-container" className="flex items-center gap-2 w-full sm:w-auto">
                <input
                  id="inp-power-value"
                  type="number"
                  min="0"
                  max="1000000000"
                  value={powerInput}
                  onChange={(e) => handlePowerSubmit(parseInt(e.target.value, 10))}
                  className="w-full sm:w-32 px-3 py-2 border border-slate-200 rounded-lg text-sm font-mono focus:outline-none focus:ring-2 focus:ring-indigo-600/20"
                />
              </div>
            </div>

            {/* Clickable quick bit editor for Power of Two */}
            <div id="power-interactive-bits-container" className="border border-slate-100 rounded-lg p-2.5 bg-slate-50/50">
              <span id="power-bits-label" className="font-sans text-[11px] font-semibold text-slate-500 block mb-2">
                Toggle bits to test powers of two (0 - 15):
              </span>
              <div id="power-bits-grid" className="flex gap-1 overflow-x-auto pb-1 justify-between">
                {Array.from({ length: 16 }).map((_, i) => {
                  const bitIndex = 15 - i;
                  const isSet = (powerInput & (1 << bitIndex)) !== 0;
                  return (
                    <button
                      id={`btn-power-bit-toggle-${bitIndex}`}
                      key={bitIndex}
                      onClick={() => togglePowerBit(bitIndex)}
                      className={`flex-1 min-w-[28px] h-8 flex flex-col items-center justify-center rounded border font-mono text-[11px] transition-all ${
                        isSet 
                          ? 'bg-emerald-50 border-emerald-300 text-emerald-700 font-bold shadow-sm'
                          : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-400'
                      }`}
                    >
                      <span className="text-[8px] text-slate-400 leading-none mb-0.5">{bitIndex}</span>
                      <span className="leading-none">{isSet ? '1' : '0'}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Main Interactive Stage Panel */}
      <div id="visualization-stage" className="flex-1 bg-white border border-slate-200 rounded-xl p-6 shadow-sm flex flex-col justify-center min-h-[360px]">
        
        {/* Single Number Visualization */}
        {algoId === 'single-number' && (() => {
          const state: SingleNumberState = currentStep.dataState;
          const nums = state?.nums || [];
          const currentIndex = state?.currentIndex ?? -1;
          const completedIndices = state?.completedIndices || [];
          const accumulator = state?.accumulator ?? 0;

          return (
            <div id="stage-single-number" className="flex flex-col gap-6">
              {/* Array items visual layout */}
              <div id="single-num-array-block" className="flex flex-col gap-2">
                <span id="array-visual-label" className="font-sans text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Array Elements Input
                </span>
                <div id="array-cards-row" className="flex flex-wrap gap-2.5 items-center justify-center p-4 bg-slate-50/50 rounded-xl border border-slate-100">
                  {nums.map((num, idx) => {
                    const isCurrent = idx === currentIndex;
                    const isDone = completedIndices.includes(idx);
                    
                    return (
                      <motion.div
                        id={`num-card-container-${idx}`}
                        key={idx}
                        layout
                        animate={{
                          scale: isCurrent ? 1.08 : 1,
                          y: isCurrent ? -4 : 0
                        }}
                        className={`w-14 h-14 flex flex-col items-center justify-center rounded-xl border font-sans transition-all shadow-sm ${
                          isCurrent
                            ? 'bg-indigo-600 text-white border-indigo-700 ring-4 ring-indigo-100'
                            : isDone
                              ? 'bg-slate-100 text-slate-400 border-slate-200'
                              : 'bg-white text-slate-800 border-slate-200'
                        }`}
                      >
                        <span id={`num-card-val-${idx}`} className="text-lg font-bold font-sans">{num}</span>
                        <span id={`num-card-idx-${idx}`} className={`text-[9px] font-mono ${isCurrent ? 'text-indigo-200' : 'text-slate-400'}`}>
                          i = {idx}
                        </span>
                      </motion.div>
                    );
                  })}
                </div>
              </div>

              {/* Bit cancellation process details */}
              <div id="bitwise-canceler-block" className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
                {/* XOR Sum Accumulator Register Card */}
                <div id="xor-accumulator-card" className="border border-slate-100 rounded-xl p-4 bg-slate-50/30 flex flex-col justify-between">
                  <div id="acc-header" className="flex items-center justify-between mb-3">
                    <span id="acc-label" className="font-sans text-xs font-bold text-slate-500 uppercase tracking-wider">
                      XOR Accumulator Registry
                    </span>
                    <span id="acc-decimal" className="font-mono text-sm font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md border border-indigo-100">
                      xor_sum = {accumulator}
                    </span>
                  </div>

                  {/* 8-bit visual grid */}
                  <div id="acc-bits-grid" className="flex gap-1.5 justify-between">
                    {toBinaryString(accumulator, 8).split('').map((bit, idx) => (
                      <div
                        id={`acc-bit-${idx}`}
                        key={idx}
                        className={`flex-1 h-11 flex flex-col items-center justify-center border rounded-lg font-mono text-xs transition-colors ${
                          bit === '1'
                            ? 'bg-indigo-50 border-indigo-300 text-indigo-700 font-bold'
                            : 'bg-white border-slate-100 text-slate-300'
                        }`}
                      >
                        <span className="text-[7px] text-slate-400 select-none">b{7 - idx}</span>
                        <span className="text-xs font-bold leading-none mt-0.5">{bit}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* XOR Calculation Logic Trace Detail */}
                <div id="bitwise-math-formula-card" className="border border-slate-200/60 rounded-xl p-4 bg-white flex flex-col justify-center">
                  <span id="formula-heading" className="font-sans text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">
                    Current XOR Transformation
                  </span>
                  {currentIndex >= 0 && nums.length > 0 ? (
                    <div id="formula-expression" className="flex flex-col gap-3 font-mono text-xs">
                      <div id="formula-accum-row" className="flex justify-between items-center bg-slate-50 p-2 rounded border border-slate-100">
                        <span className="text-slate-500">Accumulator:</span>
                        <span className="font-semibold text-slate-700">
                          {(accumulator ^ (nums[currentIndex] ?? 0))} (binary: {toBinaryString(accumulator ^ (nums[currentIndex] ?? 0), 8)})
                        </span>
                      </div>
                      
                      <div id="formula-xor-sign" className="text-center font-bold text-indigo-600 text-lg">
                        ⊕ (XOR)
                      </div>

                      <div id="formula-num-row" className="flex justify-between items-center bg-slate-50 p-2 rounded border border-slate-100">
                        <span className="text-slate-500">Current Element:</span>
                        <span className="font-semibold text-slate-700">
                          {(nums[currentIndex] ?? 0)} (binary: {toBinaryString(nums[currentIndex] ?? 0, 8)})
                        </span>
                      </div>

                      <div id="formula-divider" className="border-t border-dashed border-slate-200 my-1"></div>

                      <div id="formula-result-row" className="flex justify-between items-center bg-indigo-50 p-2 rounded border border-indigo-100">
                        <span className="font-sans font-semibold text-indigo-800">New Accumulator:</span>
                        <span className="font-bold text-indigo-700">
                          {accumulator} (binary: {toBinaryString(accumulator, 8)})
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div id="formula-idle-message" className="text-xs text-slate-400 italic text-center py-6">
                      {completedIndices.length === nums.length && nums.length > 0
                        ? 'Simulation complete! Playback or reset to examine cancellation details.'
                        : 'Press Play/Next step to view mathematical cancellation.'}
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })()}

        {/* Hamming Weight Visualization */}
        {algoId === 'hamming-weight' && (() => {
          const state: HammingWeightState = currentStep.dataState;
          const n = state?.n ?? 0;
          const binaryRepresentation = state?.binaryRepresentation || '0'.repeat(32);
          const operationType = state?.operationType || 'idle';
          const maskRepresentation = state?.maskRepresentation || '';
          const count = state?.count ?? 0;
          
          return (
            <div id="stage-hamming-weight" className="flex flex-col gap-6">
              {/* Binary 32-bit visual register grid representation */}
              <div id="hamming-register-container" className="flex flex-col gap-2">
                <div id="hamming-reg-header" className="flex justify-between items-center">
                  <span id="hamming-reg-lbl" className="font-sans text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    32-bit Integer Register Grid
                  </span>
                  <span id="hamming-reg-dec-val" className="font-mono text-xs font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
                    n = {n} (decimal)
                  </span>
                </div>

                <div id="hamming-register-grid" className="grid grid-cols-8 gap-1.5 p-3.5 bg-slate-50 rounded-xl border border-slate-150">
                  {binaryRepresentation.split('').map((bit, idx) => {
                    const bitIndex = 31 - idx;
                    const isSet = bit === '1';
                    
                    // We can highlight the lowest set bit being analyzed or cleared
                    // The bit that will be cleared is the rightmost 1-bit.
                    const isLowestSet = isSet && (n & (1 << bitIndex)) === (n & -n) && n > 0;
                    
                    return (
                      <div
                        id={`hamming-reg-bit-${bitIndex}`}
                        key={bitIndex}
                        className={`h-11 flex flex-col items-center justify-center border rounded-lg transition-colors ${
                          isLowestSet && operationType === 'apply'
                            ? 'bg-rose-50 border-rose-400 text-rose-700 ring-2 ring-rose-200'
                            : isSet
                              ? 'bg-emerald-50 border-emerald-300 text-emerald-700 font-bold'
                              : 'bg-white border-slate-200 text-slate-300'
                        }`}
                      >
                        <span className="text-[7px] text-slate-400 select-none leading-none">b{bitIndex}</span>
                        <span className="text-xs font-bold leading-none mt-0.5">{bit}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Set bit counts and execution formula trace */}
              <div id="hamming-info-block" className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Kernighan math box */}
                <div id="hamming-math-card" className="border border-slate-150 rounded-xl p-4 bg-white flex flex-col justify-center">
                  <span id="hamming-math-title" className="font-sans text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">
                    Bit-Clearing Operation Trace
                  </span>
                  {operationType === 'apply' || operationType === 'check' || operationType === 'increment' ? (
                    <div id="hamming-math-details" className="font-mono text-xs flex flex-col gap-2">
                      <div id="hamming-math-n" className="flex justify-between p-1.5 bg-slate-50 rounded">
                        <span>n:</span>
                        <span>{(n === 0 && operationType === 'apply') ? toBinaryString(n, 8) : toBinaryString(n, 8)} ({n})</span>
                      </div>
                      <div id="hamming-math-n-minus" className="flex justify-between p-1.5 bg-slate-50 rounded">
                        <span>n - 1:</span>
                        <span className="text-rose-600">
                          {maskRepresentation ? toBinaryString(parseInt(maskRepresentation, 2), 8) : '...'} ({maskRepresentation ? parseInt(maskRepresentation, 2) : ''})
                        </span>
                      </div>
                      <div className="border-t border-dashed border-slate-200 my-0.5"></div>
                      <div id="hamming-math-result" className="flex justify-between p-1.5 bg-emerald-50 text-emerald-800 rounded font-semibold border border-emerald-100">
                        <span>n & (n - 1):</span>
                        <span>{toBinaryString(n, 8)} ({n})</span>
                      </div>
                    </div>
                  ) : (
                    <div id="hamming-math-idle" className="text-xs text-slate-400 italic py-6 text-center">
                      Register evaluation complete. Run/Step to watch the lowest set bit disappear.
                    </div>
                  )}
                </div>

                {/* Counter Visual Box */}
                <div id="hamming-counter-card" className="border border-slate-200 rounded-xl p-4 bg-slate-50/50 flex flex-col items-center justify-center">
                  <span id="hamming-count-label" className="font-sans text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">
                    Set Bit Counter
                  </span>
                  <div id="hamming-counter-bubble" className="w-16 h-16 rounded-full bg-indigo-600 text-white font-sans font-bold text-2xl flex items-center justify-center shadow-md border-4 border-indigo-100 mt-2">
                    {count}
                  </div>
                  <span id="hamming-count-caption" className="font-sans text-[10px] text-slate-400 block mt-2 text-center">
                    Count of set bits in the 32-bit register
                  </span>
                </div>
              </div>
            </div>
          );
        })()}

        {/* Power of Two Visualization */}
        {algoId === 'power-of-two' && (() => {
          const state: PowerOfTwoState = currentStep.dataState;
          const originalN = state?.originalN ?? 0;
          const nMinusOneBinary = state?.nMinusOneBinary || '';
          const andResultBinary = state?.andResultBinary || '';
          const operationType = state?.operationType || 'idle';
          const isPowerOfTwo = state?.isPowerOfTwo ?? false;
          
          return (
            <div id="stage-power-of-two" className="flex flex-col gap-6">
              {/* Subtraction and AND operation grid stack */}
              <div id="power-operation-stack" className="flex flex-col gap-3 p-4 bg-slate-50 rounded-xl border border-slate-100">
                <span id="power-op-label" className="font-sans text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1">
                  Bitwise Overlap Evaluation Grid
                </span>

                {/* Grid Row for N */}
                <div id="power-grid-row-n" className="flex items-center gap-3">
                  <span id="power-lbl-n" className="font-mono text-xs text-slate-500 w-16">N ({originalN})</span>
                  <div id="power-bit-row-n" className="flex gap-1 flex-1 justify-between">
                    {toBinaryString(originalN, 16).split('').map((bit, idx) => (
                      <div
                        id={`power-n-bit-${idx}`}
                        key={idx}
                        className={`flex-1 h-9 flex items-center justify-center border rounded-md font-mono text-[11px] transition-colors ${
                          bit === '1'
                            ? 'bg-indigo-50 border-indigo-300 text-indigo-700 font-bold'
                            : 'bg-white border-slate-100 text-slate-300'
                        }`}
                      >
                        {bit}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Grid Row for N - 1 */}
                <div id="power-grid-row-n-minus" className="flex items-center gap-3">
                  <span id="power-lbl-n-minus" className="font-mono text-xs text-slate-500 w-16">N - 1 ({Math.max(0, originalN - 1)})</span>
                  <div id="power-bit-row-n-minus" className="flex gap-1 flex-1 justify-between">
                    {nMinusOneBinary !== 'N/A' && nMinusOneBinary !== '' ? (
                      toBinaryString(Math.max(0, originalN - 1), 16).split('').map((bit, idx) => (
                        <div
                          id={`power-nminus-bit-${idx}`}
                          key={idx}
                          className={`flex-1 h-9 flex items-center justify-center border rounded-md font-mono text-[11px] transition-colors ${
                            bit === '1'
                              ? 'bg-amber-50 border-amber-300 text-amber-700 font-bold'
                              : 'bg-white border-slate-100 text-slate-300'
                          }`}
                        >
                          {bit}
                        </div>
                      ))
                    ) : (
                      <div className="flex-1 text-center font-sans text-xs text-slate-400 italic">Not Applicable</div>
                    )}
                  </div>
                </div>

                {/* Divider with AND Symbol */}
                <div id="power-math-divider" className="flex items-center gap-3">
                  <span id="power-and-symbol" className="font-mono text-sm font-bold text-slate-400 w-16 text-right">AND (&)</span>
                  <div id="power-divider-line" className="flex-1 border-t-2 border-dashed border-slate-200"></div>
                </div>

                {/* Grid Row for Result */}
                <div id="power-grid-row-result" className="flex items-center gap-3">
                  <span id="power-lbl-result" className="font-mono text-xs text-slate-500 w-16">Result</span>
                  <div id="power-bit-row-result" className="flex gap-1 flex-1 justify-between">
                    {andResultBinary ? (
                      andResultBinary.split('').map((bit, idx) => {
                        const hasOverlap = bit === '1';
                        return (
                          <div
                            id={`power-and-bit-${idx}`}
                            key={idx}
                            className={`flex-1 h-9 flex items-center justify-center border rounded-md font-mono text-[11px] transition-colors ${
                              hasOverlap
                                ? 'bg-rose-50 border-rose-300 text-rose-700 font-bold ring-2 ring-rose-100'
                                : 'bg-emerald-50 border-emerald-200 text-emerald-700 font-medium'
                            }`}
                          >
                            {bit}
                          </div>
                        );
                      })
                    ) : (
                      <div className="flex-1 text-center font-sans text-xs text-slate-400 italic py-1">Awaiting AND execution step</div>
                    )}
                  </div>
                </div>
              </div>

              {/* Overlap outcome badge */}
              {operationType === 'and-operation' && (
                <div
                  id="power-outcome-banner"
                  className={`p-4 rounded-xl border flex flex-col items-center justify-center text-center transition-all ${
                    isPowerOfTwo
                      ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                      : 'bg-rose-50 border-rose-200 text-rose-800'
                  }`}
                >
                  <span id="power-outcome-title" className="font-sans font-bold text-sm mb-1">
                    {isPowerOfTwo ? 'Power of Two Detected! 🎉' : 'Not a Power of Two ❌'}
                  </span>
                  <span id="power-outcome-desc" className="font-sans text-xs max-w-lg leading-relaxed">
                    {isPowerOfTwo
                      ? `Since n & (n - 1) is exactly equal to 0, there are absolutely no overlapping '1' columns. This mathematically proves that ${originalN} has exactly one set bit, meaning it is a power of 2!`
                      : `Since n & (n - 1) is ${originalN & (originalN - 1)} (which is NOT equal to 0), there is at least one overlapping set bit column. This proves that ${originalN} has multiple set bits, meaning it is not a power of 2.`}
                  </span>
                </div>
              )}
            </div>
          );
        })()}

      </div>
    </div>
  );
};
