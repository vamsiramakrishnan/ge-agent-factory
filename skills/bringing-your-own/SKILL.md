---
name: bringing-your-own
description: Operates the BYO (bring the enterprise's own systems, evals, models, and policies) insertion points of the GE Agent Factory — validating and applying a BYO manifest, binding a contract system to a live twin/MCP/REST target, synthesizing a brand-new simulated system, importing an external evalset, and checking model-provider readiness. Use when enterprise systems, evalsets, models, or policies need to enter the factory line without forking it, when working with ge.byo.yaml, ge systems bind/synth, ge evals import, or ge models doctor.
composes: [building-simulators, driving-live-proof, guarding-the-factory]
---

# Bringing Your Own

Use this skill wherever an enterprise's own systems, evals, models, or policies enter the factory line instead of the factory's built-in simulators and defaults.

In plain language: "bring your own" (BYO) is not one command — it is every insertion point where real enterprise material replaces a factory default: a live system bound in place of (or alongside) a simulator twin, an externally-authored evalset imported next to compiled ones, a model provider checked for readiness, and a manifest (`ge.byo.yaml`) that packages every one of those customizations into one reviewable, appliable unit. Everything here is local-only and read-only by default; only `apply`/`bind`/`unbind` write local state, and nothing uploads or deploys.

## Assembly-Line Slot

- **First step:** identify which insertion point is in play — a manifest to validate (`byo.doctor`), a system to bind to a live target (`systems.bind`), a brand-new system to synthesize (`systems.synth`), an external evalset to import (`evals.import`), or a model provider to check (`models.doctor`).
- **Plays a role in:** the simulator/system layer (`building-simulators`) and the behavioral-eval layer (`driving-live-proof`) — this skill is how an enterprise's own version of either enters the line without forking the factory.
- **Input:** a `ge.byo.yaml` manifest, a contract system id + live target (twin pack id, MCP endpoint, or REST base URL), an OpenAPI spec / sample rows / natural-language description, or an ADK-compatible evalset file.
- **Output:** a validated apply plan (appliable / planned-only / invalid), a persisted binding under `.ge/systems/bindings.json`, a synthesized system (in-process or promoted into the curated corpus), an imported evalset under `.ge/behavioral/`, or a model-readiness report.
- **Next step:** a bound/synthesized system feeds `building-simulators`; an imported evalset feeds `ge prove --live` (`driving-live-proof`); a validated manifest is applied, then re-validated.

## Workflow

1. Start read-only: `ge byo doctor` before `ge byo apply` — it classifies every manifest action as appliable / planned-only / invalid without touching anything.
2. For a live system, decide the target kind (`twin` | `mcp` | `rest`) and precedence mode (`twin_first` | `live_first` | `twin_only`) before binding — a wrong `--to`/`--kind` pairing fails validation rather than binding silently.
3. Bind, list, or unbind as needed; every bound system is discoverable later via `ge systems bindings`.
4. To stand up a brand-new simulated system, synthesize it from a description, samples, or an OpenAPI spec; use `--promote` only once the result should persist into the curated corpus, not just the current process.
5. Import bring-your-own evalsets so they sit alongside compiled ones under `.ge/behavioral/` and are visible to `ge evals coverage` / `ge prove --live`.
6. Check model-provider readiness before anything that depends on the refinement/judge model; this never makes network or paid calls.
7. Apply the manifest's safe subset only after doctor reports the plan clean; `--dry-run` reports without executing.
8. Consult `guarding-the-factory` before binding to a live production target or promoting a synthesized system — both are reversible locally, but a live binding changes what the factory line actually talks to.

## Commands

```bash
bun tools/ge.mjs byo doctor --manifest ge.byo.yaml
bun tools/ge.mjs byo apply --manifest ge.byo.yaml --dry-run
bun tools/ge.mjs byo apply --manifest ge.byo.yaml

bun tools/ge.mjs systems bind <system> --to <twin-pack-id|mcp-url|rest-url> --kind twin --mode twin_first
bun tools/ge.mjs systems bindings
bun tools/ge.mjs systems unbind <system>
bun tools/ge.mjs systems synth --description "<what the system does>"
bun tools/ge.mjs systems doctor

bun tools/ge.mjs evals import --evalset <path-to-evalset.json>
bun tools/ge.mjs models doctor
```

## Common mistakes

- Running `byo apply` before `byo doctor` — the plan classification is exactly what tells you which actions are safe to apply.
- Binding a system with `--kind rest`/`mcp` to a URL that isn't reachable yet, then being surprised the binding "worked" (bind validates shape, not live reachability).
- Synthesizing a system without `--promote` and expecting it to persist — an unpromoted result lives only in the spawned process's in-process overlay.
- Importing an evalset under an id that collides with a compiled one without `--force`, silently shadowing the compiled suite.
- Treating `ge.byo.yaml` as the same thing as `ge.manifest.json` — the manifest here is enterprise customization packaging, not platform/fleet desired state (that's `ge apply`).

## Done when

The manifest applies clean (or its remaining actions are correctly classified planned-only/invalid with a reason), every intended system is bound/synthesized and shows up in `ge systems bindings` / `ge systems list`, imported evalsets are visible to `ge evals coverage`, and `ge models doctor` reports the provider(s) the line depends on as ready.

## References

- Cookbook: `docs/cookbooks/bring-your-own-systems.md` — the BYO insertion points end to end, with the local-only/read-only-by-default scope spelled out.
- Reference: `docs/reference/cli.md` — full flag tables for `ge byo`, `ge systems`, `ge evals import`, and `ge models doctor`.
- Engine: `@ge/byo-systems` (`packages/byo-systems/README.md`) — the manifest schema, binding validation, and synthesis core behind these commands.
