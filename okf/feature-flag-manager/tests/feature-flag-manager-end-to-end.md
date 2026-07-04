---
type: Eval Scenario
title: Run the Feature Flag Manager workflow for the current period. Cite the releva...
description: "Run the Feature Flag Manager workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
source_id: "feature-flag-manager-end-to-end"
generation_status: inferred
tags:
  - it
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Run the Feature Flag Manager workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

## Validates

- [flag-inventory](/queries/flag-inventory.md)

## Mechanisms to call

- [query_launchdarkly_launchdarkly_records](/tools/query-launchdarkly-launchdarkly-records.md)
- [query_github_pull_requests](/tools/query-github-pull-requests.md)
- [query_datadog_alerts](/tools/query-datadog-alerts.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_feature_flag_manager_runbook](/tools/lookup-feature-flag-manager-runbook.md)
- [action_launchdarkly_generate](/tools/action-launchdarkly-generate.md)

## Success rubric

Action generate executed against LaunchDarkly, with audit-trail entry and DevOps Lead notified of outcomes.

# Citations

- [Feature Flag Manager Operations Runbook](/documents/feature-flag-manager-runbook.md)
