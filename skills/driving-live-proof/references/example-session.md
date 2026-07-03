# Example session — verify a shipped benefits agent before promotion

A worked interaction showing the whole loop: compile → drive (replay) →
prove live with caps → bench → verdict. Outputs are real, trimmed. Read this
when it's unclear which command comes next or what "good" output looks like.

## The ask

> Operator: "The benefits-enrollment agent shipped yesterday. Verify it
> behaves before we promote — and don't spend money until I say so."

Constraints extracted: deployed target exists; no live spend without
approval → cassette replay first, caps if live traffic is later approved.

## Step 1 — compile the behavior suite from the contract

```console
$ bun tools/ge.mjs evals compile
Evals — compiled — help-hr-teams-resolve-benefits-enrollment-exceptions-before-payr
  source     agent-spec · catalog/interview-specs/help-hr-teams-…-payr.json
  graph      10 capabilities · 9 tools · 2 evidence rules
  cases      40 selected of 61 candidates
  coverage   no gaps
  …
  next  ge prove --live --evalset .ge/behavioral/help-hr-….evalset.json --max-cases 3
```

Decision: `coverage no gaps` → the suite is usable. If gaps were listed, fix
the contract (or accept and note them) before proving anything.

## Step 2 — drive a replay to confirm the loop works end to end (zero cloud)

```console
$ bun tools/ge.mjs drive --cassette tools/lib/live/fixtures/success.ndjson --target-agent agent-benefits
> Can I change my plan after having a child?
Yes — the birth of a child is a qualifying life event, so you can change your plan…
  ttft 412ms · full 1.2s · chunks 4 · max gap 630ms · session …/sessions/abc123 · responder matched · tools 1
…
  verdict      ok
  transcript   .ge/transcripts/drive-mr4kzqaj-1.json
```

Footer reading: `responder matched` (identity proven from the stream),
session threaded across turns, timings well under budget. A `responder
unknown ▲` here would mean the stream carried no identity evidence — fine
for exploration, but release verification must use `--strict-responder`.

## Step 3 — prove live, capped

```console
$ bun tools/ge.mjs prove --live --evalset .ge/behavioral/help-hr-….evalset.json \
    --cassette .ge/cassettes/benefits-run.ndjson --max-cases 2 --max-turns 2
  case cap: running 2 of 40 case(s) (--max-cases)

Live Proof — help-hr-teams-resolve-benefits-enrollment-exceptions-before-payr
  verdict    PASS
  cases      2/2 pass (of 40 in the evalset)
  baseline   created
  ✓ case-auth-blackline-…-citation     1 turn(s) · conformance created
  ✓ case-auth-blackline-…-conflicting  2 turn(s) · conformance created
  gate        live gate passed
  next  ge bench
```

Decisions made here:

- `baseline created` — this green run minted the known-good baselines; the
  next run will compare and report `matched` or `drifted`.
- Had a case failed on `responder mismatched` (GELIVE006), stop: that is a
  routing/registration problem, not an eval problem — check `--target-agent`
  and the engine's agent registration before rerunning anything.
- `tool_trajectory: unavailable` in a metric grid is NOT a pass — grade
  trajectory on the local rail instead.

## Step 4 — bench against budgets (replay; live would need approval + --yes)

```console
$ bun tools/ge.mjs bench --cassette .ge/cassettes/benefits-run.ndjson --sessions 4 --turns 2 --concurrency 1,2
Live Bench — cassette-replay
  verdict   PASS
  ✓ time to first text p95      412ms  budget 2.5s
  ✓ full response p95            1.2s  budget 15.0s
  ✓ inter-chunk stall p99       630ms  budget 3.0s
  ✓ error rate                      0  budget ≤ 0.01
  artifact   .ge/proof/bench-result.json
```

## Step 5 — report back

> Agent: "Verified offline end to end: compiled suite has no coverage gaps;
> 2/2 capped live-proof cases pass with baselines created; every latency
> budget passes on the recorded run. Artifacts: `.ge/proof/live-proof-result.json`,
> `eval-matrix.json`, `bench-result.json`. Nothing was spent — all replay.
> To finish release verification I need approval for: (1) one live proof run,
> `--max-cases 3 --strict-responder --target-agent agent-benefits`, and
> (2) a small live bench, `--yes --sessions 5 --turns 2`."

The report names what was verified, what it cost (nothing), where the
evidence lives, and exactly what approval is being requested — never "all
good" without artifacts.

## Failure variant — drift on a later run

```console
  baseline   drifted
  ▲ drift in case-…-citation: invocationTools
  gate        live gate blocked
  next  ge prove --live --update-baseline
```

Do NOT run `--update-baseline` reflexively. Diff the drift (`.ge/proof/
live-proof-result.json` → `conformance.drift`), decide whether the new tool
set is intended (e.g. a new tool shipped) — and only then accept, saying so
in the run record.
