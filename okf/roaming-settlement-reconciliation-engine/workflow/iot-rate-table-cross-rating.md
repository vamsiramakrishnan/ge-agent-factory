---
type: Workflow Stage
title: "IOT Rate Table Cross-Rating"
description: "Cross-rate each roaming_partner event in rated_events against the current GSMA IOT rate table by rate_plan_code, flagging events billed under a retail plan code (UNL_BASIC, UNL_PLUS_5G) that should have rated under IOT_M2M_POOLED, and any zero_rated or rerated events lacking a documented cause."
source_id: iot_rate_table_cross_rating
tags:
  - telco
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# IOT Rate Table Cross-Rating

Cross-rate each roaming_partner event in rated_events against the current GSMA IOT rate table by rate_plan_code, flagging events billed under a retail plan code (UNL_BASIC, UNL_PLUS_5G) that should have rated under IOT_M2M_POOLED, and any zero_rated or rerated events lacking a documented cause.

- **Mode:** sequential
- **Stage:** 2 of 5

## Tools

- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_roaming_settlement_reconciliation_engine_assurance_runbook](/tools/lookup-roaming-settlement-reconciliation-engine-assurance-runbook.md)

Next: [Partner Baseline Reconciliation](/workflow/partner-baseline-reconciliation.md)
