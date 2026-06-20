import React from "react";
import { Cpu, ChevronRight, LayoutGrid, CornerUpLeft, Cloud } from "lucide-react";
import { useSlideNavigation } from "../../context/SlideContext";

const LEVEL_LABELS = ["Story", "Map", "Dept", "Domain", "Agent"] as const;

interface HeaderProps {
  onOpenPicker: () => void;
  onJumpToLevel: (level: number) => void;
}

export const Header = ({ onOpenPicker, onJumpToLevel }: HeaderProps) => {
  const { goToSlide, zoomOut, goBack, currentLevel, breadcrumbs, history, levelPosition } = useSlideNavigation();

  return (
    <header className="fixed top-0 left-0 w-full h-10 sm:h-12 px-3 sm:px-6 flex items-center z-50 bg-background/70 backdrop-blur-2xl">
      {/* Left: Logo — clickable, returns to landing */}
      <button onClick={() => goToSlide("landing")} className="flex items-center gap-3 shrink-0 group">
        <div className="w-7 h-7 rounded hero-gradient flex items-center justify-center shadow-ambient group-hover:shadow-glow transition-shadow">
          <Cpu className="w-3.5 h-3.5 text-white" />
        </div>
        <div className="hidden md:block">
          <span className="font-headline font-bold text-sm tracking-display group-hover:text-primary transition-colors">Gemini Enterprise</span>
        </div>
      </button>

      {/* Center: Breadcrumbs */}
      <div className="flex-1 flex items-center justify-center min-w-0 mx-6">
        {currentLevel >= 1 && (
          <nav className="flex items-center gap-1.5 min-w-0 overflow-hidden">
            {breadcrumbs.map((crumb, i) => {
              const isLast = i === breadcrumbs.length - 1;
              return (
                <React.Fragment key={crumb.id}>
                  {i > 0 && <ChevronRight className="w-3 h-3 text-outline-variant/40 shrink-0" />}
                  {isLast ? (
                    <span className="text-[11px] font-headline font-bold text-on-surface truncate tracking-tight">{crumb.title}</span>
                  ) : (
                    <button
                      onClick={() => goToSlide(crumb.id)}
                      className="text-[11px] font-headline font-medium text-primary/60 hover:text-primary transition-colors truncate shrink-0"
                    >
                      {crumb.title}
                    </button>
                  )}
                </React.Fragment>
              );
            })}
            <span className="text-[9px] font-mono text-secondary/50 ml-3 shrink-0">
              {levelPosition.current}/{levelPosition.total}
            </span>
          </nav>
        )}
        {currentLevel === 0 && (
          <span className="text-[9px] font-mono text-secondary/50">
            {levelPosition.current}/{levelPosition.total}
          </span>
        )}
      </div>

      {/* Right: Level buttons + controls */}
      <div className="flex items-center gap-1.5 shrink-0">
        {history.length > 0 && (
          <button
            onClick={goBack}
            className="p-1.5 rounded hover:bg-surface-container-high transition-colors group mr-1"
            title="Back (Backspace)"
          >
            <CornerUpLeft className="w-3.5 h-3.5 text-secondary/55 group-hover:text-primary transition-colors" />
          </button>
        )}

        {/* Level buttons — tonal, no borders */}
        <div className="hidden sm:flex bg-surface-container-low rounded p-0.5 gap-0.5">
          {LEVEL_LABELS.map((label, level) => {
            const isActive = currentLevel === level;
            const isAccessible = level <= 1 || (level === 2 && currentLevel >= 1) || (level === 3 && currentLevel >= 2) || (level === 4 && currentLevel >= 3);
            return (
              <button
                key={level}
                onClick={() => onJumpToLevel(level)}
                disabled={!isAccessible}
                className={`px-2.5 py-1 rounded text-[9px] font-headline font-bold uppercase tracking-widest transition-all ${
                  isActive
                    ? "hero-gradient text-white shadow-ambient"
                    : isAccessible
                      ? "text-secondary/50 hover:text-primary hover:bg-surface-container-high"
                      : "text-secondary/30 cursor-not-allowed"
                }`}
                title={`Level ${level + 1}: ${label} (${level + 1})`}
              >
                {label}
              </button>
            );
          })}
        </div>

        {currentLevel > 0 && (
          <button
            onClick={zoomOut}
            className="px-2 py-1 rounded text-[8px] font-bold uppercase tracking-widest text-secondary/40 hover:text-primary hover:bg-surface-container-high transition-colors"
            title="Zoom Out (Esc)"
          >
            Esc
          </button>
        )}

        <button
          onClick={() => goToSlide("deploy-your-own")}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded hero-gradient text-white shadow-ambient hover:shadow-glow transition-shadow group"
          title="Deploy your own copy of the factory"
        >
          <Cloud className="w-3.5 h-3.5" />
          <span className="hidden sm:inline text-[9px] font-headline font-bold uppercase tracking-widest">Deploy</span>
        </button>

        <button
          onClick={onOpenPicker}
          className="p-1.5 rounded hover:bg-surface-container-high transition-colors group"
          title="All Slides (M)"
        >
          <LayoutGrid className="w-3.5 h-3.5 text-secondary/55 group-hover:text-primary transition-colors" />
        </button>

        <div className="px-2 py-0.5 rounded bg-on-surface text-white text-[7px] font-headline font-bold uppercase tracking-[0.15em] ml-1">
          Internal
        </div>
      </div>
    </header>
  );
};
