---
type: Agent Tool
title: action_looker_publish_roi_dashboard
description: "Publish or refresh campaign ROI dashboard in Looker with attribution results, CAC trends, and comparative performance views."
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

# action_looker_publish_roi_dashboard

Publish or refresh campaign ROI dashboard in Looker with attribution results, CAC trends, and comparative performance views.

- **Kind:** action
- **Source system:** [Looker](/systems/looker.md)
- **API:** POST /systems/looker/dashboards/roi-refresh

## Inputs

- dashboard_name
- attribution_results

## Outputs

- dashboard_url
- publish_timestamp

## Side Effects

- May change Looker state because the spec classifies it as action.

## Idempotency

No idempotency key is declared in the spec or matched API; require one before production writes.

## Confirmation

- [Confirmation policy — action_looker_publish_roi_dashboard](/policies/confirmation-action-looker-publish-roi-dashboard.md)

## Permissions

No explicit permission scopes declared; source-system access is tied to [Looker](/systems/looker.md).

## Failure Modes

No explicit failure modes are declared in the spec; rely on refusal/escalation policies for unsafe or incomplete evidence.

## Used By

- [reporting_dashboards](/workflow/reporting-dashboards.md)

## Evals

- [Generate this week's ROI narrative for campaigns launched in Q1, including multi-touch attribution, CAC by channel, and investment recommendations if pipeline velocity falls below benchmark.](/tests/weekly-roi-narrative-full-workflow.md)

## Evidence emitted

- api_response
- generated_audit_trail

## Required inputs

- dashboard_name
- attribution_results

## Produces

- dashboard_url
- publish_timestamp

# Examples

```
action_looker_publish_roi_dashboard(dashboard_name=<dashboard_name>, attribution_results=<attribution_results>)
```

# Citations

- [Looker](/systems/looker.md)
- [Confirmation policy — action_looker_publish_roi_dashboard](/policies/confirmation-action-looker-publish-roi-dashboard.md)
