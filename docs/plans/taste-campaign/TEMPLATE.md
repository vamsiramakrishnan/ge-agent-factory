# WS<N> — <imperative title: what will be true after this lands>

**Status:** `[ ]` open
**Write-set:** <exact files/dirs this workstream may touch — workers treat
this as binding; anything else is "report back, don't edit">
**Depends on:** <workstreams that must be merged first, or "nothing">
**Blocks:** <workstreams waiting on this, or "nothing">

## Problem (verified <date> — re-verify anything load-bearing before editing)

<Current state as FACTS with file:line/symbol evidence, gathered at
doc-write time. Line numbers drift; anchor on symbols and tell the worker to
re-map with grep. Every claim here was checked, not remembered.>

## Target

<The end state in one paragraph. If a number appears in the DoD below, show
its arithmetic here — estimated targets that turn out impossible waste a
worker's whole session (see 08-next-horizon.md §A6).>

## Step 1 — <verification net FIRST>

<The oracle/test that pins current behavior, committed green BEFORE any
change. Name the house pattern to copy (golden oracle + GE_SOURCE_DATE pin,
corpus parity snapshot, stash-diff harness, tsc harness with
@ts-expect-error probes) and the exact file it lives in.>

## Step 2..N — <the change, smallest safe increments>

<Prescriptive: target filenames, export names, code skeletons where shape
matters. Mark any step that changes behavior as `BEHAVIOR-CHANGE` — it lands
as its own commit with the change named in the subject. Where the worker may
exercise judgment, say so EXPLICITLY and give the decision criteria — named
escape hatches outperform rigid prescriptions (the doctor/report.mjs rename
came from one).>

## Definition of done

- [ ] <Every item is a RUNNABLE COMMAND with its expected output — never a
      sentence a worker can rationalize. Include one negative test: prove
      the new gate/oracle catches a planted defect once, then revert.>
- [ ] Full gate + `bun run test:gated` green (judge failures by NAME against
      `tools/known-test-failures.json`).

## Forbidden

<The tempting adjacent improvements this workstream must NOT make. This list
is as load-bearing as the steps — it is what keeps parallel write-sets
disjoint and verbatim moves verbatim.>

---
Worker protocol (inherited from 00-orchestration.md): worktree forks from
origin/main, so `git merge <integration-branch> --no-edit` FIRST; commit
incrementally with the repo's trailer convention; never push, never stash;
final report is raw data — branch, `git log --oneline`, each DoD item with
its actual output, deviations each justified in one line. A separate
reviewer re-runs the DoD before merge; report, don't stretch scope.
