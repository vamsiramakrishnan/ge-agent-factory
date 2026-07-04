---
type: Agent Tool
title: evidence_close_cycle_playbook
description: "Cite the close cycle playbook for task definitions, cycle target-day rationale, and bottleneck escalation thresholds."
tags:
  - finance
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.toolIntents
generation_status: generated
ge_status: generated
---

# evidence_close_cycle_playbook

Cite the close cycle playbook for task definitions, cycle target-day rationale, and bottleneck escalation thresholds.

- **Kind:** evidence_lookup
- **Source system:** [BlackLine](/systems/blackline.md)

## Inputs

- citation_anchor

## Outputs

- document_citation

## Side Effects

- May change BlackLine state because the spec classifies it as evidence_lookup.

## Idempotency

No idempotency key is declared in the spec or matched API; require one before production writes.

## Confirmation

- [Confirmation policy — evidence_close_cycle_playbook](/policies/confirmation-evidence-close-cycle-playbook.md)

## Permissions

No explicit permission scopes declared; source-system access is tied to [BlackLine](/systems/blackline.md).

## Failure Modes

No explicit failure modes are declared in the spec; rely on refusal/escalation policies for unsafe or incomplete evidence.

## Used By

- [close_metrics_aggregation](/workflow/close-metrics-aggregation.md)
- [bottleneck_trend_analysis](/workflow/bottleneck-trend-analysis.md)
- [retrospective_narrative](/workflow/retrospective-narrative.md)
- [dashboard_distribution](/workflow/dashboard-distribution.md)

## Evals

- [Generate a full retrospective for our May 2026 close cycle. We closed in 8.5 days vs. a 7-day target. What bottleneck tasks delayed us, and what are your recommendations?](/tests/full-month-end-retrospective.md)
- [Which close tasks took longer than planned in April 2026, and how much did they delay the overall cycle?](/tests/bottleneck-attribution-only.md)

## Evidence emitted

- document_reference

## Required inputs

- citation_anchor

## Produces

- document_citation

# Examples

```
evidence_close_cycle_playbook(citation_anchor=<citation_anchor>)
```

# Citations

- [BlackLine](/systems/blackline.md)
- [Confirmation policy — evidence_close_cycle_playbook](/policies/confirmation-evidence-close-cycle-playbook.md)
