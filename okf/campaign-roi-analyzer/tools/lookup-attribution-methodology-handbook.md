---
type: Agent Tool
title: lookup_attribution_methodology_handbook
description: "Retrieve sections of the Attribution Methodology Handbook to cite model selection (multi-touch vs. last-touch), CAC formula, and confidence thresholds in the ROI narrative."
tags:
  - marketing
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.toolIntents
generation_status: generated
ge_status: generated
---

# lookup_attribution_methodology_handbook

Retrieve sections of the Attribution Methodology Handbook to cite model selection (multi-touch vs. last-touch), CAC formula, and confidence thresholds in the ROI narrative.

- **Kind:** evidence_lookup
- **Source system:** [BigQuery](/systems/bigquery.md)

## Inputs

- section_anchor

## Outputs

- handbook_section
- citation_anchor

## Side Effects

- No mutation is declared by the spec for this tool.

## Idempotency

No idempotency key declared; no mutation is declared by the spec for this tool.

## Confirmation

No write confirmation policy is derivable from the spec.

## Permissions

No explicit permission scopes declared; source-system access is tied to [BigQuery](/systems/bigquery.md).

## Failure Modes

No explicit failure modes are declared in the spec; rely on refusal/escalation policies for unsafe or incomplete evidence.

## Used By

- [cost_revenue_matching](/workflow/cost-revenue-matching.md)
- [attribution_modeling](/workflow/attribution-modeling.md)

## Evals

_No eval scenario explicitly exercises this tool._

## Evidence emitted

- document_reference

## Required inputs

- section_anchor

## Produces

- handbook_section
- citation_anchor

# Examples

```
lookup_attribution_methodology_handbook(section_anchor=<section_anchor>)
```

# Citations

- [BigQuery](/systems/bigquery.md)
