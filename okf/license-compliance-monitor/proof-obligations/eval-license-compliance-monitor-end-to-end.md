---
type: Proof Obligation
title: "Golden eval obligation — Run the License Compliance Monitor workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
description: golden eval proof obligation
source_id: "eval-license-compliance-monitor-end-to-end"
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

# Golden eval obligation — Run the License Compliance Monitor workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

- **Kind:** golden eval
- **Spec source:** behaviorContract.goldenEvals.0
- **Eval:** [license-compliance-monitor-end-to-end](/tests/license-compliance-monitor-end-to-end.md)


## Mechanisms

- [query_servicenow_sam_tickets](/tools/query-servicenow-sam-tickets.md)
- [query_zylo_zylo_records](/tools/query-zylo-zylo-records.md)
- [query_okta_users](/tools/query-okta-users.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_license_compliance_monitor_runbook](/tools/lookup-license-compliance-monitor-runbook.md)

## Entities that must be referenced

- tickets
- zylo_records
- users
- analytics_events

## Forbidden behaviors

- do not invent KPI numbers
- do not skip the evidence_lookup step before any recommendation
- do not act on single-system evidence

# Citations

- [license-compliance-monitor-runbook](/documents/license-compliance-monitor-runbook.md)
