import React from 'react';
import { SimulationStep, CellState, AlgorithmId } from '../types';

interface SlidingPatternCanvasProps {
  step: SimulationStep;
  algorithmId: AlgorithmId;
}

export default function SlidingPatternCanvas({ step, algorithmId }: SlidingPatternCanvasProps) {
  const text = step.text || '';
  const pattern = step.pattern || '';
  const textPointer = step.textPointer;
  const patternPointer = step.patternPointer;
  const textStates = step.textStates || {};
  const patternStates = step.patternStates || {};
  const slidingOffset = step.slidingOffset ?? 0;
  
  // Helper for rendering character cards with appropriate states
  const getCellClasses = (state: CellState) => {
    switch (state) {
      case 'matched':
        return 'bg-emerald-50 text-emerald-900 border-emerald-400 font-bold scale-[1.02] shadow-sm';
      case 'mismatched':
        return 'bg-rose-50 text-rose-800 border-rose-400 font-bold shake-anim scale-[1.02] shadow-sm';
      case 'scanning':
        return 'bg-amber-100 text-amber-900 border-amber-400 font-semibold animate-pulse';
      case 'active':
        return 'bg-amber-500 text-white border-amber-600 font-bold scale-105 shadow-md';
      case 'prefix':
        return 'bg-amber-50 text-amber-800 border-amber-300 font-semibold';
      case 'suffix':
        return 'bg-indigo-50 text-indigo-950 border-indigo-300 font-semibold';
      case 'highlight':
        return 'bg-amber-50 text-amber-800 border-amber-200';
      default:
        return 'bg-white text-slate-700 border-slate-200 hover:border-slate-300';
    }
  };

  // 1. Classical Sliding Track
  const renderSlidingTrack = () => {
    const textChars = text.split('');
    const patternChars = pattern.split('');

    return (
      <div className="flex flex-col gap-6 py-4 w-full overflow-x-auto select-none font-mono">
        {/* Upper Track: Text T */}
        <div className="flex flex-col gap-1 min-w-max">
          <div className="flex items-center gap-1.5">
            <span className="w-16 text-right font-sans text-xs font-semibold text-slate-500 pr-2 whitespace-nowrap">Text T</span>
            <div className="flex gap-1.5">
              {textChars.map((char, idx) => {
                const cellState = textStates[idx] || 'neutral';
                const isActive = idx === textPointer;
                return (
                  <div key={idx} className="flex flex-col items-center">
                    <span className="text-[10px] font-mono text-slate-400 mb-0.5">{idx}</span>
                    <div className={`w-9 h-10 border flex items-center justify-center rounded-lg text-sm transition-all duration-200 ${getCellClasses(cellState)}`}>
                      {char === ' ' ? '␣' : char}
                    </div>
                    <div className="h-4 flex items-center justify-center mt-1">
                      {isActive && (
                        <div className="flex flex-col items-center">
                          <span className="text-[10px] font-sans font-bold text-amber-600 animate-bounce">i</span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Lower Track: Sliding Pattern P */}
        <div className="flex flex-col gap-1 min-w-max">
          <div className="flex items-center gap-1.5">
            <span className="w-16 text-right font-sans text-xs font-semibold text-slate-500 pr-2 whitespace-nowrap">Pattern P</span>
            <div className="flex gap-1.5" style={{ marginLeft: `${slidingOffset * 42}px`, transition: 'margin-left 0.3s cubic-bezier(0.16, 1, 0.3, 1)' }}>
              {patternChars.map((char, idx) => {
                const cellState = patternStates[idx] || 'neutral';
                const isActive = idx === patternPointer;
                return (
                  <div key={idx} className="flex flex-col items-center">
                    <div className="h-4 flex items-center justify-center mb-1">
                      {isActive && (
                        <div className="flex flex-col items-center justify-end">
                          <span className="text-[10px] font-sans font-bold text-indigo-600 animate-bounce">j</span>
                        </div>
                      )}
                    </div>
                    <div className={`w-9 h-10 border flex items-center justify-center rounded-lg text-sm transition-all duration-200 ${getCellClasses(cellState)}`}>
                      {char}
                    </div>
                    <span className="text-[10px] font-mono text-slate-400 mt-0.5">{idx}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* KMP Skip Arc Visual Overlays */}
        {step.skipArc && (
          <div className="mx-16 p-2 bg-amber-50/50 rounded-lg border border-amber-200/50 flex items-center gap-2 text-xs text-amber-800 max-w-xl transition-all font-sans">
            <div className="w-2 h-2 rounded-full bg-amber-500 animate-ping" />
            <span>
              <strong>KMP Fallback Triggered:</strong> Mismatch at pattern index <strong>j = {step.skipArc.from}</strong>. Sliding pointer back using LPS index to <strong>j = {step.skipArc.to}</strong>. Redundant text pointer backtracking avoided!
            </span>
          </div>
        )}
      </div>
    );
  };

  // 2. LPS Table View (For LPS computation)
  const renderLpsTable = () => {
    const chars = text.split('');
    const lps = step.lps || Array(chars.length).fill(0);

    return (
      <div className="flex flex-col gap-4 py-3 overflow-x-auto font-mono">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-500 font-sans w-20 text-right">Indices:</span>
          <div className="flex gap-1.5">
            {chars.map((_, idx) => (
              <div key={idx} className="w-10 text-center text-xs text-slate-400">
                {idx}
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-500 font-sans w-20 text-right">Characters:</span>
          <div className="flex gap-1.5">
            {chars.map((char, idx) => {
              const cellState = textStates[idx] || 'neutral';
              const isI = idx === textPointer;
              const isLen = idx === patternPointer;
              let customBg = getCellClasses(cellState);
              if (isI) customBg = 'bg-indigo-50 border-indigo-400 text-indigo-900 font-bold';
              if (isLen) customBg = 'bg-amber-100 border-amber-400 text-amber-900 font-bold';

              return (
                <div key={idx} className={`w-10 h-10 border rounded-lg flex items-center justify-center text-sm transition-all duration-200 relative ${customBg}`}>
                  {char}
                  {isI && <span className="absolute -top-3 text-[9px] font-sans font-bold text-indigo-600">i</span>}
                  {isLen && <span className="absolute -bottom-3.5 text-[9px] font-sans font-bold text-amber-600">len</span>}
                </div>
              );
            })}
          </div>
        </div>

        <div className="flex items-center gap-2 mt-2">
          <span className="text-xs font-semibold text-slate-500 font-sans w-20 text-right">LPS Value:</span>
          <div className="flex gap-1.5">
            {chars.map((_, idx) => {
              const isFilled = idx < textPointer;
              const isCurrent = idx === textPointer;
              return (
                <div key={idx} className={`w-10 h-10 border rounded-lg flex items-center justify-center text-xs font-bold transition-all duration-200 ${
                  isCurrent ? 'bg-amber-500 text-white border-amber-600 scale-105 shadow-sm' :
                  isFilled ? 'bg-slate-50 text-slate-700 border-slate-300' : 'bg-slate-50/30 text-slate-300 border-slate-100'
                }`}>
                  {isFilled || isCurrent ? lps[idx] : '-'}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  // 3. Rabin-Karp Hash Registers
  const renderRabinKarpRegisters = () => {
    const textChars = text.split('');
    const patChars = pattern.split('');
    const m = patChars.length;
    const windowStart = step.hashWindowStart ?? 0;

    return (
      <div className="flex flex-col gap-6 py-2 w-full font-mono">
        {/* Sliding text view */}
        <div className="overflow-x-auto pb-2">
          <div className="flex items-center gap-1.5 min-w-max">
            <span className="w-16 text-right font-sans text-xs font-semibold text-slate-500 pr-2">Text T</span>
            <div className="flex gap-1">
              {textChars.map((char, idx) => {
                const isInWindow = idx >= windowStart && idx < windowStart + m;
                const cellState = textStates[idx] || 'neutral';
                let borderStyle = 'border-slate-100 bg-white text-slate-400';
                if (isInWindow) {
                  borderStyle = 'border-amber-400 bg-amber-50/30 text-amber-900 font-semibold';
                }
                if (cellState === 'matched') {
                  borderStyle = 'border-emerald-400 bg-emerald-50 text-emerald-900 font-bold';
                } else if (cellState === 'mismatched') {
                  borderStyle = 'border-rose-400 bg-rose-50 text-rose-800 font-bold';
                } else if (cellState === 'active') {
                  borderStyle = 'border-amber-500 bg-amber-500 text-white font-bold';
                }

                return (
                  <div key={idx} className="flex flex-col items-center">
                    <span className="text-[9px] text-slate-400 mb-0.5">{idx}</span>
                    <div className={`w-9 h-10 border flex items-center justify-center rounded-lg text-sm transition-all duration-200 ${borderStyle}`}>
                      {char}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Dual Hash Registers display */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl font-sans">
          {/* Target Pattern Register */}
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/80 flex flex-col justify-between">
            <div>
              <span className="text-[10px] font-bold tracking-wider text-slate-400 uppercase">Target Pattern Hash</span>
              <h4 className="text-xl font-serif text-slate-800 mt-1">H(P) = {step.hashTarget ?? 0}</h4>
              <p className="text-xs text-slate-500 mt-1 font-mono">
                P = "{pattern}" &middot; Mod {step.hashMod ?? 101}
              </p>
            </div>
            <div className="mt-3 flex items-center gap-1.5 text-[11px] text-slate-500 font-mono bg-white p-1.5 rounded border border-slate-100">
              <span className="text-indigo-600 font-bold">H(P)</span> = &Sigma; (P[i] &middot; {step.hashBase ?? 256}<sup>m-1-i</sup>)
            </div>
          </div>

          {/* Current Window Rolling Register */}
          <div className={`p-4 rounded-xl border flex flex-col justify-between transition-colors ${
            step.spuriousHit ? 'bg-amber-50/70 border-amber-300' :
            step.hashCurrent === step.hashTarget ? 'bg-emerald-50/70 border-emerald-300' :
            'bg-slate-50 border-slate-200/80'
          }`}>
            <div>
              <span className="text-[10px] font-bold tracking-wider text-slate-400 uppercase">Current Window Hash</span>
              <h4 className={`text-xl font-serif mt-1 ${
                step.spuriousHit ? 'text-amber-800 font-bold' :
                step.hashCurrent === step.hashTarget ? 'text-emerald-800 font-bold' :
                'text-slate-800'
              }`}>
                H(T<sub>[{windowStart}...{windowStart + m - 1}]</sub>) = {step.hashCurrent ?? 0}
              </h4>
              <p className="text-xs text-slate-500 mt-1 font-mono">
                Window: "{text.substr(windowStart, m)}" &middot; Offset: {windowStart}
              </p>
            </div>

            {/* Verification Status or slide calculation formula */}
            <div className="mt-3">
              {step.spuriousHit ? (
                <div className="flex items-center gap-1.5 text-[11px] text-amber-800 bg-white p-1.5 rounded border border-amber-200 font-mono font-semibold animate-pulse">
                  ⚠️ Hash Collision! Verifying characters...
                </div>
              ) : step.hashCurrent === step.hashTarget && step.hashTarget !== 0 ? (
                <div className="flex items-center gap-1.5 text-[11px] text-emerald-800 bg-white p-1.5 rounded border border-emerald-200 font-mono font-semibold">
                  ✓ genuine Match Verified!
                </div>
              ) : (
                <div className="flex items-center gap-1.5 text-[11px] text-slate-500 font-mono bg-white p-1.5 rounded border border-slate-100">
                  <span className="text-amber-600 font-bold">H<sub>next</sub></span> = ((H<sub>curr</sub> - T[out]&middot;{step.hashPower ?? 1})&middot;B + T[in]) % M
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  // 4. Z-Algorithm Box View
  const renderZAlgorithmCanvas = () => {
    const chars = text.split(''); // Full concatenated string S = P + "$" + T
    const zArray = step.zArray || Array(chars.length).fill(0);
    const boxL = step.zBoxL ?? 0;
    const boxR = step.zBoxR ?? 0;

    return (
      <div className="flex flex-col gap-5 py-2 w-full font-mono overflow-x-auto">
        <div className="flex flex-col gap-1.5 min-w-max">
          <div className="flex items-center gap-2">
            <span className="w-16 text-right font-sans text-xs font-semibold text-slate-500 pr-2">String S</span>
            <div className="flex gap-1.5">
              {chars.map((char, idx) => {
                const cellState = textStates[idx] || 'neutral';
                const isI = idx === textPointer;
                const isInZBox = idx >= boxL && idx <= boxR && boxR > 0;
                
                let cellStyle = getCellClasses(cellState);
                if (isInZBox && cellState === 'neutral') {
                  cellStyle = 'bg-amber-50/40 border-amber-300 text-amber-900 font-medium';
                }

                return (
                  <div key={idx} className="flex flex-col items-center">
                    <span className="text-[9px] text-slate-400 mb-0.5">{idx}</span>
                    <div className={`w-9 h-10 border flex items-center justify-center rounded-lg text-sm transition-all duration-200 relative ${cellStyle}`}>
                      {char}
                      {idx === boxL && boxR > 0 && (
                        <span className="absolute -top-3.5 -left-1 text-[8px] bg-amber-500 text-white px-0.5 rounded font-sans font-bold">L</span>
                      )}
                      {idx === boxR && boxR > 0 && (
                        <span className="absolute -top-3.5 -right-1 text-[8px] bg-amber-500 text-white px-0.5 rounded font-sans font-bold">R</span>
                      )}
                    </div>
                    <div className="h-4 flex items-center justify-center mt-1">
                      {isI && (
                        <span className="text-[10px] font-sans font-bold text-amber-600 animate-bounce">i</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Z-Values array table */}
        <div className="flex flex-col gap-1.5 min-w-max">
          <div className="flex items-center gap-2">
            <span className="w-16 text-right font-sans text-xs font-semibold text-slate-500 pr-2">Z-Value</span>
            <div className="flex gap-1.5">
              {chars.map((_, idx) => {
                const isCalculated = idx < textPointer;
                const isCurrent = idx === textPointer;
                
                return (
                  <div key={idx} className={`w-9 h-9 border rounded-lg flex items-center justify-center text-xs font-bold transition-all duration-200 ${
                    isCurrent ? 'bg-amber-500 text-white border-amber-600 scale-105 shadow-sm' :
                    isCalculated ? 'bg-slate-50 text-slate-800 border-slate-200' : 'bg-slate-50/20 text-slate-300 border-slate-100'
                  }`}>
                    {isCalculated || isCurrent ? zArray[idx] : '-'}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {boxR > 0 && (
          <div className="p-3 bg-amber-50/50 border border-amber-200 rounded-lg max-w-xl text-xs text-amber-900 font-sans">
            <strong>Active Z-box matches [L={boxL} ... R={boxR}]:</strong> S[{boxL}...{boxR}] matches the prefix substring S[0...{boxR - boxL}].
          </div>
        )}
      </div>
    );
  };

  // 5. Manacher's Palindrome Expansion Radar
  const renderManacherCanvas = () => {
    const chars = text.split(''); // Transformed string, e.g. ^ # a # b # a # $
    const radiusArray = step.manacherP || Array(chars.length).fill(0);
    const center = step.manacherCenter ?? 0;
    const right = step.manacherRight ?? 0;
    const mirror = step.manacherMirror ?? 0;
    const currentRadius = step.manacherCurrentRadius ?? 0;

    return (
      <div className="flex flex-col gap-6 py-2 w-full font-mono overflow-x-auto">
        {/* Transformed String View */}
        <div className="flex flex-col gap-1.5 min-w-max">
          <div className="flex items-center gap-2">
            <span className="w-16 text-right font-sans text-xs font-semibold text-slate-500 pr-2">Transformed T</span>
            <div className="flex gap-1">
              {chars.map((char, idx) => {
                const cellState = textStates[idx] || 'neutral';
                const isI = idx === textPointer;
                const isCenter = idx === center;
                const isMirror = idx === mirror && mirror > 0;
                const isInSymmetry = idx >= center - radiusArray[center] && idx <= center + radiusArray[center] && radiusArray[center] > 0;
                
                let cellStyle = getCellClasses(cellState);
                if (isCenter) {
                  cellStyle = 'bg-amber-500 text-white border-amber-600 font-bold scale-105 shadow-sm';
                } else if (isMirror) {
                  cellStyle = 'bg-indigo-50 border-indigo-400 text-indigo-900 font-bold';
                } else if (isInSymmetry && cellState === 'neutral') {
                  cellStyle = 'bg-slate-50/80 border-slate-300 text-slate-800';
                }

                return (
                  <div key={idx} className="flex flex-col items-center">
                    <span className="text-[9px] text-slate-400 mb-0.5">{idx}</span>
                    <div className={`w-8 h-9 border flex items-center justify-center rounded-lg text-xs transition-all duration-200 relative ${cellStyle}`}>
                      {char}
                      {isCenter && (
                        <span className="absolute -top-3.5 text-[8px] bg-amber-600 text-white px-0.5 rounded font-sans font-bold">C</span>
                      )}
                      {isMirror && (
                        <span className="absolute -top-3.5 text-[8px] bg-indigo-600 text-white px-0.5 rounded font-sans font-bold">i'</span>
                      )}
                    </div>
                    <div className="h-4 flex items-center justify-center mt-1">
                      {isI && !isCenter && (
                        <span className="text-[10px] font-sans font-bold text-amber-600 animate-bounce">i</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Radius array table */}
        <div className="flex flex-col gap-1.5 min-w-max">
          <div className="flex items-center gap-2">
            <span className="w-16 text-right font-sans text-xs font-semibold text-slate-500 pr-2">Radius P[i]</span>
            <div className="flex gap-1">
              {chars.map((_, idx) => {
                const isCalculated = idx < textPointer;
                const isCurrent = idx === textPointer;
                const isCenter = idx === center;
                return (
                  <div key={idx} className={`w-8 h-8 border rounded-lg flex items-center justify-center text-[10px] font-bold transition-all duration-200 ${
                    isCurrent ? 'bg-amber-100 text-amber-900 border-amber-400 scale-105' :
                    isCenter ? 'bg-amber-500 text-white border-amber-600' :
                    isCalculated ? 'bg-slate-50 text-slate-800 border-slate-200' : 'bg-slate-50/10 text-slate-300 border-slate-100'
                  }`}>
                    {isCalculated || isCurrent ? radiusArray[idx] : '-'}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Expansion Radar Visual description */}
        {radiusArray[center] > 0 && (
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg max-w-xl text-xs text-slate-700 font-sans flex flex-col gap-1">
            <span><strong>Mirror Reflection State:</strong> Center C = {center}, Right wall R = {right}.</span>
            {mirror > 0 && (
              <span>Mirror index of current cell i is <strong>i' = {mirror}</strong>. We pre-size P[{textPointer}] to <strong>P[{mirror}] = {radiusArray[mirror]}</strong> before expanding outward!</span>
            )}
          </div>
        )}
      </div>
    );
  };

  // 6. Generic Two-Pointer View (For reversing words, valid palindrome, compression, isomorphic, anagram etc.)
  const renderGenericPointersCanvas = () => {
    const chars = text.split('');
    const leftPtr = step.twoPointers?.left ?? -1;
    const rightPtr = step.twoPointers?.right ?? -1;
    const writePtr = step.twoPointers?.write ?? -1;

    return (
      <div className="flex flex-col gap-6 py-4 w-full overflow-x-auto select-none font-mono">
        <div className="flex items-center gap-2 min-w-max">
          <span className="w-16 text-right font-sans text-xs font-semibold text-slate-500 pr-2 whitespace-nowrap">String S</span>
          <div className="flex gap-1.5">
            {chars.map((char, idx) => {
              const cellState = textStates[idx] || 'neutral';
              const isLeft = idx === leftPtr;
              const isRight = idx === rightPtr;
              const isWrite = idx === writePtr;

              return (
                <div key={idx} className="flex flex-col items-center">
                  <span className="text-[9px] text-slate-400 mb-0.5">{idx}</span>
                  <div className={`w-9 h-10 border flex items-center justify-center rounded-lg text-sm transition-all duration-200 relative ${getCellClasses(cellState)}`}>
                    {char === ' ' ? '␣' : char}
                    
                    {/* Tiny inline markers for pointer positions */}
                    {isWrite && (
                      <span className="absolute -top-1.5 -right-1 text-[8px] bg-amber-500 text-white px-0.5 rounded font-sans font-bold">W</span>
                    )}
                  </div>
                  
                  {/* Visual pointers beneath cells */}
                  <div className="h-5 flex items-center justify-center mt-1 relative w-full">
                    <div className="flex flex-col items-center absolute">
                      {isLeft && isRight ? (
                        <span className="text-[10px] font-sans font-bold text-red-600 animate-pulse">L&amp;R</span>
                      ) : isLeft ? (
                        <span className="text-[10px] font-sans font-bold text-amber-600 animate-bounce">Left</span>
                      ) : isRight ? (
                        <span className="text-[10px] font-sans font-bold text-indigo-600 animate-bounce">Right</span>
                      ) : null}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Render Isomorphic mapping or Anagram frequency deltas inside the canvas if applicable */}
        {algorithmId === 'isomorphic_strings' && step.mappingStoT && step.mappingTtoS && (
          <div className="mt-2 grid grid-cols-2 gap-4 max-w-lg font-sans">
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Map S &rarr; T</span>
              <div className="mt-1 flex flex-wrap gap-1.5 font-mono text-xs text-slate-700">
                {Object.keys(step.mappingStoT || {}).length === 0 ? (
                  <span className="text-slate-400 italic">No mappings yet</span>
                ) : (
                  Object.entries(step.mappingStoT || {}).map(([src, dst]) => (
                    <span key={src} className="px-1.5 py-0.5 bg-white border rounded">
                      '{src}' &rarr; '{dst}'
                    </span>
                  ))
                )}
              </div>
            </div>
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Map T &rarr; S</span>
              <div className="mt-1 flex flex-wrap gap-1.5 font-mono text-xs text-slate-700">
                {Object.keys(step.mappingTtoS || {}).length === 0 ? (
                  <span className="text-slate-400 italic">No mappings yet</span>
                ) : (
                  Object.entries(step.mappingTtoS || {}).map(([src, dst]) => (
                    <span key={src} className="px-1.5 py-0.5 bg-white border rounded">
                      '{src}' &rarr; '{dst}'
                    </span>
                  ))
                )}
              </div>
            </div>
          </div>
        )}

        {algorithmId === 'valid_anagram' && step.charFrequencyDelta && (
          <div className="mt-1 p-3 bg-slate-50 border border-slate-200 rounded-lg font-sans">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Alphabet Bucket Frequency Delta</span>
            <div className="mt-2 flex flex-wrap gap-1.5 text-xs">
              {Object.entries(step.charFrequencyDelta)
                .filter(([_, val]) => val !== 0)
                .map(([char, val]) => (
                  <span key={char} className={`px-2 py-0.5 rounded border font-mono ${
                    val > 0 ? 'bg-amber-50 text-amber-800 border-amber-300' : 'bg-indigo-50 text-indigo-800 border-indigo-300'
                  }`}>
                    {char}: {val > 0 ? `+${val}` : val}
                  </span>
                ))}
              {Object.values(step.charFrequencyDelta).every(v => v === 0) && (
                <span className="text-emerald-700 font-medium text-xs bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded">
                  ✓ All frequency buckets balanced (0)
                </span>
              )}
            </div>
          </div>
        )}
      </div>
    );
  };

  // Route canvas display depending on problem category
  switch (algorithmId) {
    case 'strstr_naive':
    case 'kmp_search':
      return renderSlidingTrack();
    case 'kmp_lps':
    case 'repeated_substring':
      return renderLpsTable();
    case 'rabin_karp':
      return renderRabinKarpRegisters();
    case 'z_algorithm':
      return renderZAlgorithmCanvas();
    case 'manacher':
      return renderManacherCanvas();
    default:
      return renderGenericPointersCanvas();
  }
}
