---
type: Eval Scenario
title: Run the Policy Lifecycle Manager workflow for the current period. Cite the re...
description: "Run the Policy Lifecycle Manager workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
source_id: "policy-lifecycle-manager-end-to-end"
generation_status: inferred
tags:
  - it
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Run the Policy Lifecycle Manager workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

## Validates

- [review-triggering](/queries/review-triggering.md)

## Mechanisms to call

- [query_confluence_pages](/tools/query-confluence-pages.md)
- [query_servicenow_grc_tickets](/tools/query-servicenow-grc-tickets.md)
- [query_google_workspace_accounts](/tools/query-google-workspace-accounts.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_policy_lifecycle_manager_runbook](/tools/lookup-policy-lifecycle-manager-runbook.md)
- [action_confluence_draft](/tools/action-confluence-draft.md)

## Success rubric

Action draft executed against Confluence, with audit-trail entry and Compliance & GRC Lead notified of outcomes.

# Citations

- [Policy Lifecycle Manager Operations Runbook](/documents/policy-lifecycle-manager-runbook.md)
