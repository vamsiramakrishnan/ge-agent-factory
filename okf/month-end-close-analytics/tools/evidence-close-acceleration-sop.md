---
type: Agent Tool
title: evidence_close_acceleration_sop
description: "Cite the close acceleration SOP for recurring-bottleneck remediation procedures and escalation rules."
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

# evidence_close_acceleration_sop

Cite the close acceleration SOP for recurring-bottleneck remediation procedures and escalation rules.

- **Kind:** evidence_lookup
- **Source system:** [BigQuery](/systems/bigquery.md)

## Inputs

- citation_anchor

## Outputs

- document_citation

## Side Effects

- May change BigQuery state because the spec classifies it as evidence_lookup.

## Idempotency

No idempotency key is declared in the spec or matched API; require one before production writes.

## Confirmation

- [Confirmation policy — evidence_close_acceleration_sop](/policies/confirmation-evidence-close-acceleration-sop.md)

## Permissions

No explicit permission scopes declared; source-system access is tied to [BigQuery](/systems/bigquery.md).

## Failure Modes

No explicit failure modes are declared in the spec; rely on refusal/escalation policies for unsafe or incomplete evidence.

## Used By

- [close_metrics_aggregation](/workflow/close-metrics-aggregation.md)
- [bottleneck_trend_analysis](/workflow/bottleneck-trend-analysis.md)
- [retrospective_narrative](/workflow/retrospective-narrative.md)
- [dashboard_distribution](/workflow/dashboard-distribution.md)

## Evals

- [Generate a full retrospective for our May 2026 close cycle. We closed in 8.5 days vs. a 7-day target. What bottleneck tasks delayed us, and what are your recommendations?](/tests/full-month-end-retrospective.md)

## Evidence emitted

- document_reference

## Required inputs

- citation_anchor

## Produces

- document_citation

# Examples

```
evidence_close_acceleration_sop(citation_anchor=<citation_anchor>)
```

# Citations

- [BigQuery](/systems/bigquery.md)
- [Confirmation policy — evidence_close_acceleration_sop](/policies/confirmation-evidence-close-acceleration-sop.md)
