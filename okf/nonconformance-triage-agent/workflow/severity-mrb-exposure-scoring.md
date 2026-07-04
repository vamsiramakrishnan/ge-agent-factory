---
type: Workflow Stage
title: "Severity & MRB Exposure Scoring"
description: "Score severity, quantity_affected, and mrb_required against capa_actions precedent and the historical_metrics and cached_aggregates baselines in BigQuery to rank the Shift Quality Lead's queue and size the material held in the MRB cage."
source_id: severity_mrb_exposure_scoring
tags:
  - manufacturing
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Severity & MRB Exposure Scoring

Score severity, quantity_affected, and mrb_required against capa_actions precedent and the historical_metrics and cached_aggregates baselines in BigQuery to rank the Shift Quality Lead's queue and size the material held in the MRB cage.

- **Mode:** sequential
- **Stage:** 3 of 5

## Tools

- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_nonconformance_triage_agent_sop](/tools/lookup-nonconformance-triage-agent-sop.md)

Next: [SOP-Gated Disposition Recommendation](/workflow/sop-gated-disposition-recommendation.md)
