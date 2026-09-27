import React from 'react';
import {
  Network,
  Play,
  RotateCcw,
  Sparkles,
  HelpCircle,
  ArrowRight,
  Move,
  PlusCircle,
  Link as LinkIcon,
  Trash2,
  SlidersHorizontal,
  ChevronDown
} from 'lucide-react';
import { AlgorithmType } from '../types';
import { ALGORITHM_METADATA_LIST, PRESET_GRAPHS } from '../data/presetGraphs';

interface NavbarProps {
  currentAlgorithm: AlgorithmType;
  onSelectAlgorithm: (algo: AlgorithmType) => void;
  onLoadPreset: (presetId: string) => void;
  isDirected: boolean;
  onToggleDirected: (directed: boolean) => void;
  onResetGraph: () => void;
  onClearGraph: () => void;
  onOpenInfoModal: () => void;
  activeTool: 'select' | 'add-node' | 'add-edge' | 'delete';
  onChangeTool: (tool: 'select' | 'add-node' | 'add-edge' | 'delete') => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentAlgorithm,
  onSelectAlgorithm,
  onLoadPreset,
  isDirected,
  onToggleDirected,
  onResetGraph,
  onClearGraph,
  onOpenInfoModal,
  activeTool,
  onChangeTool
}) => {
  const currentAlgoMeta = ALGORITHM_METADATA_LIST.find(a => a.id === currentAlgorithm);

  return (
    <header className="bg-white border-b border-stone-200/80 sticky top-0 z-40 shadow-xs">
      {/* Top Header Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2.5 flex items-center justify-between gap-4">
        {/* Brand & Identity */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-stone-900 text-stone-50 flex items-center justify-center font-bold shadow-xs">
            <Network className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base font-bold tracking-tight text-stone-900">
                Graph Algorithms Visualizer
              </h1>
              <span className="hidden sm:inline-block px-2 py-0.5 text-[11px] font-semibold bg-stone-100 text-stone-700 rounded-full border border-stone-200">
                C++ Sync Engine
              </span>
            </div>
            <p className="text-xs text-stone-500 hidden md:block">
              Interactive execution tracer with synchronized C++ line debugger
            </p>
          </div>
        </div>

        {/* Algorithm Selection Dropdown & Specs */}
        <div className="flex items-center gap-2">
          <div className="relative">
            <select
              id="algorithm-select"
              aria-label="Select Graph Algorithm"
              value={currentAlgorithm}
              onChange={e => onSelectAlgorithm(e.target.value as AlgorithmType)}
              className="appearance-none bg-stone-50 hover:bg-stone-100 text-stone-900 text-xs font-semibold pl-3 pr-8 py-2 rounded-md border border-stone-300 focus:outline-none focus:ring-2 focus:ring-stone-900 cursor-pointer transition-colors shadow-2xs"
            >
              <optgroup label="1. Traversals & Foundations">
                <option value="bfs">Breadth First Search (BFS)</option>
                <option value="dfs">Depth First Search (DFS)</option>
              </optgroup>
              <optgroup label="2. Cycle Detection">
                <option value="cycle-undirected">Cycle in Undirected Graph (Parent Tracking)</option>
                <option value="cycle-directed">Cycle in Directed Graph (DFS Recursion Stack)</option>
                <option value="cycle-detection">Cycle Detection (Tri-Color DFS)</option>
              </optgroup>
              <optgroup label="3. DAGs & Topological Ordering">
                <option value="toposort">Topological Sort (Kahn's BFS)</option>
                <option value="course-schedule">Course Schedule I (canFinish • LC 207)</option>
                <option value="course-schedule-2">Course Schedule II (findOrder • LC 210)</option>
              </optgroup>
              <optgroup label="4. Grid Graphs & Multi-Source BFS">
                <option value="flood-fill">Flood Fill (Grid Search • LC 733)</option>
                <option value="rotten-oranges">Rotting Oranges (Multi-Source BFS • LC 994)</option>
                <option value="word-search">Word Search (2D Board DFS • LC 79)</option>
                <option value="word-ladder">Word Ladder (Shortest Transformation • LC 127)</option>
              </optgroup>
              <optgroup label="5. Shortest Path Algorithms">
                <option value="dijkstra">Dijkstra's Algorithm (Min-Heap SSSP)</option>
                <option value="bellman-ford">Bellman-Ford Algorithm (Negative Weights)</option>
                <option value="cheapest-flights">Cheapest Flights Within K Stops (LC 787)</option>
              </optgroup>
              <optgroup label="6. Minimum Spanning Trees">
                <option value="prim">Prim's Algorithm (Greedy Cut)</option>
                <option value="kruskal">Kruskal's Algorithm (DSU Union-Find)</option>
              </optgroup>
              <optgroup label="7. Euler Tours & Word Chains">
                <option value="eulerian-circuit">Eulerian Circuit (Hierholzer's Tour)</option>
                <option value="circle-of-strings">Circle of Strings (Word Chaining • GFG/LC)</option>
              </optgroup>
              <optgroup label="8. Network Connectivity & Failures (Advanced)">
                <option value="kosaraju">Kosaraju's SCC Decomposition</option>
                <option value="critical-connections">Critical Connections (Bridges • LC 1192)</option>
                <option value="articulation-points">Articulation Points (Cut Vertices)</option>
                <option value="network-connected">Make Network Connected (Cable Rewiring • LC 1319)</option>
                <option value="covid-spread">COVID-19 Social Contact Spread</option>
              </optgroup>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-stone-500 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {/* Preset Selector */}
          <div className="relative hidden sm:block">
            <select
              id="preset-select"
              aria-label="Load Preset Graph"
              defaultValue=""
              onChange={e => {
                if (e.target.value) {
                  onLoadPreset(e.target.value);
                  e.target.value = '';
                }
              }}
              className="appearance-none bg-white hover:bg-stone-50 text-stone-700 text-xs font-medium pl-3 pr-8 py-2 rounded-md border border-stone-200 focus:outline-none focus:ring-2 focus:ring-stone-400 cursor-pointer transition-colors shadow-2xs"
            >
              <option value="" disabled>Load Preset...</option>
              {PRESET_GRAPHS.map(p => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-stone-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {/* Algorithm Info / Complexity Button */}
          <button
            id="algo-info-btn"
            onClick={onOpenInfoModal}
            className="flex items-center gap-1.5 px-2.5 py-2 text-xs font-medium text-stone-600 hover:text-stone-900 bg-stone-100 hover:bg-stone-200/80 rounded-md transition-colors"
            title="Algorithm Theory & Time Complexity"
          >
            <HelpCircle className="w-4 h-4 text-stone-500" />
            <span className="hidden lg:inline">{currentAlgoMeta?.timeComplexity}</span>
          </button>
        </div>
      </div>

      {/* Secondary Toolbar: Canvas Tools & Modifiers */}
      <div className="bg-stone-50/70 border-t border-stone-200/60 px-4 sm:px-6 py-1.5">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2 text-xs">
          {currentAlgorithm === 'flood-fill' || currentAlgorithm === 'rotten-oranges' ? (
            <div className="flex items-center gap-2 py-0.5">
              <span className="font-semibold text-stone-700 flex items-center gap-1.5">
                {currentAlgorithm === 'rotten-oranges' ? '🍊 Rotten Oranges Mode' : '🎨 Flood Fill Matrix'}
              </span>
              <span className="text-stone-400">|</span>
              <span className="text-[11px] text-stone-500">
                {currentAlgorithm === 'rotten-oranges'
                  ? 'Click cells to cycle Empty (0) → Fresh (1) → Rotten (2)'
                  : 'Click cell to toggle wall/color • Right-click to set seed [S]'}
              </span>
            </div>
          ) : (
            /* Canvas Editing Tools */
            <div className="flex items-center gap-1 bg-white p-1 rounded-lg border border-stone-200 shadow-2xs">
              <button
                id="tool-select"
                onClick={() => onChangeTool('select')}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded font-medium transition-all ${
                  activeTool === 'select'
                    ? 'bg-stone-900 text-white shadow-xs'
                    : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
                }`}
                title="Select & Move Nodes (V)"
              >
                <Move className="w-3.5 h-3.5" />
                <span>Move</span>
              </button>

              <button
                id="tool-add-node"
                onClick={() => onChangeTool('add-node')}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded font-medium transition-all ${
                  activeTool === 'add-node'
                    ? 'bg-stone-900 text-white shadow-xs'
                    : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
                }`}
                title="Click Canvas to Add Node (N)"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>Add Node</span>
              </button>

              <button
                id="tool-add-edge"
                onClick={() => onChangeTool('add-edge')}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded font-medium transition-all ${
                  activeTool === 'add-edge'
                    ? 'bg-stone-900 text-white shadow-xs'
                    : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
                }`}
                title="Click Source then Target to Connect (E)"
              >
                <LinkIcon className="w-3.5 h-3.5" />
                <span>Add Edge</span>
              </button>

              <button
                id="tool-delete"
                onClick={() => onChangeTool('delete')}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded font-medium transition-all ${
                  activeTool === 'delete'
                    ? 'bg-rose-600 text-white shadow-xs'
                    : 'text-stone-600 hover:text-rose-700 hover:bg-rose-50'
                }`}
                title="Click Node or Edge to Erase (D)"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Erase</span>
              </button>
            </div>
          )}

          {/* Graph Config Switches & Quick Actions */}
          {currentAlgorithm !== 'flood-fill' && currentAlgorithm !== 'rotten-oranges' && (
            <div className="flex items-center gap-2">
              {/* Directed / Undirected Toggle */}
              <button
                id="toggle-directed-btn"
                onClick={() => onToggleDirected(!isDirected)}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md border text-xs font-semibold transition-all ${
                  isDirected
                    ? 'bg-amber-50 text-amber-900 border-amber-300'
                    : 'bg-white text-stone-700 border-stone-200 hover:bg-stone-100'
                }`}
                title="Toggle between Directed (arrows) and Undirected edges"
              >
                <ArrowRight className={`w-3.5 h-3.5 ${isDirected ? 'text-amber-600' : 'text-stone-400'}`} />
                <span>{isDirected ? 'Directed Graph' : 'Undirected Graph'}</span>
              </button>

              {/* Reset Graph to current preset */}
              <button
                id="reset-graph-btn"
                onClick={onResetGraph}
                className="px-2.5 py-1 rounded-md border border-stone-200 bg-white text-stone-600 hover:text-stone-900 hover:bg-stone-100 transition-colors font-medium"
                title="Reset graph layout to default preset"
              >
                Reset Layout
              </button>

              {/* Clear Canvas */}
              <button
                id="clear-canvas-btn"
                onClick={onClearGraph}
                className="px-2.5 py-1 rounded-md border border-stone-200 bg-white text-stone-600 hover:text-rose-600 hover:bg-rose-50/50 transition-colors font-medium"
                title="Clear all nodes and edges"
              >
                Clear
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
