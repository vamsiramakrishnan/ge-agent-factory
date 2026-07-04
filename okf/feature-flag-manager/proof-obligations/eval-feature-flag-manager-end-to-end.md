---
type: Proof Obligation
title: "Golden eval obligation — Run the Feature Flag Manager workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
description: golden eval proof obligation
source_id: "eval-feature-flag-manager-end-to-end"
tags:
  - it
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.goldenEvals.0
generation_status: generated
ge_status: generated
---

# Golden eval obligation — Run the Feature Flag Manager workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

- **Kind:** golden eval
- **Spec source:** behaviorContract.goldenEvals.0
- **Eval:** [feature-flag-manager-end-to-end](/tests/feature-flag-manager-end-to-end.md)


## Mechanisms

- [query_launchdarkly_launchdarkly_records](/tools/query-launchdarkly-launchdarkly-records.md)
- [query_github_pull_requests](/tools/query-github-pull-requests.md)
- [query_datadog_alerts](/tools/query-datadog-alerts.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_feature_flag_manager_runbook](/tools/lookup-feature-flag-manager-runbook.md)
- [action_launchdarkly_generate](/tools/action-launchdarkly-generate.md)

## Entities that must be referenced

- launchdarkly_records
- pull_requests
- alerts
- analytics_events

## Forbidden behaviors

- do not invent KPI numbers
- do not skip the evidence_lookup step before any recommendation
- do not execute generate without two-system evidence

# Citations

- [feature-flag-manager-runbook](/documents/feature-flag-manager-runbook.md)
