---
type: Proof Obligation
title: "Golden eval obligation — Run the Technology Lifecycle Manager workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
description: golden eval proof obligation
source_id: "eval-technology-lifecycle-manager-end-to-end"
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

# Golden eval obligation — Run the Technology Lifecycle Manager workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

- **Kind:** golden eval
- **Spec source:** behaviorContract.goldenEvals.0
- **Eval:** [technology-lifecycle-manager-end-to-end](/tests/technology-lifecycle-manager-end-to-end.md)


## Mechanisms

- [query_servicenow_cmdb_tickets](/tools/query-servicenow-cmdb-tickets.md)
- [query_servicenow_sam_tickets](/tools/query-servicenow-sam-tickets.md)
- [query_leanix_leanix_records](/tools/query-leanix-leanix-records.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_technology_lifecycle_manager_runbook](/tools/lookup-technology-lifecycle-manager-runbook.md)
- [action_servicenow_cmdb_generate](/tools/action-servicenow-cmdb-generate.md)

## Entities that must be referenced

- tickets
- tickets
- leanix_records
- analytics_events

## Forbidden behaviors

- do not invent KPI numbers
- do not skip the evidence_lookup step before any recommendation
- do not execute generate without two-system evidence

# Citations

- [technology-lifecycle-manager-runbook](/documents/technology-lifecycle-manager-runbook.md)
