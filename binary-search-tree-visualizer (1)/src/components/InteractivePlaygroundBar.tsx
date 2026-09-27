import React, { useState } from 'react';
import { Plus, Search, Trash2 } from 'lucide-react';

interface InteractivePlaygroundBarProps {
  onInsertNode: (val: number) => void;
  onSearchNode: (val: number) => void;
  onDeleteNode: (val: number) => void;
}

export const InteractivePlaygroundBar: React.FC<InteractivePlaygroundBarProps> = ({
  onInsertNode,
  onSearchNode,
  onDeleteNode,
}) => {
  const [insertVal, setInsertVal] = useState<string>('');
  const [searchVal, setSearchVal] = useState<string>('');
  const [deleteVal, setDeleteVal] = useState<string>('');

  const handleInsert = (e: React.FormEvent) => {
    e.preventDefault();
    const num = parseInt(insertVal, 10);
    if (!isNaN(num)) {
      onInsertNode(num);
      setInsertVal('');
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const num = parseInt(searchVal, 10);
    if (!isNaN(num)) {
      onSearchNode(num);
      setSearchVal('');
    }
  };

  const handleDelete = (e: React.FormEvent) => {
    e.preventDefault();
    const num = parseInt(deleteVal, 10);
    if (!isNaN(num)) {
      onDeleteNode(num);
      setDeleteVal('');
    }
  };

  return (
    <div className="bg-slate-900 text-white px-5 py-2 border-b border-slate-800 shadow-inner">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 text-slate-300">
          <span className="font-semibold text-amber-400">Playground:</span>
          <span className="text-slate-400 hidden sm:inline">Direct Tree Manipulations & Live Pathing</span>
        </div>

        <div className="flex flex-wrap items-center gap-2 sm:gap-4">
          {/* Quick Insert */}
          <form onSubmit={handleInsert} className="flex items-center gap-1.5">
            <input
              type="number"
              placeholder="Val"
              value={insertVal}
              onChange={(e) => setInsertVal(e.target.value)}
              className="w-16 bg-slate-800 border border-slate-700 rounded-md px-2 py-1 text-white text-xs font-mono focus:outline-none focus:border-amber-400"
            />
            <button
              type="submit"
              className="flex items-center gap-1 bg-emerald-600 hover:bg-emerald-500 text-white font-medium px-2.5 py-1 rounded-md transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Insert</span>
            </button>
          </form>

          <span className="text-slate-700 hidden sm:inline">|</span>

          {/* Quick Search */}
          <form onSubmit={handleSearch} className="flex items-center gap-1.5">
            <input
              type="number"
              placeholder="Val"
              value={searchVal}
              onChange={(e) => setSearchVal(e.target.value)}
              className="w-16 bg-slate-800 border border-slate-700 rounded-md px-2 py-1 text-white text-xs font-mono focus:outline-none focus:border-amber-400"
            />
            <button
              type="submit"
              className="flex items-center gap-1 bg-blue-600 hover:bg-blue-500 text-white font-medium px-2.5 py-1 rounded-md transition-colors cursor-pointer"
            >
              <Search className="w-3.5 h-3.5" />
              <span>Search</span>
            </button>
          </form>

          <span className="text-slate-700 hidden sm:inline">|</span>

          {/* Quick Delete */}
          <form onSubmit={handleDelete} className="flex items-center gap-1.5">
            <input
              type="number"
              placeholder="Val"
              value={deleteVal}
              onChange={(e) => setDeleteVal(e.target.value)}
              className="w-16 bg-slate-800 border border-slate-700 rounded-md px-2 py-1 text-white text-xs font-mono focus:outline-none focus:border-amber-400"
            />
            <button
              type="submit"
              className="flex items-center gap-1 bg-rose-600 hover:bg-rose-500 text-white font-medium px-2.5 py-1 rounded-md transition-colors cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Delete</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
