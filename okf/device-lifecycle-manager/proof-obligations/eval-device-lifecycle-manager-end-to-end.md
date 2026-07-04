---
type: Proof Obligation
title: "Golden eval obligation — Run the Device Lifecycle Manager workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
description: golden eval proof obligation
source_id: "eval-device-lifecycle-manager-end-to-end"
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

# Golden eval obligation — Run the Device Lifecycle Manager workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

- **Kind:** golden eval
- **Spec source:** behaviorContract.goldenEvals.0
- **Eval:** [device-lifecycle-manager-end-to-end](/tests/device-lifecycle-manager-end-to-end.md)


## Mechanisms

- [query_manageengine_manageengine_records](/tools/query-manageengine-manageengine-records.md)
- [query_google_workspace_accounts](/tools/query-google-workspace-accounts.md)
- [query_okta_users](/tools/query-okta-users.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_device_lifecycle_manager_runbook](/tools/lookup-device-lifecycle-manager-runbook.md)
- [action_manageengine_generate](/tools/action-manageengine-generate.md)

## Entities that must be referenced

- manageengine_records
- accounts
- users
- analytics_events

## Forbidden behaviors

- do not invent KPI numbers
- do not skip the evidence_lookup step before any recommendation
- do not execute generate without two-system evidence

# Citations

- [device-lifecycle-manager-runbook](/documents/device-lifecycle-manager-runbook.md)
