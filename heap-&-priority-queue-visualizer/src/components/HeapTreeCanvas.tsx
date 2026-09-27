import React, { useMemo } from 'react';
import { NodeState, HeapType } from '../types';

interface HeapTreeCanvasProps {
  heap: number[];
  heapLabels?: string[];
  nodeStates?: Record<number, NodeState>;
  comparingIndices?: number[];
  swappingIndices?: number[];
  satisfiedIndices?: number[];
  heapType?: HeapType;
  hoveredIndex?: number | null;
  onHoverIndex?: (index: number | null) => void;
  title?: string;
  badge?: string;
}

interface NodeCoord {
  index: number;
  value: number;
  label?: string;
  x: number;
  y: number;
  radius: number;
  parentIndex: number;
  leftIndex: number;
  rightIndex: number;
}

export const HeapTreeCanvas: React.FC<HeapTreeCanvasProps> = ({
  heap,
  heapLabels,
  nodeStates = {},
  comparingIndices = [],
  swappingIndices = [],
  satisfiedIndices = [],
  heapType = 'max',
  hoveredIndex,
  onHoverIndex,
  title,
  badge
}) => {
  // SVG Canvas Dimensions
  const canvasWidth = 560;
  const canvasHeight = 270;

  // Compute node coordinates based on binary tree mathematics
  const nodes = useMemo<NodeCoord[]>(() => {
    if (!heap || heap.length === 0) return [];

    const result: NodeCoord[] = [];
    const maxDepth = Math.floor(Math.log2(heap.length));
    const levelHeight = maxDepth > 3 ? 50 : 58;
    const startY = 38;

    for (let i = 0; i < heap.length; i++) {
      const depth = Math.floor(Math.log2(i + 1));
      const countInLevel = Math.pow(2, depth);
      const positionInLevel = i - (countInLevel - 1);

      // Horizontal segment width for this level
      const segmentWidth = canvasWidth / (countInLevel + 1);
      const x = segmentWidth * (positionInLevel + 1);
      const y = startY + depth * levelHeight;

      // Dynamic radius based on total nodes to keep it clean
      const radius = heap.length > 15 ? 14 : heap.length > 7 ? 17 : 19;

      const parentIndex = i > 0 ? Math.floor((i - 1) / 2) : -1;
      const leftIndex = 2 * i + 1;
      const rightIndex = 2 * i + 2;

      result.push({
        index: i,
        value: heap[i],
        label: heapLabels && heapLabels[i] ? heapLabels[i] : undefined,
        x,
        y,
        radius,
        parentIndex,
        leftIndex,
        rightIndex
      });
    }

    return result;
  }, [heap, heapLabels]);

  const getNodeState = (index: number): NodeState => {
    if (swappingIndices.includes(index)) return 'swapping';
    if (comparingIndices.includes(index)) return 'comparing';
    if (nodeStates[index]) return nodeStates[index];
    if (satisfiedIndices.includes(index)) return 'satisfied';
    return 'default';
  };

  const getNodeColors = (state: NodeState, isHovered: boolean, isRelated: boolean) => {
    if (state === 'swapping') {
      return {
        fill: '#fef3c7', // amber-100
        stroke: '#d97706', // amber-600
        text: '#92400e', // amber-900
        strokeWidth: 3,
        dash: undefined
      };
    }
    if (state === 'comparing') {
      return {
        fill: '#fee2e2', // rose-100
        stroke: '#e11d48', // rose-600
        text: '#9f1239', // rose-900
        strokeWidth: 3,
        dash: '3,3'
      };
    }
    if (state === 'violation') {
      return {
        fill: '#ffe4e6', // rose-100
        stroke: '#f43f5e',
        text: '#be123c',
        strokeWidth: 3,
        dash: undefined
      };
    }
    if (state === 'satisfied') {
      return {
        fill: '#ecfdf5', // emerald-50
        stroke: '#059669', // emerald-600
        text: '#065f46', // emerald-900
        strokeWidth: 2,
        dash: undefined
      };
    }
    if (state === 'active') {
      return {
        fill: '#eff6ff', // blue-50
        stroke: '#2563eb', // blue-600
        text: '#1e40af', // blue-900
        strokeWidth: 2.5,
        dash: undefined
      };
    }
    if (state === 'extracted') {
      return {
        fill: '#f1f5f9', // slate-100
        stroke: '#cbd5e1', // slate-300
        text: '#94a3b8', // slate-400
        strokeWidth: 1.5,
        dash: '2,2'
      };
    }

    // Default neutral slate
    return {
      fill: isHovered ? '#f8fafc' : isRelated ? '#f0fdf4' : '#ffffff',
      stroke: isHovered ? '#0284c7' : isRelated ? '#10b981' : '#94a3b8',
      text: '#1e293b',
      strokeWidth: isHovered || isRelated ? 2.5 : 1.5,
      dash: undefined
    };
  };

  return (
    <div className="flex flex-col h-full bg-[#FAF9F6] border border-slate-200 rounded-lg p-2.5 relative select-none shadow-2xs">
      {/* Canvas Top Bar */}
      <div className="flex items-center justify-between mb-1.5 px-1">
        <div className="flex items-center gap-2">
          <span className="font-serif font-bold text-xs text-slate-800 tracking-tight">
            {title || 'Complete Binary Tree Canvas'}
          </span>
          {badge && (
            <span className="font-mono text-[10px] font-semibold px-1.5 py-0.2 rounded bg-amber-50 text-amber-800 border border-amber-200">
              {badge}
            </span>
          )}
        </div>

        {/* Legend */}
        <div className="flex items-center gap-3 text-[10px] font-mono text-slate-500">
          <div className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-white border border-slate-400 inline-block" />
            <span>Default</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-100 border border-rose-500 inline-block" />
            <span>Compare</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-100 border border-amber-500 inline-block" />
            <span>Swap</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-50 border border-emerald-500 inline-block" />
            <span>Satisfied</span>
          </div>
        </div>
      </div>

      {/* SVG Container */}
      <div className="relative flex-1 w-full min-h-[160px] flex items-center justify-center overflow-hidden">
        {nodes.length === 0 ? (
          <div className="text-center text-slate-400 font-sans text-xs py-10">
            Heap is currently empty. Insert elements or select a preset to visualize.
          </div>
        ) : (
          <svg
            viewBox={`0 0 ${canvasWidth} ${canvasHeight}`}
            className="w-full h-full max-h-full object-contain drop-shadow-2xs"
          >
            <defs>
              {/* Arrow marker for swaps */}
              <marker
                id="arrowhead"
                markerWidth="6"
                markerHeight="6"
                refX="5"
                refY="3"
                orient="auto"
              >
                <polygon points="0 0, 6 3, 0 6" fill="#d97706" />
              </marker>
            </defs>

            {/* 1. Parent-to-child connector lines */}
            {nodes.map((node) => {
              if (node.parentIndex < 0) return null;
              const parent = nodes[node.parentIndex];
              if (!parent) return null;

              const isComparing =
                (comparingIndices.includes(node.index) && comparingIndices.includes(parent.index)) ||
                (swappingIndices.includes(node.index) && swappingIndices.includes(parent.index));

              return (
                <g key={`edge-${parent.index}-${node.index}`}>
                  <line
                    x1={parent.x}
                    y1={parent.y}
                    x2={node.x}
                    y2={node.y}
                    stroke={isComparing ? '#d97706' : '#cbd5e1'}
                    strokeWidth={isComparing ? 2.5 : 1.5}
                    strokeDasharray={isComparing ? '4,3' : undefined}
                    className="transition-all duration-200"
                  />
                </g>
              );
            })}

            {/* 2. Nodes rendering */}
            {nodes.map((node) => {
              const state = getNodeState(node.index);
              const isHovered = hoveredIndex === node.index;
              const isParentOfHovered = hoveredIndex !== null && hoveredIndex !== undefined && nodes[hoveredIndex]?.parentIndex === node.index;
              const isChildOfHovered =
                hoveredIndex !== null && hoveredIndex !== undefined &&
                (nodes[hoveredIndex]?.leftIndex === node.index || nodes[hoveredIndex]?.rightIndex === node.index);
              const isRelated = isParentOfHovered || isChildOfHovered;

              const style = getNodeColors(state, isHovered, isRelated);

              return (
                <g
                  key={`node-${node.index}`}
                  className="cursor-pointer transition-transform duration-200"
                  onMouseEnter={() => onHoverIndex && onHoverIndex(node.index)}
                  onMouseLeave={() => onHoverIndex && onHoverIndex(null)}
                >
                  {/* Subtle outer pulse circle for comparing or swapping */}
                  {(state === 'comparing' || state === 'swapping') && (
                    <circle
                      cx={node.x}
                      cy={node.y}
                      r={node.radius + 5}
                      fill="none"
                      stroke={style.stroke}
                      strokeWidth="1.5"
                      strokeDasharray="3,3"
                      className="animate-spin-slow opacity-75"
                    />
                  )}

                  {/* Main Circle */}
                  <circle
                    cx={node.x}
                    cy={node.y}
                    r={node.radius}
                    fill={style.fill}
                    stroke={style.stroke}
                    strokeWidth={style.strokeWidth}
                    strokeDasharray={style.dash}
                    className="transition-colors duration-200"
                  />

                  {/* Node Index Badge (above node) */}
                  <rect
                    x={node.x - 11}
                    y={node.y - node.radius - 10}
                    width="22"
                    height="10"
                    rx="3"
                    fill="#f8fafc"
                    stroke="#cbd5e1"
                    strokeWidth="0.75"
                  />
                  <text
                    x={node.x}
                    y={node.y - node.radius - 2.5}
                    textAnchor="middle"
                    className="text-[8px] font-mono font-bold fill-slate-500 select-none pointer-events-none"
                  >
                    i={node.index}
                  </text>

                  {/* Node Value */}
                  <text
                    x={node.x}
                    y={node.y + (node.label ? -1 : 4)}
                    textAnchor="middle"
                    fill={style.text}
                    className="text-[11px] font-mono font-bold select-none pointer-events-none"
                  >
                    {node.value}
                  </text>

                  {/* Optional Custom Sublabel (e.g. freq or point) */}
                  {node.label && (
                    <text
                      x={node.x}
                      y={node.y + 10}
                      textAnchor="middle"
                      fill="#64748b"
                      className="text-[7.5px] font-mono font-medium select-none pointer-events-none truncate"
                    >
                      {node.label.length > 8 ? node.label.slice(0, 8) + '..' : node.label}
                    </text>
                  )}
                </g>
              );
            })}
          </svg>
        )}
      </div>

      {/* Math Formula Hint Footer */}
      <div className="mt-1 pt-1 border-t border-slate-200/70 flex items-center justify-between text-[10px] font-mono text-slate-500 px-1">
        <span>Parent: floor((i-1)/2)</span>
        <span>Left: 2i + 1</span>
        <span>Right: 2i + 2</span>
        <span className="font-semibold text-slate-700">
          Invariant: {heapType === 'max' ? 'Parent >= Child' : 'Parent <= Child'}
        </span>
      </div>
    </div>
  );
};
