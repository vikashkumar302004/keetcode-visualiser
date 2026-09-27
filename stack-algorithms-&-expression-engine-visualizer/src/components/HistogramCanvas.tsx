import React from 'react';
import { AreaChart, TrendingUp, HelpCircle } from 'lucide-react';
import { HistogramState, TrappingRainWaterState } from '../types';

interface HistogramCanvasProps {
  problemId: string;
  data: number[];
  inputCursor: number;
  stackIndices: number[];
  histogramState?: HistogramState;
  waterState?: TrappingRainWaterState;
  variables?: Record<string, any>;
}

export const HistogramCanvas: React.FC<HistogramCanvasProps> = ({
  problemId,
  data = [],
  inputCursor,
  stackIndices = [],
  histogramState,
  waterState,
  variables = {}
}) => {
  if (!data || data.length === 0) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center text-slate-400 font-sans text-xs italic gap-1 select-none">
        <AreaChart className="w-6 h-6 text-slate-300" />
        <span>No numeric data to display</span>
      </div>
    );
  }

  // Find max value to scale the chart dynamically
  const maxValue = Math.max(...data, 1);
  const chartHeight = 180;
  const chartWidth = 450;
  const padding = 20;

  const innerHeight = chartHeight - 2 * padding;
  const innerWidth = chartWidth - 2 * padding;

  const barCount = data.length;
  const gap = 8;
  const barWidth = (innerWidth - (barCount - 1) * gap) / barCount;

  // Render bars
  const bars = data.map((val, idx) => {
    // Scaling
    const barHeight = (val / maxValue) * innerHeight;
    const x = padding + idx * (barWidth + gap);
    const y = chartHeight - padding - barHeight;

    // Check conditions
    const isActive = idx === inputCursor;
    const isInStack = stackIndices.includes(idx);
    
    // Determine color
    let barColor = 'fill-slate-200 stroke-slate-300';
    if (problemId === 'trapping-rain-water') {
      barColor = 'fill-slate-400 stroke-slate-500';
    } else if (isActive) {
      barColor = 'fill-amber-500 stroke-amber-600';
    } else if (isInStack) {
      barColor = 'fill-indigo-400 stroke-indigo-500';
    }

    return {
      value: val,
      index: idx,
      x,
      y,
      width: barWidth,
      height: barHeight,
      colorClass: barColor,
      isActive,
      isInStack
    };
  });

  // Calculate histogram rectangle overlay
  let rectOverlay: React.ReactNode = null;
  if (
    (problemId === 'largest-rectangle' || problemId === 'maximal-rectangle') &&
    histogramState &&
    histogramState.currentHeight > 0 &&
    histogramState.leftBoundary !== undefined &&
    histogramState.rightBoundary !== undefined
  ) {
    const leftX = padding + histogramState.leftBoundary * (barWidth + gap);
    const rightX = padding + histogramState.rightBoundary * (barWidth + gap) + barWidth;
    const rectW = rightX - leftX;
    const rectH = (histogramState.currentHeight / maxValue) * innerHeight;
    const rectY = chartHeight - padding - rectH;

    rectOverlay = (
      <g>
        {/* Shaded red/amber calculated area */}
        <rect
          x={leftX}
          y={rectY}
          width={rectW}
          height={rectH}
          className="fill-amber-500/25 stroke-amber-600 stroke-[2] stroke-dasharray-[4]"
          style={{ strokeDasharray: '4 3' }}
        />
        {/* Dimensions banner text */}
        <text
          x={leftX + rectW / 2}
          y={Math.max(rectY - 6, 15)}
          textAnchor="middle"
          className="font-sans text-[10px] font-bold fill-amber-800"
        >
          {`Area: ${histogramState.currentHeight}H × ${histogramState.currentWidth}W = ${histogramState.currentArea}`}
        </text>
      </g>
    );
  }

  // Render trapped water blocks
  let waterOverlay: React.ReactNode = null;
  if (problemId === 'trapping-rain-water' && waterState && waterState.trapped) {
    waterOverlay = waterState.trapped.map((trappedWater, idx) => {
      if (trappedWater <= 0) return null;

      const baseHeight = data[idx];
      const scaledBaseHeight = (baseHeight / maxValue) * innerHeight;
      const scaledWaterHeight = (trappedWater / maxValue) * innerHeight;

      const x = padding + idx * (barWidth + gap);
      const y = chartHeight - padding - scaledBaseHeight - scaledWaterHeight;

      return (
        <rect
          key={`water-${idx}`}
          x={x}
          y={y}
          width={barWidth}
          height={scaledWaterHeight}
          className="fill-cyan-400/70 stroke-cyan-500/85 stroke-[1]"
        />
      );
    });
  }

  // Label helper depending on problem context
  const getProblemLabel = () => {
    switch (problemId) {
      case 'daily-temperatures':
        return 'Daily Temperature Heights (°F)';
      case 'online-stock-span':
        return 'Stock Price Timeline ($)';
      case 'trapping-rain-water':
        return 'Elevation Map (Grey) + Trapped Water (Blue)';
      case 'largest-rectangle':
      case 'maximal-rectangle':
        return 'Histogram Bar Heights (Yellow: Active, Purple: Stack)';
      default:
        return 'Monotonic Stack Bar Array';
    }
  };

  return (
    <div className="w-full flex flex-col justify-center select-none h-full gap-2">
      <div className="flex items-center justify-between shrink-0 px-1">
        <span className="font-sans text-[11px] font-bold text-slate-500 uppercase tracking-wider">
          {getProblemLabel()}
        </span>
        <div className="flex items-center gap-1.5 text-[10px] font-mono text-slate-400">
          <TrendingUp className="w-3.5 h-3.5 text-indigo-500" />
          <span>Scaled Max: {maxValue}</span>
        </div>
      </div>

      <div className="bg-white border border-slate-200/80 rounded-lg p-2.5 flex items-center justify-center shadow-xs min-h-0 flex-1">
        <svg
          viewBox={`0 0 ${chartWidth} ${chartHeight}`}
          className="w-full max-h-[220px] h-full"
        >
          {/* Grid lines */}
          <line
            x1={padding}
            y1={chartHeight - padding}
            x2={chartWidth - padding}
            y2={chartHeight - padding}
            className="stroke-slate-300 stroke-[1.5]"
          />
          <line
            x1={padding}
            y1={padding}
            x2={padding}
            y2={chartHeight - padding}
            className="stroke-slate-300 stroke-[1]"
          />

          {/* Render individual bars */}
          {bars.map((bar) => (
            <g key={bar.index}>
              <rect
                x={bar.x}
                y={bar.y}
                width={bar.width}
                height={bar.height}
                rx="2"
                className={`transition-all duration-200 ${bar.colorClass}`}
              />
              
              {/* Index marker */}
              <text
                x={bar.x + bar.width / 2}
                y={chartHeight - 4}
                textAnchor="middle"
                className="font-mono text-[9px] fill-slate-400"
              >
                {bar.index}
              </text>

              {/* Bar Value on top */}
              {bar.value > 0 && (
                <text
                  x={bar.x + bar.width / 2}
                  y={bar.y - 4}
                  textAnchor="middle"
                  className={`font-mono text-[9px] font-semibold ${
                    bar.isActive
                      ? 'fill-amber-800 font-bold'
                      : bar.isInStack
                      ? 'fill-indigo-800'
                      : 'fill-slate-500'
                  }`}
                >
                  {bar.value}
                </text>
              )}
            </g>
          ))}

          {/* Histograms Rect overlays */}
          {rectOverlay}

          {/* Trapped water block overlays */}
          {waterOverlay}
        </svg>
      </div>
    </div>
  );
};
