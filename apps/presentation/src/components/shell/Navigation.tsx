import React from "react";
import { ChevronLeft, ChevronRight, CornerUpLeft, LayoutGrid } from "lucide-react";
import { useSlideNavigation } from "../../context/SlideContext";

interface NavigationProps {
  onPrev: () => void;
  onNext: () => void;
  current: number;
  total: number;
}

const LEVEL_NAMES = ["Story", "Map", "Dept", "Domain", "Agent"] as const;

export const Navigation = ({ onPrev, onNext }: NavigationProps) => {
  const { currentLevel, levelPosition, zoomOut } = useSlideNavigation();

  return (
    <>
      {/* Desktop: bottom-right compact nav */}
      <div className="fixed bottom-4 right-6 hidden sm:flex items-center gap-2 z-50">
        <div className="flex items-center gap-1.5 px-2 py-1 rounded bg-surface-container-lowest/80 backdrop-blur-sm shadow-ambient">
          <span className="text-[8px] font-headline font-bold uppercase tracking-[0.1em] text-secondary/55">
            {LEVEL_NAMES[currentLevel]}
          </span>
          <span className="text-[10px] font-mono text-secondary/60 tabular-nums">
            {levelPosition.current}<span className="text-outline-variant/40">/</span>{levelPosition.total}
          </span>
        </div>
        <div className="flex gap-0.5">
          <button
            onClick={onPrev}
            disabled={levelPosition.current <= 1}
            className="p-1.5 rounded bg-surface-container-lowest hover:bg-surface-container-high transition-colors disabled:opacity-30 disabled:pointer-events-none shadow-ambient"
          >
            <ChevronLeft className="w-3.5 h-3.5 text-secondary" />
          </button>
          <button
            onClick={onNext}
            disabled={levelPosition.current >= levelPosition.total}
            className="p-1.5 rounded bg-surface-container-lowest hover:bg-surface-container-high transition-colors disabled:opacity-30 disabled:pointer-events-none shadow-ambient"
          >
            <ChevronRight className="w-3.5 h-3.5 text-secondary" />
          </button>
        </div>
      </div>

      {/* Mobile: full-width bottom bar with larger touch targets */}
      <div className="fixed bottom-0 left-0 w-full sm:hidden z-50 bg-background/80 backdrop-blur-2xl safe-area-bottom">
        <div className="flex items-center justify-between px-4 py-2">
          {/* Back / Zoom Out */}
          <button
            onClick={zoomOut}
            disabled={currentLevel === 0}
            className="p-3 rounded-lg bg-surface-container-low active:bg-surface-container-high transition-colors disabled:opacity-20"
          >
            <CornerUpLeft className="w-5 h-5 text-secondary" />
          </button>

          {/* Center: level + position */}
          <div className="flex items-center gap-2">
            <span className="text-[9px] font-headline font-bold uppercase tracking-[0.1em] text-secondary/60">
              {LEVEL_NAMES[currentLevel]}
            </span>
            <span className="text-xs font-mono text-secondary/60 tabular-nums">
              {levelPosition.current} / {levelPosition.total}
            </span>
          </div>

          {/* Prev / Next */}
          <div className="flex gap-1">
            <button
              onClick={onPrev}
              disabled={levelPosition.current <= 1}
              className="p-3 rounded-lg bg-surface-container-low active:bg-surface-container-high transition-colors disabled:opacity-20"
            >
              <ChevronLeft className="w-5 h-5 text-secondary" />
            </button>
            <button
              onClick={onNext}
              disabled={levelPosition.current >= levelPosition.total}
              className="p-3 rounded-lg bg-surface-container-low active:bg-surface-container-high transition-colors disabled:opacity-20"
            >
              <ChevronRight className="w-5 h-5 text-secondary" />
            </button>
          </div>
        </div>
      </div>
    </>
  );
};
