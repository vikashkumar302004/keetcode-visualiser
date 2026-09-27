import React, { useRef, useState, useEffect } from 'react';
import { BSTNode, NodeHighlightStatus } from '../types';
import { computeTreeLayout, collectTreeEdges, TreeEdge } from '../utils/treeUtils';
import { ZoomIn, ZoomOut, Maximize2, Move } from 'lucide-react';

interface TreeCanvasProps {
  tree: BSTNode | null;
  highlightedNodes: Record<string, NodeHighlightStatus>;
  highlightedEdges: Record<string, 'active' | 'traversed' | 'pruned'>;
  activeNodeId?: string | null;
  arrayVisualizer?: {
    label: string;
    elements: number[];
    activeIndex?: number;
    range?: [number, number];
    midIndex?: number;
  };
}

export const TreeCanvas: React.FC<TreeCanvasProps> = ({
  tree,
  highlightedNodes,
  highlightedEdges,
  activeNodeId,
  arrayVisualizer,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [zoom, setZoom] = useState<number>(1);
  const [pan, setPan] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  // Compute layout
  const containerWidth = 720;
  const { root: layoutTree, dimensions } = computeTreeLayout(tree, containerWidth, 78, 22);
  const edges: TreeEdge[] = collectTreeEdges(layoutTree);

  // Flatten layout nodes for rendering
  const nodes: BSTNode[] = [];
  function collectNodes(node: BSTNode | null) {
    if (!node) return;
    nodes.push(node);
    collectNodes(node.left);
    collectNodes(node.right);
  }
  collectNodes(layoutTree);

  // Auto-center tree when tree structure changes
  useEffect(() => {
    if (layoutTree && containerRef.current) {
      const containerW = containerRef.current.clientWidth || 700;
      const initialPanX = Math.max(0, (containerW - dimensions.width) / 2);
      setPan({ x: initialPanX, y: 20 });
    }
  }, [tree]);

  // Pan handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    // Only start drag on canvas background, not controls
    if ((e.target as HTMLElement).tagName !== 'BUTTON' && (e.target as HTMLElement).tagName !== 'INPUT') {
      setIsDragging(true);
      setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setPan({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y,
    });
  };

  const handleMouseUp = () => setIsDragging(false);

  const handleResetView = () => {
    setZoom(1);
    if (containerRef.current) {
      const containerW = containerRef.current.clientWidth || 700;
      setPan({ x: Math.max(0, (containerW - dimensions.width) / 2), y: 20 });
    } else {
      setPan({ x: 0, y: 20 });
    }
  };

  return (
    <div
      ref={containerRef}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      className={`relative w-full h-[360px] lg:h-[410px] bg-[#FAF9F6] bg-warm-dots border border-slate-200 rounded-xl overflow-hidden select-none cursor-grab ${
        isDragging ? 'cursor-grabbing' : ''
      }`}
    >
      {/* Canvas Top Status Bar */}
      <div className="absolute top-3 left-3 z-10 flex items-center gap-2">
        <div className="bg-white/90 backdrop-blur-xs border border-slate-200/80 rounded-lg px-2.5 py-1 text-[11px] font-medium text-slate-600 shadow-2xs flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span>BST Visual Canvas</span>
        </div>
      </div>

      {/* Canvas Zoom & Navigation Floating Controls */}
      <div className="absolute top-3 right-3 z-10 flex items-center gap-1 bg-white/90 backdrop-blur-xs border border-slate-200 rounded-lg p-1 shadow-2xs">
        <button
          onClick={() => setZoom((z) => Math.min(1.8, z + 0.15))}
          title="Zoom In"
          className="p-1.5 hover:bg-slate-100 rounded-md text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
        >
          <ZoomIn className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={() => setZoom((z) => Math.max(0.5, z - 0.15))}
          title="Zoom Out"
          className="p-1.5 hover:bg-slate-100 rounded-md text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
        >
          <ZoomOut className="w-3.5 h-3.5" />
        </button>
        <div className="w-px h-3.5 bg-slate-200 mx-0.5" />
        <button
          onClick={handleResetView}
          title="Reset View / Fit to Canvas"
          className="p-1.5 hover:bg-slate-100 rounded-md text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
        >
          <Maximize2 className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* SVG Canvas for Tree Links and Nodes */}
      <div
        className="w-full h-full transition-transform duration-75 origin-top-left"
        style={{
          transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
        }}
      >
        <svg
          width={Math.max(dimensions.width, 900)}
          height={Math.max(dimensions.height, 560)}
          className="overflow-visible"
        >
          <defs>
            {/* Arrowhead marker for directed comparisons if needed */}
            <marker
              id="arrow"
              viewBox="0 0 10 10"
              refX="8"
              refY="5"
              markerWidth="4"
              markerHeight="4"
              orient="auto-start-reverse"
            >
              <path d="M 0 1 L 10 5 L 0 9 z" fill="#94a3b8" />
            </marker>
          </defs>

          {/* Render Tree Edges */}
          {edges.map((edge) => {
            const edgeState = highlightedEdges[edge.id];
            const isTraversed = edgeState === 'traversed';
            const isActive = edgeState === 'active';
            const isPruned = edgeState === 'pruned';

            // Curvature calculation
            const dx = edge.targetX - edge.sourceX;
            const dy = edge.targetY - edge.sourceY;
            const cx1 = edge.sourceX;
            const cy1 = edge.sourceY + dy * 0.45;
            const cx2 = edge.targetX;
            const cy2 = edge.targetY - dy * 0.45;
            const pathData = `M ${edge.sourceX} ${edge.sourceY} C ${cx1} ${cy1}, ${cx2} ${cy2}, ${edge.targetX} ${edge.targetY}`;

            let strokeColor = '#cbd5e1'; // default slate-300
            let strokeWidth = 2;
            let strokeDasharray = undefined;

            if (isActive) {
              strokeColor = '#f59e0b'; // vibrant amber
              strokeWidth = 3.5;
            } else if (isTraversed) {
              strokeColor = '#3b82f6'; // active blue
              strokeWidth = 2.5;
            } else if (isPruned) {
              strokeColor = '#f43f5e'; // pruned red
              strokeDasharray = '4 4';
              strokeWidth = 2;
            }

            return (
              <g key={edge.id}>
                <path
                  d={pathData}
                  fill="none"
                  stroke={strokeColor}
                  strokeWidth={strokeWidth}
                  strokeDasharray={strokeDasharray}
                  strokeLinecap="round"
                  className="transition-colors duration-200"
                />
              </g>
            );
          })}

          {/* Render Tree Nodes */}
          {nodes.map((node) => {
            if (node.x === undefined || node.y === undefined) return null;
            const status: NodeHighlightStatus = highlightedNodes[node.id] || 'idle';
            const isActive = activeNodeId === node.id;
            const isRoot = layoutTree?.id === node.id;

            // Status Styling Matrix
            let fillColor = '#ffffff';
            let strokeColor = '#94a3b8'; // slate-400
            let textColor = '#0f172a'; // slate-900
            let strokeWidth = 2;
            let pulseClass = '';
            let labelBadge: { text: string; bg: string; color: string } | null = null;

            if (isRoot) {
              labelBadge = { text: 'ROOT', bg: 'bg-slate-100', color: 'text-slate-700' };
            }

            switch (status) {
              case 'comparing':
                fillColor = '#fef3c7'; // warm yellow-50
                strokeColor = '#f59e0b'; // amber-500
                strokeWidth = 3.5;
                pulseClass = 'animate-pulse';
                labelBadge = { text: 'COMPARING', bg: 'bg-amber-100', color: 'text-amber-800' };
                break;
              case 'found':
                fillColor = '#ecfdf5'; // emerald-50
                strokeColor = '#10b981'; // emerald-500
                textColor = '#065f46';
                strokeWidth = 3.5;
                labelBadge = { text: 'MATCH / PLACED', bg: 'bg-emerald-100', color: 'text-emerald-800' };
                break;
              case 'swapping':
                fillColor = '#f5f3ff'; // purple-50
                strokeColor = '#8b5cf6'; // purple-500
                textColor = '#5b21b6';
                strokeWidth = 3.5;
                labelBadge = { text: 'SUCCESSOR', bg: 'bg-purple-100', color: 'text-purple-800' };
                break;
              case 'pruned':
                fillColor = '#fef2f2'; // rose-50
                strokeColor = '#ef4444'; // rose-500
                textColor = '#991b1b';
                strokeWidth = 2.5;
                labelBadge = { text: 'PRUNED', bg: 'bg-rose-100', color: 'text-rose-800' };
                break;
              case 'boundary_active':
                fillColor = '#f0f9ff'; // sky-50
                strokeColor = '#0284c7'; // sky-600
                strokeWidth = 3;
                labelBadge = { text: 'BOUND CHECK', bg: 'bg-sky-100', color: 'text-sky-800' };
                break;
              case 'idle':
              default:
                fillColor = '#ffffff';
                strokeColor = '#cbd5e1';
                strokeWidth = 2;
                break;
            }

            return (
              <g
                key={node.id}
                transform={`translate(${node.x}, ${node.y})`}
                className="transition-all duration-300"
              >
                {/* Subtle outer glow on comparing or active */}
                {(status === 'comparing' || status === 'found' || status === 'swapping') && (
                  <circle
                    r={27}
                    fill={strokeColor}
                    fillOpacity={0.18}
                    className={pulseClass}
                  />
                )}

                {/* Node Circle */}
                <circle
                  r={22}
                  fill={fillColor}
                  stroke={strokeColor}
                  strokeWidth={strokeWidth}
                  className={`drop-shadow-xs ${pulseClass}`}
                />

                {/* Node Value Text */}
                <text
                  textAnchor="middle"
                  dy="0.35em"
                  fontSize="13"
                  fontWeight="600"
                  fontFamily="'JetBrains Mono', monospace"
                  fill={textColor}
                >
                  {node.value}
                </text>

                {/* Status Badge Tag above node */}
                {labelBadge && (
                  <foreignObject x="-45" y="-38" width="90" height="18">
                    <div className="flex justify-center">
                      <span
                        className={`text-[9px] font-mono font-semibold px-1.5 py-0.2 rounded-full border border-slate-200/60 shadow-2xs uppercase tracking-tight ${labelBadge.bg} ${labelBadge.color}`}
                      >
                        {labelBadge.text}
                      </span>
                    </div>
                  </foreignObject>
                )}
              </g>
            );
          })}
        </svg>
      </div>

      {/* Empty Tree State */}
      {(!layoutTree || nodes.length === 0) && (
        <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-400">
          <p className="font-serif text-lg text-slate-500 font-medium">Binary Tree is Empty</p>
          <p className="text-xs text-slate-400 mt-1">
            Insert a node above or load a predefined tree preset to begin.
          </p>
        </div>
      )}

      {/* Array Stream / Construction Ribbon Visualizer (e.g. for Sorted Array to BST / Preorder) */}
      {arrayVisualizer && arrayVisualizer.elements && (
        <div className="absolute bottom-3 left-3 right-3 z-10 bg-white/95 backdrop-blur-xs border border-slate-200/90 rounded-xl p-2.5 shadow-sm">
          <div className="flex items-center justify-between gap-2 mb-1.5">
            <span className="text-[11px] font-semibold text-slate-700 uppercase tracking-wider">
              {arrayVisualizer.label}
            </span>
            {arrayVisualizer.range && (
              <span className="text-[10px] font-mono text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                Active Range: [{arrayVisualizer.range[0]} ... {arrayVisualizer.range[1]}]
              </span>
            )}
          </div>
          <div className="flex items-center gap-1.5 overflow-x-auto py-1">
            {arrayVisualizer.elements.map((val, idx) => {
              const isInRange =
                arrayVisualizer.range &&
                idx >= arrayVisualizer.range[0] &&
                idx <= arrayVisualizer.range[1];
              const isMid = arrayVisualizer.midIndex === idx;
              const isActive = arrayVisualizer.activeIndex === idx;

              return (
                <div
                  key={idx}
                  className={`flex flex-col items-center justify-center min-w-9 h-11 rounded-lg border text-xs font-mono font-medium transition-all ${
                    isMid
                      ? 'bg-amber-100 border-amber-400 text-amber-900 font-bold scale-105 shadow-xs'
                      : isActive
                      ? 'bg-emerald-100 border-emerald-400 text-emerald-900 font-bold'
                      : isInRange
                      ? 'bg-blue-50 border-blue-300 text-blue-900'
                      : 'bg-slate-50 border-slate-200 text-slate-400 opacity-60'
                  }`}
                >
                  <span>{val}</span>
                  <span className="text-[8px] text-slate-400 font-sans mt-0.5">#{idx}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Status Legends */}
      <div className="absolute bottom-3 right-3 hidden sm:flex items-center gap-3 bg-white/90 backdrop-blur-xs border border-slate-200 rounded-lg px-2.5 py-1 text-[10px] text-slate-600 shadow-2xs">
        <div className="flex items-center gap-1">
          <span className="w-2.5 h-2.5 rounded-full border border-slate-300 bg-white inline-block" />
          <span>Idle</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="w-2.5 h-2.5 rounded-full border border-amber-500 bg-amber-100 inline-block" />
          <span>Comparing</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="w-2.5 h-2.5 rounded-full border border-emerald-500 bg-emerald-100 inline-block" />
          <span>Matched</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="w-2.5 h-2.5 rounded-full border border-purple-500 bg-purple-100 inline-block" />
          <span>Successor</span>
        </div>
      </div>
    </div>
  );
};
