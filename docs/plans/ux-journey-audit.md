# UX Journey Audit — CLI · Console · Presentation

Date: 2026-07-02. Scope: the end-to-end operator journey (first run → build →
watch → recover → ship) across the `ge` CLI, the console, and the presentation
deck. Method: trace the journey a new operator actually takes, find the
mechanisms (not copy) that break it, fix the mechanisms. Findings below are
kept as the rationale record for the changes shipped alongside this document.

## Principles applied

- **Journey-driven, not page-driven** — every surface should answer "where am
  I, what's next, how much effort is it?" The strongest existing assets
  (`next:` hints, `journey-plan.mjs`, doctor `fix:` lines) already did this;
  the fixes extend the same pattern to the places that didn't.
- **Resume is a first-class value** — an interrupted run must be recoverable
  from where it stopped, with one obvious verb, on every surface.
- **Tell the user how easy it is** — effort estimates up front
  (`expectedDuration` existed in the registry but was never shown), elapsed
  time at the end.
- **Progressive disclosure** — first-run users get orientation; configured
  users get dashboards; advanced flags stay out of the happy path.
- **No dead ends** — a button or key that does nothing is a bug, not a
  missing feature.

## Fixed in this change

### CLI (`tools/ge/*`)

1. **`ge agents resume`** (new verb). Resume for plain factory builds existed
   only as folklore (`--force`, `ship --start-stage`, reading `ge ledger
   plan`). The pipeline state machine already computed per-item next actions;
   `tools/lib/agents-resume.mjs` folds those rows into at most three
   executable groups (build locally → ship → resubmit remote), printed as a
   plan by default and executed with `--run`. `ge agents status` and
   `ge ledger plan` now point at it when something failed.
2. **Duration honesty.** `guarded()` prints `done in Ns` / `failed after Ns`
   (stderr, ≥5s, suppressed for `--json`). `ge up`, `ge data up`,
   `ge mcp deploy` announce `usually takes …` from the same registry the
   console reads (`ge-command-registry.mjs`), so estimates cannot drift per
   surface.
3. **One-command watch.** `ge agents build --watch` (remote) rolls straight
   into the status watch loop; `ge mission run --follow`,
   `ge journey run --follow`, `ge autopilot run --follow` stream live SSE
   events inline instead of requiring a remembered second command.
4. **First-run orientation.** Bare `ge` with no configured project now renders
   a three-step quickstart (setup → init → devex smoke) with effort estimates,
   instead of a status board about planes the user doesn't have yet.
5. **Actionable errors.** `guarded()` renders `err.hint` as a `next:` line —
   the same affordance successful commands already print.
6. **Fail-safe mode fallbacks.** Two `cfg.mode || "remote"` fallbacks
   (`modeOf`, `agents sync`, `ge mode`) contradicted the config contract's
   fail-safe default (`config-schema.mjs`: a fresh checkout must never touch
   GCP). All now fall back to `local`.

### Console (`apps/console`)

1. **Followed runs survive the tab.** `RunFollowProvider` persists the active
   follow target (`ge.runFollow.active`, same pattern as JobToast's
   `ge:active-jobs`) and re-attaches on boot; a run that finished meanwhile
   auto-collapses and clears itself.
2. **Guided first journey.** Overview renders a three-step get-started card
   (build → watch → ship) with live done-states derived from fleet/run data,
   honest effort labels, and a readiness escape hatch. It doubles as the
   resume point mid-journey, auto-retires on the first deployed agent, and is
   dismissable (persisted).
3. **No silent dead-ends.** Unknown stage-action kinds in the Pipeline wizard
   now surface the underlying CLI command via ErrorBanner (one-click copy)
   instead of a button that does nothing.
4. **Structured next-step routing.** Overview's next-step button matches the
   status board's exact command prefixes (`ge init` / `ge up [--plane]` /
   `ge agents build`) instead of `includes("up")` substring matching, and
   unrecognized commands land on the Pipeline with the command shown — not
   silently on the Fleet roster.
5. **Naming drift.** Fleet's `h1` said "Agents" while nav said "Fleet"; the
   hardcoded "363 specs" fallback showed before the catalog loaded. Both fixed
   (the count now derives from the catalog or shows a loading state).

### Presentation (`apps/presentation`)

1. **Self-truing headline.** The Act V divider was hardcoded at "228 Agents.
   28 Domains." (actual: 363/46, five departments). It is now computed from
   the slide registry at render time, so it can never go stale again.
2. **Department-aware level jumping.** `jumpToLevel` was hardcoded to
   HR/Procurement; keys 2–5 from Finance/Marketing/IT slides jumped to the
   wrong department. Now resolves via the current slide's department
   (inherited through the parent chain for deep-dive slides that omit it —
   which also fixes the department atmosphere hues on those slides).
3. **Dead "Story" jump.** `goToSlide("title")` targeted a slide id that
   doesn't exist (`landing`), so the jump-to-story key and the "Story"
   breadcrumb were silent no-ops. Fixed.

## Known gaps, deliberately not fixed here

- **Dual stage vocabularies** (ledger stages vs `FACTORY_STAGE_GRAPH` names)
  remain unreconciled in docs — a docs/domain change, tracked in the taste
  campaign (see `docs/plans/taste-campaign/08-next-horizon.md`).
- **Run replay** (`ge run replay` / console scrubber) is the flagship item in
  `08-next-horizon.md` B9 and stays there.
- **Interview wizard continuity** relies on the "Continue Interview" pill +
  localStorage; a persistent cross-view journey thread is a larger IA change.
- **Four orchestration nouns** (mission/journey/autopilot/factory run) still
  coexist; renaming is a breaking-surface decision.
