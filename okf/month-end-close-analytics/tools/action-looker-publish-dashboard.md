---
type: Agent Tool
title: action_looker_publish_dashboard
description: Refresh and publish the close analytics dashboard with the latest bottleneck analysis and trend comparison visualizations.
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

# action_looker_publish_dashboard

Refresh and publish the close analytics dashboard with the latest bottleneck analysis and trend comparison visualizations.

- **Kind:** action
- **Source system:** [Looker](/systems/looker.md)
- **API:** POST /systems/looker/dashboards/refresh

## Inputs

- dashboard_id
- analysis_results

## Outputs

- dashboard_url
- publication_timestamp

## Side Effects

- May change Looker state because the spec classifies it as action.

## Idempotency

No idempotency key is declared in the spec or matched API; require one before production writes.

## Confirmation

- [Confirmation policy — action_looker_publish_dashboard](/policies/confirmation-action-looker-publish-dashboard.md)

## Permissions

No explicit permission scopes declared; source-system access is tied to [Looker](/systems/looker.md).

## Failure Modes

No explicit failure modes are declared in the spec; rely on refusal/escalation policies for unsafe or incomplete evidence.

## Used By

- [dashboard_distribution](/workflow/dashboard-distribution.md)

## Evals

- [Generate a full retrospective for our May 2026 close cycle. We closed in 8.5 days vs. a 7-day target. What bottleneck tasks delayed us, and what are your recommendations?](/tests/full-month-end-retrospective.md)

## Evidence emitted

- api_response

## Required inputs

- dashboard_id
- analysis_results

## Produces

- dashboard_url
- publication_timestamp

# Examples

```
action_looker_publish_dashboard(dashboard_id=<dashboard_id>, analysis_results=<analysis_results>)
```

# Citations

- [Looker](/systems/looker.md)
- [Confirmation policy — action_looker_publish_dashboard](/policies/confirmation-action-looker-publish-dashboard.md)
