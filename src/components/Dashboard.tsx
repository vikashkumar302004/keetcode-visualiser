import React, { useState, useMemo } from 'react';
import { VISUALIZERS, CATEGORIES } from '../data/visualizersData';
import { VisualizerModule } from '../types';
import { 
  Search, 
  Grid, 
  GitPullRequest, 
  Network, 
  Binary, 
  Activity, 
  Share2, 
  Layers, 
  Link, 
  Calculator, 
  ListFilter, 
  Cpu, 
  Maximize2, 
  Database, 
  Code2, 
  MoveHorizontal,
  Sparkles,
  ArrowRight
} from 'lucide-react';

interface DashboardProps {
  onSelectVisualizer: (module: VisualizerModule) => void;
}

const ICON_MAP: Record<string, React.ElementType> = {
  Grid,
  Search,
  GitPullRequest,
  Network,
  Binary,
  Activity,
  Share2,
  Layers,
  Link,
  Calculator,
  ListFilter,
  Cpu,
  Maximize2,
  Database,
  Code2,
  MoveHorizontal
};

export const Dashboard: React.FC<DashboardProps> = ({ onSelectVisualizer }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filteredVisualizers = useMemo(() => {
    return VISUALIZERS.filter((item) => {
      const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
      const matchesSearch = 
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.topics.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  return (
    <section id="visualizers" className="relative z-10 max-w-7xl mx-auto px-6 py-20">
      {/* Section Header */}
      <div className="text-center mb-14 font-sans">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full liquid-glass text-xs tracking-wider uppercase text-gray-300 mb-4 border border-white/10 font-mono">
          <Sparkles className="w-3.5 h-3.5 text-blue-400" />
          <span>Keetcode Algorithmic Suite</span>
        </div>
        
        <h2 
          className="text-4xl sm:text-6xl text-white font-semibold tracking-tight"
          style={{ fontFamily: "'Playfair Display', serif", letterSpacing: '-0.02em' }}
        >
          Interactive <em className="not-italic font-bold text-gray-400">Algorithm Engines</em>
        </h2>
        
        <p className="text-gray-400 max-w-2xl mx-auto mt-4 text-base font-sans subtext">
          Choose from 16 standalone high-performance visualizer modules built for deep algorithmic understanding.
        </p>
      </div>

      {/* Search & Category Filter Controls */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-12 font-sans">
        {/* Search Input */}
        <div className="relative w-full md:w-96">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search algorithms (e.g., Dijkstra, KMP, BST)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white/[0.04] backdrop-blur-md border border-white/10 rounded-full pl-11 pr-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-white/30 transition-all font-sans"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-gray-400 hover:text-white"
            >
              Clear
            </button>
          )}
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-none font-sans">
          {CATEGORIES.slice(0, 6).map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-full text-xs transition-all whitespace-nowrap cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-white text-black font-semibold shadow-lg'
                  : 'liquid-glass text-gray-300 font-medium hover:text-white hover:bg-white/10'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of 16 Visualizer Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredVisualizers.map((module) => {
          const IconComponent = ICON_MAP[module.icon] || Grid;
          
          return (
            <div
              key={module.id}
              className="liquid-glass rounded-2xl p-6 flex flex-col justify-between group hover:border-white/20 transition-all duration-300 hover:-translate-y-1 cursor-pointer"
              onClick={() => onSelectVisualizer(module)}
            >
              <div>
                {/* Header Row: Icon + Category + Difficulty */}
                <div className="flex items-center justify-between mb-4 font-sans">
                  <div className="w-12 h-12 rounded-xl liquid-glass flex items-center justify-center text-white border border-white/10 group-hover:scale-110 transition-transform duration-300">
                    <IconComponent className="w-6 h-6" />
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-medium px-2.5 py-1 rounded-full bg-white/5 text-gray-300 border border-white/10">
                      {module.category}
                    </span>
                    <span 
                      className={`text-[10px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded-md ${
                        module.difficulty === 'Beginner' 
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                          : module.difficulty === 'Intermediate'
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                          : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                      }`}
                    >
                      {module.difficulty}
                    </span>
                  </div>
                </div>

                {/* Title */}
                <h3 
                  className="text-2xl text-white font-semibold mb-2 group-hover:text-blue-200 transition-colors"
                  style={{ fontFamily: "'Playfair Display', serif", letterSpacing: '-0.02em' }}
                >
                  {module.title}
                </h3>

                {/* Description */}
                <p className="text-gray-400 text-xs leading-relaxed mb-5 line-clamp-3 font-sans subtext">
                  {module.description}
                </p>

                {/* Topic Pills */}
                <div className="flex flex-wrap gap-1.5 mb-6 font-sans">
                  {module.topics.slice(0, 3).map((topic, i) => (
                    <span 
                      key={i} 
                      className="text-[10px] bg-white/[0.04] text-gray-300 px-2 py-1 rounded-md border border-white/5"
                    >
                      {topic}
                    </span>
                  ))}
                  {module.topics.length > 3 && (
                    <span className="text-[10px] text-gray-500 px-1 py-1">
                      +{module.topics.length - 3} more
                    </span>
                  )}
                </div>
              </div>

              {/* Bottom Action Footer */}
              <div className="pt-4 border-t border-white/5 flex items-center justify-between font-sans">
                <span className="text-xs text-gray-400 font-mono">
                  {module.algorithmsCount} Algorithms
                </span>
                
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectVisualizer(module);
                  }}
                  className="inline-flex items-center gap-1.5 text-xs text-white group-hover:text-blue-300 font-semibold transition-colors"
                >
                  <span>Launch Engine</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {filteredVisualizers.length === 0 && (
        <div className="text-center py-20 liquid-glass rounded-2xl max-w-md mx-auto font-sans">
          <p className="text-gray-400 text-sm">No visualizers match your search criteria.</p>
          <button
            onClick={() => { setSelectedCategory('All'); setSearchQuery(''); }}
            className="mt-4 text-xs text-white underline font-semibold"
          >
            Reset Filters
          </button>
        </div>
      )}
    </section>
  );
};
