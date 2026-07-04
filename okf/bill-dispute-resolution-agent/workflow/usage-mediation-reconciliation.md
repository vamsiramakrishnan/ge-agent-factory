---
type: Workflow Stage
title: "Usage & mediation reconciliation"
description: "Cross-check usage_records against rated_events on subscriber_key and mediation_batch, checking guiding_status and duplicate_suspect to confirm the charge reflects settled, non-suspense usage."
source_id: usage_mediation_reconciliation
tags:
  - telco
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Usage & mediation reconciliation

Cross-check usage_records against rated_events on subscriber_key and mediation_batch, checking guiding_status and duplicate_suspect to confirm the charge reflects settled, non-suspense usage.

- **Mode:** sequential
- **Stage:** 3 of 6

## Tools

- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)

Next: [Root-cause & baseline comparison](/workflow/root-cause-baseline-comparison.md)
