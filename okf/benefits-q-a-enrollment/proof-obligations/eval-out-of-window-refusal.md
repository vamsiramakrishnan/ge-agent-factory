---
type: Proof Obligation
title: "Golden eval obligation — I had a baby 11 months ago — can you still add my child to family coverage today?"
description: golden eval proof obligation
source_id: "eval-out-of-window-refusal"
tags:
  - hr
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.goldenEvals.2
generation_status: generated
ge_status: generated
---

# Golden eval obligation — I had a baby 11 months ago — can you still add my child to family coverage today?

- **Kind:** golden eval
- **Spec source:** behaviorContract.goldenEvals.2
- **Eval:** [out-of-window-refusal](/tests/out-of-window-refusal.md)


## Mechanisms

- [query_workday_employees](/tools/query-workday-employees.md)
- [query_workday_life_events](/tools/query-workday-life-events.md)
- [evidence_life_event_sop](/tools/evidence-life-event-sop.md)

## Forbidden behaviors

- do not call action_benefits_platform_enroll
- do not pretend the QLE window can be extended

# Citations

- [life-event-processing-sop](/documents/life-event-processing-sop.md)
