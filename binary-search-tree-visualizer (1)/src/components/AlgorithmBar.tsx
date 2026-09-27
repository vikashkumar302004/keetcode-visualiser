import React, { useState } from 'react';
import { AlgorithmCategory, AlgorithmId } from '../types';
import { ALGORITHM_METADATA } from '../algorithms/cppSnippets';
import { Play, Clock, Database, HelpCircle, ArrowRight, CornerDownRight } from 'lucide-react';

interface AlgorithmBarProps {
  activeCategory: AlgorithmCategory;
  activeAlgorithm: AlgorithmId;
  onSelectAlgorithm: (id: AlgorithmId) => void;
  onExecute: (params: Record<string, any>) => void;
  availableTreeValues: number[];
}

export const AlgorithmBar: React.FC<AlgorithmBarProps> = ({
  activeCategory,
  activeAlgorithm,
  onSelectAlgorithm,
  onExecute,
  availableTreeValues,
}) => {
  // Input parameter states
  const [singleValue, setSingleValue] = useState<number>(45);
  const [deleteValue, setDeleteValue] = useState<number>(25);
  const [searchValue, setSearchValue] = useState<number>(37);
  const [rangeLow, setRangeLow] = useState<number>(20);
  const [rangeHigh, setRangeHigh] = useState<number>(65);
  const [kthVal, setKthVal] = useState<number>(3);
  const [kthMode, setKthMode] = useState<'smallest' | 'largest'>('smallest');
  const [lcaP, setLcaP] = useState<number>(12);
  const [lcaQ, setLcaQ] = useState<number>(37);
  const [sortedArrayStr, setSortedArrayStr] = useState<string>('12, 25, 37, 50, 62, 75, 87');
  const [preorderStr, setPreorderStr] = useState<string>('50, 25, 12, 37, 75, 62, 87');

  // Filter algorithms for current category
  const categoryAlgorithms = Object.values(ALGORITHM_METADATA).filter(
    (alg) => alg.category === activeCategory
  );

  const currentMeta = ALGORITHM_METADATA[activeAlgorithm];

  const handleRun = () => {
    switch (activeAlgorithm) {
      case 'insert':
        onExecute({ value: Number(singleValue) });
        break;
      case 'search':
        onExecute({ value: Number(searchValue) });
        break;
      case 'delete':
        onExecute({ value: Number(deleteValue) });
        break;
      case 'validate':
      case 'find_min_max':
      case 'binary_tree_to_bst':
        onExecute({});
        break;
      case 'kth_element':
        onExecute({ k: Number(kthVal), kthMode });
        break;
      case 'range_sum':
        onExecute({ low: Number(rangeLow), high: Number(rangeHigh) });
        break;
      case 'prune':
        onExecute({ low: Number(rangeLow), high: Number(rangeHigh) });
        break;
      case 'sorted_array_to_bst': {
        const parsed = sortedArrayStr
          .split(',')
          .map((s) => Number(s.trim()))
          .filter((n) => !isNaN(n));
        onExecute({ sortedArray: parsed.length ? parsed : [10, 20, 30, 40, 50, 60, 70] });
        break;
      }
      case 'bst_from_preorder': {
        const parsed = preorderStr
          .split(',')
          .map((s) => Number(s.trim()))
          .filter((n) => !isNaN(n));
        onExecute({ preorderArray: parsed.length ? parsed : [50, 25, 12, 37, 75, 62, 87] });
        break;
      }
      case 'lca':
        onExecute({ pVal: Number(lcaP), qVal: Number(lcaQ) });
        break;
      case 'successor_predecessor':
        onExecute({ value: Number(singleValue) });
        break;
    }
  };

  return (
    <div className="bg-white border-b border-slate-200 px-5 py-3">
      <div className="max-w-7xl mx-auto space-y-3">
        {/* Sub-classified operations list */}
        <div className="flex flex-wrap items-center gap-2">
          {categoryAlgorithms.map((alg) => {
            const isSelected = activeAlgorithm === alg.id;
            return (
              <button
                key={alg.id}
                onClick={() => onSelectAlgorithm(alg.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer border ${
                  isSelected
                    ? 'bg-slate-900 border-slate-900 text-white shadow-xs'
                    : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100 hover:border-slate-300'
                }`}
              >
                {alg.title}
              </button>
            );
          })}
        </div>

        {/* Algorithm Details and Dynamic Parameter Bar */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3 bg-[#FAF9F6] border border-slate-200/80 rounded-xl p-3">
          {/* Metadata info */}
          <div className="space-y-1 max-w-2xl">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-serif font-semibold text-sm text-slate-900">
                {currentMeta.title}
              </span>
              <div className="flex items-center gap-1.5 text-[11px] text-slate-600 bg-white border border-slate-200 px-2 py-0.5 rounded-md font-mono">
                <Clock className="w-3 h-3 text-slate-400" />
                <span>Time: {currentMeta.timeComplexity}</span>
              </div>
              <div className="flex items-center gap-1.5 text-[11px] text-slate-600 bg-white border border-slate-200 px-2 py-0.5 rounded-md font-mono">
                <Database className="w-3 h-3 text-slate-400" />
                <span>Space: {currentMeta.spaceComplexity}</span>
              </div>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed font-sans">
              {currentMeta.shortDesc}
            </p>
          </div>

          {/* Parameter Inputs and Action Trigger */}
          <div className="flex items-center gap-2 flex-wrap shrink-0">
            {/* Insert parameters */}
            {activeAlgorithm === 'insert' && (
              <div className="flex items-center gap-1.5">
                <label className="text-xs font-medium text-slate-600">Value:</label>
                <input
                  type="number"
                  value={singleValue}
                  onChange={(e) => setSingleValue(Number(e.target.value))}
                  className="w-18 bg-white border border-slate-200 rounded-lg px-2.5 py-1 text-xs text-slate-800 font-mono focus:outline-none focus:ring-1 focus:ring-slate-400"
                />
              </div>
            )}

            {/* Search parameters */}
            {activeAlgorithm === 'search' && (
              <div className="flex items-center gap-1.5">
                <label className="text-xs font-medium text-slate-600">Target Key:</label>
                <input
                  type="number"
                  value={searchValue}
                  onChange={(e) => setSearchValue(Number(e.target.value))}
                  className="w-18 bg-white border border-slate-200 rounded-lg px-2.5 py-1 text-xs text-slate-800 font-mono focus:outline-none focus:ring-1 focus:ring-slate-400"
                />
              </div>
            )}

            {/* Delete parameters */}
            {activeAlgorithm === 'delete' && (
              <div className="flex items-center gap-2 flex-wrap">
                <div className="flex items-center gap-1.5">
                  <label className="text-xs font-medium text-slate-600">Key:</label>
                  <input
                    type="number"
                    value={deleteValue}
                    onChange={(e) => setDeleteValue(Number(e.target.value))}
                    className="w-18 bg-white border border-slate-200 rounded-lg px-2.5 py-1 text-xs text-slate-800 font-mono focus:outline-none focus:ring-1 focus:ring-slate-400"
                  />
                </div>
                {/* Helpful quick case suggestions */}
                <span className="text-[11px] text-slate-400">Quick tests:</span>
                <button
                  type="button"
                  onClick={() => setDeleteValue(80)}
                  className="text-[10px] bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 px-1.5 py-0.5 rounded cursor-pointer"
                  title="Leaf node deletion"
                >
                  Leaf (80)
                </button>
                <button
                  type="button"
                  onClick={() => setDeleteValue(87)}
                  className="text-[10px] bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 px-1.5 py-0.5 rounded cursor-pointer"
                  title="Single-child node deletion"
                >
                  1-Child (87)
                </button>
                <button
                  type="button"
                  onClick={() => setDeleteValue(25)}
                  className="text-[10px] bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 px-1.5 py-0.5 rounded cursor-pointer"
                  title="Two-child node deletion (Inorder successor)"
                >
                  2-Children (25)
                </button>
              </div>
            )}

            {/* K-th element parameters */}
            {activeAlgorithm === 'kth_element' && (
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1.5">
                  <label className="text-xs font-medium text-slate-600">k:</label>
                  <input
                    type="number"
                    min={1}
                    max={20}
                    value={kthVal}
                    onChange={(e) => setKthVal(Number(e.target.value))}
                    className="w-14 bg-white border border-slate-200 rounded-lg px-2 py-1 text-xs text-slate-800 font-mono focus:outline-none focus:ring-1 focus:ring-slate-400"
                  />
                </div>
                <div className="inline-flex rounded-lg border border-slate-200 bg-white p-0.5 text-xs">
                  <button
                    onClick={() => setKthMode('smallest')}
                    className={`px-2 py-0.5 rounded-md font-medium cursor-pointer ${
                      kthMode === 'smallest' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Smallest
                  </button>
                  <button
                    onClick={() => setKthMode('largest')}
                    className={`px-2 py-0.5 rounded-md font-medium cursor-pointer ${
                      kthMode === 'largest' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Largest
                  </button>
                </div>
              </div>
            )}

            {/* Range queries and pruning */}
            {(activeAlgorithm === 'range_sum' || activeAlgorithm === 'prune') && (
              <div className="flex items-center gap-1.5">
                <label className="text-xs font-medium text-slate-600">Low:</label>
                <input
                  type="number"
                  value={rangeLow}
                  onChange={(e) => setRangeLow(Number(e.target.value))}
                  className="w-16 bg-white border border-slate-200 rounded-lg px-2 py-1 text-xs text-slate-800 font-mono"
                />
                <span className="text-slate-400 text-xs">to</span>
                <label className="text-xs font-medium text-slate-600">High:</label>
                <input
                  type="number"
                  value={rangeHigh}
                  onChange={(e) => setRangeHigh(Number(e.target.value))}
                  className="w-16 bg-white border border-slate-200 rounded-lg px-2 py-1 text-xs text-slate-800 font-mono"
                />
              </div>
            )}

            {/* Sorted Array to BST */}
            {activeAlgorithm === 'sorted_array_to_bst' && (
              <div className="flex items-center gap-1.5">
                <label className="text-xs font-medium text-slate-600 whitespace-nowrap">Array:</label>
                <input
                  type="text"
                  value={sortedArrayStr}
                  onChange={(e) => setSortedArrayStr(e.target.value)}
                  placeholder="10, 20, 30, 40, 50"
                  className="w-48 bg-white border border-slate-200 rounded-lg px-2.5 py-1 text-xs text-slate-800 font-mono"
                />
              </div>
            )}

            {/* BST from Preorder */}
            {activeAlgorithm === 'bst_from_preorder' && (
              <div className="flex items-center gap-1.5">
                <label className="text-xs font-medium text-slate-600 whitespace-nowrap">Preorder:</label>
                <input
                  type="text"
                  value={preorderStr}
                  onChange={(e) => setPreorderStr(e.target.value)}
                  placeholder="50, 25, 12, 37, 75"
                  className="w-48 bg-white border border-slate-200 rounded-lg px-2.5 py-1 text-xs text-slate-800 font-mono"
                />
              </div>
            )}

            {/* LCA parameters */}
            {activeAlgorithm === 'lca' && (
              <div className="flex items-center gap-1.5">
                <label className="text-xs font-medium text-slate-600">p:</label>
                <input
                  type="number"
                  value={lcaP}
                  onChange={(e) => setLcaP(Number(e.target.value))}
                  className="w-16 bg-white border border-slate-200 rounded-lg px-2 py-1 text-xs text-slate-800 font-mono"
                />
                <label className="text-xs font-medium text-slate-600">q:</label>
                <input
                  type="number"
                  value={lcaQ}
                  onChange={(e) => setLcaQ(Number(e.target.value))}
                  className="w-16 bg-white border border-slate-200 rounded-lg px-2 py-1 text-xs text-slate-800 font-mono"
                />
              </div>
            )}

            {/* Successor / Predecessor key */}
            {activeAlgorithm === 'successor_predecessor' && (
              <div className="flex items-center gap-1.5">
                <label className="text-xs font-medium text-slate-600">Key:</label>
                <input
                  type="number"
                  value={singleValue}
                  onChange={(e) => setSingleValue(Number(e.target.value))}
                  className="w-18 bg-white border border-slate-200 rounded-lg px-2.5 py-1 text-xs text-slate-800 font-mono"
                />
              </div>
            )}

            {/* Execute Button */}
            <button
              onClick={handleRun}
              className="inline-flex items-center gap-1.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-semibold text-xs px-3.5 py-1.5 rounded-lg shadow-xs hover:shadow transition-all cursor-pointer shrink-0"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Simulate Algorithm</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
