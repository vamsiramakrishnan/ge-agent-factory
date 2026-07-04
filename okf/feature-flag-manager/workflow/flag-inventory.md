---
type: Workflow Stage
title: Flag Inventory
description: "Audit feature flags from LaunchDarkly across all environments. Track status, rollout percentage, last modified date, and code references in GitHub."
source_id: flag_inventory
tags:
  - it
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Flag Inventory

Audit feature flags from LaunchDarkly across all environments. Track status, rollout percentage, last modified date, and code references in GitHub.

- **Mode:** sequential
- **Stage:** 1 of 4

## Tools

- [query_launchdarkly_launchdarkly_records](/tools/query-launchdarkly-launchdarkly-records.md)
- [query_github_pull_requests](/tools/query-github-pull-requests.md)
- [lookup_feature_flag_manager_runbook](/tools/lookup-feature-flag-manager-runbook.md)
- [action_launchdarkly_generate](/tools/action-launchdarkly-generate.md)

Next: [Lifecycle & Impact Analysis](/workflow/lifecycle-impact-analysis.md)
