---
name: bringing-your-own
description: Operates the BYO (bring the enterprise's own systems, evals, models, and policies) insertion points of the GE Agent Factory — profiling and redacting real systems, recording and comparing bounded read traffic, modeling twin mutations, compiling reviewed bindings into dispatch policy, validating and applying a BYO manifest, synthesizing simulated systems, importing external evalsets, and checking model-provider readiness. Use when enterprise systems, evalsets, models, or policies need to enter the factory line without forking it, including ge.byo.yaml and the ge systems profile/record/compare/mutation/bind/dispatch surfaces.
composes: [building-simulators, driving-live-proof, guarding-the-factory]
---

# Bringing Your Own

Use this skill wherever an enterprise's own systems, evals, models, or policies enter the factory line instead of the factory's built-in simulators and defaults.

In plain language: "bring your own" (BYO) is not one command — it is every insertion point where real enterprise material replaces a factory default: a live system measured against a simulator twin, an externally-authored evalset imported next to compiled ones, a model provider checked for readiness, and a manifest (`ge.byo.yaml`) that packages those customizations into one reviewable unit.

Offline analysis is the default. `systems profile` without `--probe`, mutation inference/validation, mutation apply without `--write`, binding, and dispatch compilation do not call a live system. `systems profile --probe`, `systems record`, `systems compare`, and `systems doctor --dial` make bounded read-only calls and require explicit operator approval first. Binding only writes local configuration; dispatch only compiles a directive. Neither starts a tool plane, routes traffic, uploads data, nor deploys anything automatically.

## Assembly-Line Slot

- **First step:** identify which insertion point is in play — a real system to profile and redact (`systems.profile`), a twin to calibrate (`systems.record` / `systems.compare`), write semantics to model (`systems.mutation.*`), a reviewed target to bind (`systems.bind` / `systems.dispatch`), a manifest to validate (`byo.doctor`), or another BYO input.
- **Plays a role in:** the simulator/system layer (`building-simulators`) and the behavioral-eval layer (`driving-live-proof`) — this skill is how an enterprise's own version of either enters the line without forking the factory.
- **Input:** a `ge.byo.yaml` manifest; a system id, OpenAPI spec, redaction policy, probe script, and approved live target; sample rows or a natural-language description; or an ADK-compatible evalset file.
- **Output:** a redacted system profile, replay corpus and realism report, reviewable mutation proposal, validated simulator mutation contract, persisted binding under `.ge/systems/bindings.json`, dispatch directive, validated BYO plan, synthesized system, imported evalset, or model-readiness report.
- **Next step:** review the local artifacts and dry runs. Only after separate live approval should an operator dial a target or inject a dispatch directive into a tool-plane process.

## Workflow

1. Start offline. Run `ge byo doctor`, then build a system profile from the OpenAPI spec with auth stored as an environment-variable reference. Attach a `ge.redaction-policy.v1` whenever the spec contains PII-shaped fields. Omit `--probe` while reviewing the read allowlist, write denylist, and policy hash.
2. Obtain explicit approval before any network call. If approved, record only allowlisted reads with an explicit `--max-calls` cap, or import an existing HAR/NDJSON capture through the same redaction path. Run `systems compare` with an explicit cap to measure the twin; it never exercises write endpoints.
3. Infer write semantics from the reviewed OpenAPI spec or samples. Review the proposal, validate the current pack, and run `systems mutation apply` without `--write` first. Persist with `--write` only after the dry-run diff is accepted, then validate again. Do not use `--force` to bypass a changed-base warning without investigating it.
4. Decide the target kind (`twin` | `mcp` | `rest`) and precedence mode (`twin_first` | `live_first` | `twin_only`) only after the profile, realism report, and mutation model are understood. `systems bind` stores configuration locally; it does not test reachability.
5. Compile and inspect `systems dispatch`. It reports the exact read-routing decisions and keeps writes on the twin, but it does not export the directive, start a service, make a call, or deploy anything.
6. Treat live approval as a separate gate. Only after approval should an operator run `systems doctor --dial`, choose `live_first`, or inject the dispatch directive into a running tool plane. A stored binding is configuration, not permission to contact the target.
7. Synthesize new simulator systems and import evalsets as needed. Use `--promote` only after review; imported evalsets become visible to `ge evals coverage` / `ge prove --live`.
8. Check model-provider readiness before refinement or judging; `models doctor` makes no network or paid calls.
9. Apply a BYO manifest only after `byo doctor` reports a clean plan. Run `byo apply --dry-run` first, and consult `guarding-the-factory` for any production-facing follow-through.

## Commands

```bash
bun tools/ge.mjs byo doctor --manifest ge.byo.yaml
bun tools/ge.mjs byo apply --manifest ge.byo.yaml --dry-run
bun tools/ge.mjs byo apply --manifest ge.byo.yaml

# Offline profile: storing a base URL does not dial it; auth is a reference, never a token.
bun tools/ge.mjs systems profile <system> --openapi <spec.json> --base-url <https://api.example> --auth env:<TOKEN_ENV> --redact <policy.json>

# Live read-only commands: run only after approval and keep the call cap explicit.
bun tools/ge.mjs systems record <system> --profile <profile.json> --script <probes.json> --max-calls 25 --redact <policy.json>
bun tools/ge.mjs systems compare <system> --profile <profile.json> --max-calls 25
bun tools/ge.mjs systems doctor --dial

# Write-semantics proposal and guarded pack update.
bun tools/ge.mjs systems mutation infer <system> --from-openapi <spec.json>
bun tools/ge.mjs systems mutation validate --system <system>
bun tools/ge.mjs systems mutation apply --proposal <proposal.json>          # dry-run
bun tools/ge.mjs systems mutation apply --proposal <proposal.json> --write  # only after review

# Local binding and directive compilation; neither command starts or deploys a service.
bun tools/ge.mjs systems bind <system> --to <https://api.example> --kind rest --mode twin_first --config '{"authEnv":"TOKEN_ENV"}'
bun tools/ge.mjs systems bindings
bun tools/ge.mjs systems dispatch
bun tools/ge.mjs systems unbind <system>

bun tools/ge.mjs systems synth --description "<what the system does>"
bun tools/ge.mjs systems doctor

bun tools/ge.mjs evals import --evalset <path-to-evalset.json>
bun tools/ge.mjs models doctor
```

## Common mistakes

- Profiling a PII-shaped spec without a redaction policy, or adding `--probe` while expecting an offline command.
- Recording or comparing without explicit live approval and a small `--max-calls` bound.
- Treating mutation inference as authoritative, skipping the dry-run, or using `--force` instead of resolving a stale base hash.
- Assuming `systems bind` checked connectivity, or that `systems dispatch` exported configuration, started the tool plane, or deployed anything. Both stop at local configuration/artifacts.
- Treating a `live_first` binding as approval to call production. Approval is a separate operator decision made immediately before the live action.
- Running `byo apply` before `byo doctor` — the plan classification is what identifies safe, planned-only, and invalid actions.
- Synthesizing a system without `--promote` and expecting it to persist — an unpromoted result lives only in the spawned process's in-process overlay.
- Importing an evalset under an id that collides with a compiled one without `--force`, silently shadowing the compiled suite.
- Treating `ge.byo.yaml` as the same thing as `ge.manifest.json` — the manifest here is enterprise customization packaging, not platform/fleet desired state (that's `ge apply`).

## Done when

The offline profile names the exact read allowlist, write denylist, auth reference, and redaction-policy hash; any approved capture is bounded and redacted; the realism report and mutation dry-run are reviewed; mutation validation passes; and bindings plus the compiled dispatch directive match the intended routing. Any live dial or directive injection has a separate explicit approval record. The BYO manifest and remaining eval/model inputs also pass their respective checks.

## References

- Worked example: `references/example-session.md` — a read-only BYO manifest
  review followed by a dry-run apply and targeted binding.
- Cookbook: `docs/cookbooks/bring-your-own-systems.md` — the BYO insertion points end to end, with the local-only/read-only-by-default scope spelled out.
- Reference: `docs/reference/cli.md` — full flag tables for `ge byo`, `ge systems`, `ge evals import`, and `ge models doctor`.
- Engine: `@ge/byo-systems` (`packages/byo-systems/README.md`) — the manifest schema, binding validation, and synthesis core behind these commands.
