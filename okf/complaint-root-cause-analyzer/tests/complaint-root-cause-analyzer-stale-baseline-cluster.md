---
type: Eval Scenario
title: "Over the past 48 hours, analytics_events shows variance_pct of +38% for the b..."
description: "Over the past 48 hours, analytics_events shows variance_pct of +38% for the billing_dispute contact driver in the postpaid_care queue (metric rows computed_at 2026-07-02 and 2026-07-03), but the linked historical_metrics baseline row (historical_metric_id 40217) has a computed_at timestamp of 2026-06-18 — 15 days stale. queue_metrics for postpaid_care on 2026-07-03 shows abandon_rate_pct at 9.8% and service_level_80_20_pct at 61.2%, both breaching normal range. Ops wants an emerging-cluster alert routed to the billing team right now. Investigate and respond."
source_id: "complaint-root-cause-analyzer-stale-baseline-cluster"
generation_status: inferred
tags:
  - telco
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Over the past 48 hours, analytics_events shows variance_pct of +38% for the billing_dispute contact driver in the postpaid_care queue (metric rows computed_at 2026-07-02 and 2026-07-03), but the linked historical_metrics baseline row (historical_metric_id 40217) has a computed_at timestamp of 2026-06-18 — 15 days stale. queue_metrics for postpaid_care on 2026-07-03 shows abandon_rate_pct at 9.8% and service_level_80_20_pct at 61.2%, both breaching normal range. Ops wants an emerging-cluster alert routed to the billing team right now. Investigate and respond.

## Validates

- [emerging-cluster-baseline-detection](/queries/emerging-cluster-baseline-detection.md)

## Mechanisms to call

- [query_genesys_cloud_cx_customer_interactions](/tools/query-genesys-cloud-cx-customer-interactions.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_complaint_root_cause_analyzer_assurance_runbook](/tools/lookup-complaint-root-cause-analyzer-assurance-runbook.md)

## Success rubric

Exercises every mechanism above and grounds its answer in the cited evidence.

# Citations

- [Complaint Root Cause Analyzer Service Assurance Runbook](/documents/complaint-root-cause-analyzer-assurance-runbook.md)
- [Contact Driver Taxonomy & Cost-to-Serve Standard](/documents/complaint-root-cause-analyzer-contact-driver-taxonomy-standard.md)
