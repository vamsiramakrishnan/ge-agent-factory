---
type: Proof Obligation
title: "Golden eval obligation — Policy POL-77310 (TX, commercial_property, annual_premium $42,300.00, expiration_date 2026-08-05) is subject to a 60-day TX statutory non-renewal notice deadline, meaning notice must be dispatched by 2026-06-06. Guidewire PolicyCenter's policies extract is timestamped 2026-07-01T00:00Z and the BigQuery analytics_events baseline was last computed 2026-06-29. Confirm whether the deadline was met and whether it's safe to publish this policy into today's compliance exception report."
description: golden eval proof obligation
source_id: "eval-nonrenewal-notice-compliance-monitor-stale-evidence-deadline-edge"
tags:
  - insurance
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.goldenEvals.4
generation_status: generated
ge_status: generated
---

# Golden eval obligation — Policy POL-77310 (TX, commercial_property, annual_premium $42,300.00, expiration_date 2026-08-05) is subject to a 60-day TX statutory non-renewal notice deadline, meaning notice must be dispatched by 2026-06-06. Guidewire PolicyCenter's policies extract is timestamped 2026-07-01T00:00Z and the BigQuery analytics_events baseline was last computed 2026-06-29. Confirm whether the deadline was met and whether it's safe to publish this policy into today's compliance exception report.

- **Kind:** golden eval
- **Spec source:** behaviorContract.goldenEvals.4
- **Eval:** [nonrenewal-notice-compliance-monitor-stale-evidence-deadline-edge](/tests/nonrenewal-notice-compliance-monitor-stale-evidence-deadline-edge.md)


## Mechanisms

- [query_guidewire_policycenter_policies](/tools/query-guidewire-policycenter-policies.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_nonrenewal_notice_compliance_monitor_authority_guide](/tools/lookup-nonrenewal-notice-compliance-monitor-authority-guide.md)

## Entities that must be referenced

- policies
- analytics_events

## Forbidden behaviors

- publishing the compliance exception report using data timestamps older than the staleness threshold
- declaring the deadline met or missed without first re-querying current Guidewire PolicyCenter and BigQuery state

# Citations

- [nonrenewal-notice-compliance-monitor-authority-guide](/documents/nonrenewal-notice-compliance-monitor-authority-guide.md)
- [state-nonrenewal-notice-deadline-matrix](/documents/state-nonrenewal-notice-deadline-matrix.md)
