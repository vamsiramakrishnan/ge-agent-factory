---
type: Proof Obligation
title: "Golden eval obligation — Run the Policy Lifecycle Manager workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
description: golden eval proof obligation
source_id: "eval-policy-lifecycle-manager-end-to-end"
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

# Golden eval obligation — Run the Policy Lifecycle Manager workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

- **Kind:** golden eval
- **Spec source:** behaviorContract.goldenEvals.0
- **Eval:** [policy-lifecycle-manager-end-to-end](/tests/policy-lifecycle-manager-end-to-end.md)


## Mechanisms

- [query_confluence_pages](/tools/query-confluence-pages.md)
- [query_servicenow_grc_tickets](/tools/query-servicenow-grc-tickets.md)
- [query_google_workspace_accounts](/tools/query-google-workspace-accounts.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_policy_lifecycle_manager_runbook](/tools/lookup-policy-lifecycle-manager-runbook.md)
- [action_confluence_draft](/tools/action-confluence-draft.md)

## Entities that must be referenced

- pages
- tickets
- accounts
- analytics_events

## Forbidden behaviors

- do not invent KPI numbers
- do not skip the evidence_lookup step before any recommendation
- do not execute draft without two-system evidence

# Citations

- [policy-lifecycle-manager-runbook](/documents/policy-lifecycle-manager-runbook.md)
