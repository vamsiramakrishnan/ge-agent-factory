---
type: Query Capability
title: "Audit feature flags from LaunchDarkly across all environments. Track status, ..."
description: "Audit feature flags from LaunchDarkly across all environments. Track status, rollout percentage, last modified date, and code references in GitHub."
source_id: "flag-inventory"
generation_status: inferred
tags:
  - it
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Audit feature flags from LaunchDarkly across all environments. Track status, rollout percentage, last modified date, and code references in GitHub.

## Tools used

- [query_launchdarkly_launchdarkly_records](/tools/query-launchdarkly-launchdarkly-records.md)
- [query_github_pull_requests](/tools/query-github-pull-requests.md)
- [lookup_feature_flag_manager_runbook](/tools/lookup-feature-flag-manager-runbook.md)
- [action_launchdarkly_generate](/tools/action-launchdarkly-generate.md)

## Runs in

- [flag_inventory](/workflow/flag-inventory.md)

## Evidence expected

- source_system_record
- document_reference
- api_response
- generated_audit_trail

## Evals

- [Run the Feature Flag Manager workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/feature-flag-manager-end-to-end.md)

# Citations

- [Feature Flag Manager Operations Runbook](/documents/feature-flag-manager-runbook.md)
