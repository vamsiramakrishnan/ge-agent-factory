# Zoom-Level Navigation Redesign

## Summary

Replace the linear slide-by-slide navigation with a 4-level zoom model (Story → Map → Domain → Agent). Users zoom in/out between levels, navigate within a level, and always see where they are via breadcrumbs. History stack enables "go back to where I was."

## The 4 Levels

Each slide gets a `level` and `parent` assignment:

- **L0: Story** — narrative slides (title, challenge, solution, personas, RACI, day-in-life, tech-landscape, transformation, build slides, impact, roadmap, closing). Arrow keys navigate sequentially within this set.
- **L1: Map** — the periodic table slide (single slide). Entry point to all domains/agents.
- **L2: Domain** — 10 domain catalog slides. Arrow keys move between domains (domain-1 ↔ domain-2 ↔ ... ↔ domain-10).
- **L3: Agent** — 82 use case slides. Arrow keys move between use cases within the same domain. Each agent's parent is its domain.

## Navigation Model

### Zoom OUT (Escape key)
- Agent → its parent Domain catalog
- Domain → Map (periodic table)
- Map → Story (last visited story slide, or first)
- Story at first slide → no-op

### Zoom IN (Enter key / Click)
- Periodic table element click → Agent slide
- Domain catalog card click → Agent slide
- Story slide: no implicit zoom-in (clickable elements within slides handle it)

### Navigate WITHIN level (← → arrow keys)
- Story: prev/next story slide
- Domain: prev/next domain catalog
- Agent: prev/next agent within same domain (wraps to domain catalog when exhausting agents)

### History (Backspace key)
- Every goToSlide pushes current slide ID onto a history stack
- Backspace pops and navigates to the previous slide
- Stack max depth: 50

## Data Model Changes

Add to `SlideConfig`:
```ts
interface SlideConfig {
  id: string;
  title: string;
  content: React.ReactNode;
  level: 0 | 1 | 2 | 3;
  parent?: string; // parent slide ID for zoom-out
  domain?: number; // 1-10, for domain/agent level navigation
}
```

## Header Redesign

The header becomes the primary navigation surface:

### Left section
- Logo + "Gemini Enterprise" (existing)

### Center section — Breadcrumbs
- Dynamic breadcrumb trail: `Story › Capability Map › Talent Acquisition › A-204 Resume Screening`
- Each segment is clickable — navigates to that slide
- Built from current slide's parent chain
- Only visible at L2+ (domains and agents)

### Right section — Level buttons + controls
- 4 pill buttons: **Story** | **Map** | **Domain** | **Agent**
- Active level highlighted with `bg-primary text-white`
- Clicking a level button:
  - Story → goes to first story slide (or last visited)
  - Map → goes to periodic table
  - Domain → goes to current domain (or last visited domain)
  - Agent → no-op if not in a domain context; otherwise goes to last visited agent in current domain
- Deeper levels dimmed when not contextually available
- Slide picker (M) button
- Keyboard shortcut: 1/2/3/4 jump to levels

## Component Changes

### SlideContext expansion
Add to context:
```ts
interface SlideContextType {
  currentSlide: number;
  goToSlide: (id: string) => void;
  nextSlide: () => void;
  prevSlide: () => void;
  zoomOut: () => void;
  zoomIn: (targetId?: string) => void;
  goBack: () => void;
  history: string[];
  currentLevel: 0 | 1 | 2 | 3;
  breadcrumbs: { id: string; title: string }[];
}
```

### App.tsx
- Rewrite navigation logic to be level-aware
- Arrow keys: navigate within level
- Escape: zoom out
- Backspace: history pop
- 1-4 number keys: jump to level
- History stack management
- Compute breadcrumbs from current slide's parent chain

### Header.tsx
- Remove domain dropdown
- Add breadcrumb trail (center)
- Add level buttons (right)
- Active level indicator

### Navigation.tsx
- Keep prev/next arrows but they now navigate within level
- Counter shows position within current level (e.g., "3/10" for domains, "5/13" for TA agents)

### slides.tsx
- Add `level`, `parent`, and `domain` to every slide entry

## Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `← →` | Prev/next within current level |
| `Escape` | Zoom out one level |
| `Enter` | Zoom in (context-dependent) |
| `Backspace` | History back |
| `M` | Slide overview modal |
| `1` | Jump to Story level |
| `2` | Jump to Map |
| `3` | Jump to Domain level |
| `4` | Jump to Agent level |

## Files to Create/Modify

- Modify: `src/context/SlideContext.tsx` — expanded context with zoom/history
- Modify: `src/App.tsx` — level-aware navigation logic, history stack, breadcrumb computation
- Modify: `src/components/Header.tsx` — breadcrumbs + level buttons
- Modify: `src/components/Navigation.tsx` — level-aware counter
- Modify: `src/config/slides.tsx` — add level/parent/domain to all entries
