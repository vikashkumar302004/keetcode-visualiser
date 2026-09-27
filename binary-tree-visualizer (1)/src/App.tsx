/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useRef, useMemo } from 'react';
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  RotateCcw,
  Plus,
  Trash2,
  Edit2,
  Code,
  Layers,
  Eye,
  Info,
  X,
  Check,
  ChevronRight,
  FileCode,
  HelpCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

import { TreeNode, TreeDict, VisStep, NodeState, CallStackFrame, AlgorithmType } from './types';
import { CODE_SNIPPETS } from './codeSnippets';
import { ALGORITHM_QUESTIONS } from './problemQuestions';
import { PRESET_TREES, PresetTree } from './presets';
import {
  generatePreorderRec,
  generatePreorderIter,
  generateInorderRec,
  generateInorderIter,
  generatePostorderRec,
  generatePostorderIter,
  generateLevelOrder,
  generateHeight,
  generateDiameter,
  generateLCA,
  generateLeftView,
  generateRightView,
  generateTopView,
  generateBottomView,
  generatePathSum,
  generateSymmetric,
  generateSerializeDeserialize,
  generateBoundaryTraversal,
  generateMorrisInorder,
  generateBurningTree
} from './visGenerators';

export default function App() {
  // Tree State
  const [tree, setTree] = useState<TreeDict>(PRESET_TREES.perfect.treeDict);
  const [rootId, setRootId] = useState<string | null>('1');

  // Selected Node in Editor
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);

  // LCA Targets
  const [lcaPId, setLcaPId] = useState<string>('4'); // Default left leaf
  const [lcaQId, setLcaQId] = useState<string>('7'); // Default right leaf

  // Path Sum Target
  const [targetSum, setTargetSum] = useState<number>(15);

  // Active Algorithm
  const [activeAlgo, setActiveAlgo] = useState<AlgorithmType>('preorder-rec');

  // Visualization Execution State
  const [steps, setSteps] = useState<VisStep[]>([]);
  const [currentStepIdx, setCurrentStepIdx] = useState<number>(-1);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(800); // ms per step

  // Editor Inline Inputs
  const [editValue, setEditValue] = useState<string>('');
  const [newChildValue, setNewChildValue] = useState<string>('');

  // Active tab in visualizer console ("code" | "stack" | "structures")
  const [consoleTab, setConsoleTab] = useState<'code' | 'stack' | 'structures'>('code');

  // Ref to C++ Code snippet container for auto-scrolling
  const codeContainerRef = useRef<HTMLDivElement>(null);

  // SVG dimensions for layout
  const [spacingX, setSpacingX] = useState<number>(65);
  const [spacingY, setSpacingY] = useState<number>(75);

  // Auto-run/generate steps whenever the tree, algorithm, or its arguments change
  const currentStep: VisStep | null = useMemo(() => {
    if (steps.length > 0 && currentStepIdx >= 0 && currentStepIdx < steps.length) {
      return steps[currentStepIdx];
    }
    return null;
  }, [steps, currentStepIdx]);

  // Compute Layout coordinates based on Inorder index (guarantees NO overlapping nodes!)
  const layoutCoords = useMemo(() => {
    const coords: Record<string, { x: number; y: number }> = {};
    if (!rootId || !tree[rootId]) return coords;

    let index = 0;
    function traverse(nodeId: string, depth: number) {
      const node = tree[nodeId];
      if (!node) return;

      if (node.leftId && tree[node.leftId]) {
        traverse(node.leftId, depth + 1);
      }

      coords[nodeId] = {
        x: 50 + index * spacingX,
        y: 50 + depth * spacingY,
      };
      index++;

      if (node.rightId && tree[node.rightId]) {
        traverse(node.rightId, depth + 1);
      }
    }

    traverse(rootId, 0);
    return coords;
  }, [tree, rootId, spacingX, spacingY]);

  // Determine bounding box for SVG viewBox
  const svgBounds = useMemo(() => {
    const coords = Object.values(layoutCoords);
    if (coords.length === 0) return { width: 500, height: 350 };
    const xs = coords.map((c) => c.x);
    const ys = coords.map((c) => c.y);
    const maxX = Math.max(...xs) + 60;
    const maxY = Math.max(...ys) + 60;
    return {
      width: Math.max(maxX, 400),
      height: Math.max(maxY, 300),
    };
  }, [layoutCoords]);

  // Reset or clear playback
  const resetPlayback = () => {
    setIsPlaying(false);
    setCurrentStepIdx(-1);
    setSteps([]);
  };

  // Generate visual steps for the selected algorithm
  const startAlgorithm = (algo: AlgorithmType = activeAlgo) => {
    resetPlayback();
    let generatedSteps: VisStep[] = [];

    switch (algo) {
      case 'preorder-rec':
        generatedSteps = generatePreorderRec(rootId, tree);
        break;
      case 'preorder-iter':
        generatedSteps = generatePreorderIter(rootId, tree);
        break;
      case 'inorder-rec':
        generatedSteps = generateInorderRec(rootId, tree);
        break;
      case 'inorder-iter':
        generatedSteps = generateInorderIter(rootId, tree);
        break;
      case 'postorder-rec':
        generatedSteps = generatePostorderRec(rootId, tree);
        break;
      case 'postorder-iter':
        generatedSteps = generatePostorderIter(rootId, tree);
        break;
      case 'level-order':
        generatedSteps = generateLevelOrder(rootId, tree);
        break;
      case 'height':
        generatedSteps = generateHeight(rootId, tree);
        break;
      case 'diameter':
        generatedSteps = generateDiameter(rootId, tree);
        break;
      case 'lca':
        generatedSteps = generateLCA(rootId, lcaPId, lcaQId, tree);
        break;
      case 'left-view':
        generatedSteps = generateLeftView(rootId, tree);
        break;
      case 'right-view':
        generatedSteps = generateRightView(rootId, tree);
        break;
      case 'top-view':
        generatedSteps = generateTopView(rootId, tree);
        break;
      case 'bottom-view':
        generatedSteps = generateBottomView(rootId, tree);
        break;
      case 'path-sum':
        generatedSteps = generatePathSum(rootId, targetSum, tree);
        break;
      case 'symmetric':
        generatedSteps = generateSymmetric(rootId, tree);
        break;
      case 'serialize-deserialize':
        generatedSteps = generateSerializeDeserialize(rootId, tree);
        break;
      case 'boundary-traversal':
        generatedSteps = generateBoundaryTraversal(rootId, tree);
        break;
      case 'morris-inorder':
        generatedSteps = generateMorrisInorder(rootId, tree);
        break;
      case 'burning-tree':
        generatedSteps = generateBurningTree(rootId, selectedNodeId || lcaPId || rootId, tree);
        break;
    }

    setSteps(generatedSteps);
    if (generatedSteps.length > 0) {
      setCurrentStepIdx(0);
    }
  };

  // Initialize with preorder-rec steps on load or when algo changes
  useEffect(() => {
    startAlgorithm();
  }, [activeAlgo, rootId, lcaPId, lcaQId, targetSum, selectedNodeId]);

  // Stop playback if tree is mutated
  const handleTreeMutation = (newTree: TreeDict, newRootId: string | null) => {
    setTree(newTree);
    setRootId(newRootId);
    resetPlayback();
    // Validate LCA targets are still in the tree
    if (newRootId) {
      const ids = Object.keys(newTree);
      if (ids.length > 0) {
        if (!newTree[lcaPId]) setLcaPId(ids[0]);
        if (!newTree[lcaQId]) setLcaQId(ids[Math.min(ids.length - 1, 1)]);
      }
    }
  };

  // Playback timer loop
  useEffect(() => {
    let timer: any = null;
    if (isPlaying && steps.length > 0) {
      timer = setInterval(() => {
        setCurrentStepIdx((prev) => {
          if (prev < steps.length - 1) {
            return prev + 1;
          } else {
            setIsPlaying(false);
            return prev;
          }
        });
      }, playbackSpeed);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isPlaying, steps, playbackSpeed]);

  // Auto-scroll the C++ code container to keep the highlighted line in view
  useEffect(() => {
    if (consoleTab === 'code' && codeContainerRef.current) {
      const highlightedEl = codeContainerRef.current.querySelector('[data-highlighted="true"]');
      if (highlightedEl) {
        highlightedEl.scrollIntoView({
          behavior: 'smooth',
          block: 'nearest',
        });
      }
    }
  }, [currentStep?.lineHighlight, consoleTab, activeAlgo]);

  // Load preset trees
  const loadPreset = (key: keyof typeof PRESET_TREES) => {
    const preset = PRESET_TREES[key];
    handleTreeMutation(preset.treeDict, preset.rootId);
    setSelectedNodeId(null);
  };

  // Add Child Helper
  const addChildNode = (direction: 'left' | 'right') => {
    if (!selectedNodeId) return;
    const val = parseInt(newChildValue);
    if (isNaN(val)) return;

    const newId = `node_${Date.now()}`;
    const newChild: TreeNode = {
      id: newId,
      val,
      leftId: null,
      rightId: null,
    };

    const updatedTree = { ...tree };
    updatedTree[newId] = newChild;

    const parent = updatedTree[selectedNodeId];
    if (direction === 'left') {
      parent.leftId = newId;
    } else {
      parent.rightId = newId;
    }

    handleTreeMutation(updatedTree, rootId);
    setNewChildValue('');
  };

  // Create Root Node when tree is empty
  const createRoot = (val: number) => {
    const newId = '1';
    const newRoot: TreeNode = {
      id: newId,
      val,
      leftId: null,
      rightId: null,
    };
    handleTreeMutation({ [newId]: newRoot }, newId);
    setSelectedNodeId(newId);
  };

  // Delete Subtree Helper
  const deleteSubtree = (nodeId: string) => {
    const updatedTree = { ...tree };
    const toDelete = new Set<string>();

    function collect(id: string | null) {
      if (!id || !updatedTree[id]) return;
      toDelete.add(id);
      collect(updatedTree[id].leftId);
      collect(updatedTree[id].rightId);
    }

    collect(nodeId);

    // Remove reference from parent node
    for (const key in updatedTree) {
      const n = updatedTree[key];
      if (n.leftId === nodeId) n.leftId = null;
      if (n.rightId === nodeId) n.rightId = null;
    }

    // Delete collected nodes
    toDelete.forEach((id) => {
      delete updatedTree[id];
    });

    const isRootDeleted = toDelete.has(rootId ?? '');
    const nextRootId = isRootDeleted ? null : rootId;

    handleTreeMutation(updatedTree, nextRootId);
    setSelectedNodeId(null);
  };

  // Modify node value
  const updateNodeValue = (nodeId: string, valStr: string) => {
    const val = parseInt(valStr);
    if (isNaN(val)) return;
    const updatedTree = { ...tree };
    if (updatedTree[nodeId]) {
      updatedTree[nodeId].val = val;
    }
    handleTreeMutation(updatedTree, rootId);
  };

  // Select node details
  const selectNode = (nodeId: string) => {
    setSelectedNodeId(nodeId);
    setEditValue(String(tree[nodeId]?.val ?? ''));
  };

  // Get active color for a node based on visualization steps
  const getNodeColorClass = (id: string): { fill: string; stroke: string; strokeWidth: string; textFill: string; filter: string; textWeight: string } => {
    if (currentStep && currentStep.nodeStates[id]) {
      const state = currentStep.nodeStates[id];
      switch (state) {
        case 'active':
          return {
            fill: 'fill-[#FEF3C7]', // amber-100
            stroke: 'stroke-amber-500',
            strokeWidth: 'stroke-[3px]',
            textFill: 'fill-amber-950',
            textWeight: 'font-bold',
            filter: 'url(#activeGlow)'
          };
        case 'visited':
          return {
            fill: 'fill-[#E0F2FE]', // sky-100
            stroke: 'stroke-sky-500',
            strokeWidth: 'stroke-[2px]',
            textFill: 'fill-sky-950',
            textWeight: 'font-semibold',
            filter: 'url(#shadow)'
          };
        case 'result':
          return {
            fill: 'fill-[#D1FAE5]', // emerald-100
            stroke: 'stroke-emerald-600',
            strokeWidth: 'stroke-[3px]',
            textFill: 'fill-emerald-950',
            textWeight: 'font-extrabold',
            filter: 'url(#resultGlow)'
          };
        case 'burning':
          return {
            fill: 'fill-[#FFEDD5]', // orange-100
            stroke: 'stroke-orange-500',
            strokeWidth: 'stroke-[3px]',
            textFill: 'fill-orange-950',
            textWeight: 'font-black animate-pulse',
            filter: 'url(#fireGlow)'
          };
        case 'burned':
          return {
            fill: 'fill-[#78716C]', // stone-500 charcoal
            stroke: 'stroke-[#44403C]',
            strokeWidth: 'stroke-[2px]',
            textFill: 'fill-white',
            textWeight: 'font-semibold',
            filter: 'url(#shadow)'
          };
      }
    }

    // Neutral State with specific overrides for special nodes
    if (selectedNodeId === id) {
      return {
        fill: 'fill-[#F5F5F4]', // warm gray
        stroke: 'stroke-stone-800',
        strokeWidth: 'stroke-[2.5px]',
        textFill: 'fill-stone-950',
        textWeight: 'font-bold',
        filter: 'url(#selectedShadow)'
      };
    }
    if (id === lcaPId) {
      return {
        fill: 'fill-[#EEF2FF]', // indigo-50
        stroke: 'stroke-indigo-500',
        strokeWidth: 'stroke-[2.5px]',
        textFill: 'fill-indigo-950',
        textWeight: 'font-bold',
        filter: 'url(#shadow)'
      };
    }
    if (id === lcaQId) {
      return {
        fill: 'fill-[#FFF1F2]', // rose-50
        stroke: 'stroke-rose-500',
        strokeWidth: 'stroke-[2.5px]',
        textFill: 'fill-rose-950',
        textWeight: 'font-bold',
        filter: 'url(#shadow)'
      };
    }

    // Standard unvisited node
    return {
      fill: 'fill-[#FCFBF9]',
      stroke: 'stroke-stone-300',
      strokeWidth: 'stroke-[2px]',
      textFill: 'fill-stone-700',
      textWeight: 'font-medium',
      filter: 'url(#shadow)'
    };
  };

  const getEdgeStrokeClass = (parentId: string, childId: string): string => {
    if (currentStep) {
      const parentState = currentStep.nodeStates[parentId];
      const childState = currentStep.nodeStates[childId];
      if (parentState === 'result' && childState === 'result') {
        return 'stroke-emerald-500 stroke-[3.5px]';
      }
      if (parentState === 'active' || childState === 'active') {
        return 'stroke-amber-400 stroke-[3px]';
      }
      if (parentState === 'visited' && childState === 'visited') {
        return 'stroke-sky-400 stroke-[2.5px]';
      }
    }
    return 'stroke-[#E2E0D9] stroke-[2px]';
  };

  return (
    <div className="h-screen bg-[#FBFBFA] text-stone-900 antialiased font-sans flex flex-col selection:bg-stone-200 overflow-hidden">
      {/* HEADER SECTION */}
      <header className="border-b border-stone-200 bg-white/70 backdrop-blur-md shrink-0 px-5 py-2.5 flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 bg-stone-900 text-white rounded-lg">
              <Layers size={16} />
            </span>
            <h1 className="text-lg font-bold tracking-tight text-stone-900 font-serif">
              Binary Tree Algorithms Visualizer
            </h1>
          </div>
          <p className="text-[11px] text-stone-500 mt-0.5 max-w-2xl">
            Strictly explores <strong>Non-BST Binary Trees</strong>. Edit nodes, construct custom topologies, and trace optimized C++ paths step-by-step.
          </p>
        </div>

        {/* PRESET QUICK TABS */}
        <div className="flex flex-wrap items-center gap-1.5 text-[11px]">
          <span className="text-stone-400 font-medium">Presets:</span>
          {Object.entries(PRESET_TREES).map(([key, value]) => (
            <button
              key={key}
              onClick={() => loadPreset(key as any)}
              className="px-2.5 py-1 rounded-lg border border-stone-200 bg-stone-50 hover:bg-stone-100 transition-colors cursor-pointer text-stone-700 font-medium active:scale-95"
            >
              {value.name}
            </button>
          ))}
          <button
            onClick={() => handleTreeMutation({}, null)}
            className="px-2.5 py-1 rounded-lg border border-dashed border-red-200 text-red-600 hover:bg-red-50/50 transition-colors cursor-pointer font-medium active:scale-95"
          >
            Clear Tree
          </button>
        </div>
      </header>

      {/* MAIN CONTAINER */}
      <main className="flex-1 w-full max-w-[1600px] mx-auto px-5 py-3 grid grid-cols-1 lg:grid-cols-12 gap-4 min-h-0 overflow-hidden">
        
        {/* LEFT COLUMN: INTERACTIVE VISUAL WORKSPACE (7 cols) */}
        <section className="lg:col-span-7 flex flex-col gap-4 h-full min-h-0 overflow-hidden">
          <div className="flex-1 min-h-0 bg-white border border-stone-200 rounded-xl overflow-hidden shadow-sm flex flex-col">
            {/* Workspace Header */}
            <div className="px-4 py-2.5 border-b border-stone-100 bg-stone-50/50 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[10px] font-semibold tracking-wider text-stone-500 uppercase">SVG Workspace</span>
              </div>
              <div className="flex items-center gap-3 text-[10px] text-stone-500">
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-[#F9F9F8] border border-stone-300 inline-block" /> Unvisited
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-amber-100 border border-amber-400 inline-block" /> Active
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-sky-100 border border-sky-400 inline-block" /> Visited
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-100 border border-emerald-500 inline-block" /> Result Path
                </span>
              </div>
            </div>

            {/* SVG Visual Area */}
            <div className="flex-1 relative bg-[#FCFCFB] overflow-auto flex items-center justify-center p-4 min-h-0">
              {/* Pattern Background for scientific design */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-[0.03]" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                    <path d="M 20 0 L 0 0 0 20" fill="none" stroke="currentColor" strokeWidth="1" />
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#grid)" />
              </svg>

              {rootId === null || Object.keys(tree).length === 0 ? (
                <div className="text-center py-12 flex flex-col items-center gap-3">
                  <p className="text-xs text-stone-400 max-w-sm">The binary tree is currently empty. Initialize a new root node to build your topology manually.</p>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      placeholder="Root val"
                      defaultValue="1"
                      id="rootValInit"
                      className="w-20 px-2 py-1 text-xs border border-stone-200 rounded-lg text-center bg-white"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          const val = parseInt((e.target as HTMLInputElement).value);
                          createRoot(isNaN(val) ? 1 : val);
                        }
                      }}
                    />
                    <button
                      onClick={() => {
                        const el = document.getElementById('rootValInit') as HTMLInputElement;
                        const val = parseInt(el?.value ?? '1');
                        createRoot(isNaN(val) ? 1 : val);
                      }}
                      className="px-3 py-1 bg-stone-900 hover:bg-stone-800 text-white text-xs font-medium rounded-lg cursor-pointer active:scale-95"
                    >
                      Create Root
                    </button>
                  </div>
                </div>
              ) : (
                <svg
                  className="w-full h-full max-w-full max-h-full overflow-visible transition-all duration-300"
                  viewBox={`0 0 ${svgBounds.width} ${svgBounds.height}`}
                  style={{ minWidth: '100%', minHeight: '100%' }}
                >
                  <defs>
                    <filter id="shadow" x="-30%" y="-30%" width="160%" height="160%">
                      <feDropShadow dx="0" dy="2" stdDeviation="2.5" floodColor="#78716c" floodOpacity="0.12"/>
                    </filter>
                    <filter id="selectedShadow" x="-35%" y="-35%" width="170%" height="170%">
                      <feDropShadow dx="0" dy="3" stdDeviation="3.5" floodColor="#1c1917" floodOpacity="0.25"/>
                    </filter>
                    <filter id="activeGlow" x="-40%" y="-40%" width="180%" height="180%">
                      <feDropShadow dx="0" dy="0" stdDeviation="5" floodColor="#f59e0b" floodOpacity="0.6"/>
                    </filter>
                    <filter id="resultGlow" x="-40%" y="-40%" width="180%" height="180%">
                      <feDropShadow dx="0" dy="0" stdDeviation="5" floodColor="#10b981" floodOpacity="0.6"/>
                    </filter>
                    <filter id="fireGlow" x="-40%" y="-40%" width="180%" height="180%">
                      <feDropShadow dx="0" dy="0" stdDeviation="6" floodColor="#f97316" floodOpacity="0.8"/>
                    </filter>
                  </defs>

                  {/* EDGES / PATHS WITH BEAUTIFUL SMOOTH BEZIER CURVES */}
                  <g>
                    {Object.values(tree).map((node) => {
                      const parentCoord = layoutCoords[node.id];
                      if (!parentCoord) return null;

                      return (
                        <g key={`edges-${node.id}`}>
                          {node.leftId && layoutCoords[node.leftId] && (() => {
                            const childCoord = layoutCoords[node.leftId];
                            const px = parentCoord.x;
                            const py = parentCoord.y;
                            const cx = childCoord.x;
                            const cy = childCoord.y;
                            // Smooth bezier curve downwards
                            const pathD = `M ${px} ${py} C ${px} ${(py + cy) / 2}, ${cx} ${(py + cy) / 2}, ${cx} ${cy}`;
                            return (
                              <path
                                d={pathD}
                                fill="none"
                                className={`transition-all duration-300 ${getEdgeStrokeClass(node.id, node.leftId)}`}
                              />
                            );
                          })()}
                          {node.rightId && layoutCoords[node.rightId] && (() => {
                            const childCoord = layoutCoords[node.rightId];
                            const px = parentCoord.x;
                            const py = parentCoord.y;
                            const cx = childCoord.x;
                            const cy = childCoord.y;
                            // Smooth bezier curve downwards
                            const pathD = `M ${px} ${py} C ${px} ${(py + cy) / 2}, ${cx} ${(py + cy) / 2}, ${cx} ${cy}`;
                            return (
                              <path
                                d={pathD}
                                fill="none"
                                className={`transition-all duration-300 ${getEdgeStrokeClass(node.id, node.rightId)}`}
                              />
                            );
                          })()}
                        </g>
                      );
                    })}
                  </g>

                  {/* THREADS (FOR MORRIS TRAVERSAL BACK-EDGES) */}
                  <g>
                    {currentStep?.threads && Object.entries(currentStep.threads).map(([fromId, toId]) => {
                      const fromCoord = layoutCoords[fromId];
                      const toCoord = layoutCoords[toId];
                      if (!fromCoord || !toCoord) return null;

                      const px = fromCoord.x;
                      const py = fromCoord.y;
                      const cx = toCoord.x;
                      const cy = toCoord.y;

                      // Draw a beautiful curved back-thread curving out to the left
                      const controlX = px - 50;
                      const controlY = (py + cy) / 2;
                      const pathD = `M ${px} ${py} Q ${controlX} ${controlY}, ${cx} ${cy}`;

                      return (
                        <g key={`thread-link-${fromId}-${toId}`} className="animate-pulse">
                          <path
                            d={pathD}
                            fill="none"
                            stroke="#8b5cf6" // Elegant purple thread
                            strokeWidth="2"
                            strokeDasharray="4 3"
                            className="transition-all duration-300"
                          />
                          {/* Pulsing indicator arrowhead or indicator dot near the destination */}
                          <circle
                            cx={cx}
                            cy={cy + 15}
                            r="4"
                            fill="#8b5cf6"
                            className="animate-ping"
                          />
                          <circle
                            cx={cx}
                            cy={cy + 15}
                            r="2.5"
                            fill="#8b5cf6"
                          />
                        </g>
                      );
                    })}
                  </g>

                  {/* NODES */}
                  <g>
                    {Object.values(tree).map((node) => {
                      const coord = layoutCoords[node.id];
                      if (!coord) return null;

                      const colors = getNodeColorClass(node.id);
                      const isLcaP = node.id === lcaPId;
                      const isLcaQ = node.id === lcaQId;

                      return (
                        <g
                          key={`node-group-${node.id}`}
                          transform={`translate(${coord.x}, ${coord.y})`}
                          className="cursor-pointer select-none group"
                          onClick={() => selectNode(node.id)}
                          onDoubleClick={() => {
                            selectNode(node.id);
                            const newVal = prompt(`Change value of node from ${node.val} to:`, String(node.val));
                            if (newVal !== null) {
                              updateNodeValue(node.id, newVal);
                            }
                          }}
                        >
                          {/* Inner Circle with high-end SVG stroke and filters */}
                          <circle
                            r="20"
                            className={`transition-all duration-300 ${colors.stroke} ${colors.strokeWidth} ${colors.fill} group-hover:scale-110 origin-center`}
                            filter={colors.filter}
                            style={{ transformOrigin: '0px 0px' }}
                          />
                          
                          {/* Node Value Text */}
                          <text
                            textAnchor="middle"
                            dy="4"
                            className={`text-[11px] select-none pointer-events-none transition-colors duration-300 ${colors.textWeight} ${colors.textFill}`}
                          >
                            {node.val}
                          </text>

                          {/* LCA Badges */}
                          {(isLcaP || isLcaQ) && (
                            <g transform="translate(0, -26)">
                              <rect
                                x="-10"
                                y="-6"
                                width="20"
                                height="12"
                                rx="3"
                                className={`stroke-none ${isLcaP ? 'fill-indigo-600 shadow-sm' : 'fill-rose-500 shadow-sm'}`}
                              />
                              <text
                                textAnchor="middle"
                                dy="3"
                                className="text-[8px] fill-white font-bold select-none"
                              >
                                {isLcaP ? 'P' : 'Q'}
                              </text>
                            </g>
                          )}
                        </g>
                      );
                    })}
                  </g>
                </svg>
              )}
            </div>

            {/* Layout control coordinates spacers */}
            <div className="px-4 py-2 border-t border-stone-100 bg-stone-50/50 flex items-center justify-between text-[10px] text-stone-500 shrink-0">
              <span className="flex items-center gap-1">
                <Info size={12} className="text-stone-400" />
                Double-click nodes to edit. Click node to inspect/modify.
              </span>
              <div className="flex items-center gap-2.5">
                <label className="flex items-center gap-1 select-none">
                  X Spacing:
                  <input
                    type="range"
                    min="40"
                    max="100"
                    value={spacingX}
                    onChange={(e) => setSpacingX(Number(e.target.value))}
                    className="w-14 accent-stone-700 h-1 cursor-pointer"
                  />
                </label>
                <label className="flex items-center gap-1 select-none">
                  Y Spacing:
                  <input
                    type="range"
                    min="50"
                    max="110"
                    value={spacingY}
                    onChange={(e) => setSpacingY(Number(e.target.value))}
                    className="w-14 accent-stone-700 h-1 cursor-pointer"
                  />
                </label>
              </div>
            </div>
          </div>

          {/* INTERACTIVE NODE INSPECTOR & EDITOR CARD */}
          <div className="shrink-0 bg-white border border-stone-200 rounded-xl p-4 shadow-sm">
            <h3 className="text-[10px] font-bold tracking-wider text-stone-400 uppercase mb-2.5 flex items-center gap-1.5">
              <Edit2 size={12} /> Node Inspector & Editor
            </h3>

            {selectedNodeId && tree[selectedNodeId] ? (
              <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                
                {/* Node identifier & current value editor */}
                <div className="md:col-span-4 flex flex-col gap-1">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[11px] text-stone-500">Selected Node:</span>
                    <span className="px-2 py-0.5 bg-stone-100 text-stone-800 text-[9px] font-bold rounded-full">
                      ID: {selectedNodeId.replace('node_', '')}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mt-0.5">
                    <input
                      type="number"
                      value={editValue}
                      onChange={(e) => {
                        setEditValue(e.target.value);
                        updateNodeValue(selectedNodeId, e.target.value);
                      }}
                      className="w-full px-2.5 py-1 text-xs border border-stone-200 rounded-lg focus:outline-none focus:border-stone-800"
                      placeholder="Node Value"
                    />
                  </div>
                </div>

                {/* Insertion tools */}
                <div className="md:col-span-5 flex flex-col gap-1">
                  <span className="text-[11px] text-stone-500">Insert child node:</span>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      value={newChildValue}
                      onChange={(e) => setNewChildValue(e.target.value)}
                      className="w-20 px-2.5 py-1 text-xs border border-stone-200 rounded-lg focus:outline-none focus:border-stone-800"
                      placeholder="Val"
                    />
                    <button
                      disabled={tree[selectedNodeId].leftId !== null}
                      onClick={() => addChildNode('left')}
                      className="flex-1 py-1 bg-stone-50 text-stone-700 hover:bg-stone-100 text-xs font-semibold rounded-lg border border-stone-200 flex items-center justify-center gap-1 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                    >
                      <Plus size={11} /> Left
                    </button>
                    <button
                      disabled={tree[selectedNodeId].rightId !== null}
                      onClick={() => addChildNode('right')}
                      className="flex-1 py-1 bg-stone-50 text-stone-700 hover:bg-stone-100 text-xs font-semibold rounded-lg border border-stone-200 flex items-center justify-center gap-1 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                    >
                      <Plus size={11} /> Right
                    </button>
                  </div>
                </div>

                {/* Other controls (Delete, LCA) */}
                <div className="md:col-span-3 flex flex-wrap md:flex-col gap-1.5 justify-end">
                  <div className="flex gap-1.5 w-full">
                    <button
                      onClick={() => setLcaPId(selectedNodeId)}
                      className={`flex-1 py-1 text-[9px] font-bold rounded-lg border transition-colors ${
                        lcaPId === selectedNodeId
                          ? 'bg-indigo-50 border-indigo-300 text-indigo-700'
                          : 'bg-stone-50 border-stone-200 text-stone-600 hover:bg-stone-100'
                      }`}
                    >
                      Set LCA P
                    </button>
                    <button
                      onClick={() => setLcaQId(selectedNodeId)}
                      className={`flex-1 py-1 text-[9px] font-bold rounded-lg border transition-colors ${
                        lcaQId === selectedNodeId
                          ? 'bg-rose-50 border-rose-300 text-rose-700'
                          : 'bg-stone-50 border-stone-200 text-stone-600 hover:bg-stone-100'
                      }`}
                    >
                      Set LCA Q
                    </button>
                  </div>
                  <button
                    onClick={() => deleteSubtree(selectedNodeId)}
                    className="w-full py-1 bg-red-50 text-red-600 hover:bg-red-100 text-[10px] font-semibold rounded-lg border border-red-100 flex items-center justify-center gap-1 cursor-pointer transition-colors"
                  >
                    <Trash2 size={11} /> Delete Subtree
                  </button>
                </div>

              </div>
            ) : (
              <div className="py-2.5 text-center text-stone-400 text-[11px] flex items-center justify-center gap-1.5">
                <HelpCircle size={14} /> Click on any node in the workspace to edit value, assign children, or set targets.
              </div>
            )}
          </div>
        </section>

        {/* RIGHT COLUMN: CONTROLS, STEP ENGINE & TRACE (5 cols) */}
        <section className="lg:col-span-5 flex flex-col gap-4 h-full min-h-0 overflow-hidden">
          
          {/* LEETCODE PROBLEM INFO & TEST CASES */}
          {ALGORITHM_QUESTIONS[activeAlgo] && (
            <div className="shrink-0 bg-white border border-stone-200 rounded-xl p-4 shadow-sm flex flex-col gap-2.5">
              <div className="flex items-center justify-between gap-2 border-b border-stone-100 pb-2">
                <div className="flex items-center gap-1.5 min-w-0">
                  <span className="p-1 bg-stone-50 rounded text-stone-600 shrink-0">
                    <FileCode size={13} className="text-stone-500" />
                  </span>
                  <h3 className="font-bold text-[12px] text-stone-800 truncate select-none">
                    {ALGORITHM_QUESTIONS[activeAlgo].title}
                  </h3>
                </div>
                <span className={`px-2 py-0.5 text-[9px] font-extrabold rounded-full border uppercase tracking-wider shrink-0 select-none ${
                  ALGORITHM_QUESTIONS[activeAlgo].difficulty === 'Easy'
                    ? 'bg-emerald-50 border-emerald-100 text-emerald-700'
                    : ALGORITHM_QUESTIONS[activeAlgo].difficulty === 'Medium'
                    ? 'bg-amber-50 border-amber-100 text-amber-700'
                    : 'bg-red-50 border-red-100 text-red-700'
                }`}>
                  {ALGORITHM_QUESTIONS[activeAlgo].difficulty}
                </span>
              </div>

              <p className="text-[11px] text-stone-600 leading-relaxed font-normal">
                {ALGORITHM_QUESTIONS[activeAlgo].description}
              </p>

              <div className="grid grid-cols-2 gap-2 bg-stone-50 border border-stone-100 p-2 rounded-lg text-[10px]">
                <div className="flex flex-col gap-0.5 min-w-0">
                  <span className="text-[9px] font-bold text-stone-400 uppercase tracking-wide">Sample Input / Target</span>
                  <code className="text-stone-700 font-mono font-medium truncate select-all" title={ALGORITHM_QUESTIONS[activeAlgo].inputCase}>
                    {ALGORITHM_QUESTIONS[activeAlgo].inputCase}
                  </code>
                </div>
                <div className="flex flex-col gap-0.5 min-w-0 border-l border-stone-200/60 pl-2">
                  <span className="text-[9px] font-bold text-stone-400 uppercase tracking-wide">Expected Output</span>
                  <code className="text-stone-700 font-mono font-bold truncate select-all" title={ALGORITHM_QUESTIONS[activeAlgo].expectedOutput}>
                    {ALGORITHM_QUESTIONS[activeAlgo].expectedOutput}
                  </code>
                </div>
              </div>
            </div>
          )}

          {/* CONTROL & CONFIG CENTER */}
          <div className="shrink-0 bg-white border border-stone-200 rounded-xl p-4 shadow-sm flex flex-col gap-3">
            {/* Algorithm Selector & Presets row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-stone-400">Select Algorithm</label>
                <select
                  value={activeAlgo}
                  onChange={(e) => setActiveAlgo(e.target.value as AlgorithmType)}
                  className="w-full px-2 py-1.5 text-xs border border-stone-200 rounded-lg bg-stone-50 text-stone-800 font-medium focus:outline-none focus:border-stone-800 cursor-pointer"
                >
                  <optgroup label="Binary Tree Traversals (Recursive)">
                    <option value="preorder-rec">Preorder Traversal (DFS)</option>
                    <option value="inorder-rec">Inorder Traversal (DFS)</option>
                    <option value="postorder-rec">Postorder Traversal (DFS)</option>
                  </optgroup>
                  <optgroup label="Binary Tree Traversals (Iterative)">
                    <option value="preorder-iter">Iterative Preorder (Stack)</option>
                    <option value="inorder-iter">Iterative Inorder (Stack)</option>
                    <option value="postorder-iter">Iterative Postorder (Two Stacks)</option>
                  </optgroup>
                  <optgroup label="Level Order Traversal">
                    <option value="level-order">Breadth-First (BFS Queue)</option>
                  </optgroup>
                  <optgroup label="Properties & Metrics">
                    <option value="height">Height / Max Depth</option>
                    <option value="diameter">Tree Diameter</option>
                    <option value="lca">Lowest Common Ancestor (LCA)</option>
                  </optgroup>
                  <optgroup label="Structural Views">
                    <option value="left-view">Left View</option>
                    <option value="right-view">Right View</option>
                    <option value="top-view">Top View</option>
                    <option value="bottom-view">Bottom View</option>
                  </optgroup>
                  <optgroup label="Path & Structures">
                    <option value="path-sum">Path Sum Check</option>
                    <option value="symmetric">Symmetric / Mirror Tree Check</option>
                    <option value="serialize-deserialize">Serialize Tree</option>
                  </optgroup>
                  <optgroup label="Advanced & Dynamic Simulations">
                    <option value="boundary-traversal">Boundary Traversal</option>
                    <option value="burning-tree">Burning Tree Simulation</option>
                    <option value="morris-inorder">Morris Inorder (O(1) Space)</option>
                  </optgroup>
                </select>
              </div>

              {/* Dynamic Inputs */}
              {activeAlgo === 'lca' && (
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-stone-400">LCA Setup (Select p & q)</label>
                  <div className="grid grid-cols-2 gap-1.5">
                    <select
                      value={lcaPId}
                      onChange={(e) => setLcaPId(e.target.value)}
                      className="p-1 px-1.5 border border-stone-200 rounded bg-white text-xs"
                    >
                      {Object.values(tree).map((n) => (
                        <option key={`opt-p-${n.id}`} value={n.id}>
                          p: {n.val}
                        </option>
                      ))}
                    </select>
                    <select
                      value={lcaQId}
                      onChange={(e) => setLcaQId(e.target.value)}
                      className="p-1 px-1.5 border border-stone-200 rounded bg-white text-xs"
                    >
                      {Object.values(tree).map((n) => (
                        <option key={`opt-q-${n.id}`} value={n.id}>
                          q: {n.val}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              )}

              {activeAlgo === 'path-sum' && (
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-stone-400">Target Path Sum</label>
                  <input
                    type="number"
                    value={targetSum}
                    onChange={(e) => setTargetSum(Number(e.target.value))}
                    className="w-full px-2 py-1 text-center text-xs border border-stone-200 rounded bg-white font-semibold text-stone-800"
                  />
                </div>
              )}

              {activeAlgo !== 'lca' && activeAlgo !== 'path-sum' && (
                <div className="flex flex-col justify-center">
                  <span className="text-[11px] text-stone-500 leading-tight">
                    {activeAlgo.includes('rec') ? 'Recursive (DFS) exploration with visual stack trace.' : 
                     activeAlgo.includes('iter') ? 'Iterative simulation using simulated storage Stack.' :
                     activeAlgo === 'level-order' ? 'Queue-driven Level Order (BFS) traversal.' : 
                     activeAlgo === 'boundary-traversal' ? 'Sweeps outer paths: Left Boundary -> Leaves -> Right Boundary.' :
                     activeAlgo === 'morris-inorder' ? 'Morris Inorder Traversal: O(1) space using temporary back-links.' :
                     activeAlgo === 'burning-tree' ? `Spreads fire level-by-level from ${selectedNodeId ? `Node ${tree[selectedNodeId]?.val}` : 'selected node'} to all connected nodes.` :
                     'Visualizing topological and structural metrics.'}
                  </span>
                </div>
              )}
            </div>

            {/* Playback Controls and Speed slider */}
            <div className="pt-2 border-t border-stone-100 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-1">
                <button
                  disabled={currentStepIdx <= 0}
                  onClick={() => setCurrentStepIdx((prev) => Math.max(0, prev - 1))}
                  className="p-1.5 border border-stone-200 rounded-lg hover:bg-stone-50 text-stone-700 disabled:opacity-40 disabled:cursor-not-allowed active:scale-95 transition-transform cursor-pointer"
                  title="Step Backward"
                >
                  <SkipBack size={13} />
                </button>
                <button
                  disabled={steps.length === 0}
                  onClick={() => setIsPlaying(!isPlaying)}
                  className={`p-1.5 px-2 rounded-lg text-white font-semibold active:scale-95 transition-transform cursor-pointer flex items-center justify-center ${
                    isPlaying ? 'bg-amber-600 hover:bg-amber-700' : 'bg-stone-900 hover:bg-stone-800'
                  }`}
                  title={isPlaying ? 'Pause' : 'Play'}
                >
                  {isPlaying ? <Pause size={13} /> : <Play size={13} />}
                </button>
                <button
                  disabled={currentStepIdx >= steps.length - 1}
                  onClick={() => setCurrentStepIdx((prev) => Math.min(steps.length - 1, prev + 1))}
                  className="p-1.5 border border-stone-200 rounded-lg hover:bg-stone-50 text-stone-700 disabled:opacity-40 disabled:cursor-not-allowed active:scale-95 transition-transform cursor-pointer"
                  title="Step Forward"
                >
                  <SkipForward size={13} />
                </button>
                <button
                  onClick={() => {
                    setIsPlaying(false);
                    setCurrentStepIdx(steps.length > 0 ? 0 : -1);
                  }}
                  className="p-1.5 border border-stone-200 rounded-lg hover:bg-stone-50 text-stone-700 active:scale-95 transition-transform cursor-pointer"
                  title="Reset"
                >
                  <RotateCcw size={13} />
                </button>
                <span className="text-[11px] font-semibold text-stone-500 ml-1.5 select-none">
                  Step: {steps.length > 0 ? `${currentStepIdx + 1}/${steps.length}` : '0/0'}
                </span>
              </div>

              {/* Speed Controller with presets */}
              <div className="flex items-center gap-2.5 text-[11px] text-stone-500 justify-end flex-wrap">
                <span className="font-medium select-none">Speed:</span>
                <div className="flex gap-1">
                  {[400, 800, 1500].map((speedMs) => (
                    <button
                      key={speedMs}
                      onClick={() => setPlaybackSpeed(speedMs)}
                      className={`px-1.5 py-0.5 rounded text-[10px] border cursor-pointer transition-colors ${
                        playbackSpeed === speedMs
                          ? 'bg-stone-900 text-white border-stone-900 font-semibold'
                          : 'bg-white text-stone-600 border-stone-200 hover:bg-stone-50'
                      }`}
                    >
                      {speedMs === 400 ? '0.4s (Fast)' : speedMs === 800 ? '0.8s' : '1.5s (Slow)'}
                    </button>
                  ))}
                </div>
                <input
                  type="range"
                  min="200"
                  max="2000"
                  step="100"
                  value={playbackSpeed}
                  onChange={(e) => setPlaybackSpeed(Number(e.target.value))}
                  className="w-14 accent-stone-700 h-1 cursor-pointer"
                  title="Fine-tune Speed"
                />
                <span className="font-mono min-w-[28px] text-right">{(playbackSpeed / 1000).toFixed(1)}s</span>
              </div>
            </div>

            {/* Dynamic Explanation Panel */}
            <div className="bg-[#FAF9F5] border border-amber-200/40 rounded-lg p-2.5 text-[11px] flex gap-2">
              <Info size={13} className="text-amber-600 shrink-0 mt-0.5" />
              <div className="flex-1 min-w-0">
                <p className="text-stone-700 leading-normal font-sans">
                  {currentStep?.description ?? 'Select an algorithm above and press Play or Step Forward to start.'}
                </p>
                {currentStep && currentStep.metrics && currentStep.metrics.length > 0 && (
                  <div className="mt-1.5 flex flex-wrap gap-2 items-center">
                    {currentStep.metrics.map((m, idx) => (
                      <span key={`metric-${idx}`} className="text-[10px] font-mono bg-amber-100/60 text-amber-900 px-1.5 py-0.5 rounded border border-amber-200/40">
                        <strong>{m.label}:</strong> {m.value}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Live Traversal Output Tape */}
            <div className="border-t border-stone-100 pt-2.5 mt-0.5 shrink-0">
              <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-stone-400 mb-1.5 select-none">
                <span>Live Output / Traversal Stream</span>
                {currentStep && currentStep.visited.length > 0 && (
                  <span className="text-emerald-600 font-extrabold normal-case font-sans">
                    {currentStep.visited.length} node{currentStep.visited.length > 1 ? 's' : ''} visited
                  </span>
                )}
              </div>
              <div className="bg-stone-50 border border-stone-200 rounded-lg p-2 min-h-[36px] flex flex-wrap gap-1.5 items-center">
                {currentStep && currentStep.visited.length > 0 ? (
                  currentStep.visited.map((v, idx) => {
                    const isLast = idx === currentStep.visited.length - 1;
                    return (
                      <div key={`live-vis-${idx}`} className="flex items-center gap-1 animate-fadeIn">
                        <span className={`px-2 py-0.5 rounded font-mono font-extrabold text-[11px] border shadow-sm transition-all duration-300 ${
                          isLast
                            ? 'bg-amber-100 border-amber-300 text-amber-900 scale-105 ring-2 ring-amber-400/20'
                            : 'bg-white border-stone-200 text-stone-800'
                        }`}>
                          {v}
                        </span>
                        {idx < currentStep.visited.length - 1 && (
                          <span className="text-stone-300 text-[10px] font-bold font-mono">→</span>
                        )}
                      </div>
                    );
                  })
                ) : (
                  <span className="text-stone-400 text-[11px] italic leading-none pl-1 select-none">No outputs generated yet. Start stepping or play to populate.</span>
                )}
              </div>
            </div>
          </div>

          {/* TRACE CONSOLE (Synchronized C++ Snippet & Structures) */}
          <div className="flex-1 min-h-0 bg-white border border-stone-200 rounded-xl overflow-hidden shadow-sm flex flex-col">
            {/* Console Tab Selectors */}
            <div className="flex border-b border-stone-100 bg-stone-50/50 shrink-0">
              <button
                onClick={() => setConsoleTab('code')}
                className={`flex-1 py-2 text-[11px] font-semibold border-b-2 transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  consoleTab === 'code'
                    ? 'border-stone-900 text-stone-950 bg-white'
                    : 'border-transparent text-stone-400 hover:text-stone-600'
                }`}
              >
                <Code size={12} /> C++ Code
              </button>
              <button
                onClick={() => setConsoleTab('stack')}
                className={`flex-1 py-2 text-[11px] font-semibold border-b-2 transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  consoleTab === 'stack'
                    ? 'border-stone-900 text-stone-950 bg-white'
                    : 'border-transparent text-stone-400 hover:text-stone-600'
                }`}
              >
                <Layers size={12} /> Call Stack
              </button>
              <button
                onClick={() => setConsoleTab('structures')}
                className={`flex-1 py-2 text-[11px] font-semibold border-b-2 transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  consoleTab === 'structures'
                    ? 'border-stone-900 text-stone-950 bg-white'
                    : 'border-transparent text-stone-400 hover:text-stone-600'
                }`}
              >
                <Eye size={12} /> Storage/Visited
              </button>
            </div>

            {/* Tab Contents */}
            <div ref={codeContainerRef} className="flex-1 overflow-auto p-3.5 bg-[#1E1E1C] text-stone-300 font-mono text-[11px]">
              
              {/* CODE SNIPPET VIEW */}
              {consoleTab === 'code' && (
                <div className="space-y-0.5">
                  {(CODE_SNIPPETS[activeAlgo] ?? []).map((line, idx) => {
                    const isHighlighted = currentStep && currentStep.lineHighlight === idx;
                    return (
                      <div
                        key={`code-line-${idx}`}
                        data-highlighted={isHighlighted ? 'true' : 'false'}
                        className={`py-0.5 px-1.5 rounded flex items-center transition-all ${
                          isHighlighted
                            ? 'bg-amber-500/20 text-amber-200 border-l-[3px] border-amber-500 -ml-1.5'
                            : 'opacity-75'
                        }`}
                      >
                        <span className="w-5 text-stone-500 text-[10px] select-none text-right mr-3">
                          {idx + 1}
                        </span>
                        <pre className="whitespace-pre">{line}</pre>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* RECURSION CALL STACK VIEW */}
              {consoleTab === 'stack' && (
                <div className="space-y-2 h-full flex flex-col justify-end">
                  {currentStep && currentStep.callStack.length > 0 ? (
                    <div className="flex flex-col-reverse gap-1.5 overflow-y-auto pr-1">
                      {currentStep.callStack.map((frame, idx) => (
                        <div
                          key={`frame-${frame.id}`}
                          className="bg-stone-800 border border-stone-700/80 rounded-lg p-2 flex flex-col gap-0.5 shadow-sm"
                          style={{ marginLeft: `${frame.depth * 6}px` }}
                        >
                          <div className="flex items-center justify-between text-[10px]">
                            <span className="text-amber-300 font-bold">
                              Depth {frame.depth}: {frame.name}()
                            </span>
                            {frame.returnVal !== undefined && (
                              <span className="text-emerald-400 font-semibold">
                                Return: {frame.returnVal}
                              </span>
                            )}
                          </div>
                          <span className="text-stone-400 text-[10px] font-mono">
                            Params: {frame.params}
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-stone-500 h-full flex items-center justify-center text-center p-4">
                      No recursion stack active.<br />Recursive DFS algorithms populate this panel.
                    </div>
                  )}
                </div>
              )}

              {/* DATA STRUCTURES (Queue, Stack, Visited outputs) */}
              {consoleTab === 'structures' && (
                <div className="space-y-4">
                  {/* Visited Array */}
                  <div>
                    <span className="text-[10px] uppercase tracking-wider text-stone-500 block mb-1">
                      Visited/Processed Outputs
                    </span>
                    <div className="bg-stone-800 border border-stone-700 rounded-lg p-2 min-h-[30px] flex flex-wrap gap-1.5 items-center">
                      {currentStep && currentStep.visited.length > 0 ? (
                        currentStep.visited.map((v, idx) => (
                          <span
                            key={`vis-${idx}`}
                            className="px-2 py-0.5 bg-sky-950/60 text-sky-200 border border-sky-900 rounded font-bold text-[10px]"
                          >
                            {v}
                          </span>
                        ))
                      ) : (
                        <span className="text-stone-500 text-xs italic">Empty</span>
                      )}
                    </div>
                  </div>

                  {/* Active Queue / Auxiliary Stack Content */}
                  <div>
                    <span className="text-[10px] uppercase tracking-wider text-stone-500 block mb-1">
                      Auxiliary Storage (Queue / Iterative Stack)
                    </span>
                    <div className="bg-stone-800 border border-stone-700 rounded-lg p-2 min-h-[30px] flex flex-wrap gap-1.5 items-center">
                      {currentStep && currentStep.queue.length > 0 ? (
                        currentStep.queue.map((qItem, idx) => (
                          <span
                            key={`queue-${idx}`}
                            className="px-2 py-0.5 bg-amber-950/60 text-amber-200 border border-amber-900 rounded font-bold text-[10px] flex items-center gap-1"
                          >
                            {idx === 0 && <span className="w-1.5 h-1.5 rounded-full bg-amber-400 inline-block shrink-0 animate-pulse" />}
                            {qItem}
                          </span>
                        ))
                      ) : (
                        <span className="text-stone-500 text-xs italic">Empty</span>
                      )}
                    </div>
                  </div>
                </div>
              )}

            </div>
          </div>

        </section>

      </main>
    </div>
  );
}
