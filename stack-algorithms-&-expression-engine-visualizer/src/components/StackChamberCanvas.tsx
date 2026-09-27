import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, AlertCircle } from 'lucide-react';
import { StackItem } from '../types';

interface StackChamberCanvasProps {
  stack: StackItem[];
  secondaryStack?: StackItem[];
  secondaryTitle?: string;
}

export const StackChamberCanvas: React.FC<StackChamberCanvasProps> = ({
  stack,
  secondaryStack,
  secondaryTitle = 'Auxiliary Stack'
}) => {
  const isSecondaryActive = Array.isArray(secondaryStack);

  const renderChamber = (items: StackItem[], title?: string, isMain = true) => {
    const isEmpty = items.length === 0;

    return (
      <div className="flex-1 flex flex-col items-center justify-end h-full min-h-0 select-none">
        {/* Chamber Title */}
        {title && (
          <div className="mb-2 shrink-0">
            <span className="font-sans text-[11px] font-bold text-slate-500 uppercase tracking-wider bg-slate-100 border border-slate-200/65 px-2 py-0.5 rounded-full">
              {title}
            </span>
          </div>
        )}

        {/* Vertical Stack Chamber Structure */}
        <div className="relative w-44 h-full max-h-[280px] bg-slate-50/50 border-l-[6px] border-r-[6px] border-b-[6px] border-slate-300/40 rounded-b-xl flex flex-col justify-end p-2 pb-1.5 shadow-inner">
          
          {/* Empty Chamber Indicator */}
          {isEmpty && (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-400 font-sans text-xs gap-1 opacity-75">
              <span className="text-[10px] font-mono">[EMPTY]</span>
              <span className="tracking-tight">Chamber Underflow</span>
            </div>
          )}

          {/* Render Stack Items (with animations) */}
          <div className="w-full flex flex-col-reverse gap-1.5 overflow-y-auto max-h-full pr-1 scrollbar-thin">
            <AnimatePresence initial={false}>
              {items.map((item, index) => {
                const isTop = index === items.length - 1;
                return (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: -60, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -40, scale: 0.8 }}
                    transition={{ type: 'spring', stiffness: 220, damping: 18 }}
                    className={`relative w-full h-9 rounded-md flex items-center justify-center border font-mono text-xs font-bold shadow-xs select-none transition-colors ${
                      isTop
                        ? 'bg-amber-500 text-amber-950 border-amber-400 font-extrabold ring-2 ring-amber-500/25'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    {/* Index marker */}
                    <span className="absolute left-2 text-[9px] text-slate-400/80 font-sans select-none">
                      [{index}]
                    </span>

                    {/* Main Value Display */}
                    <div className="flex flex-col items-center leading-none">
                      <span className="text-sm tracking-tight">{item.value}</span>
                      {item.subValue && (
                        <span className="text-[8.5px] font-medium font-sans opacity-70 mt-0.5">
                          {item.subValue}
                        </span>
                      )}
                    </div>

                    {/* TOP Pointer arrow inside the main chamber */}
                    {isTop && (
                      <div className="absolute -right-16 flex items-center gap-1 bg-amber-500 text-amber-950 px-1.5 py-0.5 rounded text-[10px] font-sans font-bold shadow-xs">
                        <ArrowLeft className="w-3 h-3 animate-pulse" />
                        <span>TOP</span>
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        </div>

        {/* Capacity indicators */}
        <div className="mt-2 text-[10px] font-mono text-slate-400 flex items-center gap-1.5 h-4">
          {items.length >= 8 ? (
            <span className="text-amber-700 font-sans font-bold flex items-center gap-1 animate-pulse">
              <AlertCircle className="w-3.5 h-3.5" /> Overflow Warning
            </span>
          ) : (
            <span>Size: {items.length} / 8</span>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="flex items-center justify-center gap-8 w-full h-full min-h-0 py-2">
      {/* Main Stack Chamber */}
      {renderChamber(stack, isSecondaryActive ? 'Main Stack' : 'Core Stack Chamber', true)}

      {/* Optional Dual/Auxiliary Stack Chamber */}
      {isSecondaryActive && renderChamber(secondaryStack, secondaryTitle, false)}
    </div>
  );
};
