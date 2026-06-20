---
name: interviewing-specs
description: Turns rough enterprise agent ideas into normalized GE use-case specs through a harness-driven interview. Use when Antigravity or another harness should interview the user, infer systems/data/tools/evals, register an interview-authored spec, or check spec completeness before factory planning.
---

# Interviewing Specs

Use this skill at the very beginning of the line.

In plain language: this skill turns a rough idea into the contract the factory compiles. The factory should not start from vague intent like “make a procurement agent.” It needs a normalized use-case spec: persona, objective, source systems, tool intents, data contracts, policies, eval prompts, success criteria, and deployment intent.

## Assembly-Line Slot

- **First step:** run or prepare a harness-driven interview unless the user already supplied a complete spec.
- **Plays a role in:** user interview, spec generation, and workspace creation before `plan`.
- **Input:** rough user idea, catalog use-case id, department, systems, or freeform description.
- **Output:** registered interview spec in `catalog/interview-specs/` or catalog selection that can generate `mock_systems/usecase-spec.json`.
- **Next step:** pass the selected/generated spec to `planning-missions`.

## Workflow

1. Decide whether the user is selecting an existing catalog use case, creating a new one, or creating a variant of an existing spec.
2. If the user is creating or refining a spec, prefer the harness interview path. Antigravity should enrich systems, schemas, tool intents, evidence rules, evals, simulator scope, and safe baselines.
   - If a missing answer changes the build, emit an interaction form using `references/interaction-forms.md`.
   - Do not hide important questions in a log stream. The console must be able to render the form and persist the response before the harness resumes.
3. Register the normalized spec through the interview spec registry. Do not send a vague freeform description directly to generation unless the user explicitly asks for a throwaway draft.
4. Generate or repair golden evals through the spec workbench, then validate them before registration.
5. Validate the spec shape and registry quality gates. The validator is strict; do not proceed while it reports gaps such as missing document `requiredSections`, `minimumWordCount`, source systems, entities, tool intents, or golden evals.
6. Sync/merge the registry into the generated use-case catalog.
7. Pass the buildable spec id to `planning-missions` or `running-factory`.

## Commands

Harness-driven interview:

Ask Antigravity to produce a normalized spec JSON using `references/harness-interview.md` as the contract. The stable repo mechanism today is to register that JSON:

```bash
node apps/ge-demo-generator/scripts/register-agent-spec.mjs --input <normalized-spec.json>
```

Use `--allow-draft true` only when intentionally storing an incomplete interview result that must not build yet.

Merge registered interview specs into the build catalog:

```bash
node apps/ge-demo-generator/scripts/sync-use-cases-from-slides.mjs
```

Build the registered spec:

```bash
node tools/ge.mjs agents build --ids <registered-spec-id> --local --target previewed
```

Catalog use case:

```bash
node apps/ge-demo-generator/src/cli.js create --usecase <id> --name "<Name>"
```

Legacy freeform draft only:

```bash
node apps/ge-demo-generator/src/cli.js create --freeform "<description>" --name "<Name>" --systems <a,b> --domain <domain>
```

Use legacy freeform only for quick local drafts. For durable factory work, use a harness-authored normalized spec first so the generator receives a real spec contract.

Validate a spec file:

```bash
node skills/interviewing-specs/scripts/validate-usecase-spec.mjs <workspace>/mock_systems/usecase-spec.json
```

Generate a golden-eval prompt for Antigravity:

```bash
node apps/ge-demo-generator/scripts/spec-workbench.mjs golden-evals prompt --spec <normalized-spec.json> --out /tmp/golden-evals.prompt.txt
```

Validate Antigravity-authored evals:

```bash
node apps/ge-demo-generator/scripts/spec-workbench.mjs golden-evals validate --spec <normalized-spec.json> --evals <golden-evals.json>
```

Apply validated evals back to the spec:

```bash
node apps/ge-demo-generator/scripts/spec-workbench.mjs golden-evals apply --spec <normalized-spec.json> --evals <golden-evals.json> --out <normalized-spec.with-evals.json>
```

## References

- Read `references/spec-shape.md` before creating or changing a use-case spec.
- Read `references/harness-interview.md` before asking Antigravity or another harness to author a spec.
- Read `references/interaction-forms.md` when the harness needs user choices, dropdowns, text fields, or approval before continuing.
- Read `references/golden-evals.md` before asking Antigravity or another harness to create evals.
- Read `references/assembly-line-role.md` to understand where this skill fits in the factory line.
