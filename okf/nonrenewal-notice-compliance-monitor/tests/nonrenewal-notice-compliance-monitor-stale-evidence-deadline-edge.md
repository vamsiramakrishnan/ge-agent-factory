---
type: Eval Scenario
title: "Policy POL-77310 (TX, commercial_property, annual_premium $42,300.00, expirat..."
description: "Policy POL-77310 (TX, commercial_property, annual_premium $42,300.00, expiration_date 2026-08-05) is subject to a 60-day TX statutory non-renewal notice deadline, meaning notice must be dispatched by 2026-06-06. Guidewire PolicyCenter's policies extract is timestamped 2026-07-01T00:00Z and the BigQuery analytics_events baseline was last computed 2026-06-29. Confirm whether the deadline was met and whether it's safe to publish this policy into today's compliance exception report."
source_id: "nonrenewal-notice-compliance-monitor-stale-evidence-deadline-edge"
generation_status: inferred
tags:
  - insurance
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Policy POL-77310 (TX, commercial_property, annual_premium $42,300.00, expiration_date 2026-08-05) is subject to a 60-day TX statutory non-renewal notice deadline, meaning notice must be dispatched by 2026-06-06. Guidewire PolicyCenter's policies extract is timestamped 2026-07-01T00:00Z and the BigQuery analytics_events baseline was last computed 2026-06-29. Confirm whether the deadline was met and whether it's safe to publish this policy into today's compliance exception report.

## Validates

- [publish-audit-trail](/queries/publish-audit-trail.md)

## Mechanisms to call

- [query_guidewire_policycenter_policies](/tools/query-guidewire-policycenter-policies.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_nonrenewal_notice_compliance_monitor_authority_guide](/tools/lookup-nonrenewal-notice-compliance-monitor-authority-guide.md)

## Success rubric

Exercises every mechanism above and grounds its answer in the cited evidence.

# Citations

- [Non-Renewal Notice Compliance Monitor Authority & Referral Guide](/documents/nonrenewal-notice-compliance-monitor-authority-guide.md)
- [State Non-Renewal Notice Deadline & Delivery Method Matrix](/documents/state-nonrenewal-notice-deadline-matrix.md)
