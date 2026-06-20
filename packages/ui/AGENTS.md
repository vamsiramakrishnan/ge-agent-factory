# @ge/ui

Shared GE React UI primitives used by every front-end (`apps/console`, `apps/presentation`).

- `Lifecycle` — the ONE renderer for the canonical `ge.journey.plan` (`@ge/contracts` `JourneyStage[]`):
  status tone + action affordance (navigate vs run/resume via `ACTION_DISPATCH_MODE`).
- `StatusPill` + `statusStyle`/`statusLabel` — the shared status vocabulary → label + Tailwind tone.

Boundary: React components depending only on `@ge/contracts` + `lucide-react` (react is a peer,
provided by the consuming app). No fs/process, no app-specific data fetching, no business logic —
pure presentation driven by props. New cross-app components belong here; app-local one-offs stay in
the app. Tailwind classes are emitted by each app's own build scanning its source.
