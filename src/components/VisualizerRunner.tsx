import React, { lazy, Suspense, useEffect } from 'react';
import { VisualizerModule } from '../types';
import { ArrowLeft, Loader2, Sparkles, X, UserCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

// Lazy loading all 16 visualizers from their respective directories
const ArrayApp = lazy(() => import('../../array-algorithms-visualizer/src/App'));
const BinarySearchApp = lazy(() => import('../../binary-search-engine-&-answer-space-visualizer/src/App'));
const BSTApp = lazy(() => import('../../binary-search-tree-visualizer (1)/src/App'));
const BinaryTreeApp = lazy(() => import('../../binary-tree-visualizer (1)/src/App'));
const BitwiseApp = lazy(() => import('../../bitwise-&-interval-algorithm-visualizer/src/App'));
const FastSlowApp = lazy(() => import('../../fast-&-slow-pointers-engine/src/App'));
const GraphApp = lazy(() => import('../../graph-algorithms-visualizer (1)/src/App'));
const HeapApp = lazy(() => import('../../heap-&-priority-queue-visualizer/src/App'));
const LinkedListApp = lazy(() => import('../../linked-list-pointer-engine (1)/src/App'));
const MathPrefixApp = lazy(() => import('../../math and prefix sum/src/App'));
const QueueDequeApp = lazy(() => import('../../queue-&-deque-algorithms-visualizer/src/App'));
const RecursionApp = lazy(() => import('../../recursion-&-backtracking-algorithms-visualizer/src/App'));
const SlidingWindowApp = lazy(() => import('../../sliding-window-visualizer/src/App'));
const StackExpressionApp = lazy(() => import('../../stack-algorithms-&-expression-engine-visualizer/src/App'));
const StringAlgoApp = lazy(() => import('../../string-algorithms-&-pattern-matching-visualizer/src/App'));
const TwoPointersApp = lazy(() => import('../../two-pointers-&-kadane\'s-visualizer/src/App'));

interface VisualizerRunnerProps {
  module: VisualizerModule;
  onBack: () => void;
  onRequireAuth: (message: string) => void;
}

export const VisualizerRunner: React.FC<VisualizerRunnerProps> = ({ 
  module, 
  onBack,
  onRequireAuth 
}) => {
  const { isLoggedIn } = useAuth();

  // Listen for problem switch events triggered inside sub-visualizer apps
  useEffect(() => {
    const handleProblemChangeClick = (e: MouseEvent) => {
      if (isLoggedIn) return; // Full access when logged in

      const target = e.target as HTMLElement;
      // Detect if user clicks on problem selection buttons/options beyond the 1st problem
      const problemBtn = target.closest('[data-problem-index], [data-problem-id], button, select');
      
      if (problemBtn) {
        const problemIdxAttr = problemBtn.getAttribute('data-problem-index');
        const problemIdAttr = problemBtn.getAttribute('data-problem-id');

        if ((problemIdxAttr && parseInt(problemIdxAttr, 10) > 0) || (problemIdAttr && problemIdAttr !== '0')) {
          e.preventDefault();
          e.stopPropagation();
          onRequireAuth("To view and simulate this algorithm problem, please log in or create a free Keetcode account.");
        }
      }
    };

    window.addEventListener('click', handleProblemChangeClick, true);
    return () => window.removeEventListener('click', handleProblemChangeClick, true);
  }, [isLoggedIn, onRequireAuth]);

  const renderVisualizerApp = () => {
    switch (module.id) {
      case 'array-algorithms':
        return <ArrayApp />;
      case 'binary-search':
        return <BinarySearchApp />;
      case 'binary-search-tree':
        return <BSTApp />;
      case 'binary-tree':
        return <BinaryTreeApp />;
      case 'bitwise-intervals':
        return <BitwiseApp />;
      case 'fast-slow-pointers':
        return <FastSlowApp />;
      case 'graph-algorithms':
        return <GraphApp />;
      case 'heap-priority-queue':
        return <HeapApp />;
      case 'linked-list':
        return <LinkedListApp />;
      case 'math-prefix-sum':
        return <MathPrefixApp />;
      case 'queue-deque':
        return <QueueDequeApp />;
      case 'recursion-backtracking':
        return <RecursionApp />;
      case 'sliding-window':
        return <SlidingWindowApp />;
      case 'stack-expression':
        return <StackExpressionApp />;
      case 'string-algorithms':
        return <StringAlgoApp />;
      case 'two-pointers-kadane':
        return <TwoPointersApp />;
      default:
        return (
          <div className="p-12 text-center text-gray-400 font-sans">
            Visualizer engine not found for {module.title}.
          </div>
        );
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-slate-950 text-white overflow-hidden animate-fade-rise font-sans">
      {/* Top Floating Control Bar */}
      <header className="sticky top-0 z-50 flex items-center justify-between px-6 py-3 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 shadow-xl font-sans">
        <div className="flex items-center gap-4">
          <button
            onClick={onBack}
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 text-white text-xs font-semibold transition-all cursor-pointer shadow-md font-sans"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Dashboard</span>
          </button>

          <div className="h-4 w-px bg-slate-700 hidden sm:block" />

          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-blue-400" />
            <h1 
              className="text-lg text-white font-semibold truncate max-w-xs sm:max-w-md"
              style={{ fontFamily: "'Playfair Display', serif", letterSpacing: '-0.02em' }}
            >
              {module.title}
            </h1>
            <span className="hidden md:inline-block text-[10px] bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded-full border border-blue-500/30 font-sans">
              {module.category}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3 font-sans">
          {!isLoggedIn && (
            <button
              onClick={() => onRequireAuth("To view all algorithm problems in this suite, please sign in or create a free account.")}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-blue-500/20 text-blue-200 text-xs font-medium border border-blue-500/30 hover:bg-blue-500/30 transition-all cursor-pointer"
            >
              <UserCheck className="w-3.5 h-3.5 text-blue-400" />
              <span>Starting Problem Open • Sign In for All</span>
            </button>
          )}

          <span className="text-xs text-slate-400 hidden lg:inline font-mono">
            {module.folderName}
          </span>
          
          <button
            onClick={onBack}
            className="p-2 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
            aria-label="Close visualizer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Main Visualizer App Content Canvas */}
      <div className="flex-1 overflow-auto bg-slate-950 relative font-sans">
        <Suspense
          fallback={
            <div className="flex flex-col items-center justify-center h-full min-h-[60vh] gap-4 font-sans">
              <Loader2 className="w-8 h-8 text-blue-400 animate-spin" />
              <p className="text-xs text-slate-400 font-mono">
                Loading {module.title} Engine...
              </p>
            </div>
          }
        >
          {renderVisualizerApp()}
        </Suspense>
      </div>
    </div>
  );
};
