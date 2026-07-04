---
type: Proof Obligation
title: "Golden eval obligation — Run the Vendor Rationalization Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
description: golden eval proof obligation
source_id: "eval-vendor-rationalization-agent-end-to-end"
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

# Golden eval obligation — Run the Vendor Rationalization Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

- **Kind:** golden eval
- **Spec source:** behaviorContract.goldenEvals.0
- **Eval:** [vendor-rationalization-agent-end-to-end](/tests/vendor-rationalization-agent-end-to-end.md)


## Mechanisms

- [query_servicenow_sam_tickets](/tools/query-servicenow-sam-tickets.md)
- [query_zylo_zylo_records](/tools/query-zylo-zylo-records.md)
- [query_okta_users](/tools/query-okta-users.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_vendor_rationalization_agent_runbook](/tools/lookup-vendor-rationalization-agent-runbook.md)
- [action_servicenow_sam_recommend](/tools/action-servicenow-sam-recommend.md)

## Entities that must be referenced

- tickets
- zylo_records
- users
- analytics_events

## Forbidden behaviors

- do not invent KPI numbers
- do not skip the evidence_lookup step before any recommendation
- do not execute recommend without two-system evidence

# Citations

- [vendor-rationalization-agent-runbook](/documents/vendor-rationalization-agent-runbook.md)
