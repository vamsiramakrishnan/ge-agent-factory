---
type: Workflow Stage
title: MES Genealogy Correlation
description: "Correlate the nonconformance against production_orders, machine_events, and quality_checks in Siemens Opcenter MES to pin down the affected order, the process step, and whether a CTQ characteristic was already trending out of control."
source_id: mes_genealogy_correlation
tags:
  - manufacturing
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# MES Genealogy Correlation

Correlate the nonconformance against production_orders, machine_events, and quality_checks in Siemens Opcenter MES to pin down the affected order, the process step, and whether a CTQ characteristic was already trending out of control.

- **Mode:** sequential
- **Stage:** 2 of 5

## Tools

- [query_siemens_opcenter_mes_production_orders](/tools/query-siemens-opcenter-mes-production-orders.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_nonconformance_triage_agent_sop](/tools/lookup-nonconformance-triage-agent-sop.md)

Next: [Severity & MRB Exposure Scoring](/workflow/severity-mrb-exposure-scoring.md)
