# Run-triage decision table — copy into the triage note and mark the row that fired

First: `ge runs list` → `ge runs show <id>` → `ge runs events <id>` and find
the FIRST failing event. Then match it to one row (top match wins):

| # | First-failure signal | Classification | Recovery | Command / hand-off |
|---|---|---|---|---|
| 1 | `ge.interaction.request` pending, no failure | not a failure — run is asking | answer it | `ge runs respond <task> <interaction> --question … --freeform …` |
| 2 | timeout / rate limit / daemon blip, and `runs show` says resume is safe | transient | resume | `ge runs resume <id>` |
| 3 | doctor/readiness check red (toolchain, plane, IAM, missing service) | readiness gap | fix per the check's own `fix:` line, re-run | `standing-up-the-platform`; `ge doctor --command <cmd>` |
| 4 | bad/missing input produced by an earlier station (spec gap, empty dataset) | upstream defect | fix in the owning station, then re-run this stage | owning station skill |
| 5 | same input → same failure on retry (code/config error in the stage) | deterministic | fix the cause; do NOT resume or blind re-run | fix, then re-run |
| 6 | side effects partially applied (some resources mutated), or you can't tell | ambiguous / irreversible | STOP — escalate with evidence | `guarding-the-factory`; include first-failure event + ids |

Rules that override the table:
- Cheapest correct recovery wins: resume < re-run < upstream fix < escalate.
- `done` status is not a verdict — read the events (exit 0 tasks can contain failed checks).
- One recovery attempt per classification; if it doesn't clear on re-observe, reclassify (usually one row down).
- Record the failure + recovery (see `recording-evidence`) so repeats become visible.
