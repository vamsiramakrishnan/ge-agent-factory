---
type: Agent Tool
title: action_looker_publish_attrition_dashboard
description: "Publish team-level risk heatmap and intervention ROI dashboard to Looker for CHRO and HRBP consumption."
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

# action_looker_publish_attrition_dashboard

Publish team-level risk heatmap and intervention ROI dashboard to Looker for CHRO and HRBP consumption.

- **Kind:** action
- **Source system:** [BigQuery](/systems/bigquery.md)
- **API:** POST /systems/looker/dashboards/attrition-refresh

## Inputs

- risk_scores
- intervention_history

## Outputs

- dashboard_id
- publication_timestamp

## Side Effects

- May change BigQuery state because the spec classifies it as action.

## Idempotency

No idempotency key is declared in the spec or matched API; require one before production writes.

## Confirmation

- [Confirmation policy — action_looker_publish_attrition_dashboard](/policies/confirmation-action-looker-publish-attrition-dashboard.md)

## Permissions

No explicit permission scopes declared; source-system access is tied to [BigQuery](/systems/bigquery.md).

## Failure Modes

No explicit failure modes are declared in the spec; rely on refusal/escalation policies for unsafe or incomplete evidence.

## Used By

- [predictive_modeling](/workflow/predictive-modeling.md)
- [root_cause_analysis](/workflow/root-cause-analysis.md)
- [intervention_dashboard](/workflow/intervention-dashboard.md)

## Evals

- [Analyze attrition risk for the Finance team (25 employees) over Q2 2025 and publish a Looker dashboard with risk heatmap and prior intervention ROI.](/tests/team-heatmap-with-intervention-roi.md)

## Evidence emitted

- api_response
- generated_audit_trail

## Required inputs

- risk_scores
- intervention_history

## Produces

- dashboard_id
- publication_timestamp

# Examples

```
action_looker_publish_attrition_dashboard(risk_scores=<risk_scores>, intervention_history=<intervention_history>)
```

# Citations

- [BigQuery](/systems/bigquery.md)
- [Confirmation policy — action_looker_publish_attrition_dashboard](/policies/confirmation-action-looker-publish-attrition-dashboard.md)
