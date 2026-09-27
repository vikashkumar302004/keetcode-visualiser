import React, { useState } from 'react';
import { ExecutionStep, GraphData } from '../types';
import { buildAdjacencyList, buildAdjacencyMatrix } from '../algorithms/engine';
import { Activity, Database, Table, Layers, AlertTriangle, CheckCircle2 } from 'lucide-react';

interface TraceStatePanelProps {
  currentStep?: ExecutionStep;
  graph: GraphData;
}

export const TraceStatePanel: React.FC<TraceStatePanelProps> = ({ currentStep, graph }) => {
  const [activeTab, setActiveTab] = useState<'state' | 'representation'>('state');
  const [repType, setRepType] = useState<'list' | 'matrix'>('list');

  const adjList = buildAdjacencyList(graph);
  const { nodes: matrixNodes, matrix } = buildAdjacencyMatrix(graph);

  const ds = currentStep?.dataStructure;
  const visited = currentStep?.visited || {};
  const distances = currentStep?.distances;
  const parents = currentStep?.parents;
  const cycleDetected = currentStep?.cycleDetected;
  const negativeCycle = currentStep?.negativeCycle;

  return (
    <div className="flex flex-col h-full bg-white rounded-xl border border-stone-200/90 overflow-hidden shadow-xs">
      {/* Panel Navigation Tabs */}
      <div className="flex items-center justify-between px-3 py-2 bg-stone-50 border-b border-stone-200">
        <div className="flex items-center gap-1">
          <button
            onClick={() => setActiveTab('state')}
            className={`flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-md transition-colors ${
              activeTab === 'state'
                ? 'bg-white text-stone-900 shadow-2xs border border-stone-200'
                : 'text-stone-500 hover:text-stone-800'
            }`}
          >
            <Activity className="w-3.5 h-3.5 text-stone-600" />
            Execution State
          </button>
          <button
            onClick={() => setActiveTab('representation')}
            className={`flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-md transition-colors ${
              activeTab === 'representation'
                ? 'bg-white text-stone-900 shadow-2xs border border-stone-200'
                : 'text-stone-500 hover:text-stone-800'
            }`}
          >
            <Table className="w-3.5 h-3.5 text-stone-600" />
            Adj List / Matrix
          </button>
        </div>

        {currentStep?.phase && (
          <span className="text-[11px] font-semibold text-stone-600 bg-stone-200/70 px-2 py-0.5 rounded">
            {currentStep.phase}
          </span>
        )}
      </div>

      {/* Step Narrative Explanation Box */}
      <div className="p-3 bg-stone-50/50 border-b border-stone-100">
        <div className="flex items-start gap-2">
          {cycleDetected || negativeCycle ? (
            <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
          ) : (
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
          )}
          <p className="text-xs text-stone-800 font-medium leading-relaxed">
            {currentStep?.description || 'Ready. Press Play or Step Forward to start graph algorithm execution.'}
          </p>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto p-3 space-y-4">
        {activeTab === 'state' ? (
          <>
            {/* 1. Active Data Structure (Queue / Stack / Min-Heap / DSU) */}
            {ds && (
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-stone-700 flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5 text-stone-500" />
                    {ds.title}
                  </span>
                  <span className="text-[10px] text-stone-400 font-mono">
                    {ds.items.length} item{ds.items.length === 1 ? '' : 's'}
                  </span>
                </div>

                {ds.type === 'dsu' && ds.dsuParent ? (
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-1.5 p-2 bg-stone-50 rounded-lg border border-stone-200 font-mono text-xs">
                    {Object.entries(ds.dsuParent).map(([node, parentNode]) => (
                      <div key={node} className="bg-white p-1.5 rounded border border-stone-200 flex flex-col items-center">
                        <span className="text-[10px] text-stone-400 font-bold">{node}</span>
                        <span className="text-xs font-bold text-stone-800">
                          Parent: {parentNode}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : ds.type === 'components' && ds.items.length > 0 ? (
                  <div className="space-y-1.5 p-2 bg-stone-50 rounded-lg border border-stone-200">
                    {ds.items.map((item, idx) => (
                      <div key={idx} className="flex items-center justify-between text-xs px-2 py-1 bg-white rounded border border-stone-200 font-mono">
                        <span className="font-bold text-stone-700">{item.label}</span>
                        <span className="font-semibold text-emerald-700">{item.value}</span>
                      </div>
                    ))}
                  </div>
                ) : ds.items.length === 0 ? (
                  <div className="p-3 text-center text-xs text-stone-400 bg-stone-50 rounded-lg border border-stone-100 font-mono">
                    [ Empty / Cleared ]
                  </div>
                ) : (
                  <div className="flex flex-wrap gap-1.5 p-2 bg-stone-50 rounded-lg border border-stone-200">
                    {ds.items.map((item, idx) => (
                      <div
                        key={idx}
                        className={`flex items-center gap-1.5 px-2.5 py-1 rounded border text-xs font-mono font-medium shadow-2xs ${
                          item.badge === 'top' || item.badge === 'min' || item.status === 'active'
                            ? 'bg-amber-100 text-amber-900 border-amber-300 font-bold'
                            : 'bg-white text-stone-800 border-stone-200'
                        }`}
                      >
                        <span>{item.label}</span>
                        {item.value && (
                          <span className="text-[10px] text-stone-500 font-normal">
                            ({item.value})
                          </span>
                        )}
                        {item.badge && (
                          <span className="text-[9px] uppercase px-1 py-0.2 bg-amber-600 text-white rounded font-bold">
                            {item.badge}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* 2. Distance Array dist[u] (for Dijkstra & Bellman-Ford) */}
            {distances && (
              <div className="space-y-1.5">
                <span className="text-xs font-bold text-stone-700">
                  Distance Array <span className="font-mono text-stone-400">dist[u]</span>
                </span>
                <div className="grid grid-cols-4 sm:grid-cols-6 gap-1 p-2 bg-stone-50 rounded-lg border border-stone-200 font-mono text-xs">
                  {graph.nodes.map(n => {
                    const d = distances[n.id];
                    return (
                      <div key={n.id} className="bg-white p-1.5 rounded border border-stone-200 text-center">
                        <div className="text-[10px] font-bold text-stone-400">{n.id}</div>
                        <div className={`font-bold ${d !== null ? 'text-indigo-700' : 'text-stone-400'}`}>
                          {d !== null ? d : '∞'}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* 3. Visited Array visited[u] */}
            {graph.nodes.length > 0 && (
              <div className="space-y-1.5">
                <span className="text-xs font-bold text-stone-700">
                  Visited Array <span className="font-mono text-stone-400">visited[u]</span>
                </span>
                <div className="flex flex-wrap gap-1.5 p-2 bg-stone-50 rounded-lg border border-stone-200 font-mono text-xs">
                  {graph.nodes.map(n => {
                    const isVis = visited[n.id] ?? false;
                    return (
                      <div
                        key={n.id}
                        className={`flex items-center gap-1.5 px-2 py-0.5 rounded border ${
                          isVis
                            ? 'bg-emerald-50 text-emerald-900 border-emerald-300 font-bold'
                            : 'bg-white text-stone-500 border-stone-200'
                        }`}
                      >
                        <span>{n.id}:</span>
                        <span>{isVis ? 'true' : 'false'}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* 4. Parent Array (if present) */}
            {parents && Object.values(parents).some(p => p !== null) && (
              <div className="space-y-1.5">
                <span className="text-xs font-bold text-stone-700">
                  Parent Pointers <span className="font-mono text-stone-400">parent[u]</span>
                </span>
                <div className="flex flex-wrap gap-1.5 p-2 bg-stone-50 rounded-lg border border-stone-200 font-mono text-xs">
                  {graph.nodes.map(n => {
                    const p = parents[n.id];
                    return (
                      <div key={n.id} className="bg-white px-2 py-0.5 rounded border border-stone-200">
                        <span className="text-stone-400">{n.id} ← </span>
                        <span className="font-bold text-stone-800">{p ?? 'None'}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* 5. Live Algorithm Variables (if present) */}
            {currentStep?.variables && Object.keys(currentStep.variables).length > 0 && (
              <div className="space-y-1.5">
                <span className="text-xs font-bold text-stone-700">
                  Active State Variables
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5 p-2 bg-stone-50 rounded-lg border border-stone-200 font-mono text-xs">
                  {Object.entries(currentStep.variables).map(([k, v]) => (
                    <div key={k} className="bg-white p-1.5 rounded border border-stone-200 flex flex-col">
                      <span className="text-[10px] text-stone-400 font-bold uppercase truncate">{k}</span>
                      <span className="font-bold text-stone-900 truncate">{String(v)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 6. Critical Bridges & Articulation Points Highlights */}
            {currentStep?.bridges && currentStep.bridges.length > 0 && (
              <div className="space-y-1.5 p-2.5 bg-amber-50/80 rounded-lg border border-amber-200">
                <span className="text-xs font-bold text-amber-900 flex items-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-700" />
                  Identified Critical Connections (Bridges)
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {currentStep.bridges.map((b, i) => (
                    <span key={i} className="px-2 py-0.5 bg-amber-200/80 text-amber-900 text-xs font-mono font-bold rounded border border-amber-300">
                      Bridge: {b}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {currentStep?.articulationPoints && currentStep.articulationPoints.length > 0 && (
              <div className="space-y-1.5 p-2.5 bg-purple-50/80 rounded-lg border border-purple-200">
                <span className="text-xs font-bold text-purple-900 flex items-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5 text-purple-700" />
                  Confirmed Articulation Points (Cut Vertices)
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {currentStep.articulationPoints.map((nodeId, i) => (
                    <span key={i} className="px-2 py-0.5 bg-purple-200/80 text-purple-900 text-xs font-mono font-bold rounded border border-purple-300">
                      Cut Vertex: {nodeId}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* 7. Eulerian Circuit Trail Sequence */}
            {currentStep?.eulerCircuit && currentStep.eulerCircuit.length > 0 && (
              <div className="space-y-1.5 p-2.5 bg-emerald-50/80 rounded-lg border border-emerald-200">
                <span className="text-xs font-bold text-emerald-900">
                  Eulerian Trail Sequence
                </span>
                <div className="text-xs font-mono font-semibold text-emerald-800 break-words leading-relaxed">
                  {currentStep.eulerCircuit.join(' → ')}
                </div>
              </div>
            )}

            {/* 8. Course Schedule / Topo Order */}
            {currentStep?.topoOrder && currentStep.topoOrder.length > 0 && (
              <div className="space-y-1.5 p-2.5 bg-indigo-50/80 rounded-lg border border-indigo-200">
                <span className="text-xs font-bold text-indigo-900">
                  Course Completion Order
                </span>
                <div className="text-xs font-mono font-semibold text-indigo-800 break-words leading-relaxed">
                  {currentStep.topoOrder.join(' → ')}
                </div>
              </div>
            )}

            {/* 8b. Circle of Strings Word Loop */}
            {currentStep?.wordChain && currentStep.wordChain.length > 0 && (
              <div className="space-y-1.5 p-2.5 bg-teal-50/80 rounded-lg border border-teal-200">
                <span className="text-xs font-bold text-teal-900 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-teal-700" />
                  Circle of Strings Word Loop
                </span>
                <div className="flex flex-wrap items-center gap-1.5 text-xs font-mono font-semibold text-teal-900">
                  {currentStep.wordChain.map((w, idx) => (
                    <React.Fragment key={idx}>
                      <span className="px-2 py-0.5 bg-teal-200/80 text-teal-950 rounded border border-teal-300">
                        "{w}"
                      </span>
                      {idx < currentStep.wordChain!.length - 1 && <span className="text-teal-500">→</span>}
                    </React.Fragment>
                  ))}
                  <span className="text-teal-600 font-bold">↺ loop</span>
                </div>
              </div>
            )}

            {/* 9. COVID-19 Epidemic Wave Stats */}
            {currentStep?.covidStats && (
              <div className="grid grid-cols-3 gap-2 p-2.5 bg-rose-50/80 rounded-lg border border-rose-200 font-mono text-xs">
                <div className="bg-white p-2 rounded border border-rose-200 text-center">
                  <span className="text-[10px] text-rose-500 font-bold uppercase block">Wave Day</span>
                  <span className="text-base font-extrabold text-rose-900">Day {currentStep.covidStats.day}</span>
                </div>
                <div className="bg-white p-2 rounded border border-rose-200 text-center">
                  <span className="text-[10px] text-rose-500 font-bold uppercase block">Infected</span>
                  <span className="text-base font-extrabold text-rose-700">{currentStep.covidStats.infected}</span>
                </div>
                <div className="bg-white p-2 rounded border border-rose-200 text-center">
                  <span className="text-[10px] text-emerald-600 font-bold uppercase block">Protected</span>
                  <span className="text-base font-extrabold text-emerald-700">{currentStep.covidStats.healthy}</span>
                </div>
              </div>
            )}
          </>
        ) : (
          /* Tab 2: Adjacency List / Matrix */
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setRepType('list')}
                className={`text-xs px-2.5 py-1 rounded font-semibold transition-colors ${
                  repType === 'list'
                    ? 'bg-stone-900 text-white'
                    : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                }`}
              >
                Adjacency List
              </button>
              <button
                onClick={() => setRepType('matrix')}
                className={`text-xs px-2.5 py-1 rounded font-semibold transition-colors ${
                  repType === 'matrix'
                    ? 'bg-stone-900 text-white'
                    : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                }`}
              >
                Adjacency Matrix
              </button>
            </div>

            {repType === 'list' ? (
              <div className="p-2 bg-stone-50 rounded-lg border border-stone-200 font-mono text-xs space-y-1.5">
                {Object.entries(adjList).map(([u, neighbors]) => (
                  <div key={u} className="flex items-start gap-2 bg-white p-1.5 rounded border border-stone-200">
                    <span className="font-bold text-stone-900 w-6 shrink-0">{u}:</span>
                    <span className="text-stone-700">
                      {neighbors.length === 0
                        ? '[]'
                        : `[ ${neighbors.map(n => `(${n.target}, w=${n.weight})`).join(', ')} ]`}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="overflow-x-auto p-2 bg-stone-50 rounded-lg border border-stone-200">
                <table className="w-full text-xs font-mono border-collapse text-center">
                  <thead>
                    <tr>
                      <th className="p-1.5 text-stone-400 font-bold border-b border-stone-200"></th>
                      {matrixNodes.map(id => (
                        <th key={id} className="p-1.5 text-stone-700 font-bold border-b border-stone-200">
                          {id}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {matrixNodes.map(u => (
                      <tr key={u} className="hover:bg-stone-100/60">
                        <td className="p-1.5 text-stone-700 font-bold border-r border-stone-200 bg-white">
                          {u}
                        </td>
                        {matrixNodes.map(v => {
                          const w = matrix[u][v];
                          return (
                            <td
                              key={v}
                              className={`p-1.5 border border-stone-200/50 ${
                                w !== null ? 'font-bold text-indigo-700 bg-indigo-50/40' : 'text-stone-300'
                              }`}
                            >
                              {w !== null ? w : '0'}
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
