import React from 'react';
import { SimulationStep } from '../types';
import { ArrowRight, Flame, Fuel, Zap, Clock, ShieldAlert } from 'lucide-react';

interface QueueCanvasProps {
  algorithmId: string;
  step: SimulationStep;
}

export const QueueCanvas: React.FC<QueueCanvasProps> = ({ algorithmId, step }) => {
  // Safe default values from active simulation step
  const {
    queue = [],
    front = 0,
    rear = 0,
    count = 0,
    capacity = 5,
    stack1 = [],
    stack2 = [],
    queue1 = [],
    array = [],
    prefixSums = [],
    windowL = null,
    windowR = null,
    deque = [],
    maxDeque = [],
    minDeque = [],
    ans,
    charFreq = {},
    sum = 0,
    average = 0,
    deck = [],
    revealed = [],
    grid = [],
    orangeQueue = [],
    freshCount = 0,
    minutes = 0,
    activeCells = [],
    gas = [],
    cost = [],
    tank = 0,
    startCandidate = 0,
    activeStation = null,
    taskCounts = {},
    taskCooldowns = {},
    scheduleResult = [],
    time = 0,
    highlightedIndices = [],
  } = step;

  // Render 1: Standard Linear Queue
  const renderLinearQueue = () => {
    return (
      <div className="flex flex-col items-center justify-center h-full p-4 font-mono">
        <div className="text-xs font-semibold text-slate-400 mb-6 uppercase tracking-wider">
          Standard Linear Queue (Bounded)
        </div>

        {/* Pointer indicators above the array */}
        <div className="w-full max-w-2xl flex items-center justify-between mb-2 px-1 text-[11px] h-6 relative">
          {queue.map((_, idx) => {
            const isFront = idx === front;
            const isRear = idx === rear;
            if (!isFront && !isRear) return <div key={idx} className="w-14" />;

            return (
              <div
                key={idx}
                className="w-14 flex flex-col items-center justify-center absolute transition-all duration-300"
                style={{
                  left: `calc(${(idx / capacity) * 100}% + 8px)`,
                  transform: 'translateX(-50%)',
                }}
              >
                {isFront && isRear ? (
                  <span className="bg-amber-500 text-slate-950 font-bold px-1 py-0.5 rounded text-[9px] shadow-xs">
                    F & R
                  </span>
                ) : isFront ? (
                  <span className="bg-emerald-600 text-white font-bold px-1.5 py-0.5 rounded text-[9px] shadow-xs">
                    FRONT
                  </span>
                ) : (
                  <span className="bg-slate-700 text-slate-200 font-bold px-1.5 py-0.5 rounded text-[9px] shadow-xs">
                    REAR
                  </span>
                )}
              </div>
            );
          })}
        </div>

        {/* Queue Array */}
        <div className="flex items-center gap-2 border-y border-slate-300 bg-slate-50 p-4 rounded-xl shadow-xs w-full max-w-2xl justify-between">
          <div className="text-slate-400 text-xs font-bold uppercase select-none px-2 shrink-0">
            Front Deq ➔
          </div>

          <div className="flex items-center gap-1.5 flex-1 justify-around">
            {queue.map((val, idx) => {
              const isOccupied = val !== null;
              const isActive = idx >= (front ?? 0) && idx < (rear ?? 0);
              const isHighlighted = highlightedIndices.includes(idx);

              let cellClass = 'border-slate-200 bg-white text-slate-300';
              if (isActive) {
                cellClass = 'border-amber-400 bg-amber-50 text-amber-900 shadow-xs font-bold scale-102';
              }
              if (isHighlighted) {
                cellClass = 'border-rose-500 bg-rose-50 text-rose-900 font-bold animate-pulse';
              }

              return (
                <div key={idx} className="flex flex-col items-center gap-1">
                  <div
                    className={`w-12 h-12 rounded-lg border-2 flex items-center justify-center text-sm transition-all duration-300 ${cellClass}`}
                  >
                    {isOccupied ? val : '∅'}
                  </div>
                  <span className="text-[10px] text-slate-400 font-bold">idx {idx}</span>
                </div>
              );
            })}
          </div>

          <div className="text-slate-400 text-xs font-bold uppercase select-none px-2 shrink-0">
            ➔ Enq Rear
          </div>
        </div>

        {/* Capacity status info */}
        <div className="mt-6 flex gap-6 text-xs text-slate-500">
          <div>
            Capacity: <span className="font-bold text-slate-800">{capacity}</span>
          </div>
          <div>
            Size: <span className="font-bold text-slate-800">{(rear ?? 0) - (front ?? 0)}</span>
          </div>
          <div>
            Status:{' '}
            {rear === capacity ? (
              <span className="text-rose-600 font-bold flex items-center gap-1 inline-flex">
                <ShieldAlert className="w-3 h-3" /> Overflow State (Linear Block)
              </span>
            ) : front === rear ? (
              <span className="text-amber-600 font-medium">Empty</span>
            ) : (
              <span className="text-emerald-600 font-medium">Active</span>
            )}
          </div>
        </div>
      </div>
    );
  };

  // Render 2 & 3: Circular Queue / Deque
  const renderCircularCanvas = () => {
    // Generate circular coordinates for the SVG
    const cx = 150;
    const cy = 110;
    const r = 68;
    const cellsCount = capacity || 5;

    const sectors = Array.from({ length: cellsCount }).map((_, i) => {
      const angle = (i * 2 * Math.PI) / cellsCount - Math.PI / 2;
      const x = cx + r * Math.cos(angle);
      const y = cy + r * Math.sin(angle);
      return { index: i, x, y };
    });

    return (
      <div className="flex flex-col items-center justify-center h-full p-2 font-mono">
        <div className="text-xs font-semibold text-slate-400 mb-2 uppercase tracking-wider">
          Circular Buffer Ring ➔ (i + 1) % {cellsCount}
        </div>

        <div className="relative w-[300px] h-[220px]">
          <svg className="w-full h-full select-none" viewBox="0 0 300 220">
            {/* Inner Ring circle track */}
            <circle cx={cx} cy={cy} r={r} fill="none" stroke="#e2e8f0" strokeWidth="24" />
            <circle cx={cx} cy={cy} r={r} fill="none" stroke="#cbd5e1" strokeWidth="1" strokeDasharray="3 3" />

            {/* Render slots */}
            {sectors.map((sec) => {
              const val = queue[sec.index];
              const isOccupied = val !== null;
              const isFront = sec.index === front;
              const isRear = sec.index === rear;
              const isHighlighted = highlightedIndices.includes(sec.index);

              // Cell Color codes
              let fillBg = '#ffffff';
              let strokeCol = '#cbd5e1';
              let textCol = '#64748b';

              if (isOccupied) {
                fillBg = '#fffbeb'; // amber-50
                strokeCol = '#f59e0b'; // amber-500
                textCol = '#78350f'; // amber-900
              }
              if (isHighlighted) {
                fillBg = '#fef2f2'; // rose-50
                strokeCol = '#f43f5e'; // rose-500
                textCol = '#881337'; // rose-900
              }

              return (
                <g key={sec.index} className="transition-all duration-300">
                  {/* Circular Node */}
                  <circle cx={sec.x} cy={sec.y} r="15" fill={fillBg} stroke={strokeCol} strokeWidth="2" />
                  
                  {/* Element Value inside node */}
                  <text
                    x={sec.x}
                    y={sec.y + 4}
                    textAnchor="middle"
                    className="text-xs font-bold"
                    fill={textCol}
                    fontSize="11"
                  >
                    {isOccupied ? String(val) : '∅'}
                  </text>

                  {/* Index Label outer */}
                  <text
                    x={cx + (r + 26) * Math.cos((sec.index * 2 * Math.PI) / cellsCount - Math.PI / 2)}
                    y={cy + (r + 26) * Math.sin((sec.index * 2 * Math.PI) / cellsCount - Math.PI / 2) + 3}
                    textAnchor="middle"
                    className="text-[9px] font-bold"
                    fill="#94a3b8"
                  >
                    [{sec.index}]
                  </text>

                  {/* Front/Rear Pointer Indicators in SVG */}
                  {isFront && (
                    <g transform={`translate(${sec.x - 22 * Math.cos((sec.index * 2 * Math.PI) / cellsCount - Math.PI / 2)}, ${sec.y - 22 * Math.sin((sec.index * 2 * Math.PI) / cellsCount - Math.PI / 2)})`}>
                      <circle r="4" fill="#10b981" />
                      <text y="-6" textAnchor="middle" fill="#047857" className="text-[8px] font-extrabold font-sans">
                        F
                      </text>
                    </g>
                  )}
                  {isRear && (
                    <g transform={`translate(${sec.x - 30 * Math.cos((sec.index * 2 * Math.PI) / cellsCount - Math.PI / 2)}, ${sec.y - 30 * Math.sin((sec.index * 2 * Math.PI) / cellsCount - Math.PI / 2)})`}>
                      <circle r="4" fill="#3b82f6" />
                      <text y="10" textAnchor="middle" fill="#1d4ed8" className="text-[8px] font-extrabold font-sans">
                        R
                      </text>
                    </g>
                  )}
                </g>
              );
            })}

            {/* Inner Dashboard Core */}
            <circle cx={cx} cy={cy} r="38" fill="#f8fafc" stroke="#e2e8f0" strokeWidth="1" />
            <text x={cx} y={cy - 4} textAnchor="middle" fill="#475569" className="text-[10px] font-extrabold uppercase font-sans">
              COUNT
            </text>
            <text x={cx} y={cy + 12} textAnchor="middle" fill="#1e293b" className="text-lg font-bold">
              {count} / {cellsCount}
            </text>
          </svg>
        </div>

        {/* Circular Indicators explanation */}
        <div className="flex gap-4 text-[10px] text-slate-500 mt-2">
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" /> Front Pointer (F)
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-500 inline-block" /> Rear Pointer (R)
          </span>
          <span className="flex items-center gap-1 font-bold text-slate-700">
            {count === cellsCount ? 'FULL RING 🔔' : count === 0 ? 'EMPTY RING 🕳️' : 'ACTIVE'}
          </span>
        </div>
      </div>
    );
  };

  // Render 4: Queue via Stacks
  const renderQueueViaStacks = () => {
    return (
      <div className="flex flex-col h-full p-4 font-mono justify-between">
        <div className="text-center text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
          FIFO Queue simulation via Dual LIFO Stacks
        </div>

        <div className="grid grid-cols-2 gap-6 items-end flex-1 max-h-[170px]">
          {/* Stack 1 Container */}
          <div className="flex flex-col items-center">
            <div className="text-[10px] text-slate-400 font-bold mb-1.5 uppercase">
              Stack 1 (Push Inbound)
            </div>
            <div className="border-x-2 border-b-2 border-slate-300 w-28 min-h-[100px] flex flex-col-reverse justify-start gap-1 p-1 bg-slate-50/50 rounded-b-lg">
              {stack1.length === 0 ? (
                <span className="text-[10px] text-slate-400 text-center py-6 select-none italic">
                  empty
                </span>
              ) : (
                stack1.map((val, idx) => (
                  <div
                    key={idx}
                    className="bg-amber-100 border border-amber-300 text-amber-900 rounded py-1 px-2 text-center text-xs font-bold transition-all duration-300 shadow-xs"
                  >
                    {val}
                  </div>
                ))
              )}
            </div>
            <span className="text-[9px] text-slate-400 mt-1">LIFO TOP ↑</span>
          </div>

          {/* Stack 2 Container */}
          <div className="flex flex-col items-center">
            <div className="text-[10px] text-slate-400 font-bold mb-1.5 uppercase">
              Stack 2 (Pop Outbound)
            </div>
            <div className="border-x-2 border-b-2 border-slate-300 w-28 min-h-[100px] flex flex-col-reverse justify-start gap-1 p-1 bg-slate-50/50 rounded-b-lg">
              {stack2.length === 0 ? (
                <span className="text-[10px] text-slate-400 text-center py-6 select-none italic">
                  empty
                </span>
              ) : (
                stack2.map((val, idx) => (
                  <div
                    key={idx}
                    className="bg-emerald-100 border border-emerald-300 text-emerald-900 rounded py-1 px-2 text-center text-xs font-bold transition-all duration-300 shadow-xs"
                  >
                    {val}
                  </div>
                ))
              )}
            </div>
            <span className="text-[9px] text-slate-400 mt-1">LIFO TOP (Front) ↑</span>
          </div>
        </div>

        {/* Action transfer animated status banner */}
        {step.activeTransfer && (
          <div className="mt-2 text-center p-1.5 bg-amber-500/10 text-amber-700 text-[10px] rounded border border-amber-200 font-sans animate-pulse font-semibold">
            ✦ Transferring elements: Popping Stack1 to Push Stack2 to reverse order ✦
          </div>
        )}
      </div>
    );
  };

  // Render 5: Stack via Queues
  const renderStackViaQueues = () => {
    return (
      <div className="flex flex-col h-full p-4 font-mono justify-between">
        <div className="text-center text-xs font-semibold text-slate-400 uppercase tracking-wider">
          LIFO Stack simulation via Queue Rotations
        </div>

        <div className="flex flex-col items-center justify-center flex-1 my-2">
          <div className="text-[10px] text-slate-400 font-bold mb-2 uppercase">
            Active Queue (Q)
          </div>

          <div className="flex items-center gap-1.5 border border-slate-200 bg-white p-3.5 rounded-xl shadow-xs min-w-[240px] justify-center relative">
            <span className="text-[9px] font-extrabold text-emerald-600 bg-emerald-50 px-1 py-0.5 rounded border border-emerald-200 uppercase tracking-wider absolute -top-2.5 left-2">
              Front (LIFO Top)
            </span>

            {queue1.length === 0 ? (
              <span className="text-xs text-slate-400 italic py-2">Queue is empty</span>
            ) : (
              queue1.map((val, idx) => {
                const isTop = idx === 0;
                return (
                  <div
                    key={idx}
                    className={`w-11 h-11 rounded-lg border-2 flex items-center justify-center text-xs font-bold transition-all duration-300 ${
                      isTop
                        ? 'border-emerald-500 bg-emerald-50 text-emerald-900 scale-102 shadow-xs'
                        : 'border-slate-200 bg-slate-50 text-slate-700'
                    }`}
                  >
                    {val}
                  </div>
                );
              })
            )}

            <span className="text-[9px] font-extrabold text-slate-500 bg-slate-100 px-1 py-0.5 rounded border border-slate-200 uppercase tracking-wider absolute -bottom-2.5 right-2">
              Rear (LIFO Bottom)
            </span>
          </div>
        </div>

        {step.activeTransfer && (
          <div className="text-center p-1 bg-amber-500/10 text-amber-700 text-[10px] rounded border border-amber-200 font-sans font-semibold animate-pulse">
            🔄 Rotating elements: Dequeuing from front and Enqueuing back to Rear
          </div>
        )}
      </div>
    );
  };

  // Render 6, 7 & 8: Monotonic Deques & Sliding Windows
  const renderSlidingWindows = () => {
    return (
      <div className="flex flex-col h-full p-3 font-mono justify-between">
        {/* Original Array visualization */}
        <div>
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
            Input Array & Sliding Window Highlight
          </div>
          <div className="flex items-center gap-1 overflow-x-auto py-2 bg-slate-50/50 rounded-lg px-2 border border-slate-100">
            {array.map((val, idx) => {
              const isL = windowL !== null && idx === windowL;
              const isR = windowR !== null && idx === windowR;
              const inWindow = windowL !== null && windowR !== null && idx >= windowL && idx <= windowR;
              const isHighlighted = highlightedIndices.includes(idx);

              let itemClass = 'border-slate-200 bg-white text-slate-700';
              if (inWindow) {
                itemClass = 'border-amber-400 bg-amber-50 text-amber-950 font-bold scale-101';
              }
              if (isHighlighted) {
                itemClass = 'border-rose-500 bg-rose-50 text-rose-950 font-extrabold animate-pulse';
              }

              return (
                <div key={idx} className="flex flex-col items-center shrink-0 min-w-9">
                  <div
                    className={`h-9 w-9 rounded-md border flex items-center justify-center text-xs transition-all relative ${itemClass}`}
                  >
                    {val}
                    {isL && (
                      <span className="absolute -top-2 -left-1 bg-emerald-600 text-white font-extrabold rounded px-0.5 text-[7px]">
                        L
                      </span>
                    )}
                    {isR && (
                      <span className="absolute -top-2 -right-1 bg-blue-600 text-white font-extrabold rounded px-0.5 text-[7px]">
                        R
                      </span>
                    )}
                  </div>
                  <span className="text-[8px] text-slate-400 mt-1">i={idx}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Dynamic prefix sums row (for Shortest Subarray Sum >= K) */}
        {prefixSums.length > 0 && (
          <div className="mt-1">
            <div className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">
              Calculated Cumulative Prefix Sums Array:
            </div>
            <div className="flex items-center gap-1 overflow-x-auto py-1 bg-slate-50/40 rounded-lg px-2 border border-slate-100">
              {prefixSums.map((val, idx) => {
                const inDq = deque.includes(idx);
                return (
                  <div key={idx} className="flex flex-col items-center shrink-0 min-w-9">
                    <div
                      className={`h-7 w-9 rounded border flex items-center justify-center text-[10px] font-bold ${
                        inDq ? 'border-emerald-400 bg-emerald-50 text-emerald-800' : 'border-slate-200 bg-white text-slate-500'
                      }`}
                    >
                      {val}
                    </div>
                    <span className="text-[7px] text-slate-400">p[{idx}]</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Monotonic Deques section */}
        <div className="grid grid-cols-2 gap-3 mt-1.5 border-t border-slate-100 pt-1.5">
          {algorithmId === '07' ? (
            <>
              {/* Max Deque */}
              <div className="bg-amber-50/50 p-2 rounded-lg border border-amber-200">
                <span className="text-[9px] font-bold text-amber-800 uppercase block mb-1">
                  1. Monotonic Max-Deque
                </span>
                <div className="flex items-center gap-1">
                  {maxDeque.length === 0 ? (
                    <span className="text-[10px] text-slate-400 italic">empty</span>
                  ) : (
                    maxDeque.map((idxVal, i) => (
                      <div key={i} className="flex flex-col items-center">
                        <div className="h-8 w-8 rounded bg-white border border-amber-400 flex items-center justify-center text-xs font-bold text-amber-950 shadow-xxs">
                          {array[idxVal as number]}
                        </div>
                        <span className="text-[7px] text-slate-400">idx {idxVal}</span>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Min Deque */}
              <div className="bg-blue-50/50 p-2 rounded-lg border border-blue-200">
                <span className="text-[9px] font-bold text-blue-800 uppercase block mb-1">
                  2. Monotonic Min-Deque
                </span>
                <div className="flex items-center gap-1">
                  {minDeque.length === 0 ? (
                    <span className="text-[10px] text-slate-400 italic">empty</span>
                  ) : (
                    minDeque.map((idxVal, i) => (
                      <div key={i} className="flex flex-col items-center">
                        <div className="h-8 w-8 rounded bg-white border border-blue-400 flex items-center justify-center text-xs font-bold text-blue-950 shadow-xxs">
                          {array[idxVal as number]}
                        </div>
                        <span className="text-[7px] text-slate-400">idx {idxVal}</span>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </>
          ) : (
            <div className="col-span-2 bg-slate-50 p-2 rounded-lg border border-slate-200 flex flex-col justify-center">
              <span className="text-[9px] font-bold text-slate-700 uppercase block mb-1.5">
                Deque Container (Indices & Values)
              </span>
              <div className="flex items-center gap-2">
                <span className="text-[9px] font-bold text-slate-400">FRONT ➔</span>
                <div className="flex items-center gap-1.5">
                  {deque.length === 0 ? (
                    <span className="text-[10px] text-slate-400 italic">empty</span>
                  ) : (
                    deque.map((idxVal, i) => (
                      <div key={i} className="flex items-center gap-1 border border-slate-200 bg-white rounded p-1 shadow-xxs">
                        <div className="text-[10px] font-bold text-slate-800">
                          val:{' '}
                          <span className="text-amber-600">
                            {prefixSums.length > 0 ? prefixSums[idxVal as number] : array[idxVal as number]}
                          </span>
                        </div>
                        <div className="bg-slate-100 text-slate-500 font-mono text-[8px] px-1 rounded">
                          i:{idxVal}
                        </div>
                      </div>
                    ))
                  )}
                </div>
                {deque.length > 0 && <span className="text-[9px] font-bold text-slate-400">➔ REAR</span>}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  // Render 9: Character Stream processing
  const renderStreamCanvas = () => {
    return (
      <div className="flex flex-col h-full p-4 font-mono justify-between">
        <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">
          Stream First-Non-Repeating Character Tracer
        </div>

        <div className="grid grid-cols-12 gap-4 items-center flex-1 my-2">
          {/* Stream Queue */}
          <div className="col-span-6 flex flex-col gap-1.5">
            <span className="text-[10px] text-slate-500 font-bold uppercase">
              Unique Chars Queue
            </span>
            <div className="flex items-center gap-1.5 border border-slate-200 bg-white p-3 rounded-lg min-h-12 shadow-xxs">
              <span className="text-[8px] text-slate-400">FRONT</span>
              {queue1.length === 0 ? (
                <span className="text-[10px] text-slate-400 italic">empty</span>
              ) : (
                queue1.map((ch, idx) => (
                  <div
                    key={idx}
                    className={`w-7 h-7 rounded border-2 flex items-center justify-center text-xs font-bold ${
                      idx === 0 ? 'border-amber-400 bg-amber-50 text-amber-900' : 'border-slate-200 bg-slate-50'
                    }`}
                  >
                    {ch}
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Char frequencies */}
          <div className="col-span-6 flex flex-col gap-1">
            <span className="text-[10px] text-slate-500 font-bold uppercase">
              Frequency Table
            </span>
            <div className="flex flex-wrap gap-1 border border-slate-200 bg-slate-50/50 p-2 rounded-lg max-h-16 overflow-y-auto">
              {Object.keys(charFreq).length === 0 ? (
                <span className="text-[9px] text-slate-400 italic">no data</span>
              ) : (
                Object.entries(charFreq).map(([ch, count]) => (
                  <div
                    key={ch}
                    className={`text-[10px] px-1.5 py-0.5 rounded border flex gap-1 ${
                      count > 1
                        ? 'bg-rose-50 border-rose-200 text-rose-800'
                        : 'bg-emerald-50 border-emerald-200 text-emerald-800 font-bold'
                    }`}
                  >
                    <span>{ch}:</span>
                    <span>{count}</span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Answer trace */}
        <div className="bg-slate-950 text-slate-100 rounded-lg p-2 flex items-center justify-between">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-sans">
            Accumulated Stream Output string
          </span>
          <div className="text-sm font-bold text-amber-400 tracking-wider">
            {ans || '""'}
          </div>
        </div>
      </div>
    );
  };

  // Render 10: Moving Average
  const renderMovingAverageCanvas = () => {
    return (
      <div className="flex flex-col h-full p-4 font-mono justify-between">
        <div className="text-xs font-bold text-slate-400 uppercase tracking-wider text-center">
          Moving Average Sliding Queue
        </div>

        <div className="flex flex-col items-center justify-center flex-1 my-2">
          <div className="flex items-center gap-1.5 border-2 border-dashed border-slate-200 bg-white p-4 rounded-xl shadow-xs">
            {queue1.length === 0 ? (
              <span className="text-xs text-slate-400 italic">No stream inputs</span>
            ) : (
              queue1.map((val, idx) => (
                <div
                  key={idx}
                  className="w-10 h-10 rounded border border-amber-400 bg-amber-50 text-amber-900 font-bold flex items-center justify-center text-xs animate-fadeIn shadow-xxs"
                >
                  {val}
                </div>
              ))
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 bg-slate-900 text-white rounded-lg p-2.5">
          <div className="text-center border-r border-slate-800">
            <div className="text-[9px] text-slate-400 uppercase">Active Sum</div>
            <div className="text-sm font-bold text-amber-400">{sum}</div>
          </div>
          <div className="text-center">
            <div className="text-[9px] text-slate-400 uppercase">Average (Sum / size)</div>
            <div className="text-sm font-bold text-emerald-400">{average.toFixed(3)}</div>
          </div>
        </div>
      </div>
    );
  };

  // Render 11: Reveal Cards
  const renderRevealCards = () => {
    return (
      <div className="flex flex-col h-full p-3 font-mono justify-between">
        {/* Sorted cards deck at top */}
        <div>
          <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
            Sorted Input Deck
          </span>
          <div className="flex items-center gap-1 overflow-x-auto bg-slate-100 p-1.5 rounded border border-slate-200">
            {deck.map((card, idx) => {
              const isHighlighted = highlightedIndices.includes(idx);
              return (
                <div
                  key={idx}
                  className={`h-7 w-9 rounded flex items-center justify-center text-xs font-bold shrink-0 border ${
                    isHighlighted ? 'border-rose-500 bg-rose-50 text-rose-800' : 'border-slate-300 bg-white text-slate-700'
                  }`}
                >
                  {card}
                </div>
              );
            })}
          </div>
        </div>

        {/* Indices Queue in middle */}
        <div className="my-1.5 p-1.5 bg-slate-50 border border-slate-200 rounded">
          <span className="text-[9px] font-bold text-slate-500 uppercase block mb-1">
            Index BFS Queue (Q)
          </span>
          <div className="flex items-center gap-1.5">
            <span className="text-[8px] text-slate-400">FRONT</span>
            {queue1.length === 0 ? (
              <span className="text-[10px] text-slate-400 italic">empty</span>
            ) : (
              queue1.map((qIdx, i) => (
                <div
                  key={i}
                  className="h-6 w-6 rounded border border-slate-300 bg-white text-[10px] font-bold flex items-center justify-center text-slate-800"
                >
                  {qIdx}
                </div>
              ))
            )}
            <span className="text-[8px] text-slate-400">REAR</span>
          </div>
        </div>

        {/* Revealed Configuration */}
        <div>
          <span className="text-[9px] font-bold text-emerald-700 uppercase tracking-wider block mb-1">
            Constructed Output Deck (Revealed layout)
          </span>
          <div className="flex items-center gap-1 bg-emerald-50/50 p-2 rounded-lg border border-emerald-200 overflow-x-auto">
            {revealed.map((card, idx) => (
              <div key={idx} className="flex flex-col items-center shrink-0">
                <div
                  className={`h-8 w-9 rounded-md border flex items-center justify-center text-xs font-bold ${
                    card === null ? 'border-dashed border-emerald-300 bg-white text-emerald-300' : 'border-emerald-500 bg-emerald-100 text-emerald-900'
                  }`}
                >
                  {card === null ? '∅' : card}
                </div>
                <span className="text-[7px] text-slate-400 mt-1">res[{idx}]</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  // Render 12: Rotting Oranges
  const renderRottingOranges = () => {
    return (
      <div className="flex flex-col h-full p-2 font-mono justify-between">
        <div className="flex justify-between items-center text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
          <span>Multi-Source BFS Grid Tracker</span>
          <span className="text-amber-600 bg-amber-50 border border-amber-200 px-1 py-0.5 rounded">
            Fresh Left: {freshCount}
          </span>
        </div>

        {/* Grid Visual */}
        <div className="flex justify-center items-center flex-1 my-1">
          <div className="flex flex-col gap-1.5 p-2 border border-slate-200 bg-slate-50/50 rounded-xl">
            {grid.map((row, rIdx) => (
              <div key={rIdx} className="flex gap-1.5">
                {row.map((cell, cIdx) => {
                  const isActive = activeCells.some(([x, y]) => x === rIdx && y === cIdx);
                  const isRotten = cell === 2;
                  const isFresh = cell === 1;

                  let orangeClass = 'border-slate-200 bg-white';
                  if (isRotten) {
                    orangeClass = 'border-rose-700 bg-rose-600 text-white shadow-inner animate-pulse';
                  } else if (isFresh) {
                    orangeClass = 'border-amber-400 bg-amber-500 shadow-sm';
                  }

                  if (isActive) {
                    orangeClass += ' ring-2 ring-amber-400 ring-offset-1 scale-102 font-extrabold';
                  }

                  return (
                    <div
                      key={cIdx}
                      className={`h-9 w-9 rounded-lg border-2 flex items-center justify-center relative transition-all duration-300 ${orangeClass}`}
                    >
                      {isRotten ? (
                        <Flame className="w-4 h-4 fill-rose-300 stroke-rose-900" />
                      ) : isFresh ? (
                        <span className="h-3.5 w-3.5 rounded-full bg-amber-100 border border-amber-600 inline-block" />
                      ) : (
                        '∅'
                      )}
                      <span className="absolute bottom-0 right-0.5 text-[6px] text-slate-400">
                        {rIdx},{cIdx}
                      </span>
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>

        {/* Orange Queue queue trace below */}
        <div className="bg-slate-900 text-slate-300 rounded-lg p-1.5 flex items-center gap-1.5 overflow-x-auto text-[10px]">
          <span className="text-slate-400 font-bold shrink-0">BFS Q:</span>
          {orangeQueue.length === 0 ? (
            <span className="text-slate-500 italic">Queue is empty</span>
          ) : (
            orangeQueue.map(([r, c, mins], idx) => (
              <div
                key={idx}
                className="bg-slate-800 border border-slate-700 rounded px-1.5 py-0.5 font-bold text-amber-400 flex gap-1"
              >
                <span>({r},{c})</span>
                <span className="text-slate-400 font-normal">t:{mins}m</span>
              </div>
            ))
          )}
        </div>
      </div>
    );
  };

  // Render 13: Gas Station / Circular Tour
  const renderGasStation = () => {
    return (
      <div className="flex flex-col h-full p-2.5 font-mono justify-between">
        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider text-center">
          Circular Fuel Tour Simulation
        </div>

        {/* Ring layout for stations */}
        <div className="flex justify-center items-center flex-1 my-1">
          <div className="grid grid-cols-5 gap-2 items-center w-full max-w-[320px]">
            {gas.map((gVal, idx) => {
              const cVal = cost[idx];
              const isActive = activeStation === idx;
              const isStartCandidate = startCandidate === idx;

              let nodeClass = 'border-slate-200 bg-white text-slate-600';
              if (isActive) {
                nodeClass = 'border-amber-500 bg-amber-100 text-amber-950 ring-2 ring-amber-400 scale-102';
              } else if (isStartCandidate) {
                nodeClass = 'border-emerald-500 bg-emerald-50 text-emerald-950 font-extrabold';
              }

              return (
                <div
                  key={idx}
                  className={`flex flex-col items-center justify-center p-1 rounded-lg border text-center transition-all ${nodeClass}`}
                >
                  <span className="text-[8px] font-bold text-slate-400 block">St.{idx}</span>
                  <div className="flex flex-col text-[10px] font-bold">
                    <span className="text-emerald-700">⛽{gVal}</span>
                    <span className="text-rose-700">➔{cVal}</span>
                  </div>
                  {isStartCandidate && (
                    <span className="text-[6px] font-extrabold bg-emerald-500 text-white rounded px-0.5 mt-0.5">
                      START
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Dashboard display */}
        <div className="grid grid-cols-2 gap-3 bg-slate-900 text-white rounded-lg p-2 flex items-center">
          <div className="flex items-center gap-1.5 border-r border-slate-800 justify-center">
            <Fuel className="w-5 h-5 text-amber-400 shrink-0" />
            <div className="text-left">
              <span className="text-[8px] text-slate-400 block uppercase">Current Tank</span>
              <span className="text-sm font-bold text-amber-400">{tank} L</span>
            </div>
          </div>

          <div className="text-center">
            <span className="text-[8px] text-slate-400 block uppercase">Start Candidate</span>
            <span className="text-xs font-bold text-emerald-400">
              {startCandidate === -1 ? 'None' : `Station ${startCandidate}`}
            </span>
          </div>
        </div>
      </div>
    );
  };

  // Render 14: Task Scheduler
  const renderTaskScheduler = () => {
    return (
      <div className="flex flex-col h-full p-2.5 font-mono justify-between">
        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
          CPU Clock Scheduler Timeline
        </div>

        {/* Timeline block */}
        <div className="overflow-x-auto bg-slate-900 text-white rounded-lg p-2.5 flex gap-1 items-center min-h-12 border border-slate-800">
          <span className="text-[8px] text-slate-400 uppercase font-sans shrink-0 mr-1.5">
            Clock tick:
          </span>
          {scheduleResult.length === 0 ? (
            <span className="text-[10px] text-slate-500 italic">idle waiting...</span>
          ) : (
            scheduleResult.map((task, idx) => {
              const isIdle = task === 'IDLE';
              return (
                <div key={idx} className="flex flex-col items-center shrink-0">
                  <div
                    className={`h-7 w-7 rounded font-extrabold text-xs flex items-center justify-center border shadow-xxs ${
                      isIdle ? 'bg-slate-800 border-slate-700 text-slate-400' : 'bg-amber-500 border-amber-600 text-slate-950 animate-fadeIn'
                    }`}
                  >
                    {task}
                  </div>
                  <span className="text-[6px] text-slate-500 mt-0.5 font-mono">t={idx + 1}</span>
                </div>
              );
            })
          )}
        </div>

        {/* Active Cooldown remaining table */}
        <div className="grid grid-cols-2 gap-3 mt-1.5 border-t border-slate-100 pt-1.5">
          {/* Frequencies Remaining */}
          <div className="bg-slate-50 border border-slate-200 p-1.5 rounded-lg max-h-[85px] overflow-y-auto">
            <span className="text-[8px] font-extrabold text-slate-500 uppercase block mb-1">
              Frequencies Left:
            </span>
            <div className="flex flex-wrap gap-1">
              {Object.entries(taskCounts).map(([task, count]) => {
                if ((count as number) <= 0) return null;
                return (
                  <span key={task} className="bg-white border border-slate-300 px-1 py-0.5 rounded text-[9px] font-bold">
                    {task}: {count}
                  </span>
                );
              })}
            </div>
          </div>

          {/* Cooling Table */}
          <div className="bg-rose-50/50 border border-rose-200 p-1.5 rounded-lg max-h-[85px] overflow-y-auto">
            <span className="text-[8px] font-extrabold text-rose-800 uppercase block mb-1">
              Under Cooldown locks:
            </span>
            <div className="flex flex-wrap gap-1">
              {Object.keys(taskCooldowns).length === 0 ? (
                <span className="text-[8px] text-slate-400 italic">None cooling</span>
              ) : (
                Object.entries(taskCooldowns).map(([task, cd]) => (
                  <span key={task} className="bg-white border border-rose-300 text-rose-800 px-1.5 py-0.5 rounded text-[9px] font-extrabold">
                    {task} ({cd} left)
                  </span>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Render 15: LRU Cache
  const renderLRUCache = () => {
    return (
      <div className="flex flex-col items-center justify-center h-full p-3 font-mono">
        <div className="text-xs font-semibold text-slate-400 mb-4 uppercase tracking-wider">
          LRU Cache (Capacity: {capacity})
        </div>
        
        {/* Double-Ended Queue for Keys */}
        <div className="flex items-center gap-3 bg-slate-50 border border-slate-200 p-4 rounded-xl shadow-xxs max-w-lg w-full justify-center">
          <div className="text-[10px] font-bold text-slate-400 uppercase select-none shrink-0 text-center">
            Most Recent (Front)
          </div>
          <div className="flex items-center gap-2 flex-1 justify-center">
            {deque.length === 0 ? (
              <span className="text-xs text-slate-400 italic">Cache Empty</span>
            ) : (
              deque.map((key, idx) => {
                const val = charFreq[key] ?? -1;
                const isLRU = idx === deque.length - 1;
                const isMRU = idx === 0;
                return (
                  <div key={key} className="flex flex-col items-center">
                    <div className={`w-14 h-14 rounded-lg border-2 flex flex-col items-center justify-center transition-all ${
                      isMRU ? 'border-amber-400 bg-amber-50 text-amber-900' : 'border-slate-300 bg-white text-slate-800'
                    }`}>
                      <span className="text-[10px] text-slate-400">K: {key}</span>
                      <span className="text-xs font-bold font-mono">V: {val}</span>
                    </div>
                    <span className="text-[8px] text-slate-500 mt-1 uppercase font-bold">
                      {isMRU ? 'MRU' : isLRU ? 'LRU' : `pos ${idx}`}
                    </span>
                  </div>
                );
              })
            )}
          </div>
          <div className="text-[10px] font-bold text-slate-400 uppercase select-none shrink-0 text-center">
            Least Recent (Back)
          </div>
        </div>

        {/* Cache status details */}
        <div className="mt-4 text-xs text-slate-500 flex gap-4">
          <span>Active keys count: <strong className="text-slate-800">{deque.length} / {capacity}</strong></span>
          <span>Hit/Return output: <strong className="text-amber-600">{ans !== undefined ? ans : 'None'}</strong></span>
        </div>
      </div>
    );
  };

  // Render 16: Binary Tree Level Order Traversal
  const renderLevelOrder = () => {
    return (
      <div className="flex flex-col items-center justify-center h-full p-3 font-mono">
        <div className="text-xs font-semibold text-slate-400 mb-4 uppercase tracking-wider">
          Binary Tree Level Order Traversal (BFS)
        </div>

        {/* Active BFS Queue */}
        <div className="w-full max-w-md bg-slate-900 text-amber-400 p-3 rounded-lg flex items-center gap-2 mb-4 border border-slate-800">
          <span className="text-[10px] text-slate-500 font-bold uppercase shrink-0">BFS Queue ➔</span>
          <div className="flex items-center gap-1.5 overflow-x-auto">
            {queue.length === 0 ? (
              <span className="text-xs text-slate-500 italic">Empty</span>
            ) : (
              queue.map((node, idx) => (
                <div key={idx} className="bg-amber-500/20 text-amber-400 border border-amber-500/30 px-2.5 py-1 rounded text-xs font-extrabold animate-pulse">
                  {node}
                </div>
              ))
            )}
          </div>
        </div>

        {/* Traversal Levels Tier Structure */}
        <div className="w-full max-w-md bg-slate-50 border border-slate-200 rounded-xl p-3 flex flex-col gap-2">
          <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider mb-1">
            Traversed Levels:
          </span>
          {revealed.length === 0 ? (
            <div className="text-xs text-slate-400 italic text-center py-4">No levels traversed yet</div>
          ) : (
            revealed.map((level, idx) => (
              <div key={idx} className="flex items-center gap-3 border-b border-slate-200/50 pb-1.5 last:border-0 last:pb-0">
                <span className="text-[9px] font-extrabold bg-slate-200 text-slate-600 px-1.5 py-0.5 rounded uppercase">
                  Level {idx}
                </span>
                <div className="flex items-center gap-1.5">
                  {(level as any as string[]).map((val, cidx) => (
                    <div key={cidx} className="bg-white border border-slate-300 rounded shadow-xxs px-2 py-1 text-xs font-bold text-slate-800">
                      {val}
                    </div>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    );
  };

  // Render 17: Recent Calls
  const renderRecentCalls = () => {
    return (
      <div className="flex flex-col items-center justify-center h-full p-3 font-mono">
        <div className="text-xs font-semibold text-slate-400 mb-4 uppercase tracking-wider">
          Recent Requests in 3000ms Sliding Window
        </div>

        {/* Sliding window representation */}
        <div className="w-full max-w-md bg-slate-50 border border-slate-200 rounded-xl p-4 flex flex-col items-center gap-3">
          <div className="flex items-center justify-between w-full text-[10px] text-slate-400 font-extrabold">
            <span>[ t - 3000ms ]</span>
            <span>[ Active Window ]</span>
            <span>[ t ]</span>
          </div>

          <div className="flex items-center gap-2 w-full justify-center">
            {queue.length === 0 ? (
              <span className="text-xs text-slate-400 italic">No calls registered</span>
            ) : (
              queue.map((tVal, idx) => {
                const isNewest = idx === queue.length - 1;
                return (
                  <div key={idx} className={`px-2 py-1.5 rounded-lg border flex flex-col items-center text-center shadow-xxs ${
                    isNewest ? 'bg-amber-100 border-amber-400 text-amber-900 font-bold animate-pulse' : 'bg-white border-slate-300 text-slate-700'
                  }`}>
                    <span className="text-xs">{tVal}</span>
                    <span className="text-[7px] text-slate-400 uppercase mt-0.5">ping</span>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Output */}
        <div className="mt-4 text-xs text-slate-500">
          Recent calls in active window: <strong className="text-amber-600 font-extrabold text-sm font-mono">{ans || 0}</strong>
        </div>
      </div>
    );
  };

  // Render 18: Bounded Blocking Queue
  const renderBlockingQueue = () => {
    const isFull = count === capacity;
    const isEmpty = count === 0;

    return (
      <div className="flex flex-col items-center justify-center h-full p-3 font-mono">
        <div className="text-xs font-semibold text-slate-400 mb-4 uppercase tracking-wider">
          Bounded Blocking Queue (Thread-Safe Buffer)
        </div>

        <div className="flex items-center gap-4 w-full max-w-md justify-between">
          {/* Enqueue Producer Thread Side */}
          <div className="flex flex-col items-center gap-1 bg-blue-50/50 border border-blue-200 rounded-lg p-2 text-center w-28">
            <span className="text-[8px] text-blue-600 font-extrabold uppercase">Producer Thread</span>
            <div className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
              isFull ? 'bg-rose-500 text-white font-extrabold animate-pulse' : 'bg-emerald-100 text-emerald-800'
            }`}>
              {isFull ? 'BLOCKED' : 'READY'}
            </div>
          </div>

          {/* Queue circular slots */}
          <div className="flex gap-1.5 bg-slate-50 border border-slate-200 p-2.5 rounded-lg">
            {queue.map((val, idx) => {
              const isOccupied = val !== null;
              const isFront = idx === front;
              const isRear = idx === rear;
              return (
                <div key={idx} className="flex flex-col items-center gap-1">
                  <div className={`w-9 h-9 rounded border flex items-center justify-center text-xs font-bold transition-all ${
                    isOccupied ? 'bg-amber-400 text-slate-950 border-amber-500 shadow-xxs' : 'bg-white text-slate-300 border-slate-200'
                  }`}>
                    {isOccupied ? val : '∅'}
                  </div>
                  <span className="text-[7px] text-slate-400 uppercase font-extrabold">
                    {isFront && isRear ? 'F/R' : isFront ? 'F' : isRear ? 'R' : `idx ${idx}`}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Dequeue Consumer Thread Side */}
          <div className="flex flex-col items-center gap-1 bg-emerald-50/50 border border-emerald-200 rounded-lg p-2 text-center w-28">
            <span className="text-[8px] text-emerald-600 font-extrabold uppercase">Consumer Thread</span>
            <div className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
              isEmpty ? 'bg-rose-500 text-white font-extrabold animate-pulse' : 'bg-emerald-100 text-emerald-800'
            }`}>
              {isEmpty ? 'BLOCKED' : 'READY'}
            </div>
          </div>
        </div>

        {/* Blocking logs */}
        <div className="mt-4 text-[10px] text-slate-500">
          Capacity: <strong className="text-slate-700">{capacity}</strong> | Size: <strong className="text-slate-700">{count}</strong>
        </div>
      </div>
    );
  };

  // Render 19: Queue Reconstruction by Height
  const renderQueueReconstruction = () => {
    return (
      <div className="flex flex-col items-center justify-center h-full p-3 font-mono">
        <div className="text-xs font-semibold text-slate-400 mb-4 uppercase tracking-wider">
          Queue Reconstruction by Height (Greedy Inserts)
        </div>

        <div className="flex flex-wrap items-center justify-center gap-2 max-w-md bg-slate-50 border border-slate-200 p-4 rounded-xl shadow-xxs min-h-[90px]">
          {queue.length === 0 ? (
            <span className="text-xs text-slate-400 italic">No people placed yet</span>
          ) : (
            queue.map((height, idx) => {
              const isHighlight = highlightedIndices.includes(idx);
              return (
                <div key={idx} className={`px-2.5 py-1.5 rounded-lg border flex flex-col items-center text-center shadow-xxs transform transition-all duration-300 ${
                  isHighlight ? 'bg-amber-400 text-slate-950 border-amber-500 scale-110 font-bold' : 'bg-white border-slate-300 text-slate-700'
                }`}>
                  <span className="text-xs">{height}</span>
                  <span className="text-[7px] text-slate-400 mt-0.5">idx {idx}</span>
                </div>
              );
            })
          )}
        </div>
      </div>
    );
  };

  // Render 20: 0-1 BFS Shortest Path
  const renderZeroOneBFS = () => {
    return (
      <div className="flex flex-col items-center justify-center h-full p-3 font-mono">
        <div className="text-xs font-semibold text-slate-400 mb-4 uppercase tracking-wider">
          0-1 BFS Dijkstra Shortest Path using Deque
        </div>

        {/* Double Ended Queue with Front / Rear labels */}
        <div className="w-full max-w-md flex items-center justify-between gap-2 border border-slate-200 bg-slate-50 p-3 rounded-lg mb-4">
          <span className="text-[8px] font-extrabold text-blue-500 uppercase">Front (0 Weight)</span>
          <div className="flex items-center gap-1">
            {deque.length === 0 ? (
              <span className="text-xs text-slate-400 italic">Deque Empty</span>
            ) : (
              deque.map((node, idx) => (
                <div key={idx} className="bg-amber-500 border border-amber-600 text-slate-950 px-2 py-1 rounded font-extrabold text-xs shadow-xxs">
                  {node}
                </div>
              ))
            )}
          </div>
          <span className="text-[8px] font-extrabold text-slate-500 uppercase">Rear (1 Weight)</span>
        </div>

        {/* Distance Tables */}
        <div className="w-full max-w-md bg-white border border-slate-200/80 rounded-xl p-3">
          <span className="text-[8px] font-extrabold text-slate-400 uppercase tracking-wider block mb-1">
            Shortest Path Distances:
          </span>
          <div className="grid grid-cols-5 gap-1.5">
            {['A', 'B', 'C', 'D', 'E'].map(node => {
              const dist = charFreq[node];
              const isInfinite = dist === undefined;
              return (
                <div key={node} className="bg-slate-50 border border-slate-200 rounded p-1.5 text-center flex flex-col justify-center">
                  <span className="text-[9px] text-slate-400 font-bold">{node}</span>
                  <span className="text-xs font-extrabold text-slate-800">
                    {isInfinite ? '∞' : dist}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  // Dispatch rendering based on active id
  const getRenderCanvas = () => {
    switch (algorithmId) {
      case '01':
        return renderLinearQueue();
      case '02':
      case '03':
        return renderCircularCanvas();
      case '04':
        return renderQueueViaStacks();
      case '05':
        return renderStackViaQueues();
      case '06':
      case '07':
      case '08':
        return renderSlidingWindows();
      case '09':
        return renderStreamCanvas();
      case '10':
        return renderMovingAverageCanvas();
      case '11':
        return renderRevealCards();
      case '12':
        return renderRottingOranges();
      case '13':
        return renderGasStation();
      case '14':
        return renderTaskScheduler();
      case '15':
        return renderLRUCache();
      case '16':
        return renderLevelOrder();
      case '17':
        return renderRecentCalls();
      case '18':
        return renderBlockingQueue();
      case '19':
        return renderQueueReconstruction();
      case '20':
        return renderZeroOneBFS();
      default:
        return (
          <div className="flex flex-col items-center justify-center h-full text-slate-400 italic text-xs">
            Visual element loader...
          </div>
        );
    }
  };

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-3 shadow-xs h-full flex flex-col justify-between overflow-hidden">
      {getRenderCanvas()}
    </div>
  );
};
