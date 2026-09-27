import React, { useState, useRef } from 'react';
import { GraphData, GraphNode, GraphEdge, NodeVisualStatus, EdgeVisualStatus } from '../types';
import { Flag, Target, Edit3, X, Check } from 'lucide-react';

interface GraphCanvasProps {
  graph: GraphData;
  nodeStates: Record<string, NodeVisualStatus>;
  edgeStates: Record<string, EdgeVisualStatus>;
  startNodeId: string;
  targetNodeId?: string;
  onSetStartNode: (nodeId: string) => void;
  onSetTargetNode?: (nodeId: string) => void;
  onUpdateGraph: (updated: GraphData) => void;
  activeTool: 'select' | 'add-node' | 'add-edge' | 'delete';
  activeNodeId?: string | null;
  activeEdgeId?: string | null;
  requiresWeights: boolean;
}

const NODE_RADIUS = 22;

export const GraphCanvas: React.FC<GraphCanvasProps> = ({
  graph,
  nodeStates,
  edgeStates,
  startNodeId,
  targetNodeId,
  onSetStartNode,
  onSetTargetNode,
  onUpdateGraph,
  activeTool,
  activeNodeId,
  activeEdgeId,
  requiresWeights
}) => {
  const svgRef = useRef<SVGSVGElement | null>(null);

  // Dragging state
  const [draggingNodeId, setDraggingNodeId] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  // Edge creation state
  const [edgeSourceNodeId, setEdgeSourceNodeId] = useState<string | null>(null);

  // Weight editing modal state
  const [editingEdge, setEditingEdge] = useState<{ id: string; weight: number } | null>(null);
  const [tempWeight, setTempWeight] = useState<string>('1');

  // Node selection context menu / popover
  const [selectedNodeMenu, setSelectedNodeMenu] = useState<{
    nodeId: string;
    x: number;
    y: number;
  } | null>(null);

  // Get pointer coordinates relative to SVG
  const getSVGCoordinates = (e: React.MouseEvent<SVGSVGElement>) => {
    if (!svgRef.current) return { x: 0, y: 0 };
    const rect = svgRef.current.getBoundingClientRect();
    return {
      x: Math.round(e.clientX - rect.left),
      y: Math.round(e.clientY - rect.top)
    };
  };

  // Handle canvas click to add node
  const handleCanvasClick = (e: React.MouseEvent<SVGSVGElement>) => {
    if (activeTool === 'add-node') {
      const { x, y } = getSVGCoordinates(e);
      // Generate unique node label
      const existingLabels = new Set(graph.nodes.map(n => n.label));
      let nextChar = 65; // 'A'
      while (existingLabels.has(String.fromCharCode(nextChar)) && nextChar <= 90) {
        nextChar++;
      }
      const label = nextChar <= 90 ? String.fromCharCode(nextChar) : `N${graph.nodes.length + 1}`;
      const newNode: GraphNode = {
        id: label,
        label,
        x: Math.max(30, Math.min(x, 700)),
        y: Math.max(30, Math.min(y, 450))
      };

      onUpdateGraph({
        ...graph,
        nodes: [...graph.nodes, newNode]
      });
      setSelectedNodeMenu(null);
    } else if (activeTool === 'select') {
      setSelectedNodeMenu(null);
      setEdgeSourceNodeId(null);
    }
  };

  // Node drag start
  const handleNodeMouseDown = (e: React.MouseEvent, node: GraphNode) => {
    e.stopPropagation();

    if (activeTool === 'delete') {
      // Delete node and associated edges
      onUpdateGraph({
        ...graph,
        nodes: graph.nodes.filter(n => n.id !== node.id),
        edges: graph.edges.filter(edge => edge.source !== node.id && edge.target !== node.id)
      });
      setSelectedNodeMenu(null);
      return;
    }

    if (activeTool === 'add-edge') {
      if (!edgeSourceNodeId) {
        setEdgeSourceNodeId(node.id);
      } else if (edgeSourceNodeId === node.id) {
        setEdgeSourceNodeId(null);
      } else {
        // Create new edge
        const existing = graph.edges.find(
          edge => (edge.source === edgeSourceNodeId && edge.target === node.id) ||
                  (!graph.isDirected && edge.source === node.id && edge.target === edgeSourceNodeId)
        );

        if (!existing) {
          const newEdge: GraphEdge = {
            id: `e_${Date.now()}`,
            source: edgeSourceNodeId,
            target: node.id,
            weight: 1,
            directed: graph.isDirected
          };
          onUpdateGraph({
            ...graph,
            edges: [...graph.edges, newEdge]
          });
        }
        setEdgeSourceNodeId(null);
      }
      return;
    }

    if (activeTool === 'select') {
      const { x, y } = getSVGCoordinates(e as unknown as React.MouseEvent<SVGSVGElement>);
      setDraggingNodeId(node.id);
      setDragOffset({ x: x - node.x, y: y - node.y });
    }
  };

  // Node drag move
  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    if (draggingNodeId && activeTool === 'select') {
      const { x, y } = getSVGCoordinates(e);
      const newX = Math.max(25, Math.min(x - dragOffset.x, 750));
      const newY = Math.max(25, Math.min(y - dragOffset.y, 480));

      onUpdateGraph({
        ...graph,
        nodes: graph.nodes.map(n => (n.id === draggingNodeId ? { ...n, x: newX, y: newY } : n))
      });
    }
  };

  // End drag
  const handleMouseUp = () => {
    setDraggingNodeId(null);
  };

  // Edge click handler
  const handleEdgeClick = (e: React.MouseEvent, edge: GraphEdge) => {
    e.stopPropagation();
    if (activeTool === 'delete') {
      onUpdateGraph({
        ...graph,
        edges: graph.edges.filter(item => item.id !== edge.id)
      });
    } else {
      setEditingEdge({ id: edge.id, weight: edge.weight });
      setTempWeight(String(edge.weight));
    }
  };

  // Node right-click context menu
  const handleNodeContextMenu = (e: React.MouseEvent, node: GraphNode) => {
    e.preventDefault();
    e.stopPropagation();
    const { x, y } = getSVGCoordinates(e as unknown as React.MouseEvent<SVGSVGElement>);
    setSelectedNodeMenu({ nodeId: node.id, x, y });
  };

  // Save updated weight
  const handleSaveWeight = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingEdge) return;
    const num = parseFloat(tempWeight);
    if (!isNaN(num)) {
      onUpdateGraph({
        ...graph,
        edges: graph.edges.map(e => (e.id === editingEdge.id ? { ...e, weight: num } : e))
      });
    }
    setEditingEdge(null);
  };

  // Compute edge path and trimmed endpoints for arrows
  const getEdgeCoordinates = (edge: GraphEdge) => {
    const sourceNode = graph.nodes.find(n => n.id === edge.source);
    const targetNode = graph.nodes.find(n => n.id === edge.target);
    if (!sourceNode || !targetNode) return null;

    const dx = targetNode.x - sourceNode.x;
    const dy = targetNode.y - sourceNode.y;
    const dist = Math.hypot(dx, dy) || 1;

    // Check if there is an opposite edge to add a slight curve
    const hasOpposite = graph.edges.some(
      e => e.id !== edge.id && e.source === edge.target && e.target === edge.source
    );

    // Trim radius from endpoints so arrows don't collide with node circle
    const offset = NODE_RADIUS + 4;
    const startX = sourceNode.x + (dx / dist) * NODE_RADIUS;
    const startY = sourceNode.y + (dy / dist) * NODE_RADIUS;
    const endX = targetNode.x - (dx / dist) * offset;
    const endY = targetNode.y - (dy / dist) * offset;

    const midX = (sourceNode.x + targetNode.x) / 2;
    const midY = (sourceNode.y + targetNode.y) / 2;

    if (hasOpposite) {
      // Calculate perpendicular curve
      const curvature = 24;
      const perpX = -dy / dist * curvature;
      const perpY = dx / dist * curvature;
      const ctrlX = midX + perpX;
      const ctrlY = midY + perpY;

      return {
        path: `M ${startX} ${startY} Q ${ctrlX} ${ctrlY} ${endX} ${endY}`,
        labelX: ctrlX,
        labelY: ctrlY
      };
    }

    return {
      path: `M ${startX} ${startY} L ${endX} ${endY}`,
      labelX: midX,
      labelY: midY
    };
  };

  return (
    <div className="relative w-full h-full bg-[#fbfbfa] rounded-xl border border-stone-200/90 overflow-hidden select-none">
      {/* Subtle Dot Grid Background */}
      <div
        className="absolute inset-0 pointer-events-none opacity-40"
        style={{
          backgroundImage: 'radial-gradient(#d6d3d1 1px, transparent 1px)',
          backgroundSize: '20px 20px'
        }}
      />

      {/* Helper Notification Banner */}
      <div className="absolute top-3 left-4 z-10 flex items-center gap-2 pointer-events-none">
        {activeTool === 'add-node' && (
          <div className="px-2.5 py-1 bg-stone-900 text-white text-[11px] font-medium rounded-full shadow-xs">
            Click anywhere on the canvas to place a new node
          </div>
        )}
        {activeTool === 'add-edge' && (
          <div className="px-2.5 py-1 bg-stone-900 text-white text-[11px] font-medium rounded-full shadow-xs">
            {edgeSourceNodeId
              ? `Selected ${edgeSourceNodeId}. Click target node to connect.`
              : 'Click first node, then click second node to create edge.'}
          </div>
        )}
        {activeTool === 'delete' && (
          <div className="px-2.5 py-1 bg-rose-600 text-white text-[11px] font-medium rounded-full shadow-xs">
            Click any node or edge to erase
          </div>
        )}
        {activeTool === 'select' && (
          <div className="px-2 py-0.5 bg-stone-100/90 border border-stone-200 text-stone-600 text-[11px] font-medium rounded-md shadow-2xs">
            Drag nodes to rearrange • Right-click node for start/target options
          </div>
        )}
      </div>

      {/* SVG Canvas */}
      <svg
        id="graph-canvas-svg"
        ref={svgRef}
        className={`w-full h-full min-h-0 ${
          activeTool === 'add-node'
            ? 'cursor-crosshair'
            : activeTool === 'add-edge'
            ? 'cursor-pointer'
            : activeTool === 'delete'
            ? 'cursor-not-allowed'
            : 'cursor-default'
        }`}
        onClick={handleCanvasClick}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        <defs>
          {/* Default Arrow Marker */}
          <marker
            id="arrow-default"
            viewBox="0 0 10 10"
            refX="6"
            refY="5"
            markerWidth="6"
            markerHeight="6"
            orient="auto-start-reverse"
          >
            <path d="M 0 1 L 9 5 L 0 9 z" fill="#94a3b8" />
          </marker>
          {/* Active / Evaluating Arrow */}
          <marker
            id="arrow-evaluating"
            viewBox="0 0 10 10"
            refX="6"
            refY="5"
            markerWidth="6"
            markerHeight="6"
            orient="auto-start-reverse"
          >
            <path d="M 0 1 L 9 5 L 0 9 z" fill="#d97706" />
          </marker>
          {/* Tree Edge Arrow */}
          <marker
            id="arrow-tree"
            viewBox="0 0 10 10"
            refX="6"
            refY="5"
            markerWidth="7"
            markerHeight="7"
            orient="auto-start-reverse"
          >
            <path d="M 0 1 L 9 5 L 0 9 z" fill="#059669" />
          </marker>
          {/* Path Edge Arrow */}
          <marker
            id="arrow-path"
            viewBox="0 0 10 10"
            refX="6"
            refY="5"
            markerWidth="7"
            markerHeight="7"
            orient="auto-start-reverse"
          >
            <path d="M 0 1 L 9 5 L 0 9 z" fill="#4f46e5" />
          </marker>
          {/* Cycle Arrow */}
          <marker
            id="arrow-cycle"
            viewBox="0 0 10 10"
            refX="6"
            refY="5"
            markerWidth="7"
            markerHeight="7"
            orient="auto-start-reverse"
          >
            <path d="M 0 1 L 9 5 L 0 9 z" fill="#e11d48" />
          </marker>
        </defs>

        {/* 1. Render Edges */}
        <g id="edges-layer">
          {graph.edges.map(edge => {
            const coords = getEdgeCoordinates(edge);
            if (!coords) return null;

            const state = edgeStates[edge.id] || 'idle';
            const isDirectedEdge = graph.isDirected || edge.directed;

            let strokeColor = '#cbd5e1';
            let strokeWidth = 2;
            let strokeDash = 'none';
            let markerEnd = isDirectedEdge ? 'url(#arrow-default)' : undefined;

            if (state === 'evaluating') {
              strokeColor = '#f59e0b';
              strokeWidth = 3.5;
              strokeDash = '6 3';
              markerEnd = isDirectedEdge ? 'url(#arrow-evaluating)' : undefined;
            } else if (state === 'tree') {
              strokeColor = '#10b981';
              strokeWidth = 3.5;
              markerEnd = isDirectedEdge ? 'url(#arrow-tree)' : undefined;
            } else if (state === 'cross') {
              strokeColor = '#94a3b8';
              strokeWidth = 2;
              strokeDash = '4 4';
            } else if (state === 'path') {
              strokeColor = '#6366f1';
              strokeWidth = 4;
              markerEnd = isDirectedEdge ? 'url(#arrow-path)' : undefined;
            } else if (state === 'cycle') {
              strokeColor = '#ef4444';
              strokeWidth = 4;
              markerEnd = isDirectedEdge ? 'url(#arrow-cycle)' : undefined;
            } else if (state === 'bridge') {
              strokeColor = '#e11d48';
              strokeWidth = 4.5;
              strokeDash = '6 3';
              markerEnd = isDirectedEdge ? 'url(#arrow-cycle)' : undefined;
            }

            return (
              <g key={edge.id} className="cursor-pointer group">
                {/* Thick transparent stroke for easier hover/click selection */}
                <path
                  d={coords.path}
                  fill="none"
                  stroke="transparent"
                  strokeWidth={16}
                  onClick={e => handleEdgeClick(e, edge)}
                />
                {/* Visible Edge Stroke */}
                <path
                  d={coords.path}
                  fill="none"
                  stroke={strokeColor}
                  strokeWidth={strokeWidth}
                  strokeDasharray={strokeDash}
                  markerEnd={markerEnd}
                  className="transition-colors duration-200"
                  onClick={e => handleEdgeClick(e, edge)}
                />

                {/* Bridge Tag Badge */}
                {state === 'bridge' && (
                  <g transform={`translate(${coords.labelX}, ${coords.labelY - 14})`}>
                    <rect x={-24} y={-8} width={48} height={16} rx={4} fill="#e11d48" className="shadow-xs" />
                    <text x={0} y={4} textAnchor="middle" className="text-[9px] font-black fill-white pointer-events-none tracking-wider">
                      BRIDGE
                    </text>
                  </g>
                )}

                {/* Edge Weight Pill Badge */}
                <g
                  transform={`translate(${coords.labelX}, ${coords.labelY})`}
                  onClick={e => handleEdgeClick(e, edge)}
                  className="cursor-pointer"
                >
                  <rect
                    x={-14}
                    y={-10}
                    width={28}
                    height={20}
                    rx={6}
                    fill="#ffffff"
                    stroke={
                      state === 'bridge'
                        ? '#e11d48'
                        : state === 'path'
                        ? '#6366f1'
                        : state === 'tree'
                        ? '#10b981'
                        : state === 'evaluating'
                        ? '#f59e0b'
                        : state === 'cycle'
                        ? '#ef4444'
                        : '#e2e8f0'
                    }
                    strokeWidth={state === 'bridge' ? 2 : 1.5}
                    className="shadow-2xs group-hover:stroke-stone-900 transition-colors"
                  />
                  <text
                    x={0}
                    y={4}
                    textAnchor="middle"
                    className="text-[11px] font-bold fill-stone-700 pointer-events-none font-mono"
                  >
                    {edge.weight}
                  </text>
                </g>
              </g>
            );
          })}
        </g>

        {/* 2. Render Nodes */}
        <g id="nodes-layer">
          {graph.nodes.map(node => {
            const state = nodeStates[node.id] || 'idle';
            const isStart = node.id === startNodeId;
            const isTarget = node.id === targetNodeId;
            const isSourceSelection = edgeSourceNodeId === node.id;
            const isHighlighted = activeNodeId === node.id;

            let fillColor = '#ffffff';
            let strokeColor = '#64748b';
            let strokeWidth = 2;
            let textColor = '#0f172a';

            if (state === 'testing') {
              fillColor = '#fef3c7';
              strokeColor = '#d97706';
              strokeWidth = 3;
              textColor = '#92400e';
            } else if (state === 'active') {
              fillColor = '#d1fae5';
              strokeColor = '#059669';
              strokeWidth = 3.5;
              textColor = '#065f46';
            } else if (state === 'visited') {
              fillColor = '#f1f5f9';
              strokeColor = '#475569';
              strokeWidth = 2.5;
              textColor = '#1e293b';
            } else if (state === 'path') {
              fillColor = '#e0e7ff';
              strokeColor = '#4f46e5';
              strokeWidth = 3.5;
              textColor = '#312e81';
            } else if (state === 'cycle') {
              fillColor = '#ffe4e6';
              strokeColor = '#e11d48';
              strokeWidth = 3.5;
              textColor = '#9f1239';
            } else if (state === 'cut') {
              fillColor = '#fef2f2';
              strokeColor = '#dc2626';
              strokeWidth = 4;
              textColor = '#991b1b';
            } else if (state === 'infected') {
              fillColor = '#ffedd5';
              strokeColor = '#ea580c';
              strokeWidth = 4;
              textColor = '#9a3412';
            } else if (state === 'quarantined') {
              fillColor = '#e0f2fe';
              strokeColor = '#0284c7';
              strokeWidth = 3;
              textColor = '#0369a1';
            }

            if (isSourceSelection) {
              strokeColor = '#0284c7';
              strokeWidth = 3.5;
            }

            return (
              <g
                key={node.id}
                transform={`translate(${node.x}, ${node.y})`}
                onMouseDown={e => handleNodeMouseDown(e, node)}
                onContextMenu={e => handleNodeContextMenu(e, node)}
                className="cursor-grab active:cursor-grabbing group"
              >
                {/* Active Pulse Aura when node is currently processing or infected */}
                {(isHighlighted || state === 'active' || state === 'infected') && (
                  <circle
                    r={NODE_RADIUS + 7}
                    fill="none"
                    stroke={state === 'infected' ? '#ea580c' : '#10b981'}
                    strokeWidth={2}
                    opacity={0.4}
                    className="animate-ping"
                  />
                )}

                {/* Node Outer Circle */}
                <circle
                  r={NODE_RADIUS}
                  fill={fillColor}
                  stroke={strokeColor}
                  strokeWidth={strokeWidth}
                  className="transition-colors duration-200 shadow-xs"
                />

                {/* Node Label */}
                <text
                  x={0}
                  y={5}
                  textAnchor="middle"
                  className="font-bold text-sm select-none pointer-events-none"
                  fill={textColor}
                >
                  {node.label}
                </text>

                {/* Articulation Point Badge */}
                {state === 'cut' && (
                  <g transform="translate(0, -28)">
                    <rect x={-20} y={-8} width={40} height={16} rx={4} fill="#dc2626" className="shadow-xs" />
                    <text x={0} y={4} textAnchor="middle" className="text-[9px] font-black fill-white pointer-events-none tracking-tight">
                      CUT PT
                    </text>
                  </g>
                )}

                {/* Infected Node Badge */}
                {state === 'infected' && (
                  <g transform="translate(0, -28)">
                    <rect x={-24} y={-8} width={48} height={16} rx={4} fill="#ea580c" className="shadow-xs" />
                    <text x={0} y={4} textAnchor="middle" className="text-[8px] font-black fill-white pointer-events-none tracking-tight">
                      INFECTED
                    </text>
                  </g>
                )}

                {/* Start Node Badge */}
                {isStart && (
                  <g transform={`translate(0, ${-NODE_RADIUS - 10})`}>
                    <rect
                      x={-20}
                      y={-8}
                      width={40}
                      height={16}
                      rx={8}
                      fill="#0f172a"
                      className="shadow-xs"
                    />
                    <text
                      x={0}
                      y={4}
                      textAnchor="middle"
                      className="text-[9px] font-extrabold fill-white uppercase tracking-wider"
                    >
                      START
                    </text>
                  </g>
                )}

                {/* Target Node Badge */}
                {isTarget && !isStart && (
                  <g transform={`translate(0, ${NODE_RADIUS + 12})`}>
                    <rect
                      x={-22}
                      y={-8}
                      width={44}
                      height={16}
                      rx={8}
                      fill="#4f46e5"
                      className="shadow-xs"
                    />
                    <text
                      x={0}
                      y={4}
                      textAnchor="middle"
                      className="text-[9px] font-extrabold fill-white uppercase tracking-wider"
                    >
                      TARGET
                    </text>
                  </g>
                )}
              </g>
            );
          })}
        </g>
      </svg>

      {/* Inline Edge Weight Edit Popover */}
      {editingEdge && (
        <div
          className="absolute z-30 bg-white p-3 rounded-lg border border-stone-300 shadow-lg"
          style={{ top: '30%', left: '40%' }}
        >
          <div className="flex items-center justify-between gap-3 mb-2">
            <span className="text-xs font-bold text-stone-800 flex items-center gap-1">
              <Edit3 className="w-3.5 h-3.5 text-stone-600" />
              Edit Edge Weight
            </span>
            <button
              onClick={() => setEditingEdge(null)}
              className="text-stone-400 hover:text-stone-700"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
          <form onSubmit={handleSaveWeight} className="flex items-center gap-2">
            <input
              id="edge-weight-input"
              type="number"
              step="any"
              value={tempWeight}
              onChange={e => setTempWeight(e.target.value)}
              className="w-24 px-2 py-1 text-xs border border-stone-300 rounded font-mono font-semibold text-stone-900 focus:outline-none focus:ring-2 focus:ring-stone-900"
              autoFocus
            />
            <button
              id="save-weight-btn"
              type="submit"
              className="px-2.5 py-1 text-xs font-semibold bg-stone-900 text-white rounded hover:bg-stone-800 flex items-center gap-1"
            >
              <Check className="w-3 h-3" />
              Save
            </button>
          </form>
          <p className="text-[10px] text-stone-400 mt-1.5">
            Supports negative values (e.g. -3) for Bellman-Ford
          </p>
        </div>
      )}

      {/* Node Context Menu */}
      {selectedNodeMenu && (
        <div
          className="absolute z-30 bg-white border border-stone-200 rounded-lg shadow-lg py-1 text-xs min-w-[150px]"
          style={{
            top: Math.min(selectedNodeMenu.y, 380),
            left: Math.min(selectedNodeMenu.x, 600)
          }}
        >
          <div className="px-3 py-1 font-bold text-stone-800 border-b border-stone-100 text-[11px]">
            Node {selectedNodeMenu.nodeId}
          </div>
          <button
            onClick={() => {
              onSetStartNode(selectedNodeMenu.nodeId);
              setSelectedNodeMenu(null);
            }}
            className="w-full text-left px-3 py-1.5 hover:bg-stone-100 text-stone-700 flex items-center gap-2"
          >
            <Flag className="w-3.5 h-3.5 text-stone-900" />
            Set as Start Node
          </button>
          {onSetTargetNode && (
            <button
              onClick={() => {
                onSetTargetNode(selectedNodeMenu.nodeId);
                setSelectedNodeMenu(null);
              }}
              className="w-full text-left px-3 py-1.5 hover:bg-stone-100 text-stone-700 flex items-center gap-2"
            >
              <Target className="w-3.5 h-3.5 text-indigo-600" />
              Set as Target Node
            </button>
          )}
          <button
            onClick={() => {
              onUpdateGraph({
                ...graph,
                nodes: graph.nodes.filter(n => n.id !== selectedNodeMenu.nodeId),
                edges: graph.edges.filter(
                  e => e.source !== selectedNodeMenu.nodeId && e.target !== selectedNodeMenu.nodeId
                )
              });
              setSelectedNodeMenu(null);
            }}
            className="w-full text-left px-3 py-1.5 hover:bg-rose-50 text-rose-600 flex items-center gap-2"
          >
            Delete Node
          </button>
        </div>
      )}
    </div>
  );
};
