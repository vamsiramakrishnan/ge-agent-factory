import React, { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { AnimatePresence, motion } from "motion/react";
import { X, Search, Command } from "lucide-react";

import { Header } from "./components/shell/Header";
import { Navigation } from "./components/shell/Navigation";
import { ProgressBar } from "./components/shell/ProgressBar";
import { SlideWrapper, SlideTransition } from "./components/shell/SlideWrapper";
import { SLIDES } from "./config/slides";
import { SlideContext, BreadcrumbItem } from "./context/SlideContext";
import { DepartmentProvider } from "./context/DepartmentContext";
import { UsecaseIdProvider } from "./context/UsecaseIdContext";
import { AuthGate } from "./auth/AuthGate";

// Location-aware atmosphere: a muted Google-blue + cool-grey wash that shifts
// subtly by department, so navigating the org map gives a faint spatial cue while
// staying on a restrained blue / grey / off-white palette (no vivid hues).
const DEPT_AURORA: Record<string, [string, string]> = {
  hr: ["#1a73e8", "#9fb0c9"],
  finance: ["#3f7cc0", "#9aa6b4"],
  it: ["#2b6fd6", "#aeb8c6"],
  marketing: ["#4285f4", "#a7b2c2"],
  procurement: ["#5b85bd", "#b4bdc9"],
};
const DEFAULT_AURORA: [string, string] = ["#1a73e8", "#9aa6b8"];

const SHORTCUTS: Array<[string, string]> = [
  ["← →", "Previous / next"],
  ["Space", "Next"],
  ["Esc", "Zoom out a level"],
  ["Backspace", "Back (history)"],
  ["1 – 5", "Jump to a level"],
  ["M", "All slides"],
  ["?", "This help"],
];

export default function App() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [showPicker, setShowPicker] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [pickerQuery, setPickerQuery] = useState("");
  const [history, setHistory] = useState<string[]>([]);

  const current = SLIDES[currentSlide];

  // Get siblings at the same level (for within-level navigation)
  const siblings = useMemo(() => {
    const lvl = current.level;
    if (lvl === 4) {
      return SLIDES.map((s, i) => ({ slide: s, index: i }))
        .filter(({ slide }) => slide.level === 4 && slide.domain === current.domain);
    }
    if (lvl === 3) {
      return SLIDES.map((s, i) => ({ slide: s, index: i }))
        .filter(({ slide }) => slide.level === 3 && slide.department === current.department);
    }
    if (lvl === 2) {
      return SLIDES.map((s, i) => ({ slide: s, index: i }))
        .filter(({ slide }) => slide.level === 2);
    }
    return SLIDES.map((s, i) => ({ slide: s, index: i }))
      .filter(({ slide }) => slide.level <= 1);
  }, [current.level, current.domain, current.department]);

  const siblingIndex = siblings.findIndex(s => s.index === currentSlide);

  const levelPosition = useMemo(() => ({
    current: siblingIndex + 1,
    total: siblings.length,
  }), [siblingIndex, siblings.length]);

  // ── Spatial transition direction ─────────────────────────────────────────
  // Compare the new slide to the previous one (during render, via a ref the
  // effect syncs after paint) so the motion encodes the move: zoom in/out across
  // levels, glide left/right within a level.
  const prevRef = useRef({ level: current.level, index: currentSlide });
  const transition = useMemo<SlideTransition>(() => {
    const p = prevRef.current;
    if (currentSlide === p.index) return "forward";
    const dl = current.level - p.level;
    if (dl > 0) return "in";
    if (dl < 0) return "out";
    return currentSlide > p.index ? "forward" : "back";
  }, [currentSlide, current.level]);
  useEffect(() => {
    prevRef.current = { level: current.level, index: currentSlide };
  }, [currentSlide, current.level]);

  // ── Atmosphere hues for the current location ─────────────────────────────
  const [atmo1, atmo2] = (current.department && DEPT_AURORA[current.department]) || DEFAULT_AURORA;

  // Build breadcrumbs from parent chain
  const breadcrumbs = useMemo(() => {
    const crumbs: BreadcrumbItem[] = [];
    let slide = current;
    while (slide) {
      crumbs.unshift({ id: slide.id, title: slide.title });
      if (slide.parent) {
        const parentSlide = SLIDES.find(s => s.id === slide.parent);
        if (parentSlide) { slide = parentSlide; } else break;
      } else break;
    }
    if (current.level >= 1) crumbs.unshift({ id: "title", title: "Story" });
    return crumbs;
  }, [current]);

  const goToSlide = useCallback((id: string) => {
    const index = SLIDES.findIndex(s => s.id === id);
    if (index !== -1 && index !== currentSlide) {
      setHistory(h => [...h.slice(-49), SLIDES[currentSlide].id]);
      setCurrentSlide(index);
    }
  }, [currentSlide]);

  const nextSlide = useCallback(() => {
    if (siblingIndex < siblings.length - 1) {
      const next = siblings[siblingIndex + 1];
      setHistory(h => [...h.slice(-49), SLIDES[currentSlide].id]);
      setCurrentSlide(next.index);
    }
  }, [siblingIndex, siblings, currentSlide]);

  const prevSlide = useCallback(() => {
    if (siblingIndex > 0) {
      const prev = siblings[siblingIndex - 1];
      setHistory(h => [...h.slice(-49), SLIDES[currentSlide].id]);
      setCurrentSlide(prev.index);
    }
  }, [siblingIndex, siblings, currentSlide]);

  const zoomOut = useCallback(() => {
    const slide = SLIDES[currentSlide];
    if (slide.parent) {
      goToSlide(slide.parent);
    } else if (slide.level === 1) {
      const lastStory = SLIDES.filter(s => s.level === 0);
      if (lastStory.length > 0) goToSlide(lastStory[0].id);
    }
  }, [currentSlide, goToSlide]);

  const goBack = useCallback(() => {
    if (history.length > 0) {
      const lastId = history[history.length - 1];
      setHistory(h => h.slice(0, -1));
      const index = SLIDES.findIndex(s => s.id === lastId);
      if (index !== -1) setCurrentSlide(index);
    }
  }, [history]);

  const jumpToLevel = useCallback((level: number) => {
    if (level === 0) {
      goToSlide("title");
    } else if (level === 1) {
      goToSlide("domain-map");
    } else if (level === 2) {
      const deptId = current.department === "procurement" ? "dept-procurement" : "dept-hr";
      goToSlide(deptId);
    } else if (level === 3) {
      const domainId = current.domain ? `domain-${current.domain}` : "domain-1";
      goToSlide(domainId);
    } else if (level === 4) {
      if (current.level === 4) return;
      const domain = current.domain || 1;
      const firstAgent = SLIDES.find(s => s.level === 4 && s.domain === domain);
      if (firstAgent) goToSlide(firstAgent.id);
    }
  }, [current, goToSlide]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (showHelp) { if (e.key === "Escape") setShowHelp(false); return; }
      if (showPicker) { if (e.key === "Escape") setShowPicker(false); return; }
      if (e.key === "?") { e.preventDefault(); setShowHelp(true); return; }
      if (e.key === "ArrowRight" || e.key === " ") { e.preventDefault(); nextSlide(); }
      if (e.key === "ArrowLeft") { e.preventDefault(); prevSlide(); }
      if (e.key === "Escape") zoomOut();
      if (e.key === "Backspace") { e.preventDefault(); goBack(); }
      if (e.key === "m") setShowPicker(prev => !prev);
      if (e.key === "1") jumpToLevel(0);
      if (e.key === "2") jumpToLevel(1);
      if (e.key === "3") jumpToLevel(2);
      if (e.key === "4") jumpToLevel(3);
      if (e.key === "5") jumpToLevel(4);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [nextSlide, prevSlide, zoomOut, goBack, jumpToLevel, showPicker, showHelp]);

  // Touch swipe navigation
  useEffect(() => {
    let touchStartX = 0, touchStartY = 0, touchStartTime = 0, isSwiping = false;
    const handleTouchStart = (e: TouchEvent) => {
      if (showPicker || showHelp) return;
      const touch = e.touches[0];
      touchStartX = touch.clientX; touchStartY = touch.clientY;
      touchStartTime = Date.now(); isSwiping = false;
    };
    const handleTouchMove = (e: TouchEvent) => {
      if (showPicker || showHelp) return;
      const touch = e.touches[0];
      const deltaX = touch.clientX - touchStartX;
      const deltaY = touch.clientY - touchStartY;
      if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 30) isSwiping = true;
    };
    const handleTouchEnd = (e: TouchEvent) => {
      if (showPicker || showHelp || !isSwiping) return;
      const touch = e.changedTouches[0];
      const deltaX = touch.clientX - touchStartX;
      const deltaY = touch.clientY - touchStartY;
      const elapsed = Date.now() - touchStartTime;
      if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 50 && elapsed < 500) {
        if (deltaX < 0) nextSlide(); else prevSlide();
      }
    };
    window.addEventListener("touchstart", handleTouchStart, { passive: true });
    window.addEventListener("touchmove", handleTouchMove, { passive: true });
    window.addEventListener("touchend", handleTouchEnd, { passive: true });
    return () => {
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleTouchEnd);
    };
  }, [nextSlide, prevSlide, showPicker, showHelp]);

  // Scroll the active slide into view when the picker opens.
  useEffect(() => {
    if (!showPicker) { setPickerQuery(""); return; }
    const id = requestAnimationFrame(() => {
      document.getElementById("picker-active")?.scrollIntoView({ block: "center" });
    });
    return () => cancelAnimationFrame(id);
  }, [showPicker]);

  const query = pickerQuery.trim().toLowerCase();

  return (
    <AuthGate>
    <DepartmentProvider>
    <SlideContext.Provider value={{
      currentSlide, goToSlide, nextSlide, prevSlide,
      zoomOut, goBack, history,
      currentLevel: current.level as 0 | 1 | 2 | 3 | 4,
      breadcrumbs,
      levelPosition,
    }}>
      <div
        className="fixed inset-0 overflow-hidden selection:bg-primary/15 selection:text-primary"
        style={{ backgroundColor: "var(--color-background)", ["--atmo-1" as any]: atmo1, ["--atmo-2" as any]: atmo2 }}
      >
        {/* Location-aware atmosphere — a muted blue/grey wash that crossfades by department. */}
        <div className="aurora-blob -z-10 top-[-10%] right-[-6%] w-[55%] h-[55%] opacity-[0.07]" style={{ backgroundColor: "var(--atmo-1)" }} />
        <div className="aurora-blob -z-10 bottom-[-12%] left-[-8%] w-[45%] h-[50%] opacity-[0.06]" style={{ backgroundColor: "var(--atmo-2)" }} />
        <div className="aurora-blob -z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2/3 h-2/3 opacity-[0.03]" style={{ backgroundColor: "var(--atmo-2)" }} />

        <Header onOpenPicker={() => setShowPicker(true)} onJumpToLevel={jumpToLevel} />

        {/* Slide Picker Modal */}
        <AnimatePresence>
          {showPicker && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[100] bg-background/85 backdrop-blur-2xl overflow-y-auto"
            >
              <div className="max-w-6xl mx-auto px-8 py-6">
                <div className="flex justify-between items-center gap-4 mb-5 sticky top-0 z-10 -mx-8 px-8 py-3 bg-background/70 backdrop-blur-xl">
                  <div>
                    <h2 className="text-2xl font-headline font-bold tracking-tight">Slide Overview</h2>
                    <p className="text-xs text-secondary mt-1">{SLIDES.length} slides &middot; type to filter &middot; Esc to close</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <label className="relative hidden sm:block">
                      <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-secondary/50" />
                      <input
                        autoFocus
                        value={pickerQuery}
                        onChange={(e) => setPickerQuery(e.target.value)}
                        placeholder="Filter slides…"
                        className="h-9 w-56 rounded-lg border border-outline-variant/40 bg-surface pl-8 pr-3 text-sm outline-none focus:border-primary/50 transition-colors"
                      />
                    </label>
                    <button onClick={() => setShowPicker(false)} className="p-2 rounded-lg hover:bg-surface-container transition-colors" aria-label="Close">
                      <X className="w-5 h-5 text-secondary" />
                    </button>
                  </div>
                </div>

                {[
                  { label: "Story", level: 0 as const, color: "bg-emerald-500" },
                  { label: "Capability Map", level: 1 as const, color: "bg-blue-500" },
                  { label: "Departments", level: 2 as const, color: "bg-orange-500" },
                  { label: "Domain Catalogs", level: 3 as const, color: "bg-violet-500" },
                  { label: "Use Case Deep Dives", level: 4 as const, color: "bg-pink-500" },
                ].map(group => {
                  const groupSlides = SLIDES.map((s, i) => ({ ...s, index: i }))
                    .filter(s => s.level === group.level)
                    .filter(s => !query || s.title.toLowerCase().includes(query));
                  if (groupSlides.length === 0) return null;
                  return (
                    <div key={group.level} className="mb-6">
                      <div className="flex items-center gap-2 mb-2">
                        <div className={`w-2 h-2 rounded-full ${group.color}`} />
                        <span className="text-[10px] font-bold uppercase tracking-widest text-secondary/60">{group.label} ({groupSlides.length})</span>
                      </div>
                      <div className="grid grid-cols-3 md:grid-cols-5 lg:grid-cols-7 gap-1.5">
                        {groupSlides.map(slide => {
                          const isActive = currentSlide === slide.index;
                          return (
                            <button
                              key={slide.id}
                              id={isActive ? "picker-active" : undefined}
                              onClick={() => { setCurrentSlide(slide.index); setShowPicker(false); }}
                              className={`p-2.5 rounded-lg text-left transition-all hover:scale-[1.03] ${
                                isActive ? "editorial-active-card" : "editorial-card editorial-card-interactive"
                              }`}
                            >
                              <span className={`text-[7px] font-mono block ${isActive ? 'opacity-60' : 'text-secondary/40'}`}>
                                {String(slide.index + 1).padStart(2, '0')}
                              </span>
                              <h3 className={`text-[10px] font-headline font-bold leading-tight ${isActive ? '' : 'text-on-surface'}`}>
                                {slide.title}
                              </h3>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Keyboard shortcuts overlay */}
        <AnimatePresence>
          {showHelp && (
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setShowHelp(false)}
              className="fixed inset-0 z-[110] bg-on-surface/30 backdrop-blur-sm flex items-center justify-center p-6"
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.96, y: 8 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.97 }}
                transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
                onClick={(e) => e.stopPropagation()}
                className="editorial-card rounded-2xl p-6 w-full max-w-sm"
              >
                <div className="flex items-center gap-2 mb-4">
                  <Command className="w-4 h-4 text-primary" />
                  <h2 className="font-headline font-bold text-base tracking-tight">Keyboard shortcuts</h2>
                </div>
                <dl className="space-y-2">
                  {SHORTCUTS.map(([keys, desc]) => (
                    <div key={keys} className="flex items-center justify-between gap-4">
                      <dt className="text-sm text-secondary">{desc}</dt>
                      <dd className="font-mono text-[11px] font-semibold text-on-surface bg-surface-container px-2 py-0.5 rounded border border-outline-variant/40">{keys}</dd>
                    </div>
                  ))}
                </dl>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        <main className="relative w-full h-full">
          {/* Elevated stage — gives every slide figure/ground over the aurora backdrop. */}
          <div className="pointer-events-none absolute top-11 sm:top-14 md:top-16 left-3 right-3 bottom-3 sm:left-4 sm:right-4 md:left-6 md:right-6 md:bottom-5">
            <div className="deck-stage" />
          </div>

          <AnimatePresence mode="wait">
            <SlideWrapper key={currentSlide} isActive={true} transition={transition}>
              <UsecaseIdProvider value={current.id && current.id.startsWith("uc-") ? current.id : null}>
                {SLIDES[currentSlide].content}
              </UsecaseIdProvider>
            </SlideWrapper>
          </AnimatePresence>
        </main>

        <Navigation
          current={currentSlide}
          total={SLIDES.length}
          onPrev={prevSlide}
          onNext={nextSlide}
        />
        <ProgressBar current={levelPosition.current} total={levelPosition.total} />
      </div>
    </SlideContext.Provider>
    </DepartmentProvider>
    </AuthGate>
  );
}
