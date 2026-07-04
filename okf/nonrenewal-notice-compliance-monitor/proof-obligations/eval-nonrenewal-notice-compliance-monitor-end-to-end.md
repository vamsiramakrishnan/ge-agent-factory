---
type: Proof Obligation
title: "Golden eval obligation — Run the Non-Renewal Notice Compliance Monitor workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
description: golden eval proof obligation
source_id: "eval-nonrenewal-notice-compliance-monitor-end-to-end"
tags:
  - insurance
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.goldenEvals.0
generation_status: generated
ge_status: generated
---

# Golden eval obligation — Run the Non-Renewal Notice Compliance Monitor workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

- **Kind:** golden eval
- **Spec source:** behaviorContract.goldenEvals.0
- **Eval:** [nonrenewal-notice-compliance-monitor-end-to-end](/tests/nonrenewal-notice-compliance-monitor-end-to-end.md)


## Mechanisms

- [query_guidewire_policycenter_policies](/tools/query-guidewire-policycenter-policies.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [query_insurance_3_insurance_3_records](/tools/query-insurance-3-insurance-3-records.md)
- [lookup_nonrenewal_notice_compliance_monitor_authority_guide](/tools/lookup-nonrenewal-notice-compliance-monitor-authority-guide.md)
- [action_guidewire_policycenter_publish](/tools/action-guidewire-policycenter-publish.md)

## Entities that must be referenced

- policies
- analytics_events
- insurance_3_records

## Forbidden behaviors

- do not invent KPI numbers
- do not skip the evidence_lookup step before any recommendation
- do not execute publish without two-system evidence

# Citations

- [nonrenewal-notice-compliance-monitor-authority-guide](/documents/nonrenewal-notice-compliance-monitor-authority-guide.md)
