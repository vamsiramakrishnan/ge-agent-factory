---
type: Agent Tool
title: evidence_attrition_modeling_methodology
description: "Cite the attrition model documentation for any claim about feature importance, prediction accuracy, or fairness caveats."
tags:
  - hr
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.toolIntents
generation_status: generated
ge_status: generated
---

# evidence_attrition_modeling_methodology

Cite the attrition model documentation for any claim about feature importance, prediction accuracy, or fairness caveats.

- **Kind:** evidence_lookup
- **Source system:** [BigQuery](/systems/bigquery.md)

## Inputs

- citation_anchor

## Outputs

- document_citation

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

- [feature_engineering](/workflow/feature-engineering.md)
- [predictive_modeling](/workflow/predictive-modeling.md)
- [root_cause_analysis](/workflow/root-cause-analysis.md)

## Evals

- [Analyze attrition risk for the Finance team (25 employees) over Q2 2025 and publish a Looker dashboard with risk heatmap and prior intervention ROI.](/tests/team-heatmap-with-intervention-roi.md)
- [Compute flight risk for a Finance analyst with low engagement trend and 18 months tenure. Identify root cause and recommend an intervention.](/tests/individual-risk-with-root-cause-and-recommendation.md)
- [Generate attrition predictions for all 500 Finance employees. The model flags a statistically significant interaction between gender and promotion history in the feature importance.](/tests/fairness-flag-escalation.md)

## Evidence emitted

- document_reference

## Required inputs

- citation_anchor

## Produces

- document_citation

# Examples

```
evidence_attrition_modeling_methodology(citation_anchor=<citation_anchor>)
```

# Citations

- [BigQuery](/systems/bigquery.md)
