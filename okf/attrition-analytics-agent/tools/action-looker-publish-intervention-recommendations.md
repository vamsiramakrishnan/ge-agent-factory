---
type: Agent Tool
title: action_looker_publish_intervention_recommendations
description: Publish personalized intervention recommendations (by individual or team) with risk drivers and ROI estimates.
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

# action_looker_publish_intervention_recommendations

Publish personalized intervention recommendations (by individual or team) with risk drivers and ROI estimates.

- **Kind:** action
- **Source system:** [BigQuery](/systems/bigquery.md)
- **API:** POST /systems/looker/recommendations/publish

## Inputs

- team_id
- root_causes

## Outputs

- recommendation_id
- recommendation_url

## Side Effects

- May change BigQuery state because the spec classifies it as action.

## Idempotency

No idempotency key is declared in the spec or matched API; require one before production writes.

## Confirmation

- [Confirmation policy — action_looker_publish_intervention_recommendations](/policies/confirmation-action-looker-publish-intervention-recommendations.md)

## Permissions

No explicit permission scopes declared; source-system access is tied to [BigQuery](/systems/bigquery.md).

## Failure Modes

No explicit failure modes are declared in the spec; rely on refusal/escalation policies for unsafe or incomplete evidence.

## Used By

- [intervention_dashboard](/workflow/intervention-dashboard.md)

## Evals

_No eval scenario explicitly exercises this tool._

## Evidence emitted

- api_response
- generated_audit_trail

## Required inputs

- team_id
- root_causes

## Produces

- recommendation_id
- recommendation_url

# Examples

```
action_looker_publish_intervention_recommendations(team_id=<team_id>, root_causes=<root_causes>)
```

# Citations

- [BigQuery](/systems/bigquery.md)
- [Confirmation policy — action_looker_publish_intervention_recommendations](/policies/confirmation-action-looker-publish-intervention-recommendations.md)
