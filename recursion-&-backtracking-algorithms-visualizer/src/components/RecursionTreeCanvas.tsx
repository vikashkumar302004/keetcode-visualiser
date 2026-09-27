import React, { useMemo } from 'react';
import { TreeNode } from '../types';
import { Check, X, RotateCcw } from 'lucide-react';

interface RecursionTreeCanvasProps {
  nodes: Record<string, TreeNode>;
  activeNodeId: string | null;
}

export default function RecursionTreeCanvas({ nodes, activeNodeId }: RecursionTreeCanvasProps) {
  // Compute positions of nodes dynamically using a coordinate-balancing algorithm
  const layout = useMemo(() => {
    const list = Object.values(nodes);
    if (list.length === 0) return { coordinates: {}, width: 100, height: 100 };

    // Find roots (usually just one root with parentId: null)
    const roots = list.filter((n) => n.parentId === null);
    const coordinates: Record<string, { x: number; y: number }> = {};
    
    let nextX = 50;
    const xGap = 90;
    const yGap = 75;
    const topMargin = 45;

    function layoutDFS(nodeId: string, depth: number) {
      // Find children of this node
      const children = list.filter((n) => n.parentId === nodeId);
      // Sort children by numerical id creation order to keep structural layout stable
      children.sort((a, b) => {
        const numA = parseInt(a.id.replace('node_', ''));
        const numB = parseInt(b.id.replace('node_', ''));
        return numA - numB;
      });

      if (children.length === 0) {
        coordinates[nodeId] = { x: nextX, y: depth * yGap + topMargin };
        nextX += xGap;
      } else {
        children.forEach((child) => layoutDFS(child.id, depth + 1));
        const firstChildX = coordinates[children[0].id].x;
        const lastChildX = coordinates[children[children.length - 1].id].x;
        coordinates[nodeId] = {
          x: (firstChildX + lastChildX) / 2,
          y: depth * yGap + topMargin,
        };
      }
    }

    roots.forEach((root) => layoutDFS(root.id, 0));

    // Calculate maximum width and height
    const xs = Object.values(coordinates).map((c) => c.x);
    const ys = Object.values(coordinates).map((c) => c.y);
    const maxWidth = xs.length > 0 ? Math.max(...xs) + 60 : 200;
    const maxHeight = ys.length > 0 ? Math.max(...ys) + 60 : 200;

    return { coordinates, width: maxWidth, height: maxHeight };
  }, [nodes]);

  const { coordinates, width, height } = layout;

  return (
    <div className="relative w-full h-full min-h-[300px] overflow-auto border border-slate-200 bg-white rounded-lg select-none scrollbar-thin">
      {/* self-contained animation styles */}
      <style>{`
        @keyframes pulse-amber {
          0%, 100% {
            transform: scale(1);
            box-shadow: 0 0 0 0 rgba(245, 158, 11, 0.5);
          }
          50% {
            transform: scale(1.05);
            box-shadow: 0 0 0 6px rgba(245, 158, 11, 0.25);
          }
        }
        .pulse-node {
          animation: pulse-amber 2s infinite cubic-bezier(0.4, 0, 0.6, 1);
        }
      `}</style>

      {Object.keys(nodes).length === 0 ? (
        <div className="flex flex-col items-center justify-center h-full text-slate-400 font-sans p-6 text-center">
          <p className="text-sm">No recursion tree generated.</p>
          <p className="text-xs text-slate-400 mt-1">Press "Simulate" or step forward to explore branching states.</p>
        </div>
      ) : (
        <svg
          width={Math.max(width, 500)}
          height={Math.max(height, 280)}
          className="absolute top-0 left-0"
        >
          {/* Group 1: Connection Edges */}
          {Object.values(nodes).map((node) => {
            if (!node.parentId) return null;
            const parentPos = coordinates[node.parentId];
            const childPos = coordinates[node.id];

            if (!parentPos || !childPos) return null;

            const isActivePath =
              node.id === activeNodeId ||
              node.state === 'active' ||
              node.state === 'backtracking';

            // Determine stroke attributes based on the backtracking / standard edge
            const isBacktracking = node.state === 'backtracking';

            return (
              <g key={`edge-${node.id}`}>
                {isBacktracking ? (
                  // Backtracking curve edge with arrowhead pointing upwards to parent
                  <path
                    d={`M ${childPos.x} ${childPos.y - 12} C ${childPos.x - 15} ${(childPos.y + parentPos.y) / 2}, ${parentPos.x - 15} ${(childPos.y + parentPos.y) / 2}, ${parentPos.x} ${parentPos.y + 12}`}
                    stroke="#f59e0b"
                    strokeWidth={2}
                    strokeDasharray="4 4"
                    fill="none"
                    markerEnd="url(#arrow-up)"
                    className="transition-all duration-300"
                  />
                ) : (
                  // Standard forward exploration line
                  <line
                    x1={parentPos.x}
                    y1={parentPos.y + 12}
                    x2={childPos.x}
                    y2={childPos.y - 12}
                    stroke={isActivePath ? '#f59e0b' : '#cbd5e1'}
                    strokeWidth={isActivePath ? 2.5 : 1.5}
                    className="transition-all duration-300"
                  />
                )}

                {/* Choice branch text label */}
                {node.choice && (
                  <text
                    x={(parentPos.x + childPos.x) / 2 + 8}
                    y={(parentPos.y + childPos.y) / 2 + 3}
                    className="font-mono text-[9px] fill-slate-500 font-medium"
                    textAnchor="start"
                  >
                    {node.choice}
                  </text>
                )}
              </g>
            );
          })}

          {/* SVG Marker Definitions for backtracking arrow */}
          <defs>
            <marker
              id="arrow-up"
              viewBox="0 0 10 10"
              refX="6"
              refY="5"
              markerWidth="6"
              markerHeight="6"
              orient="auto-start-reverse"
            >
              <path d="M 0 2 L 10 5 L 0 8 z" fill="#f59e0b" />
            </marker>
          </defs>

          {/* Group 2: Tree Nodes */}
          {Object.values(nodes).map((node) => {
            const pos = coordinates[node.id];
            if (!pos) return null;

            const isActive = node.id === activeNodeId;
            const isCompleted = node.state === 'completed';

            // Custom coloring and border for node states
            let nodeBg = 'bg-white';
            let textColor = 'text-slate-800';
            let borderColor = 'border-slate-300';
            let ringStyle = '';

            if (node.state === 'active') {
              nodeBg = 'bg-amber-50 text-amber-900 font-bold';
              borderColor = 'border-amber-500 border-2';
              ringStyle = 'pulse-node';
            } else if (node.state === 'success') {
              nodeBg = 'bg-emerald-50 text-emerald-900';
              borderColor = 'border-emerald-500';
            } else if (node.state === 'fail') {
              nodeBg = 'bg-rose-50 text-rose-800 line-through';
              borderColor = 'border-rose-400';
            } else if (node.state === 'backtracking') {
              nodeBg = 'bg-amber-100 text-amber-800 font-semibold';
              borderColor = 'border-amber-400 border-dashed border-2';
            } else if (isCompleted) {
              nodeBg = 'bg-slate-50 text-slate-400';
              borderColor = 'border-slate-200';
            }

            return (
              <foreignObject
                key={`node-${node.id}`}
                x={pos.x - 45}
                y={pos.y - 14}
                width={90}
                height={38}
                className="overflow-visible"
              >
                <div
                  className={`flex flex-col items-center justify-center px-1 py-1 rounded border text-center transition-all duration-300 cursor-pointer ${nodeBg} ${borderColor} ${ringStyle}`}
                  style={{ opacity: isCompleted ? 0.7 : 1 }}
                  title={`${node.label} ${node.result ? `-> ${node.result}` : ''}`}
                >
                  <span className="font-mono text-[9px] font-bold truncate max-w-full">
                    {node.label}
                  </span>
                  
                  {/* Miniature result indicator under label */}
                  {node.result ? (
                    <div className="flex items-center gap-0.5 mt-0.5 text-[8px] font-mono font-medium max-w-full truncate">
                      {node.state === 'success' && <Check className="w-2 h-2 text-emerald-600 shrink-0" />}
                      {node.state === 'fail' && <X className="w-2 h-2 text-rose-500 shrink-0" />}
                      {node.state === 'backtracking' && <RotateCcw className="w-2 h-2 text-amber-600 shrink-0 animate-spin" />}
                      <span className={node.state === 'success' ? 'text-emerald-700' : node.state === 'fail' ? 'text-rose-600' : 'text-slate-500'}>
                        {node.result}
                      </span>
                    </div>
                  ) : (
                    <span className="text-[7px] text-slate-400 font-sans tracking-wide uppercase">
                      depth {node.depth}
                    </span>
                  )}
                </div>
              </foreignObject>
            );
          })}
        </svg>
      )}
    </div>
  );
}
